# Примеры возможных решений (для проверяющего)

> ⚠️ **Важно**: Это файл для проверяющего, не показывать кандидату!

## Вариант 1: Strategy Pattern с Generic Interface

### Шаг 1: Определяем типы

```typescript
// client-config.types.ts
export type ClientType = 'B2B' | 'B2C' | 'Enterprise';

export interface BaseClientConfig {
  readonly type: ClientType;
  readonly displayName: string;
}

export interface B2BConfig extends BaseClientConfig {
  readonly type: 'B2B';
  readonly showPriority: true;
  readonly showSLA: true;
  readonly strictValidation: true;
}

export interface B2CConfig extends BaseClientConfig {
  readonly type: 'B2C';
  readonly showPriority: false;
  readonly simplifiedView: true;
}

// Discriminated Union
export type ClientConfig = B2BConfig | B2CConfig;

// Mapped type для извлечения конфига по типу
export type ConfigForClient<T extends ClientType> = 
  T extends 'B2B' ? B2BConfig :
  T extends 'B2C' ? B2CConfig :
  never;
```

### Шаг 2: Generic Strategy Interface

```typescript
// task-display.strategy.ts
import { Task } from './data.service';
import { ClientConfig } from './client-config.types';

export interface TaskDisplayStrategy<TConfig extends ClientConfig = ClientConfig> {
  readonly config: TConfig;
  
  formatTitle(task: Task): string;
  formatDate(timestamp: number): string;
  calculatePriority(task: Task): string;
  calculateSLA(task: Task): number;
  shouldShowDescription(task: Task): boolean;
  getTaskColor(task: Task): 'primary' | 'accent' | 'warn';
  canDelete(task: Task): boolean;
}
```

### Шаг 3: Конкретные стратегии

```typescript
// b2b-task.strategy.ts
import { Injectable } from '@angular/core';
import { Task } from './data.service';
import { B2BConfig } from './client-config.types';
import { TaskDisplayStrategy } from './task-display.strategy';
import { TaskType } from './constants';

@Injectable()
export class B2BTaskStrategy implements TaskDisplayStrategy<B2BConfig> {
  readonly config: B2BConfig = {
    type: 'B2B',
    displayName: 'Business Client',
    showPriority: true,
    showSLA: true,
    strictValidation: true,
  };

  formatTitle(task: Task): string {
    const priority = this.calculatePriority(task);
    const sla = this.calculateSLA(task);
    return `[${priority}] ${task.title} (SLA: ${sla}h)`;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }

  calculatePriority(task: Task): string {
    const hoursLeft = (task.expired - Date.now()) / (1000 * 60 * 60);
    if (task.type === TaskType.BUG && hoursLeft < 4) return 'CRITICAL';
    if (task.type === TaskType.BUG) return 'HIGH';
    if (task.type === TaskType.FEATURE) return 'MEDIUM';
    return 'LOW';
  }

  calculateSLA(task: Task): number {
    if (task.type === TaskType.BUG) return 4;
    if (task.type === TaskType.FEATURE) return 48;
    return 72;
  }

  shouldShowDescription(task: Task): boolean {
    return true;
  }

  getTaskColor(task: Task): 'primary' | 'accent' | 'warn' {
    const priority = this.calculatePriority(task);
    if (priority === 'CRITICAL' || priority === 'HIGH') return 'warn';
    if (priority === 'MEDIUM') return 'accent';
    return 'primary';
  }

  canDelete(task: Task): boolean {
    return this.calculatePriority(task) !== 'CRITICAL';
  }
}

// b2c-task.strategy.ts
@Injectable()
export class B2CTaskStrategy implements TaskDisplayStrategy<B2CConfig> {
  readonly config: B2CConfig = {
    type: 'B2C',
    displayName: 'Consumer Client',
    showPriority: false,
    simplifiedView: true,
  };

  formatTitle(task: Task): string {
    return `⭐ ${task.title}`;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('ru-RU');
  }

  calculatePriority(task: Task): string {
    return 'NORMAL';
  }

  calculateSLA(task: Task): number {
    return 168; // неделя
  }

  shouldShowDescription(task: Task): boolean {
    return task.description.length < 50;
  }

  getTaskColor(task: Task): 'primary' | 'accent' | 'warn' {
    return task.type === TaskType.BUG ? 'warn' : 'primary';
  }

  canDelete(task: Task): boolean {
    return true;
  }
}
```

### Шаг 4: Type-safe токен

```typescript
// tokens.ts
import { InjectionToken } from '@angular/core';
import { TaskDisplayStrategy } from './task-display.strategy';

export const TASK_DISPLAY_STRATEGY = new InjectionToken<TaskDisplayStrategy>(
  'Task Display Strategy'
);
```

### Шаг 5: Рефакторинг компонента

```typescript
// task-list.component.ts
@Component({
  selector: 'app-task-list',
  standalone: true,
  // ... imports
})
export class TaskListComponent {
  private dataEntitieService = inject(DataEntitieService);
  private router = inject(Router);
  private strategy = inject(TASK_DISPLAY_STRATEGY); // Чисто! Без if/else

  tasks = signal<Task[]>([]);

  constructor() {
    effect(() => {
      const allTasks = this.dataEntitieService.tasks();
      this.tasks.set(
        allTasks.map((task) => ({
          ...task,
          color: this.strategy.getTaskColor(task),
        }))
      );
    });
  }

  getTaskTitle(task: Task) {
    return this.strategy.formatTitle(task); // Делегируем стратегии!
  }

  onDeleteTask(taskId: number) {
    const task = this.dataEntitieService.getTaskById(taskId);
    if (task && !this.strategy.canDelete(task)) {
      console.warn('Нельзя удалить эту задачу');
      return;
    }
    this.dataEntitieService.deleteTask(taskId);
  }

  // ... остальные методы используют strategy
}
```

### Шаг 6: Провайдеры

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { TASK_DISPLAY_STRATEGY } from './tokens';
import { B2BTaskStrategy } from './b2b-task.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    // Легко переключаемся между стратегиями!
    { provide: TASK_DISPLAY_STRATEGY, useClass: B2BTaskStrategy },
    // или
    // { provide: TASK_DISPLAY_STRATEGY, useClass: B2CTaskStrategy },
  ],
};
```

---

## Вариант 2: Abstract Factory с Conditional Types

### Шаг 1: Factory Interface

```typescript
// task-view-factory.interface.ts
export interface TaskViewConfig<T extends ClientType> {
  formatTitle(task: Task): string;
  formatDate(timestamp: number): string;
  priority: T extends 'B2B' ? PriorityConfig : undefined;
  sla: T extends 'B2B' ? SLAConfig : undefined;
}

export interface TaskViewFactory<TClient extends ClientType> {
  createConfig(): TaskViewConfig<TClient>;
}
```

### Шаг 2: Conditional Types для type-safety

```typescript
// type-utils.ts
type HasPriority<T extends ClientType> = T extends 'B2B' ? true : false;

type ViewConfigFields<T extends ClientType> = {
  title: string;
  date: string;
} & (T extends 'B2B' ? {
  priority: string;
  sla: number;
} : {});

// Type guard
function isB2BConfig<T extends ClientType>(
  type: T
): type is T & 'B2B' {
  return type === 'B2B';
}
```

---

## Вариант 3: Composition API с Builder Pattern

### Шаг 1: Fluent Builder

```typescript
// task-view.builder.ts
export class TaskViewBuilder<
  TClient extends ClientType = never,
  TFeatures extends string = never
> {
  private config: Partial<TaskViewConfig> = {};

  forClient<T extends ClientType>(
    client: T
  ): TaskViewBuilder<T, TFeatures> {
    return this as any;
  }

  withPriority<T extends TClient>(): 
    T extends 'B2B' 
      ? TaskViewBuilder<T, TFeatures | 'priority'>
      : never {
    // Compile-time проверка: priority только для B2B!
    return this as any;
  }

  withSimplifiedView<T extends TClient>():
    T extends 'B2C'
      ? TaskViewBuilder<T, TFeatures | 'simplified'>
      : never {
    return this as any;
  }

  build(): TaskViewConfig<TClient, TFeatures> {
    return this.config as any;
  }
}

// Использование
const b2bView = new TaskViewBuilder()
  .forClient('B2B')
  .withPriority() // ✅ OK
  .withSimplifiedView() // ❌ Compile error! Нельзя для B2B
  .build();
```

---

## Вариант 4: Plugin Architecture

### Шаг 1: Plugin Interface

```typescript
// task-plugin.interface.ts
export interface TaskPlugin<TContext = any> {
  readonly name: string;
  readonly priority: number;
  
  canHandle(context: TContext): boolean;
  transform(task: Task, context: TContext): Task;
}

export const TASK_PLUGINS = new InjectionToken<TaskPlugin[]>(
  'Task Plugins',
  { factory: () => [] }
);
```

### Шаг 2: Конкретные плагины

```typescript
// b2b-priority.plugin.ts
@Injectable()
export class B2BPriorityPlugin implements TaskPlugin<B2BConfig> {
  name = 'b2b-priority';
  priority = 10;

  canHandle(context: any): context is B2BConfig {
    return context.type === 'B2B';
  }

  transform(task: Task, context: B2BConfig): Task {
    // Добавляем priority к task
    return {
      ...task,
      // используем type augmentation
    };
  }
}
```

### Шаг 3: Plugin Manager

```typescript
// plugin.manager.ts
@Injectable()
export class TaskPluginManager<TContext extends ClientConfig> {
  private plugins = inject(TASK_PLUGINS);

  applyPlugins(task: Task, context: TContext): Task {
    return this.plugins
      .filter(plugin => plugin.canHandle(context))
      .sort((a, b) => a.priority - b.priority)
      .reduce((acc, plugin) => plugin.transform(acc, context), task);
  }
}
```

### Шаг 4: Multi-providers

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TASK_PLUGINS, useClass: B2BPriorityPlugin, multi: true },
    { provide: TASK_PLUGINS, useClass: B2BSLAPlugin, multi: true },
    { provide: TASK_PLUGINS, useClass: B2CSimplifiedPlugin, multi: true },
  ],
};
```

---

## Продвинутые TypeScript концепции

### 1. Template Literal Types

```typescript
type ClientEvent<T extends ClientType> = `${T}:task:${string}`;

type B2BEvents = ClientEvent<'B2B'>; 
// 'B2B:task:created' | 'B2B:task:updated' ...
```

### 2. Recursive Conditional Types

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]>
    : T[P];
};

type ReadonlyConfig = DeepReadonly<ClientConfig>;
```

### 3. Mapped Types с Filters

```typescript
type PrimitiveFields<T> = {
  [K in keyof T]: T[K] extends string | number | boolean 
    ? K 
    : never
}[keyof T];

type FilterableTaskFields = PrimitiveFields<Task>;
// 'id' | 'title' | 'description' | 'expired'
```

### 4. Type Guards с Generics

```typescript
function isTaskOfType<T extends TaskType>(
  task: Task,
  type: T
): task is Task & { type: T } {
  return task.type === type;
}

const task: Task = getTask();
if (isTaskOfType(task, TaskType.BUG)) {
  // task.type is TaskType.BUG (narrowed!)
}
```

---

## Критерии оценки решений

### Отлично (90-100 баллов)
- Использование 3+ advanced TypeScript features
- Полная type-safety без `any`/`unknown`
- Применение нескольких паттернов в композиции
- Легкое расширение (новый клиент за 5 минут)
- Нет дублирования кода
- Хорошие комментарии и документация

### Хорошо (70-89 баллов)
- Использование 2 advanced TypeScript features
- Один паттерн хорошо реализован
- Минимум условной логики в компоненте
- Можно добавить новый клиент без изменения существующего кода

### Удовлетворительно (50-69 баллов)
- Базовое использование дженериков
- Логика вынесена из компонента
- Остались некоторые if/else
- Не все type-safe

### Неудовлетворительно (<50 баллов)
- Просто вынес в сервис с if/else
- Нет использования дженериков
- Много `any`
- Нарушение SOLID

