# Task: Wazuh-MCP-Server для тестирования, разработки абстракций и демо

> **Self-contained brief.** Файл рассчитан на передачу следующему инженеру/агенту без прочтения чата.
> Прочитать целиком до начала работ.

---

## 0. TL;DR

- Развернуть `gensecaihq/Wazuh-MCP-Server` на staging-сервере
- Подключить через SSH-туннель к Claude Code локально
- Использовать для **тестирования Wazuh API**, **разработки абстракций над CLI/API** и **подготовки демо-кейсов** (включая active response)
- После демо — **полностью свернуть**: остановить контейнер, удалить пользователей, ротировать все пароли

---

## 1. Контекст

### 1.1. Зачем
1. Тестирование сценариев работы с Wazuh через conversational UI
2. Разработка абстракций (wrapper) над Wazuh API/CLI с помощью Claude Code
3. Подготовка демо-кейсов под Wazuh + наши автоматизации
4. Временный инструмент — после демо MCP отключается

### 1.2. Почему gensecaihq/Wazuh-MCP-Server
Из трёх живых реализаций (gensecaihq, gbrigandi, unmuktoai) выбрана `gensecaihq`:
- 48 готовых tools, включая 9 active response + 5 verification + 5 rollback
- Production-grade: RBAC enforcement, audit log, rate limit, output sanitization
- Активные релизы (последний — март 2026)
- Работает с любым MCP-клиентом (Claude Code в нашем случае)

### 1.3. Решение: full active response (не read-only)
Изначально ТЗ предполагало старт с read-only. Решение пересмотрено: **включаем все 48 tools**, потому что нужно демонстрировать live-active-response (block_ip, isolate_host, kill_process, quarantine_file и т.д.).

Митигация рисков см. §8.

---

## 2. Архитектура

```
┌──────────────────────────┐    SSH-туннель :3000    ┌─────────────────────────────────┐
│ Разработчик (локально)   │═════════════════════════>│ Staging server (95.142.35.174)   │
│ Claude Code              │   localhost:3000         │  ├─ nginx (уже стоит)            │
│ + claude mcp add wazuh   │                          │  └─ wazuh-mcp Docker             │
└──────────────────────────┘                          │      bind 127.0.0.1:3000         │
                                                      └────────┬─────────────────────────┘
                                                               │ HTTPS (self-signed)
                                                               ▼
                                                      ┌─────────────────────────────────┐
                                                      │ Wazuh server (5.129.197.68)      │
                                                      │  ├─ Manager API :55000           │
                                                      │  └─ Indexer (OpenSearch) :9200   │
                                                      └─────────────────────────────────┘
```

**Ключевые архитектурные решения:**
- MCP контейнер слушает `127.0.0.1:3000` — наружу не торчит
- Доступ только через SSH-туннель (без публичного DNS/TLS, без оформления через nginx)
- Если потребуется доступ нескольким разработчикам — VPN/Tailscale, **не публичный nginx**
- Wazuh self-signed серт — `VERIFY_SSL=false` или смонтировать CA bundle

---

## 3. Окружение

### 3.1. Staging server (где разворачиваем MCP)
| | |
|---|---|
| Хост | `95.142.35.174` |
| SSH user | `root` |
| Доступ | SSH-пароль (заменить на ключ перед работами) |
| Путь деплоя | `/opt/wazuh-mcp` |
| Docker | 28.4.0 |
| Compose | v2.39.2 |

### 3.2. Wazuh server
| | |
|---|---|
| Хост | `5.129.197.68` |
| Версия | 4.14.4 |
| Manager API порт | `55000` |
| TLS | self-signed |
| Indexer (OpenSearch) | 7.10.2, порт `9200` |

### 3.3. Тестовые агенты (для active response)
| ID | Name | OS | Group |
|---|---|---|---|
| 007 | NOTEBOOK_VN | Windows 11 Pro | `demo_windows` |
| 010 | wazuh-agent-4fef4d5df371 | Amazon Linux 2023 | `default` |

> **Важно:** active response гонять **только** на этих агентах. Реальные прод-агенты должны быть исключены через RBAC group restriction (см. §5.1).

### 3.4. Сетевые правила (уже выполнено)
- Staging → Wazuh Manager (55000): открыто
- Staging → Wazuh Indexer (9200): открыто
- Локальный комп → Staging (22): прямой SSH

---

## 4. Креденшелы

> **⛔ НЕ КОММИТИТЬ В ГИТ.** Все секреты — в `/opt/wazuh-mcp/.env` на staging-сервере или в системе секретов (Vault/SOPS). Файл `.env` в `.gitignore` репо MCP-сервера уже исключён.

### 4.1. Что есть сейчас (предоставлено)
- Wazuh Manager admin: `wazuh-wui` / `<пароль на staging .env>`
- OpenSearch admin: `admin` / `<пароль на staging .env>`

### 4.2. Что нужно создать (см. §5)
- `mcp-demo` — пользователь Wazuh Manager API с RBAC ролью под все 48 tools
- `mcp-indexer-ro` — read-only пользователь OpenSearch на индексы алертов и уязвимостей
- Bearer-токен MCP-сервера для авторизации Claude Code

### 4.3. После демо (обязательно, см. §9)
Ротировать всё:
- Пароли `wazuh-wui` и `admin` (попали в чат-историю)
- SSH-пароль root на staging
- Удалить `mcp-demo` и `mcp-indexer-ro`

---

## 5. План внедрения

### Этап 0 — Подготовка SSH (5 мин)
- [ ] Сгенерировать SSH-ключ для работ или добавить существующий в `/root/.ssh/authorized_keys` на staging
- [ ] Опционально: ограничить SSH по IP в `sshd_config` или через firewall
- [ ] Установить `PasswordAuthentication no` после переключения на ключ (опционально)

### Этап 1 — Wazuh: создание `mcp-demo` (10 мин)

Через Wazuh Manager API (с staging):

```bash
# 1. Получить JWT
JWT=$(curl -sk -u wazuh-wui:<PASS> -X POST \
  "https://5.129.197.68:55000/security/user/authenticate" | jq -r '.data.token')

# 2. Создать роль mcp-demo-role с полными правами
curl -sk -X POST "https://5.129.197.68:55000/security/roles" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"name": "mcp-demo-role"}'

# 3. Привязать политики (agent:*, manager:read, active-response:command, rules:read, vulnerability:read)
# Получить ID встроенных политик через GET /security/policies, затем PUT /security/roles/{id}/policies

# 4. Создать пользователя mcp-demo
curl -sk -X POST "https://5.129.197.68:55000/security/users" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"username":"mcp-demo","password":"<СГЕНЕРИТЬ>"}'

# 5. Привязать роль к пользователю
curl -sk -X POST "https://5.129.197.68:55000/security/users/{user_id}/roles?role_ids={role_id}" \
  -H "Authorization: Bearer $JWT"
```

> **Ограничение области (опционально, но рекомендуется):** при создании роли указать `resources: agent:group:demo_windows`, `agent:id:010` — тогда `mcp-demo` сможет действовать только на тестовых агентах.

### Этап 2 — OpenSearch: read-only `mcp-indexer-ro` (5 мин)

```bash
# Через OpenSearch Security API
curl -sk -u admin:<PASS> -X PUT "https://5.129.197.68:9200/_plugins/_security/api/internalusers/mcp-indexer-ro" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "<СГЕНЕРИТЬ>",
    "backend_roles": ["readall"],
    "attributes": {}
  }'

# Создать кастомную роль с правами только на нужные индексы
curl -sk -u admin:<PASS> -X PUT "https://5.129.197.68:9200/_plugins/_security/api/roles/wazuh_alerts_ro" \
  -H "Content-Type: application/json" \
  -d '{
    "index_permissions": [{
      "index_patterns": ["wazuh-alerts-*", "wazuh-states-vulnerabilities-*"],
      "allowed_actions": ["read", "search"]
    }]
  }'

# Привязать роль к пользователю
curl -sk -u admin:<PASS> -X PUT "https://5.129.197.68:9200/_plugins/_security/api/rolesmapping/wazuh_alerts_ro" \
  -H "Content-Type: application/json" \
  -d '{"users": ["mcp-indexer-ro"]}'
```

### Этап 3 — Деплой MCP на staging (10 мин)

```bash
ssh root@95.142.35.174

mkdir -p /opt/wazuh-mcp
cd /opt/wazuh-mcp
git clone https://github.com/gensecaihq/Wazuh-MCP-Server.git .

cp .env.example .env
# Заполнить .env (см. §5.1)

# Override для bind на loopback
cat > docker-compose.override.yml <<'EOF'
services:
  wazuh-mcp:
    ports:
      - "127.0.0.1:3000:3000"
    restart: unless-stopped
EOF

docker compose up -d
docker compose logs -f wazuh-mcp  # дождаться "MCP server listening on :3000"

curl -fsS http://127.0.0.1:3000/health  # должен вернуть 200
```

#### 5.1. Содержимое `.env` (плейсхолдеры)

```env
# Wazuh Manager
WAZUH_HOST=5.129.197.68
WAZUH_PORT=55000
WAZUH_USER=mcp-demo
WAZUH_PASS=<заполнить из секретов>
VERIFY_SSL=false   # self-signed

# Wazuh Indexer
WAZUH_INDEXER_HOST=5.129.197.68
WAZUH_INDEXER_PORT=9200
WAZUH_INDEXER_USER=mcp-indexer-ro
WAZUH_INDEXER_PASS=<заполнить из секретов>

# MCP server
MCP_HOST=127.0.0.1
MCP_PORT=3000
AUTH_MODE=bearer
AUTHLESS_ALLOW_WRITE=false
MCP_BEARER_TOKEN=<сгенерить: openssl rand -hex 32>
```

### Этап 4 — Подключение Claude Code (5 мин)

Локально:

```bash
# SSH-туннель в фоне
ssh -L 3000:127.0.0.1:3000 root@95.142.35.174 -N -f

# Регистрация MCP в Claude Code
claude mcp add wazuh \
  --transport http \
  --url http://localhost:3000/mcp \
  --header "Authorization: Bearer <MCP_BEARER_TOKEN>"

# Проверка
claude mcp list
```

Опционально — добавить в `~/.ssh/config`:
```
Host wazuh-mcp-tunnel
  HostName 95.142.35.174
  User root
  LocalForward 3000 127.0.0.1:3000
  ServerAliveInterval 60
```

### Этап 5 — Smoke-test (5 мин)

В Claude Code прогнать:
- [ ] `health` MCP-сервера отвечает 200
- [ ] "Покажи всех агентов Wazuh" → возвращает агентов 007 и 010
- [ ] "Health агента 010" → статус `active`
- [ ] "Сколько алертов за последний час" → число + breakdown
- [ ] Bearer-токен убрать → 401 (проверка auth)

### Этап 6 — Read-only сценарии (15 мин)

- [ ] `get_wazuh_alerts` — последние 50 алертов
- [ ] `analyze_alert_patterns` — паттерны за сутки
- [ ] `get_critical_vulnerabilities` — CVE на агенте 010
- [ ] `get_agent_processes`, `get_agent_ports` на обоих агентах
- [ ] `run_compliance_check` — PCI/HIPAA если настроено

### Этап 7 — Active Response в песочнице (30 мин)

**На агенте 010 (Linux):**
- [ ] `wazuh_block_ip` для `203.0.113.42` → проверить `iptables -L -n` на агенте → должна быть запись
- [ ] Verification tool возвращает success
- [ ] Rollback → правило удалено
- [ ] `wazuh_kill_process` — запустить `sleep 9999`, убить через MCP, проверить отсутствие
- [ ] `wazuh_quarantine_file` — создать `/tmp/test_evil.sh`, в карантин, rollback восстанавливает

**На NOTEBOOK_VN (Windows 11):**
- [ ] `wazuh_block_ip` → проверить Windows Firewall rule
- [ ] Rollback
- [ ] `wazuh_disable_user` (если есть тестовая локальная учётка) + rollback
- [ ] `wazuh_quarantine_file` для тестового файла

> **Каждое действие — проверка на агенте через `ssh` или RDP**, не доверяем только ответу MCP.

### Этап 8 — Демо-кейсы

См. §6.

---

## 6. Демо-кейсы

| # | Кейс | Tools | Что показываем |
|---|---|---|---|
| 1 | Conversational triage: "Что важного за сутки?" | `get_wazuh_alerts`, `analyze_alert_patterns`, `get_top_security_threats` | LLM суммаризирует SOC dashboard |
| 2 | Health-check fleet | `get_wazuh_running_agents`, `check_agent_health` | Замена ручной проверки агентов |
| 3 | Vulnerability assessment | `get_critical_vulnerabilities`, `vulnerability_summary` | CVE prioritization через LLM |
| 4 | **Live block IP** | `wazuh_block_ip` + verification + rollback | Active response в реальном времени |
| 5 | **Host isolation** | `wazuh_isolate_host` + rollback | Incident response |
| 6 | **Наша абстракция** | wrapper → последовательность MCP-tools | Главный кейс — собственная автоматизация |
| 7 | Compliance report | `run_compliance_check`, `generate_security_report` | PCI/HIPAA в conversational форме |

> **Кейс 6 — открытый.** Список конкретных абстракций для демо нужно зафиксировать отдельно (см. §10).

---

## 7. Acceptance criteria

### Инфраструктура
- [ ] MCP контейнер слушает только `127.0.0.1` (`ss -tlnp` подтверждает, наружу не виден)
- [ ] `/health` отвечает 200 без auth, остальные эндпоинты требуют bearer
- [ ] SSH-туннель работает с локального компа разработчика

### Read-only функциональность
- [ ] `get_wazuh_agents` возвращает оба тестовых агента
- [ ] `get_wazuh_alerts` возвращает данные из OpenSearch индексов
- [ ] `get_critical_vulnerabilities` отдаёт CVE
- [ ] Output sanitization работает: пароли/токены в алертах не светятся

### Active Response
- [ ] `wazuh_block_ip` подтверждается изменением iptables/Windows Firewall на агенте
- [ ] Verification tool возвращает `success` после действия
- [ ] Rollback восстанавливает исходное состояние
- [ ] Audit log MCP-сервера содержит запись о каждом destructive вызове (timestamp + client_id)
- [ ] При попытке active response против агента вне whitelist — 403 (если настроен group restriction)

### Безопасность
- [ ] Bearer-токен обязателен (без него — 401)
- [ ] Rate limiting срабатывает при флуде
- [ ] `.env` не в git (`.gitignore` корректен)

---

## 8. Риски и митигация

| Риск | Митигация |
|---|---|
| LLM по галлюцинации блокирует не тот IP / не того пользователя | RBAC group restriction для `mcp-demo` (только `demo_windows` + agent 010); все destructive вызовы требуют явного подтверждения через permission prompt Claude Code |
| Active response затрагивает прод-агентов | Wazuh role с `resources: agent:group:demo_windows`, `agent:id:010` — `mcp-demo` физически не видит прод-агентов |
| Креденшелы в чат-истории Anthropic | После демо ротация ВСЕХ паролей (см. §9) |
| Утечка алертов в Anthropic API через MCP | Output sanitization включён по умолчанию; согласовать с security возможность отправки SOC-данных в external LLM |
| MCP-хост скомпрометирован | Bind только на 127.0.0.1; non-root в контейнере; read-only FS (по умолчанию в gensecaihq образе) |
| SSH-пароль root скомпрометирован | Заменить на ключ до начала работ; ротировать пароль после демо; ограничить SSH по IP |
| Несовместимость с Wazuh 4.14.4 | gensecaihq поддерживает 4.8.0–4.14.4 — последняя минорная версия в окне совместимости |

---

## 9. Cleanup checklist (ПОСЛЕ ДЕМО — обязательно)

### На staging
- [ ] `docker compose -f /opt/wazuh-mcp/docker-compose.yml down -v`
- [ ] `rm -rf /opt/wazuh-mcp` (или сохранить логи и удалить только секреты)
- [ ] Сменить SSH-пароль root: `passwd`
- [ ] Удалить SSH-ключ временного инженера из `authorized_keys`

### На Wazuh Manager
- [ ] Удалить пользователя `mcp-demo` через `DELETE /security/users/{id}`
- [ ] Удалить роль `mcp-demo-role`
- [ ] Сменить пароль `wazuh-wui` (попал в историю чата)

### На Wazuh Indexer
- [ ] Удалить пользователя `mcp-indexer-ro`
- [ ] Удалить роль `wazuh_alerts_ro` и rolemapping
- [ ] Сменить пароль `admin` (попал в историю чата)

### На локальном компе разработчика
- [ ] `claude mcp remove wazuh`
- [ ] Удалить bearer-токен из заметок/менеджера паролей
- [ ] Закрыть SSH-туннель, удалить запись из `~/.ssh/config`

### Документация
- [ ] Заархивировать MCP audit-log (если нужен для отчётности)
- [ ] Зафиксировать в этом TASK файле итоги демо и retention решений

---

## 10. Открытые вопросы

1. **Whitelist агентов** — настраиваем через Wazuh RBAC `resources: agent:id:010,agent:group:demo_windows`? (рекомендуется — да)
2. **Bearer-токен** — один на всю команду или по токену на разработчика? (по токену лучше для аудита)
3. **Конкретные абстракции автоматизации** для кейса 6 — нужен отдельный список:
   - На каком языке пишем (Python / TS / Go)?
   - Где живёт код (этот репо или отдельный)?
   - Какие сценарии оборачиваем первыми?
4. **Запись демо** — нужна для повторного использования или только живой показ?

---

## 11. Полезные ссылки

- [gensecaihq/Wazuh-MCP-Server](https://github.com/gensecaihq/Wazuh-MCP-Server)
- [Wazuh Manager API docs](https://documentation.wazuh.com/current/user-manual/api/reference.html)
- [OpenSearch Security API](https://opensearch.org/docs/latest/security/access-control/api/)
- [Claude Code MCP](https://docs.claude.com/en/docs/claude-code/mcp)
- [MCP spec](https://spec.modelcontextprotocol.io/)

---

## 12. Runtime state (заполнено при деплое 2026-04-27)

> Секреты лежат на staging в `/root/.wazuh-mcp-bootstrap.env` (mode 600). Сюда — только plumbing.

### 12.1. Изменения относительно §2–§5
- **MCP-порт смещён с 3000 на 3001** — на staging 3000 уже занят Grafana (uptime 13 дней). Bind строго `127.0.0.1:3001:3000`.
- **Wazuh-MCP image тег**: `wazuh-main-server:4.2.1` (gensecaihq tag v4.2.1 / commit `fe159ba`). Compose project name: `wazuh-main-server`. Контейнер: `wazuh-main-server`. Bridge-сеть: `wazuh-main-server_default`.
- **RBAC scope для `mcp-demo` задан жёстко через `agent:id:007, agent:id:010`** (не через `agent:group:demo_windows` — в этой группе оказался прод-агент 009 / DESKTOP-E1R8HUS). Кастомные политики Wazuh: 100 (`mcp-demo-restricted-agents`) + 101 (`mcp-demo-resourceless`). Builtin: 5/13/17/22 (group/decoders/lists/rules read).
- **OpenSearch role `wazuh_alerts_ro`**: `cluster_composite_ops_ro` + `cluster_monitor`, index_permissions `read` на `wazuh-alerts-*` и `wazuh-states-vulnerabilities-*`. **DLS не настроен** — read alerts с прод-агентов через MCP виден (active-response блокируется в Manager API).
- **Auth flow**: API key (49 chars, `wazuh_<43 url-safe>`) обменивается на JWT через `POST /auth/token`. **JWT TTL = 24h** (захардкожено в gensecaihq, `TOKEN_LIFETIME_HOURS=8760` в .env игнорируется). Claude Code хранит JWT, нужно обновлять раз в сутки.

### 12.2. Файлы на staging
- `/opt/wazuh-mcp/` — клон Wazuh-MCP-Server + наши `.env`, `compose.override.yml`, `cleanup.sh`
- `/opt/wazuh-mcp/cleanup.sh` — one-shot полный rollback по §9 (mode 700, root only)
- `/root/.wazuh-mcp-bootstrap.env` — все креды и runtime-ID (mode 600)

### 12.3. Локальные файлы (на машине разработчика)
- `~/.ssh/config` — добавлен блок `Host wazuh-mcp-tunnel`
- `~/.ssh/authorized_keys` — добавлен публичный ключ на staging (`nikitakrasovskij@MacBook-Air-Nikita.local`)
- `~/.claude.json` — MCP server `wazuh` зарегистрирован (HTTP transport, http://localhost:3001/mcp)

### 12.4. Команды повседневной эксплуатации

**Открыть туннель в фоне** (SSH-config alias уже есть):
```bash
ssh -fN wazuh-mcp-tunnel
```

**Обновить JWT (раз в сутки):**
```bash
NEW_JWT=$(ssh root@95.142.35.174 '. /root/.wazuh-mcp-bootstrap.env && curl -sS -X POST http://127.0.0.1:3001/auth/token -H "Content-Type: application/json" -d "{\"api_key\":\"$MCP_API_KEY\"}" | jq -r .access_token')
claude mcp remove wazuh
claude mcp add --transport http wazuh "http://localhost:3001/mcp" --header "Authorization: Bearer $NEW_JWT"
```

**Полный откат (§9):**
```bash
ssh root@95.142.35.174 '/opt/wazuh-mcp/cleanup.sh'
claude mcp remove wazuh
ssh -O exit wazuh-mcp-tunnel
```
После этого ротировать пароли `wazuh-wui`, `admin`, root SSH (попали в чат-историю).

### 12.5. Acceptance §7 — пройдено
- [x] MCP контейнер слушает только `127.0.0.1` (`ss -tlnp` на staging показывает `127.0.0.1:3001`, внешний curl → connection refused)
- [x] `/health` отвечает 200; `/mcp` без bearer → 401
- [x] SSH-туннель работает (через `Host wazuh-mcp-tunnel`)
- [x] `get_wazuh_agents` возвращает только 007 и 010
- [x] `get_wazuh_alerts` возвращает данные из OpenSearch
- [x] RBAC denial: `check_agent_health 003` → `HTTP 403`; `active-response` против 003 → `Unauthorized`
- [x] vulnerability_tools.available = true (через индексер)
- [ ] Active Response (Этап 7) — ждёт явного OK, см. §10 пункт «доступ к агентам»
- [~] **Output sanitization — частично** (verified 2026-04-27 через unit-вызов `_sanitize_output_text` в контейнере + scan 5 alerts).
    - Применяется только к полю `full_log` алертов через `_compact_alert` (server.py:789), и только когда `full_log` укладывается в первые 300 chars (затем truncate).
    - Покрывает 3 паттерна: `password|passwd|pwd=…`, `api_key|secret|token=/:…`, `Authorization: …`. Лейблированные секреты редактируются в `[REDACTED]`.
    - **Не покрывает:** unlabeled-секреты (raw JWT без `Bearer`, AWS access key, hex blob); другие поля алерта (`rule.description`, `syscheck.path`, `data.command`); ответы остальных tools (`get_agent_processes`, `get_critical_vulnerabilities`, syscollector-tools и т.д.) — функция нигде больше не вызывается.
    - Решение: либо принять текущий scope, либо расширить вверх по стеку (см. §12.6.4).
- [ ] Audit log destructive вызовов — будет проверен в Этапе 7

### 12.6. Открытые после деплоя вопросы
1. **DLS на OpenSearch-роли?** Если нужен — добавить в `wazuh_alerts_ro`: `"_dls": "{\"terms\":{\"agent.id\":[\"000\",\"007\",\"010\"]}}"`. Тогда mcp-demo не увидит даже read-only алерты прод-агентов.
2. **SSH/RDP к агентам 007 и 010** — нужны для verification AR (TASK §7: «не доверяем только ответу MCP»). Без них AR-этап работает «вслепую» относительно реального состояния хоста.
3. **JWT auto-refresh** — ставить ли cron на staging для refresh + обновления локального claude config? Или каждый день вручную одной командой?
   - Готов скрипт `scripts/wazuh-mcp-refresh-jwt.sh` (idempotent, ssh-в-staging-за-API-key, обновляет локальный `claude mcp` registration). Для cron на dev-машине — `crontab -e` + `0 8 * * * /path/to/scripts/wazuh-mcp-refresh-jwt.sh >>/tmp/wazuh-mcp-jwt.log 2>&1`.
4. **Расширить scope output sanitization?** Текущая реализация (см. §12.5) покрывает только `full_log` алертов лейблированными паттернами. Варианты:
   - (a) Принять как есть, документировать risk — возможный leak unlabeled-секретов и не-alert payload через MCP в LLM.
   - (b) Поднять PR в gensecaihq: оборачивать всю tools/call ответную text-нагрузку в `_sanitize_output_text` + добавить паттерны (raw JWT, AWS key, base64-blob heuristic).
   - (c) Локальный fork с патчем под наш use case.

   Решение зависит от ответа security: что считается «утёкшим SOC-данным» при отправке в Anthropic API.

### 12.7. Дополнительно зафиксировано 2026-04-27
- **Прод-агент 009 (DESKTOP-E1R8HUS) виден в `get_wazuh_alerts` через MCP** — это прямое следствие отсутствия DLS на роли `wazuh_alerts_ro` (см. §12.6.1). Active Response против 009 заблокирован Manager API RBAC (§12.5), но read-only алерты с него уходят в LLM. Если §12.6.1 решается «да, нужен DLS» — это закрывает gap.
