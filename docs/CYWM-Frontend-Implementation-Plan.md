# CYWM — Frontend Implementation Plan

> **Что это.** Рабочий ТЗ для фронта: разложение бизнес-спека и UI-мокапа на конкретные файлы, маршруты, стор, API, компоненты. Делаем под бизнес-ТЗ `CYWM-Business-SPEC-Final.md` и UI-мокап `cywm-trmm-wazuh-style.html`.
>
> **Ветка.** `feature/refactorUI` (текущая, без новых веток внутри).
>
> **Целевая среда.** Wazuh **v4.14.4** (см. раздел 4 бизнес-ТЗ).
>
> **Объём фронта v0.1.** Только две страницы из мокапа:
> 1. `Files & Deploy` — дерево файлов слева + редактор справа
> 2. `Deploy History` — таблица истории деплоев
>
> Всё остальное (Manager Status, Live Logs, Settings) — за рамками.

---

## 1. Размещение модуля

Следуем сложившемуся в репе паттерну (`gpo/`, `policies/`, `resources/`, `agent-updates/`): отдельный feature-area folder в корне `src/`.

```
src/cywm/
├── views/
│   ├── CywmFilesView.vue        # страница Files & Deploy
│   └── CywmHistoryView.vue      # страница Deploy History
├── components/
│   ├── FileTree.vue             # левая колонка: список файлов по категориям
│   ├── FileTreeRow.vue          # строка файла (с modified-индикатором)
│   ├── ConfigEditor.vue         # правая колонка: редактор + toolbar
│   ├── EditorToolbar.vue        # breadcrumb + Reload/Delete/Save/Deploy
│   ├── DeployLogModal.vue       # лог операции (success/failed)
│   ├── UploadFileModal.vue      # загрузить файл
│   ├── CreateFileModal.vue      # создать новый файл из шаблона
│   ├── DeleteConfirmModal.vue   # подтверждение удаления
│   └── HistoryTable.vue         # таблица истории + пагинация
├── composables/
│   ├── useFileTree.ts           # группировка файлов по target/category
│   ├── useEditor.ts             # state редактора (modified flag, save, reload)
│   └── useDeploy.ts             # запуск deploy + опрос статуса
├── types/
│   └── index.ts                 # ConfigFile, FileCategory, DeployRecord, DeployStatus
├── data/
│   └── templates.ts             # шаблоны для "New file" (rule, decoder, AR-script…)
└── api/
    └── cywm.ts                  # axios-обёртки над REST бэкендом
```

**Pinia store** — `src/stores/cywm.ts` (рядом с остальными `stores/*.ts`).

**Тип файла модулей.** TypeScript для нового кода (как `gpo/`, security suite). JS не вводим.

---

## 2. Роуты и левая навигация

### 2.1 Маршруты

В `src/router/routes.js` добавить два детских маршрута к `MainLayout`:

```js
{
  path: "/cywm/files",
  name: "CywmFiles",
  component: () => import("@/cywm/views/CywmFilesView.vue"),
  meta: { requireAuth: true },
},
{
  path: "/cywm/history",
  name: "CywmHistory",
  component: () => import("@/cywm/views/CywmHistoryView.vue"),
  meta: { requireAuth: true },
},
```

Без вложенного layout — рисуем прямо внутри `MainLayout`. Wazuh-style верхний бар (breadcrumb + `Wazuh manager: v4.14.4` + `● API connected`) — общий компонент `components/CywmTopbar.vue`, монтируется в обеих view.

### 2.2 Пункты в FileBar / sidebar

Из мокапа — раздел `CYWM (NEW)` с двумя пунктами: `📂 Files & Deploy` и `↑ Deploy History`. Найти текущий sidebar (`src/components/FileBar.vue` или аналогичный layout-компонент), добавить отдельной секцией. **Не трогать существующие пункты TRMM** — рисуем как отдельный блок ниже.

> TODO для исполнителя: уточнить точное место, где сейчас рендерится главное меню (после правки `FileBar` в коммите `456d6d3` оно могло переехать). Найти grep-ом `Dashboard|Agents|Scripts|Alerts` по `src/layouts/` и `src/components/`.

---

## 3. Pinia store (`src/stores/cywm.ts`)

```ts
interface ConfigFile {
  id: string;                       // uuid из бэка
  target: "manager" | "windows-agent";
  category: FileCategory;           // см. types
  filename: string;                 // local_rules.xml
  content: string;                  // тело файла
  contentSaved: string;             // последняя сохранённая версия (для modified-флага)
  updatedAt: string;                // ISO
  updatedBy: string;
  isModified: boolean;              // computed: content !== contentSaved
}

type FileCategory =
  | "rules"
  | "decoders"
  | "ossec-snippets"
  | "shared"           // agent.conf для группы
  | "active-response"; // только для windows-agent

interface DeployRecord {
  id: string;
  startedAt: string;
  target: string;       // "Wazuh manager" | "WIN11-DEMO (009)" | "<group> group"
  filename: string;
  category: FileCategory;
  user: string;
  status: "success" | "failed" | "running";
  durationMs: number;
  log: string;          // полный текст лога (lazy-loaded — отдельный запрос)
}
```

**Состояние стора:**
- `files: ConfigFile[]` — все файлы
- `selectedFileId: string | null` — что в редакторе
- `editorContent: string` — текущий буфер редактора (отвязан от `files[].content`, синкается при save)
- `deployHistory: DeployRecord[]`
- `historyFilters: { search, target, status, dateFrom, dateTo }`
- `pagination: { page, perPage }`
- `isLoading`, `lastError`

**Actions:**
- `fetchFiles()`, `fetchFile(id)`, `saveFile(id)`, `deployFile(id)` — последний возвращает `Promise<DeployRecord>`, при успехе пушит запись в начало `deployHistory`
- `createFile(payload)`, `uploadFile(formData)`, `deleteFile(id)`
- `fetchHistory(params)`, `fetchDeployLog(deployId)`
- `restartManager()`, `restartAgent(agentId)` — для будущей кнопки restart (UI пока не делаем, метод закладываем)

---

## 4. API layer (`src/cywm/api/cywm.ts`)

Используем глобальный axios из `src/boot/axios.js` (через `import axios from "axios"`). `baseURL` уже `/api` в dev / `window._env_.PROD_URL` в prod — никакого своего инстанса.

**Эндпоинты (предположение, согласовать с бэкендом):**

| Метод | URL | Назначение |
|---|---|---|
| GET | `/cywm/files/` | список файлов |
| GET | `/cywm/files/:id/` | содержимое файла |
| POST | `/cywm/files/` | создать (body: target, category, filename, content) |
| PUT | `/cywm/files/:id/` | сохранить содержимое |
| DELETE | `/cywm/files/:id/` | удалить (soft-delete на 30 дней) |
| POST | `/cywm/files/upload/` | multipart upload |
| POST | `/cywm/files/:id/deploy/` | запустить деплой → `{ deployId }` |
| GET | `/cywm/deploys/:id/` | статус и лог |
| GET | `/cywm/deploys/` | история (фильтры query string) |
| POST | `/cywm/manager/restart/` | restart wazuh-manager |
| GET | `/cywm/manager/logs/?tail=100` | хвост лога manager (для будущей фичи) |

> **Открытые вопросы к бэкенду** — см. раздел 9.

---

## 5. Компоненты — что в каком берётся из мокапа

Мапинг "элемент мокапа → компонент Vue":

| Мокап (HTML) | Vue-компонент | Заметки |
|---|---|---|
| `.wazuh-topbar` | `CywmTopbar.vue` | breadcrumb (`CYWM / <текущая страница>`), `Wazuh manager: v4.14.4` справа, индикатор API |
| `.page-header` (Files) | прямо в `CywmFilesView.vue` | `Files (N)`, подзаголовок, кнопки `+ Upload file` / `+ New file` |
| `.file-layout` | `CywmFilesView.vue` (CSS-grid 2 колонки) | левая ~320px, правая — flex |
| `.file-list-card` | `FileTree.vue` | заголовок, search, body |
| `.file-cat-header` + `.file-row` | `FileTreeRow.vue` через `<template v-for>` | `+` рядом с категорией → quickCreate |
| `.editor-card` | `ConfigEditor.vue` | toolbar + редактор |
| `.editor-toolbar` | `EditorToolbar.vue` | breadcrumb + 4 кнопки |
| `.code-wrap` (textarea + line numbers) | `ConfigEditor.vue` через **Monaco** (см. §6) | в репе уже есть `boot/monaco.ts`, переиспользуем |
| `.modal-bd` (Upload, Create, Delete, Log) | отдельный компонент на каждую модалку | используем Quasar `<q-dialog>`, не свой div-overlay |
| `.wz-table-card` (history) | `HistoryTable.vue` | Quasar `<q-table>` с custom slots для бейджа статуса и иконки 👁 |
| Toast (`toast('success', ...)`) | `Notify.create({ type: "positive", ... })` | штатный Quasar Notify, как везде в проекте |

**Что НЕ копируем из мокапа дословно:**
- Не делаем свои `.modal-bd` overlay'ы — везде Quasar `<q-dialog>` (консистентность с остальным проектом)
- Не делаем свой `.btn` / `.wz-link-btn` — Quasar `<q-btn flat>` со своими CSS-переменными темы
- Свои табличные стили `.wz-table` заворачиваем в обёртку над `<q-table>` через slots

---

## 6. Редактор кода — Monaco

В проекте уже подключен Monaco через `boot/monaco.ts`. Используем его — не textarea.

- Язык подсветки определяем по `category` + расширению:
  - `rules`, `decoders`, `ossec-snippets`, `shared` → `xml`
  - `active-response` + `.cmd` → `bat`
  - `active-response` + `.ps1` → `powershell`
  - `active-response` + `.py` → `python`
- Тема — **light** (мокап светлый, Wazuh-style). Вариант: использовать `vs` или сделать кастомную с цветами из CSS-переменных мокапа (`--code-tag: #006bb4` и т.д.) — отложим, базовый `vs` ок.
- Сайз — заполняет всю высоту `editor-content`.
- Состояние "modified" — точка `●` рядом с filename в breadcrumb редактора, как в мокапе. Computed от `editorContent !== file.contentSaved`.

---

## 7. Фазирование (mock-first)

Бэкенда ещё нет. Чтобы не блокироваться:

### Phase 1 — UI на mock-данных (1 PR)

- Все компоненты, роуты, sidebar, store
- В `cywm/data/mockFiles.ts` — фикстуры из мокапа (8 файлов с реальным содержимым)
- API-слой — функции возвращают `Promise.resolve(mockData)` с искусственной задержкой 200-500ms
- Все user-flow работают: загрузить, отредактировать, сохранить (в localStorage через `useStorage`), задеплоить (рандом success/fail по таймеру), посмотреть лог
- Modified-флаг, history после deploy, валидация форм — всё уже работает

### Phase 2 — Реальный бэкенд (отдельный PR, после согласования API)

- Заменить `mock*` на настоящие axios-вызовы
- Mock-данные оставить за фиче-флагом `VITE_CYWM_MOCK=1` (для демо без бэка)
- Добавить обработку 4xx/5xx (используем уже настроенный response interceptor из `boot/axios.js`)

### Phase 3 — Доработки (за рамками v0.1)

- Manager status / live logs / settings (из бизнес-ТЗ §5.6, 5.7, 5.10) — отдельные view
- RBAC, уведомления (BQ3, BQ4)

---

## 8. Чек-лист задач (по фазам)

### Phase 1

- [ ] `src/cywm/types/index.ts` — модели данных
- [ ] `src/cywm/data/mockFiles.ts` — 8 файлов из мокапа
- [ ] `src/cywm/data/templates.ts` — шаблоны для "New file"
- [ ] `src/cywm/api/cywm.ts` — функции с моками (через `setTimeout`)
- [ ] `src/stores/cywm.ts` — Pinia store
- [ ] `src/cywm/composables/useFileTree.ts` — группировка
- [ ] `src/cywm/composables/useEditor.ts` — обвязка Monaco + modified
- [ ] `src/cywm/composables/useDeploy.ts` — оркестрация deploy + лог
- [ ] `src/cywm/components/CywmTopbar.vue`
- [ ] `src/cywm/components/FileTree.vue` + `FileTreeRow.vue`
- [ ] `src/cywm/components/ConfigEditor.vue` + `EditorToolbar.vue`
- [ ] `src/cywm/components/DeployLogModal.vue`
- [ ] `src/cywm/components/UploadFileModal.vue`
- [ ] `src/cywm/components/CreateFileModal.vue`
- [ ] `src/cywm/components/DeleteConfirmModal.vue`
- [ ] `src/cywm/components/HistoryTable.vue`
- [ ] `src/cywm/views/CywmFilesView.vue`
- [ ] `src/cywm/views/CywmHistoryView.vue`
- [ ] Роуты в `src/router/routes.js`
- [ ] Пункты в sidebar (раздел "CYWM (NEW)")
- [ ] Перенос CSS-переменных Wazuh-стиля из мокапа в `src/css/cywm.scss` (только переменные + утилитарные классы для wazuh-topbar/breadcrumb), импортнуть в `App.vue` или ограничить scope через `<style scoped>` в view'хах
- [ ] Lint pass (`npm run lint -- --max-warnings=0`)
- [ ] Format pass (`npm run format`)
- [ ] Smoke-test в браузере: пройти по всем флоу из мокапа

### Phase 2 (когда будет API)

- [ ] Заменить моки на реальные вызовы
- [ ] Обработка ошибок (валидация XML — показать конкретное место, как в бизнес-ТЗ §5.3 п.2)
- [ ] Polling deploy status (или WebSocket — уточнить с бэкендом)
- [ ] Live tail логов manager (за рамками v0.1, но API закладываем)

---

## 9. Открытые вопросы (фронт → бэк)

| # | Вопрос | Куда влияет |
|---|---|---|
| FQ1 | Deploy — синхронный (отвечает по факту) или асинхронный (возвращает `deployId`, статус опрашиваем)? | UX deploy-кнопки: спиннер vs прогресс-бар |
| FQ2 | Если асинхронный — polling или WebSocket для статуса/лога? | Реализация `useDeploy` |
| FQ3 | Validation XML делается на бэке или предполагается клиентская? Если на бэке — какой формат ошибки (line/column/message)? | Подсветка ошибки в Monaco |
| FQ4 | Soft-delete (30 дней восстановления, бизнес-ТЗ §5.1) — есть ли UI восстановления в v0.1 или только хранение? | Корзина / "Restore" — пока **не делаем**, но уточнить |
| FQ5 | История версий файла (бизнес-ТЗ §5.8) — отдельный API `/cywm/files/:id/versions/` или часть deploy-history? | Отдельная вкладка/модалка во v1.x — не в v0.1 |
| FQ6 | Шаблоны `<WAZUH_SERVER_IP>` (бизнес-ТЗ §5.5) — подстановка на бэке (server-side templating)? Где хранятся значения? | UI настроек переменных — за рамками v0.1, но проверить что бэк не ждёт от фронта |
| FQ7 | Какие именно категории/папки приходят с бэка? Захардкоженный enum (`rules`, `decoders`, `ossec-snippets`, `shared`, `active-response`) или динамический список? | Group headers в `FileTree`, форма "New file" |
| FQ8 | Один Wazuh manager на инсталляцию (бизнес-ТЗ §8) — точно ли фронту не нужен селектор сервера? | Если да — закладываем в shape store на будущее, но в UI не показываем |
| FQ9 | Auth — переиспользуем существующий TRMM-токен (Pinia `useAuthStore`) или нужен отдельный лайфцикл, как в Wazuh-axios клиентах? | API-слой |

---

## 10. Что НЕ делаем в v0.1 (двойная фиксация)

Из бизнес-ТЗ §8 + наши решения:

- Manager status, restart-кнопки в UI (action в store закладываем, кнопок нет)
- Live tail логов manager
- Settings подключения к Wazuh (адрес/SSH-ключ)
- История версий файлов (Phase 3)
- RBAC (все авторизованные TRMM-пользователи имеют полный доступ)
- Linux-агенты, мульти-Wazuh, drag-n-drop редактор правил
- Свой механизм отката (через "скопировать из истории" — да, отдельной кнопки revert — нет)
- Локализация (BQ5) — UI на английском, как мокап

---

## 11. Acceptance (фронт)

PR Phase 1 принимается, если:

1. Маршруты `/cywm/files` и `/cywm/history` открываются и не падают
2. В sidebar появилась секция "CYWM" с двумя пунктами; активный — подсвечен
3. На `/cywm/files`: дерево файлов рендерится из `mockFiles.ts`, все 8 категорий/файлов как в мокапе
4. Клик по файлу — содержимое в Monaco, breadcrumb редактора обновлён
5. Изменение содержимого → точка `●` modified рядом с filename
6. `Save` — modified исчезает, в localStorage сохранилось
7. `Save & Deploy` — модалка с прогрессом → success/fail (рандом) → запись в `deployHistory`
8. `+ New file` / `+ Upload file` / `🗑 Delete` модалки открываются и работают (мутируют моки)
9. На `/cywm/history`: таблица из `deployHistory`, бейджи success/failed, иконка 👁 → лог
10. `npm run lint` и `npm run format -- --check` зелёные
11. Никаких новых runtime-ошибок в консоли при обходе обеих страниц

---

## 12. Связанные документы

- `docs/CYWM-Business-SPEC-Final.md` — бизнес-ТЗ (источник требований)
- `docs/cywm-trmm-wazuh-style.html` — UI-мокап (источник дизайна)
- `docs/policies-backend-spec.md`, `docs/resources-backend-spec.md` — для понимания паттернов бэка в этом проекте

---

**Конец документа.** Готов начинать с Phase 1 — первый шаг: `types/`, `mockFiles.ts`, скелет роутов и view'хов.
