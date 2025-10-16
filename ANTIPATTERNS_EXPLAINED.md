# Объяснение антипаттернов в текущем коде

## Введение

Этот документ объясняет, какие именно антипаттерны присутствуют в текущей реализации `TaskListComponent` и почему они являются проблемой.

---

## 🚨 Антипаттерн #1: Boolean Injection Tokens

### Проблема
```typescript
export const IS_B2B = new InjectionToken<boolean>('IS_B2B');
export const IS_B2C = new InjectionToken<boolean>('IS_B2C');

private isB2B = inject(IS_B2B, { optional: true }) ?? false;
private isB2C = inject(IS_B2C, { optional: true }) ?? false;
```

### Почему это плохо?
1. **Несогласованное состояние**: Оба токена могут быть `true` одновременно
2. **Отсутствие type-safety**: Boolean не несет информации о поведении
3. **Невозможность расширения**: Как добавить третий тип клиента?
4. **Нет автокомплита**: IDE не подскажет доступные типы клиентов

### Как должно быть?
```typescript
// Discriminated union
type ClientType = 'B2B' | 'B2C' | 'Enterprise';

// Type-safe token
export const CLIENT_TYPE = new InjectionToken<ClientType>('Client Type');

// Или лучше - токен с конфигурацией
export const CLIENT_CONFIG = new InjectionToken<ClientConfig>('Client Config');
```

---

## 🚨 Антипаттерн #2: Множественные условные проверки

### Проблема
```typescript
getTaskTitle(task: Task) {
  const baseTitle = getTaskTitleByExpired(task);
  
  if (this.isB2B) {
    const priority = this.getTaskPriority(task);
    const sla = this.calculateSLA(task);
    return `[${priority}] ${baseTitle} (SLA: ${sla}h)`;
  } else if (this.isB2C) {
    return `⭐ ${baseTitle}`;
  }
  
  return baseTitle;
}

formatTaskDate(timestamp: number): string {
  if (this.isB2B) {
    return date.toLocaleString(/* ... */);
  } else if (this.isB2C) {
    return date.toLocaleDateString('ru-RU');
  }
  return date.toString();
}
```

### Почему это плохо?
1. **Нарушение Open/Closed Principle**: Каждое добавление типа = изменение всех методов
2. **Cyclomatic Complexity**: Сложность растет экспоненциально
3. **Дублирование логики**: `if (this.isB2B)` повторяется везде
4. **Сложность тестирования**: Нужно тестировать все комбинации
5. **Невозможность композиции**: Что если нужен B2B + Premium?

### Метрика
В текущем коде: **6 методов × 2 условия = 12 веток**
После добавления Enterprise: **6 методов × 3 условия = 18 веток**

### Как должно быть?
```typescript
// Паттерн Strategy
getTaskTitle(task: Task) {
  return this.strategy.formatTitle(task); // Одна строка!
}
```

---

## 🚨 Антипаттерн #3: Компонент знает о бизнес-логике

### Проблема
```typescript
getTaskPriority(task: Task): string {
  if (this.isB2B) {
    const hoursLeft = (task.expired - Date.now()) / (1000 * 60 * 60);
    if (task.type === TaskType.BUG && hoursLeft < 4) return 'CRITICAL';
    if (task.type === TaskType.BUG) return 'HIGH';
    if (task.type === TaskType.FEATURE) return 'MEDIUM';
    return 'LOW';
  }
  return 'NORMAL';
}

calculateSLA(task: Task): number {
  if (this.isB2B) {
    if (task.type === TaskType.BUG) return 4;
    if (task.type === TaskType.FEATURE) return 48;
    return 72;
  } else if (this.isB2C) {
    return 168;
  }
  return 0;
}
```

### Почему это плохо?
1. **Нарушение Single Responsibility**: Компонент отвечает за отображение И бизнес-логику
2. **Невозможность переиспользования**: Логика привязана к компоненту
3. **Сложность тестирования**: Нужно монтировать компонент для теста логики
4. **Нарушение Separation of Concerns**: Смешаны разные слои приложения

### Как должно быть?
```typescript
// Вся бизнес-логика в сервисе/стратегии
@Injectable()
class B2BTaskStrategy {
  calculatePriority(task: Task): Priority {
    // Логика здесь
  }
}

// Компонент только отображает
class TaskListComponent {
  priority = this.strategy.calculatePriority(this.task);
}
```

---

## 🚨 Антипаттерн #4: Отсутствие типизации возвращаемых значений

### Проблема
```typescript
getTaskPriority(task: Task): string {
  // ...
  return 'CRITICAL'; // или 'HIGH', 'MEDIUM', 'LOW', 'NORMAL'
}
```

### Почему это плохо?
1. **Нет автокомплита**: IDE не подскажет допустимые значения
2. **Опечатки**: `'CRITCAL'` скомпилируется
3. **Нет проверки exhaustiveness**: Забыли обработать случай
4. **Невозможно рефакторить**: Переименование = поиск по строкам

### Как должно быть?
```typescript
// Сначала определяем типы
type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';

// Или enum
enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
}

// Метод возвращает типизированное значение
getTaskPriority(task: Task): Priority {
  return Priority.CRITICAL; // ✅ Type-safe
}
```

---

## 🚨 Антипаттерн #5: Смешивание уровней абстракции

### Проблема
```typescript
getTaskColor(task: Task): 'primary' | 'accent' | 'warn' {
  if (this.isB2B) {
    const priority = this.getTaskPriority(task); // бизнес-логика
    if (priority === 'CRITICAL' || priority === 'HIGH') return 'warn'; // UI логика
    if (priority === 'MEDIUM') return 'accent';
    return 'primary';
  } else if (this.isB2C) {
    if (task.type === TaskType.BUG) return 'warn';
    return 'primary';
  }
  // Еще дублирование дефолтной логики
  if (task.type === TaskType.BUG) return 'warn';
  if (task.type === TaskType.FEATURE) return 'primary';
  if (task.type === TaskType.TECH_DOLG) return 'accent';
  return 'primary';
}
```

### Почему это плохо?
1. **Смешаны 3 уровня**: бизнес-логика (priority) → mapping (priority→color) → UI (color)
2. **Дублирование**: Дефолтная логика повторяется
3. **Магические строки**: Что означает `'warn'`?
4. **Связанность**: Изменение приоритетов → изменение цветов

### Как должно быть?
```typescript
// Уровень 1: Бизнес-логика
class TaskService {
  getPriority(task: Task): Priority { /* ... */ }
}

// Уровень 2: Маппинг
class PriorityColorMapper {
  private colorMap: Record<Priority, ThemeColor> = {
    [Priority.CRITICAL]: 'warn',
    [Priority.HIGH]: 'warn',
    [Priority.MEDIUM]: 'accent',
    [Priority.LOW]: 'primary',
  };
  
  toColor(priority: Priority): ThemeColor {
    return this.colorMap[priority];
  }
}

// Уровень 3: Компонент (UI)
class TaskListComponent {
  getColor(task: Task) {
    const priority = this.taskService.getPriority(task);
    return this.colorMapper.toColor(priority);
  }
}
```

---

## 🚨 Антипаттерн #6: Скрытые зависимости

### Проблема
```typescript
onDeleteTask(taskId: number) {
  if (this.isB2B) {
    const task = this.dataEntitieService.getTaskById(taskId);
    if (task && this.getTaskPriority(task) === 'CRITICAL') {
      console.warn('B2B: Нельзя удалять критические задачи');
      return;
    }
  }
  this.dataEntitieService.deleteTask(taskId);
}
```

### Почему это плохо?
1. **Неявная зависимость**: Метод зависит от `isB2B`, но это неочевидно
2. **Side effect**: `console.warn` - побочный эффект
3. **Разная сигнатура поведения**: Иногда удаляет, иногда нет
4. **Отсутствие feedback**: Пользователь не узнает почему не удалилось

### Как должно быть?
```typescript
// Явная валидация
interface DeletionValidator {
  canDelete(task: Task): ValidationResult;
}

class ValidationResult {
  constructor(
    public readonly isValid: boolean,
    public readonly message?: string
  ) {}
}

// В компоненте
onDeleteTask(taskId: number) {
  const task = this.dataService.getTaskById(taskId);
  if (!task) return;
  
  const validation = this.validator.canDelete(task);
  if (!validation.isValid) {
    this.snackBar.open(validation.message!, 'OK');
    return;
  }
  
  this.dataService.deleteTask(taskId);
}
```

---

## 📊 Метрики текущего кода

### Cyclomatic Complexity
- `getTaskTitle`: **3** (2 if/else + 1 base)
- `getTaskPriority`: **5** 
- `calculateSLA`: **4**
- `formatTaskDate`: **3**
- `shouldShowDescription`: **3**
- `getTaskColor`: **9** 🔴
- `onDeleteTask`: **4**

**Общая сложность: 31** 🔴 (критический уровень)

### Строки кода
- До рефакторинга: **~180 строк**
- После рефакторинга (Strategy): **~50 строк** ✅
- Экономия: **72%**

### Тестовые случаи
- До: **31 тестовый случай** для полного покрытия
- После: **~10 тестов** для компонента + тесты для стратегий
- Уменьшение: **68%**

---

## 🎯 Цели рефакторинга

### Что должно получиться?

1. **Zero условных операторов** в компоненте
2. **Type-safety на 100%**: без `any`, `unknown` без guards
3. **Легкое добавление нового типа**: 
   - До: изменить 6+ методов в компоненте
   - После: добавить один класс стратегии
4. **Composability**: возможность комбинировать стратегии
5. **Testability**: компонент и логика тестируются отдельно

---

## 💡 Паттерны для решения

| Паттерн | Решает | Сложность | TypeScript Features |
|---------|--------|-----------|---------------------|
| **Strategy** | Множественные условия | ⭐⭐ | Generics, Interface |
| **Abstract Factory** | Создание связанных объектов | ⭐⭐⭐ | Conditional Types |
| **Builder** | Композиция конфигурации | ⭐⭐⭐ | Template Literals, Phantom Types |
| **Plugin** | Расширяемость | ⭐⭐⭐⭐ | Multi-providers, Type Guards |

---

## 🔍 Как оценивать решение?

### Красные флаги (решение плохое)
- ❌ Просто переместил if/else в сервис
- ❌ Использует `any` или `as any`
- ❌ Компонент все еще знает о B2B/B2C
- ❌ Не использует дженерики
- ❌ Добавление нового типа требует изменения существующего кода

### Зеленые флаги (решение хорошее)
- ✅ Компонент работает с абстракциями
- ✅ Использует advanced TypeScript (conditionals, mapped types, etc)
- ✅ Применяет SOLID принципы
- ✅ Новый тип = новый класс, без изменения старого кода
- ✅ Полная type-safety с type inference

### Золотые флаги (решение отличное)
- 🏆 Использует композицию паттернов
- 🏆 Phantom types для compile-time проверок
- 🏆 Можно комбинировать стратегии (B2B + Premium)
- 🏆 Runtime валидация с выводом типов (zod/io-ts)
- 🏆 Документация и примеры использования

