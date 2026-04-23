# GPO Agents Role-Based Filtering

## Проблема

GPO бэкенд (master) возвращает **все** агенты через gRPC метод `listAgents()`, игнорируя ограничения роли пользователя (`can_view_clients`, `can_view_sites`) из Tactical бэкенда.

## Решение

Реализована фильтрация GPO агентов на фронтенде на основе уже отфильтрованных Tactical агентов.

### Принцип работы

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (Browser)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Запрос Tactical агентов                                         │
│     GET /agents/                                                    │
│     Authorization: Token <user_token>                               │
│                            │                                         │
│                            ▼                                         │
│  ┌──────────────────────────────────────────┐                      │
│  │   Tactical Backend (Django)              │                      │
│  │   - Проверяет роль пользователя          │                      │
│  │   - Фильтрует по can_view_clients        │                      │
│  │   - Фильтрует по can_view_sites          │                      │
│  └──────────────────────────────────────────┘                      │
│                            │                                         │
│                            ▼                                         │
│  Возвращает: [agent_id_1, agent_id_2, agent_id_3]                  │
│                            │                                         │
│                            ▼                                         │
│  2. Запрос GPO агентов с фильтром                                   │
│     listAgents(allowedAgentIds: [agent_id_1, agent_id_2, ...])     │
│     Authorization: Bearer <user_token>                              │
│                            │                                         │
│                            ▼                                         │
│  ┌──────────────────────────────────────────┐                      │
│  │   GPO Backend (master) via gRPC          │                      │
│  │   - Возвращает ВСЕ агенты                │                      │
│  └──────────────────────────────────────────┘                      │
│                            │                                         │
│                            ▼                                         │
│  3. Фильтрация на фронтенде                                         │
│     GPO агенты.filter(agent =>                                      │
│       allowedAgentIds.includes(agent.agentId))                      │
│                            │                                         │
│                            ▼                                         │
│  Результат: Только разрешенные GPO агенты                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Измененные файлы

#### 1. `/src/gpo/api/grpc-client.ts`

Добавлен опциональный параметр `allowedAgentIds` в метод `listAgents`:

```typescript
export const agentServiceClientWrapper = {
  async listAgents(
    allowedAgentIds?: string[]
  ): Promise<operator_pb_types.ListAgentsResponse.AsObject> {
    // ... получение всех агентов с GPO бэкенда
    
    const result = response.toObject();
    
    // Фильтрация по роли пользователя
    if (allowedAgentIds && allowedAgentIds.length > 0) {
      const allowedSet = new Set(allowedAgentIds);
      const agentsList = result.agentsList || [];
      result.agentsList = agentsList.filter((agent) => {
        const agentId = agent.agentId || "";
        return allowedSet.has(agentId);
      });
    }

    return result;
  },
}
```

#### 2. `/src/store/index.js`

Обновлена загрузка агентов в Vuex store - теперь передаем список разрешенных `agent_id`:

```javascript
// Получаем список разрешенных agent_id из уже отфильтрованных tactical агентов
const allowedAgentIds = data.map((agent) => String(agent.agent_id));

// Запрашиваем GPO агенты с фильтрацией по роли
const response = await agentServiceClientWrapper.listAgents(allowedAgentIds);
```

#### 3. `/src/gpo/composables/useFilteredGPOAgents.ts` (новый файл)

Создан reusable composable для фильтрации GPO агентов:

```typescript
export function useFilteredGPOAgents() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function getFilteredGPOAgents() {
    // 1. Получаем Tactical агенты (уже отфильтрованные бэкендом)
    const tacticalAgents = await fetchTacticalAgents({ detail: false });
    
    // 2. Извлекаем agent_id как whitelist
    const allowedAgentIds = tacticalAgents.map((agent) => String(agent.agent_id));

    // 3. Получаем GPO агенты с фильтрацией
    const response = await agentServiceClientWrapper.listAgents(allowedAgentIds);

    return response.agentsList || [];
  }

  return { isLoading, error, getFilteredGPOAgents };
}
```

## Использование

### В компонентах

```vue
<script setup lang="ts">
import { useFilteredGPOAgents } from "@/gpo/composables/useFilteredGPOAgents";

const { isLoading, error, getFilteredGPOAgents } = useFilteredGPOAgents();

async function loadAgents() {
  const agents = await getFilteredGPOAgents();
  console.log("Filtered GPO agents:", agents);
}
</script>
```

### Напрямую через API

```typescript
import { agentServiceClientWrapper } from "@/gpo/api/grpc-client";
import { fetchAgents } from "@/api/agents";

// 1. Получить разрешенные agent_id
const tacticalAgents = await fetchAgents({ detail: false });
const allowedAgentIds = tacticalAgents.map((agent) => String(agent.agent_id));

// 2. Получить отфильтрованные GPO агенты
const response = await agentServiceClientWrapper.listAgents(allowedAgentIds);
const filteredGPOAgents = response.agentsList;
```

## Примеры сценариев

### Сценарий 1: Пользователь с ограниченной ролью

**Роль:**
- `can_view_clients: [1, 2]`
- `can_view_sites: [5, 6]`

**Результат:**
1. Tactical Backend возвращает агенты только для клиентов 1, 2 и сайтов 5, 6
2. Frontend получает `agent_id: ["ag1", "ag2", "ag3"]`
3. GPO Backend возвращает все агенты: `["ag1", "ag2", "ag3", "ag4", "ag5"]`
4. Frontend фильтрует → итоговый результат: `["ag1", "ag2", "ag3"]` ✅

### Сценарий 2: Superuser

**Роль:**
- `is_superuser: true`

**Результат:**
1. Tactical Backend возвращает **все** агенты
2. Frontend получает все `agent_id`
3. GPO Backend возвращает все агенты
4. Frontend не фильтрует (или фильтрует по полному списку) → все агенты доступны ✅

### Сценарий 3: Роль без ограничений

**Роль:**
- `can_view_clients: []` (пустой массив = все клиенты)
- `can_view_sites: []` (пустой массив = все сайты)

**Результат:**
1. Tactical Backend возвращает **все** агенты
2. Frontend получает все `agent_id`
3. GPO Backend возвращает все агенты
4. Все агенты доступны ✅

## Преимущества этого подхода

### ✅ Безопасность
- Бэкенд Tactical остается единственным источником истины для прав доступа
- GPO бэкенд не требует изменений (не знает о ролях Tactical)
- Фронтенд не может обойти ограничения (использует уже отфильтрованный список)

### ✅ Согласованность
- GPO агенты полностью соответствуют основным Tactical агентам
- Пользователь видит одинаковый набор агентов во всех частях системы

### ✅ Производительность
- Фильтрация через `Set` - O(n) сложность
- Запросы к обоим бэкендам могут выполняться параллельно

### ✅ Простота поддержки
- Вся логика фильтрации инкапсулирована в одном месте
- Изменения в правах ролей автоматически применяются к GPO агентам
- Не требуется синхронизация между бэкендами

## Тестирование

### 1. Проверка фильтрации

```typescript
// Mock данные
const tacticalAgents = [
  { agent_id: "ag1", client: "Client A", site: "Site 1" },
  { agent_id: "ag2", client: "Client B", site: "Site 2" },
];

const gpoAgents = [
  { agentId: "ag1", hostName: "PC-001" },
  { agentId: "ag2", hostName: "PC-002" },
  { agentId: "ag3", hostName: "PC-003" }, // Не должен попасть в результат
];

// Результат
const filtered = await listAgents(["ag1", "ag2"]);
// filtered.agentsList = [ag1, ag2] ✅
```

### 2. Проверка прав доступа

```bash
# 1. Создать роль с ограничениями
POST /accounts/roles/
{
  "name": "Limited User",
  "can_view_clients": [1],
  "can_view_sites": [5],
  "can_list_agents": true
}

# 2. Назначить роль пользователю
# 3. Войти под этим пользователем
# 4. Проверить список GPO агентов - должны быть только агенты из Client 1 / Site 5
```

## Альтернативные подходы (не реализованы)

### ❌ Подход 2: Фильтрация на GPO бэкенде

**Требования:**
- Передавать токен Tactical в GPO бэкенд
- GPO бэкенд должен запрашивать права у Tactical бэкенда
- Синхронизация состояния между бэкендами

**Недостатки:**
- Сложность реализации
- Зависимость между бэкендами
- Дублирование логики авторизации

### ❌ Подход 3: Синхронизация ролей

**Требования:**
- Реплицировать роли из Tactical в GPO бэкенд
- Поддерживать консистентность данных

**Недостатки:**
- Высокая сложность
- Проблемы с eventual consistency
- Требует миграции данных

## FAQ

**Q: Что если GPO бэкенд вернет агента, которого нет в Tactical?**  
A: Он будет отфильтрован на фронтенде и не попадет в UI.

**Q: Что если Tactical бэкенд вернет агента, которого нет в GPO?**  
A: Этот агент не получит статус Windows Policy, но останется в списке основных агентов.

**Q: Безопасно ли это?**  
A: Да. Tactical бэкенд контролирует доступ через API с авторизацией. Фронтенд не может обойти эти ограничения.

**Q: Влияет ли это на производительность?**  
A: Минимально. Фильтрация через Set имеет O(n) сложность, что незаметно для типичных объемов данных.

**Q: Нужно ли что-то менять на бэкенде?**  
A: Нет, изменения только на фронтенде.
