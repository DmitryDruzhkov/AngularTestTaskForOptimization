# Вопросы для собеседования по проекту

## 📋 Junior Level

### Angular Basics

1. **Что такое standalone компоненты в Angular?**
   - Ожидаемый ответ: Компоненты, которые не требуют NgModule, могут напрямую импортировать зависимости

2. **Как работает двусторонняя привязка данных [(ngModel)]?**
   - Ожидаемый ответ: Комбинация property binding и event binding

3. **Что делает директива *ngFor?**
   - Ожидаемый ответ: Отображает список элементов, создавая DOM для каждого элемента массива

4. **Зачем нужен RouterModule в Angular?**
   - Ожидаемый ответ: Для навигации между компонентами/страницами приложения

5. **Что такое dependency injection?**
   - Ожидаемый ответ: Паттерн проектирования для внедрения зависимостей в компоненты/сервисы

### Код проекта

6. **Какие компоненты есть в этом приложении?**
   - Ожидаемый ответ: TaskListComponent, TaskSearchComponent, NewTaskComponent, TaskDetailComponent

7. **Где хранятся данные задач в приложении?**
   - Ожидаемый ответ: В DataEntitieService используя signals

8. **Какие типы задач поддерживает приложение?**
   - Ожидаемый ответ: Bug, Feature, Tech Dolg (из enum TaskType)

9. **Как создать новую задачу в приложении?**
   - Ожидаемый ответ: Перейти на /new, заполнить форму, нажать кнопку "Создать"

10. **Что такое FormControl в Angular?**
    - Ожидаемый ответ: Класс для отслеживания значения и состояния валидности одного поля формы

---

## 📈 Middle Level

### Angular Architecture

11. **Объясните разницу между Reactive Forms и Template-driven Forms**
    - Ожидаемый ответ: Reactive - программный подход с FormControl/FormGroup, Template-driven - декларативный с ngModel

12. **Что такое signals в Angular и чем они отличаются от BehaviorSubject?**
    - Ожидаемый ответ: Signals - новая система реактивности, более простой API, автоматический cleanup, лучшая интеграция с change detection

13. **Как работает lazy loading в Angular?**
    - Ожидаемый ответ: loadComponent/loadChildren загружают модули/компоненты только при необходимости

14. **Объясните inject() vs constructor injection**
    - Ожидаемый ответ: inject() - функциональный подход, удобнее для composable functions, доступен только в injection context

15. **Что такое change detection в Angular?**
    - Ожидаемый ответ: Механизм обнаружения и обновления изменений в DOM при изменении состояния

### Проблемы в коде

16. **Найдите проблему производительности в TaskListComponent**
    - Ожидаемый ответ: Использование effect для трансформации данных вместо computed, отсутствие OnPush

17. **Почему в TaskSearchComponent может быть memory leak?**
    - Ожидаемый ответ: valueChanges.subscribe() без unsubscribe/takeUntilDestroyed

18. **Какие проблемы вы видите в использовании *ngFor в шаблонах?**
    - Ожидаемый ответ: Отсутствие trackBy function - приводит к пересозданию всех DOM элементов

19. **Что не так с поиском в TaskSearchComponent?**
    - Ожидаемый ответ: Нет debounce - поиск выполняется на каждое нажатие клавиши

20. **Какие проблемы с валидацией форм в NewTaskComponent?**
    - Ожидаемый ответ: Нет валидации полей, можно создать пустую задачу

### RxJS

21. **Зачем нужен оператор takeUntilDestroyed()?**
    - Ожидаемый ответ: Автоматическая отписка от Observable при уничтожении компонента

22. **Что делает оператор debounceTime()?**
    - Ожидаемый ответ: Задерживает эмиссию значений на указанное время после последнего события

23. **Как превратить Observable в Signal?**
    - Ожидаемый ответ: Использовать функцию toSignal()

### Оптимизация

24. **Как оптимизировать рендеринг больших списков?**
    - Ожидаемый ответ: Virtual scrolling, pagination, OnPush, trackBy

25. **Что такое OnPush change detection strategy?**
    - Ожидаемый ответ: Проверка изменений только при изменении @Input или events, улучшает производительность

---

## 🚀 Senior Level

### Архитектура и Best Practices

26. **Критикуйте текущую архитектуру state management в приложении**
    - Ожидаемый ответ: 
      - Провайдер DataEntitieService в NewTaskComponent создает отдельный инстанс
      - Нет централизованного управления ID
      - Отсутствие immutability
      - Нет разделения на презентационные и контейнерные компоненты

27. **Как бы вы реорганизовали структуру проекта для масштабируемости?**
    - Ожидаемый ответ:
      - Feature modules/folders
      - Shared/core разделение
      - Smart/Dumb components
      - Facade сервисы
      - State management library (NgRx/NGXS)

28. **Объясните проблему с использованием effect() в TaskListComponent**
    - Ожидаемый ответ:
      - Effect не предназначен для трансформации данных
      - Должен использоваться computed()
      - Effect для side effects (localStorage, logging, API calls)
      - Текущая реализация может вызвать лишние пересчеты

29. **Как правильно организовать генерацию ID для задач?**
    - Ожидаемый ответ:
      - UUID библиотека
      - Backend генерация
      - Централизованный ID generator в сервисе
      - Computed ID на основе timestamp + random

30. **Предложите улучшенную архитектуру для поиска**
    - Ожидаемый ответ:
      - Debounce + distinctUntilChanged
      - Индексация для быстрого поиска
      - Full-text search library (Lunr.js, Fuse.js)
      - Использование computed для реактивности
      - Кэширование результатов

### Performance Deep Dive

31. **Объясните цикл change detection в Angular**
    - Ожидаемый ответ:
      - Zone.js перехватывает async операции
      - Запускает change detection от корня
      - OnPush оптимизирует проверки
      - Signals позволяют избежать Zone.js (zoneless)

32. **Как измерить и профилировать производительность Angular приложения?**
    - Ожидаемый ответ:
      - Chrome DevTools Performance tab
      - Angular DevTools profiler
      - Web Vitals metrics
      - Custom performance marks
      - Bundle analyzer

33. **Что такое ExpressionChangedAfterItHasBeenCheckedError и как его избежать?**
    - Ожидаемый ответ:
      - Изменение состояния во время change detection
      - Использовать OnPush
      - setTimeout/Promise для async обновлений
      - Правильная структура компонентов

34. **Объясните проблему вызова методов в шаблонах (getTaskTitle)**
    - Ожидаемый ответ:
      - Метод вызывается на каждом цикле change detection
      - Может быть 100+ вызовов в секунду
      - Использовать pure pipes или computed values
      - Pre-compute в component

35. **Как оптимизировать bundle size в Angular 20?**
    - Ожидаемый ответ:
      - Lazy loading routes
      - Standalone components для tree-shaking
      - Defer loading (@defer)
      - Dynamic imports
      - Remove unused dependencies

### Advanced Patterns

36. **Когда использовать Signals vs Observables?**
    - Ожидаемый ответ:
      - Signals: синхронное состояние, простые трансформации
      - Observables: async операции, сложные потоки данных, RxJS операторы
      - Можно комбинировать через toSignal/toObservable

37. **Объясните концепцию Zoneless Angular**
    - Ожидаемый ответ:
      - Отказ от Zone.js
      - Использование signals для реактивности
      - Явное управление change detection
      - Лучшая производительность

38. **Как реализовать undo/redo functionality для задач?**
    - Ожидаемый ответ:
      - Command pattern
      - State history stack
      - Immutable state updates
      - NgRx/NGXS для истории действий

39. **Предложите стратегию тестирования для этого приложения**
    - Ожидаемый ответ:
      - Unit tests для сервисов и pipes
      - Component tests с TestBed
      - Integration tests для flows
      - E2E с Playwright/Cypress
      - Snapshot testing

40. **Как бы вы добавили offline support?**
    - Ожидаемый ответ:
      - Service Workers
      - IndexedDB для локального хранения
      - Sync API для отложенных операций
      - Optimistic UI updates
      - Conflict resolution strategy

### Real-world Scenarios

41. **Приложение тормозит при 1000+ задачах. Ваши действия?**
    - Ожидаемый ответ:
      - Virtual scrolling (CDK)
      - Pagination/infinite scroll
      - OnPush + trackBy
      - Web Workers для фильтрации
      - Lazy render strategies

42. **Нужно добавить real-time updates через WebSocket. Как интегрируете?**
    - Ожидаемый ответ:
      - WebSocket service
      - Конвертация в Observable/Signal
      - Обработка reconnect
      - Optimistic updates
      - Conflict resolution

43. **Как обеспечить type safety между frontend и backend?**
    - Ожидаемый ответ:
      - Shared TypeScript types
      - OpenAPI/Swagger codegen
      - tRPC
      - GraphQL с typed queries
      - Zod для runtime validation

44. **Нужна feature flag система. Как реализуете?**
    - Ожидаемый ответ:
      - Feature toggle service
      - Environment-based config
      - A/B testing integration
      - Lazy load features
      - Guards для роутов

45. **Как масштабировать приложение до микрофронтендов?**
    - Ожидаемый ответ:
      - Module Federation
      - Web Components
      - Mono-repo структура (Nx)
      - Shared library
      - Independent deployments

---

## 🎯 Практические задания

### Junior

**Задание 1:** Добавьте валидацию в форму создания задачи
- Title - обязательное, минимум 3 символа
- Description - обязательное, минимум 10 символов

**Задание 2:** Добавьте кнопку "Очистить" в форму поиска

### Middle

**Задание 3:** Добавьте trackBy функцию во все *ngFor
**Задание 4:** Реализуйте debounce для поиска (300ms)
**Задание 5:** Исправьте memory leak в TaskSearchComponent

### Senior

**Задание 6:** Рефакторинг TaskListComponent - использовать computed вместо effect
**Задание 7:** Внедрить OnPush во все компоненты
**Задание 8:** Создать централизованный ID generator service
**Задание 9:** Добавить error boundary и обработку ошибок
**Задание 10:** Реализовать virtual scrolling для списка задач

---

## 📊 Критерии оценки

### Junior (Проходной балл: 7/10 вопросов)
- Понимание базовых концепций Angular
- Знание синтаксиса и директив
- Умение читать код
- Выполнение простых задач

### Middle (Проходной балл: 15/25 вопросов + 2/5 заданий)
- Понимание архитектуры Angular
- Знание паттернов и best practices
- Умение находить проблемы
- Навыки оптимизации

### Senior (Проходной балл: 30/45 вопросов + 3/5 заданий)
- Глубокое понимание внутреннего устройства
- Архитектурное мышление
- Умение принимать решения с учетом trade-offs
- Опыт масштабирования приложений
- Лидерские качества в обсуждении

---

## 💡 Дополнительные темы для обсуждения

1. **Миграция с Angular 16 на 20** - какие изменения, какие challenges
2. **Zoneless Angular** - преимущества и когда использовать
3. **Signals API** - будущее Angular реактивности
4. **Standalone components** - migration strategy
5. **Performance budget** - как определить и контролировать
6. **Accessibility** - как улучшить доступность приложения
7. **Internationalization** - стратегия для multi-language
8. **Security** - XSS, CSRF protection в Angular
9. **CI/CD** - pipeline для Angular приложения
10. **Monitoring** - error tracking, analytics в production

---

## 🔍 Подсказки для интервьюера

### Красные флаги 🚩
- Не знает что такое change detection
- Не понимает разницу между Reactive и Template forms
- Не слышал про trackBy
- Не может объяснить свои решения
- Не видит проблем в текущем коде

### Зеленые флаги ✅
- Задает уточняющие вопросы
- Обсуждает trade-offs решений
- Предлагает несколько вариантов
- Думает о масштабируемости
- Заботится о производительности
- Упоминает тестирование

---

**Время на интервью:**
- Junior: 30-45 минут
- Middle: 45-60 минут
- Senior: 60-90 минут

