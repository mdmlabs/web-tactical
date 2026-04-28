# ТЗ: Wazuh Ops UI (Workshop + Use Case Runner + Compliance View)

> **Самодостаточный бриф для следующего агента.** Контекст предыдущей переписки не требуется — читать файл целиком до начала кода.

---

## 1. Цель

Дать оператору CYWM возможность **закрывать acceptance-требования по информационной безопасности, не уходя из своего UI**: настраивать правила, декодеры, active response, SCA-политики и скрипты реагирования, доставлять файлы на менеджер Wazuh и на агенты в произвольные пути, перезапускать сервисы и демонстрировать всё это связкой «настройка → проверка → детект → автоответ».

Сейчас всё это делается руками — SSH на менеджер, правка XML/YAML, копирование AR-скриптов в `/var/ossec/active-response/bin/`, перезапуск, ожидание. Цель ТЗ — устранить весь этот ручной цикл и собрать его в три связных модуля внутри уже существующего web-tactical UI.

Слова `Wazuh`, `OpenSearch`, `Kibana` в UI не показываем (whitelabel-правило проекта). Внутри кода и API можно.

---

## 2. Контекст и стек

- **Repo:** `web-tactical` — Vue 3 + Quasar 2 + TypeScript + Pinia
- **Backend:** TacticalRMM (Django) + gRPC services + nginx-прокси к Wazuh API и Wazuh Indexer (OpenSearch)
- **Парный продукт по Reporting:** см. [TASK.md](TASK.md) (ветка `feat/discover-saved-search-reporting`) — **не трогаем**, работа идёт параллельно
- **Whitelabel-правила:** Quasar-компоненты, переменные `--mdm-*`, хелперы `notifySuccess`/`notifyError` из [src/utils/notify.ts](src/utils/notify.ts)

---

## 3. Что уже есть (переиспользуем, не дублируем)

| Примитив | Где | Зачем для нас |
|---|---|---|
| Wazuh API-клиент (auth, токены, перехватчики) | [src/api/wazuh.ts](src/api/wazuh.ts) | Достраиваем недостающие методы (см. §7) |
| Wazuh Indexer-клиент (поиск алёртов в OpenSearch) | [src/api/wazuhIndexer.ts](src/api/wazuhIndexer.ts) | Использовать для верификации детектов в Use Case Runner |
| Pinia-стор Wazuh | [src/stores/wazuh.ts](src/stores/wazuh.ts) | Расширяем под новые сущности (workshop history, use case runs) |
| TRMM `runScript(agent_id, payload)` | [src/api/agents.js:143](src/api/agents.js:143) | Запуск скриптов на агенте (тесты, демо-атаки, AR-альтернативы) |
| Модал «Run script on agent» | [src/components/modals/agents/RunScript.vue](src/components/modals/agents/RunScript.vue) | UX-эталон, частично переиспользуем компоненты |
| File delivery jobs (произвольный путь, mode, owner) | [src/api/fileDelivery.ts:70](src/api/fileDelivery.ts:70) | Доставка любых файлов на агентов |
| Policy deploy (бандл скриптов + файлов) | [src/api/policies.ts:347](src/api/policies.ts:347) | Эталон bundle-deploy паттерна для Use Case Runner |
| `MergedAgent { tactical_agent_id, wazuh_agent_id }` | [src/types/wazuh.ts:119](src/types/wazuh.ts:119) | Связка TRMM-агента и Wazuh-агента — единая модель эндпоинта |
| Monaco-редактор | `monaco-editor` 0.50 в [package.json](package.json) | XML/YAML/bash подсветка в Workshop |

---

## 4. Архитектура — три модуля

```
┌─────────────────┐   артефакты    ┌────────────────┐    bundle    ┌──────────────────┐
│   WORKSHOP      │ ─────────────▶ │  USE CASE      │ ───────────▶ │   COMPLIANCE     │
│ (мастерская)    │                │  RUNNER        │              │   VIEW           │
│                 │                │  (конвейер)    │              │   (приёмка)      │
│ Авторим и тестим│                │ Упаковка кейсов│              │ SCA-чеки + кнопка│
│ rule/AR/script  │                │ + демо-атаки   │              │ remediate        │
└─────────────────┘                └────────────────┘              └──────────────────┘
```

- **Workshop** — авторинг и unit-тесты артефактов: rule + logtest, AR + manual trigger, script + run-on-test-agent, SCA YAML + force-scan.
- **Use Case Runner** — bundle-deployer: один манифест (`UseCaseManifest`) → раскладка файлов по правильным местам → перезапуски → опционально demo-атака → верификация по алёртам.
- **Compliance View** — SCA-результаты на агента в виде таблицы; на каждом failed-чеке кнопки **Fix** (запуск Workshop-скрипта или Use Case bundle) и **Re-scan** (демонстрация закрытия).

Логический порядок реализации: **Workshop → Use Case Runner → Compliance View.** Workshop без двух остальных уже даёт повседневную ценность; остальные два опираются на артефакты, отлаженные в нём.

---

## 5. Модуль 1 — Workshop

**Маршрут:** `/security/workshop` → `src/views/security/WazuhWorkshop.vue`

**Структура страницы:** левый сайдбар с переключателем артефактов (Rules / Decoders / Active Response / Scripts / SCA / History) + центральная панель редактора + правая панель «Test runner». Снизу — лог-консоль.

### 5.1 Таб «Rules & Decoders»

- Список локальных файлов с менеджера: `etc/rules/local_rules.xml`, `etc/decoders/local_decoder.xml`, кастомные.
- Получение содержимого: `wazuhApi.getManagerFile(path)` *(новый метод, см. §7)*.
- Редактор Monaco с XML-подсветкой.
- **Logtest-панель** под редактором:
  - Поле «Log line» (multiline)
  - Селекты `location`, `log_format` (syslog/json/eventchannel/...)
  - Кнопка **Test** → `wazuhApi.runLogtest(log, location, log_format)` → отображение: какой decoder сработал, какое правило сматчилось, level, full match-tree.
  - Если сматчилось не то правило — показать diff между ожидаемым и фактическим rule_id.
- **Save** → `wazuhApi.putManagerFile(path, content)` + диалог «Перезапустить менеджер?» → `wazuhApi.restartManager()`.
- Перед save — снапшот в History (см. 5.6).

### 5.2 Таб «Active Response»

- Список AR-команд из `ossec.conf` (раздел `<command>` и `<active-response>`).
  - Чтение: `wazuhApi.getManagerConfiguration()` *(парсинг XML на клиенте)* или новый метод-обёртка.
- Редактор `ossec.conf`-секции AR на уровне группы (через [putGroupConfiguration](src/api/wazuh.ts:213)).
- **Manual trigger** панель:
  - Селект агента (или нескольких) из `MergedAgent`-списка
  - Селект команды
  - Поле произвольных аргументов (string array)
  - Кнопка **Trigger** → `wazuhApi.runActiveResponse(agentIds, command, args)` *(новый метод)*.
- **AR-лог панель**:
  - `wazuhApi.getActiveResponseLog(agent_id, lines=100)` *(новый метод; читает `/var/ossec/logs/active-responses.log` через `/manager/files` или Indexer)*.
  - Авто-обновление каждые 2с после triger'а в течение 30с.

### 5.3 Таб «Scripts»

- Список TRMM-скриптов (`/scripts/` — уже есть в TRMM API).
- Редактор Monaco с подсветкой по `shell` (script_type: ps, cmd, py, bash).
- **Pinned test agent** — пользователь закрепляет один любимый агент в localStorage, чтобы не выбирать каждый раз.
- **Run on test agent** → `agents.runScript(pinnedAgentId, { script_id, args, timeout })` → стрим stdout/stderr/exit_code в нижнюю консоль.
- **Save** → существующий API сохранения скрипта в TRMM.
- Доставка скрипта как AR-файла в `/var/ossec/active-response/bin/<name>` — отдельная кнопка **Push as AR** → `fileDelivery.createDeliveryJob` с `mode: "0750", owner: "root:wazuh"`.

### 5.4 Таб «SCA Policies»

- Список существующих SCA YAML на менеджере (`/var/ossec/ruleset/sca/` — read-only встроенные + `/var/ossec/etc/shared/<group>/*.yml` — кастомные).
- Редактор Monaco с YAML-подсветкой.
- **Push & scan** → `wazuhApi.putGroupFile(group_id, filename, content)` *(новый метод)* → `wazuhApi.requestSCAScan(agent_id)` *(новый метод; через restart агента или `wazuh-control`)* → опрос `getSCAChecks` пока не появятся свежие результаты.
- Отображение результатов того же чек-листа в правой панели — наглядно «было/стало».

### 5.5 Таб «History / Versions»

- Каждый `putManagerFile` / `putGroupFile` / save скрипта → снапшот в TRMM-таблице `wazuh_artifact_versions` *(новая таблица)*:
  - `id, artifact_type, path, content, author_id, created_at, comment`
- Список версий, diff между двумя выбранными (через `monaco-diff` или встроенный diff), кнопка **Revert** → пере-`putManagerFile` со старым содержимым.

### 5.6 Чего НЕ делаем в Workshop

- Не делаем визуальный rule-builder (drag-and-drop конструктор XML) — слишком дорого, оператор пишет XML руками. Logtest достаточно как safety net.
- Не делаем встроенную систему обзоров/approval — снапшоты + revert закрывают minimum viable продукт.

---

## 6. Модуль 2 — Use Case Runner

**Маршрут:** `/security/use-cases` → `src/views/security/UseCaseRunner.vue`

### 6.1 Структура UI

- Слева: библиотека кейсов из манифестов (см. 6.2).
- Центр: карточка выбранного кейса — описание, MITRE-теги, список артефактов, целевые агенты/группы.
- Кнопка **Deploy** — раскладка без атаки (только настройка).
- Кнопка **Deploy & Demo** — раскладка + опциональная демо-атака + верификация.
- Справа: **Timeline исполнения** — пошаговая визуализация (см. 6.4).

### 6.2 Структура манифеста

JSON-файлы в `src/config/usecases/*.json` *(на первом этапе — статика в репозитории; позже — CRUD на TRMM-бэкенде)*:

```json
{
  "id": "ssh-bruteforce",
  "name": "SSH brute-force detection + auto-block",
  "description": "...",
  "mitre": ["T1110.001"],
  "files": [
    {
      "target": "manager",
      "path": "etc/rules/100100-ssh-bruteforce.xml",
      "content_ref": "rules/ssh-bruteforce.xml"
    },
    {
      "target": "agent_group",
      "group_id": "linux",
      "path": "/var/ossec/active-response/bin/firewall-block.sh",
      "content_ref": "ar/firewall-block.sh",
      "mode": "0750",
      "owner": "root:wazuh"
    }
  ],
  "restart": ["manager", "agent_group:linux"],
  "demo_attack": {
    "trmm_script_id": 42,
    "target_selector": { "type": "agent_group", "group_id": "linux" },
    "params": { "duration_sec": 30, "rate_per_sec": 5 }
  },
  "verification": {
    "rule_id": 100100,
    "wait_timeout_sec": 60,
    "expected_ar_command": "firewall-drop"
  }
}
```

`content_ref` — путь к файлу с содержимым внутри `src/config/usecases/assets/`. Хранение содержимого отдельно от манифеста — чтобы можно было редактировать XML/bash в Workshop.

### 6.3 Движок исполнения (`useUseCaseRunner.ts` композабл)

Стейт-машина по шагам:

1. **Resolve** — подгружает все `content_ref` файлы, валидирует пути и группы.
2. **Dispatch manager files** → `wazuhApi.putManagerFile()` для каждого target=manager.
3. **Dispatch agent files** → `fileDelivery.createDeliveryJob({ target_agents, locations, mode, owner })`. Ждём confirm от job'а.
4. **Restart** → `wazuhApi.restartManager()` и/или `wazuhApi.restartAgent(id)` для всех затронутых.
5. **Demo attack** *(если режим Deploy & Demo)* → `agents.runScript(target_agent_id, { script_id: demo_attack.trmm_script_id, args: demo_attack.params })`.
6. **Verify** → polling Wazuh Indexer (`wazuhIndexer.search`) на `rule.id == verification.rule_id` и timestamp > moment(starting_demo). Таймаут — `verification.wait_timeout_sec`.
7. **Done** → отображаем итоги, время, agent на котором сматчилось, AR-команда из лога.

### 6.4 Timeline UI

Колонка справа — шаги по вертикали с состояниями `pending / running / ok / failed / skipped`. Раскрытие любого шага показывает диагностику (HTTP-ответы API, диффы файлов, сырые логи). Без логов «вслепую» демо смысла не имеет.

### 6.5 Кейсы первой волны (5 штук, авторим в Workshop'е)

1. SSH brute-force → firewall block
2. Подозрительный PowerShell exec → kill process
3. FIM-tamper в `/etc` → email + journal alert
4. USB mass-storage подключение → блокировка устройства
5. Неавторизованная sudo-команда → AR-уведомление + escalation

---

## 7. Модуль 3 — Compliance View

**Маршрут:** `/security/compliance` → `src/views/security/WazuhComplianceView.vue`

### 7.1 Структура UI

- Селект агента (`MergedAgent`) или группы — двухколоночный layout.
- Таблица SCA-политик через `wazuhApi.getSCA(agent_id)` (метод уже есть, [src/api/wazuh.ts:162](src/api/wazuh.ts:162)).
- Раскрытие политики → таблица чеков через `wazuhApi.getSCAChecks(agent_id, policy_id)` (уже есть, [src/api/wazuh.ts:169](src/api/wazuh.ts:169)).
- Каждая строка чека — статус (`passed / failed / not_applicable`), title, rationale, remediation text от Wazuh.
- На failed-чеках 3 кнопки:
  - **Fix script** → `agents.runScript(merged.tactical_agent_id, mappedScriptId)`
  - **Push file** → `fileDelivery.createDeliveryJob(...)` по шаблону из remediation-реестра
  - **Re-scan** → `wazuhApi.requestSCAScan(agent_id)` → polling до обновления статуса
- Прогресс-бар: «закрыто N из M требований» — визуальный индикатор для приёмки.

### 7.2 Remediation-реестр

`src/config/sca-remediations.json`:

```json
{
  "cis_centos8_linux": {
    "1.1.1.1": {
      "type": "trmm_script",
      "script_id": 17,
      "comment": "Disable cramfs filesystem"
    },
    "1.1.1.2": {
      "type": "use_case",
      "use_case_id": "harden-fs-modules"
    },
    "5.2.5": {
      "type": "file_delivery",
      "file_template": "sshd-config-baseline",
      "path": "/etc/ssh/sshd_config.d/99-cis.conf",
      "post_action": "restart_service:sshd"
    }
  }
}
```

Стартово — JSON в репозитории. На втором этапе — CRUD-страница в Workshop для администрирования реестра.

### 7.3 Bulk-режим

Кнопка «Apply baseline to group» — берёт всех агентов выбранной группы, для каждого failed-чека лукапит remediation, формирует один большой `fileDelivery` job + батч `runScript`-задач. Отчёт по выполнению — той же timeline-панелью что в Use Case Runner.

---

## 8. Расширение API-клиента

Добавить в [src/api/wazuh.ts](src/api/wazuh.ts):

```ts
// === Manager files ===
async getManagerFile(path: string): Promise<string>
async putManagerFile(path: string, content: string): Promise<void>
async deleteManagerFile(path: string): Promise<void>

// === Group files ===
async getGroupFile(groupId: string, filename: string): Promise<string>
async putGroupFile(groupId: string, filename: string, content: string): Promise<void>

// === Restart ===
async restartManager(): Promise<void>
async restartAgent(agentId: string): Promise<void>
async restartAgentsByGroup(groupId: string): Promise<void>

// === Logtest (Wazuh ruleset testing) ===
async runLogtest(log: string, location: string, logFormat: string): Promise<LogtestResult>

// === Active Response manual trigger ===
async runActiveResponse(agentIds: string[], command: string, args: string[]): Promise<void>
async getActiveResponseLog(agentId: string, lines?: number): Promise<string>

// === SCA on-demand ===
async requestSCAScan(agentId: string): Promise<void>
```

Маппинг к Wazuh REST API:

| Метод | HTTP |
|---|---|
| `getManagerFile` | `GET /manager/files?path=<path>` |
| `putManagerFile` | `PUT /manager/files?path=<path>` (body — содержимое, content-type `application/octet-stream`) |
| `deleteManagerFile` | `DELETE /manager/files?path=<path>` |
| `getGroupFile` | `GET /groups/{group_id}/files/{filename}` |
| `putGroupFile` | `PUT /groups/{group_id}/files/{filename}` |
| `restartManager` | `PUT /manager/restart` |
| `restartAgent` | `PUT /agents/{id}/restart` |
| `restartAgentsByGroup` | `PUT /agents/group/{group_id}/restart` |
| `runLogtest` | `PUT /logtest` (body: `{ log, location, log_format, token? }`) |
| `runActiveResponse` | `PUT /active-response?agents_list={ids}` (body: `{ command, arguments, alert? }`) |
| `getActiveResponseLog` | `GET /manager/files?path=logs/active-responses.log` (последние N строк парсим на клиенте) |
| `requestSCAScan` | через `restartAgent` или `runScript` с `wazuh-control restart` — Wazuh не имеет нативного «force-scan SCA» endpoint'а; обходим перезапуском агента |

**Важно по `requestSCAScan`:** Wazuh не предоставляет force-scan для SCA через API (на момент 4.x). Решение — рестарт агента (что вызывает полный re-scan через 60–120 с) **или** TRMM-скрипт `/var/ossec/bin/wazuh-control reload` через `runScript`. В UI выбираем второй путь — быстрее и точечнее.

---

## 9. Структуры данных и типы

Новые TypeScript-типы в `src/types/wazuhOps.ts`:

```ts
export interface LogtestResult {
  token: string;
  output: {
    timestamp: string;
    rule?: { id: number; level: number; description: string };
    decoder?: { name: string; parent?: string };
    full_log: string;
    location: string;
  };
  messages: string[];
}

export interface UseCaseManifest {
  id: string;
  name: string;
  description: string;
  mitre: string[];
  files: UseCaseFile[];
  restart: UseCaseRestartTarget[];
  demo_attack?: UseCaseDemoAttack;
  verification?: UseCaseVerification;
}

export interface UseCaseFile {
  target: "manager" | "agent" | "agent_group";
  agent_id?: string;
  group_id?: string;
  path: string;
  content_ref: string;
  mode?: string;
  owner?: string;
}

export type UseCaseRestartTarget =
  | "manager"
  | { agent_id: string }
  | { agent_group: string };

export interface UseCaseDemoAttack {
  trmm_script_id: number;
  target_selector: { type: "agent" | "agent_group"; agent_id?: string; group_id?: string };
  params: Record<string, unknown>;
}

export interface UseCaseVerification {
  rule_id: number;
  wait_timeout_sec: number;
  expected_ar_command?: string;
}

export interface UseCaseRunStep {
  id: string;
  label: string;
  status: "pending" | "running" | "ok" | "failed" | "skipped";
  started_at?: string;
  finished_at?: string;
  details?: unknown;
  error?: string;
}

export interface ScaRemediation {
  type: "trmm_script" | "use_case" | "file_delivery";
  script_id?: number;
  use_case_id?: string;
  file_template?: string;
  path?: string;
  post_action?: string;
  comment?: string;
}
```

---

## 10. Routing и навигация

В [src/router/routes.js](src/router/routes.js) добавить под существующий security-блок:

```js
{ path: "/security/workshop", component: () => import("@/views/security/WazuhWorkshop.vue"), meta: { title: "Workshop", requiresAuth: true } },
{ path: "/security/use-cases", component: () => import("@/views/security/UseCaseRunner.vue"), meta: { title: "Detection Cases", requiresAuth: true } },
{ path: "/security/compliance", component: () => import("@/views/security/WazuhComplianceView.vue"), meta: { title: "Compliance", requiresAuth: true } },
```

В сайдбаре (там где security-меню) — три новых пункта в той же группе. Названия в UI: **Workshop**, **Detection Cases**, **Compliance** (без слова Wazuh).

---

## 11. Маппинг на acceptance-чеклист

| Раздел | Пункт | Где закрывается |
|---|---|---|
| **Reporting (8/8)** | Все 8 пунктов отчётности и экспорта | Существующая ветка `feat/discover-saved-search-reporting` (см. [TASK.md](TASK.md)) |
| **Incident Response** | Auto-detect & alert | Wazuh-нативный + дашборд (есть) |
| | Real-time isolation | Use Case с AR-скриптом firewall-block |
| | Forensic data collection | Use Case + TRMM-скрипт через Workshop |
| | Auto-fix script | Use Case Runner ✓ напрямую |
| | Workflow escalate | **Не закрывается** — отдельная фича, костыль через AR-email |
| | Communication & collaboration | `fileDelivery` доставка инструкций как файлов |
| | Lock & Wipe | TRMM-скрипт через Workshop + Use Case |
| | Investigate & report after incident | Reporting (CSV-экспорт) + опционально таблица incidents |
| | Threat Intelligence integration | CDB-листы в Workshop + TI-feeder на бэке (отдельно) |
| | Lessons learned policy update | `policies.deployPolicy` (есть) + Workshop для авторинга |
| **Vulnerability Mgmt** | Define vuln scan policy | Workshop (group config) |
| | Collect vuln data | Wazuh-нативный (есть) |
| | Assign vulnerability score | Wazuh CVSS + UI отображение |
| | Group devices by risk | **Не закрывается** — нужен tag-фильтр в существующем agent-list |
| | Auto-fix trigger | Use Case Runner ✓ |
| | Override score | **Не закрывается** — нужна новая таблица overrides |
| | Re-scan scheduled | Workshop manual + scheduler на бэке |
| | Restrict access by score | Use Case с AR firewall-block (триггер от threshold — на бэке) |
| | SIEM integration | Workshop конфиг |
| | Vulnerability report | Reporting |
| **Continuous Scan / UEBA** | Configure scan policy | Workshop |
| | Real-time monitoring | Wazuh + дашборд (есть) |
| | Continuous vuln check | Workshop конфиг |
| | Detect & alert anomalies | Workshop (custom rules) |
| | Enforce continuous compliance | Compliance View bulk-mode |
| | USB/CD scan | Use Case первой волны #4 |
| | Auto-response detection scan | Use Case Runner ✓ |
| | SIEM/SOC feed | Workshop конфиг |
| | UEBA | **Не закрывается** — отдельный продукт; для приёмки — пресет дашборда «аномалии» |

**Итог:** тремя модулями + Reporting закрывается ~30 из 37 пунктов. Оставшиеся 7 для приёмки закрываются костылями (см. колонку), для промышленного релиза — отдельные ТЗ.

---

## 12. Этапы и оценка

| # | Этап | Содержимое | Срок |
|---|---|---|---|
| 1 | Расширение API-клиента | Все методы из §7, типы из §9, unit-тесты к парсингу logtest-ответа | 1.5 дня |
| 2 | Workshop — Rules & Decoders | Таб с Monaco + logtest, save/restart, snapshot history | 2.5 дня |
| 3 | Workshop — Active Response | Таб с manual trigger + AR-логом | 2 дня |
| 4 | Workshop — Scripts | Таб с pinned test agent, run-on-agent, push-as-AR | 1.5 дня |
| 5 | Workshop — SCA Policies | Таб YAML + push & scan | 1.5 дня |
| 6 | Workshop — History/Revert | Таблица версий + diff + revert | 1 день |
| 7 | Use Case Runner — движок | Композабл, манифест-схема, timeline-стейт-машина | 2.5 дня |
| 8 | Use Case Runner — UI | Список кейсов, карточка, timeline-панель | 2 дня |
| 9 | Use Case Runner — 5 кейсов | Авторинг манифестов и контента в Workshop'е | 5 дней (по 1 на кейс) |
| 10 | Compliance View | SCA-таблица + remediation-реестр + bulk-mode | 3 дня |
| 11 | Интеграция и smoke-тесты | E2E-прогон по всем трём модулям + фикс багов | 2 дня |

**Суммарно:** ≈ 24.5 рабочих дня одного фронтенд-разработчика. С параллельным авторингом кейсов и UI — реалистично 4 недели.

---

## 13. Открытые вопросы (требуют решения до старта)

1. **Версионирование артефактов.** Снапшоты файлов храним в TRMM-бэкенде (новая таблица) или single source of truth — Wazuh? **Рекомендация:** новая таблица в TRMM, иначе нет diff/revert.
2. **Pinned test agent.** Выделенная VM или любой боевой? **Рекомендация:** любой, выбор оператора, закрепление в localStorage.
3. **Use case манифесты.** JSON в репозитории на старте → CRUD на бэке потом, или сразу CRUD? **Рекомендация:** JSON на этапах 1–9, CRUD позже.
4. **Whitelabel-наименования.** Названия модулей в UI — окончательно: **Workshop**, **Detection Cases**, **Compliance**? Или меняем под бренд CYWM (например, **Rule Editor**, **Playbooks**, **Compliance Center**)?
5. **Costyl-стратегия по 7 не закрывающимся пунктам.** Делаем под приёмку (стабы + AR-скрипты) или включаем в roadmap как полноценные фичи? Решение влияет на финальную оценку трудозатрат.

---

## 14. Файлы, которые надо прочитать перед кодом

| Файл | Зачем |
|---|---|
| [src/api/wazuh.ts](src/api/wazuh.ts) | Эталон Wazuh-клиента, перехватчики токена — добавляем методы из §7 в этом же стиле |
| [src/api/wazuhIndexer.ts](src/api/wazuhIndexer.ts) | Поиск алёртов в OpenSearch — для Use Case Runner verification |
| [src/api/agents.js](src/api/agents.js) | TRMM `runScript` и связанные методы |
| [src/api/fileDelivery.ts](src/api/fileDelivery.ts) | Паттерн доставки файлов на агенты |
| [src/components/modals/agents/RunScript.vue](src/components/modals/agents/RunScript.vue) | UX-эталон запуска скриптов |
| [src/types/wazuh.ts](src/types/wazuh.ts) | `MergedAgent`, SCA-типы — переиспользуем |
| [src/utils/notify.ts](src/utils/notify.ts) | Хелперы нотификаций — единый стиль ошибок |
| [TASK.md](TASK.md) | Параллельная работа по Reporting — не пересекаемся |
| [quasar.config.js](quasar.config.js) | Прокси `/api/wazuh/*` к Wazuh API |
