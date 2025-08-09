# Керівні принципи проєкту Metro UI (v5)

Цей документ призначено для розробників Metro UI. Тут зафіксовано специфічні для цього репозиторію відомості щодо збирання, тестування та стилю коду, перевірені на практиці в поточній кодовій базі.

За основу взято файл .junie\~guidelines.md і скориговано під реальний процес у цьому репозиторії.

## 1. Збірка та конфігурація

Проєкт збирається за допомогою esbuild (див. build.js). Вихідний код у теці `source`, артефакти збірки — у `lib`.

- Передумови
  - Node.js: рекомендується 18+ (esbuild і сучасні ESM-флоу).
  - ОС: Windows/macOS/Linux. Для Windows використовується PowerShell, шляхи бажано зазначати у форматі з прямими слешами для CLI інструментів (див. примітки для Latte нижче).

- Встановлення залежностей
  - Виконайте: `npm ci`

- Скрипти
  - `npm run dev`
    - Очищає `lib` і запускає esbuild у режимі розробки (watch через esbuild context) для `./source/default.js` і `./source/icons.js`.
    - Вихід: `lib/metro.js` (з sourcemap) і `lib/icons.js`.
    - Перемикач середовища: `MODE=development` (встановлюється через cross-env).
  - `npm run build`
    - Повна продакшн-збірка: `lib/metro.js`, `lib/metro.all.js`, `lib/icons.js` з банером і мініфікацією.
    - Перемикач середовища: `MODE=production`.
  - `npm run clean`
    - Чистить теку `lib`.
  - `npm run check`
    - Перевірка/форматування коду за допомогою Biome (див. розділ «Стиль коду»).

- Нотатки щодо build.js
  - Підтримуються банери з версією з `package.json` і часом збірки.
  - less підтримується через `esbuild-plugin-less`, автопрефікс — через `@olton/esbuild-plugin-autoprefixer`.
  - У dev-режимі ввімкнений watch для `default.js` та `icons.js` (див. контекст у build.js), `index.js` закоментовано для watch, але збирається в production як `metro.all.js`.
  - Якщо компоненти/стилі додано/змінено, перед запуском прикладів/тестів, що читають із `lib`, виконайте `npm run dev` або `npm run build`.

## 2. Структура вихідних кодів (коротко)

- `source/`
  - `components/<name>/` — компонент (JS + LESS + index.js). Для більшості компонентів існують відповідні `.test.js` у цій самій теці.
  - `core/`, `common-{css,js}`, `colors-css`, `datetime`, `dom`, `extensions`, `farbe`, `guardian`, `hooks`, `html`, `i18n`, `icons`, `include`, `model`, `reset`, `router`, `string` — модулі ядра й утиліти.
  - Вхідні точки: `default.js`, `index.js`, `icons.js`, `runtime.js`, `i18n.js`.
- `lib/` — результати збірки (`metro.js`, `metro.all.js`, `icons.js`, CSS та sourcemap-и за потреби).
- `examples/` — HTML-приклади, що можуть використовуватись для E2E-перевірок у тестах Latte.
- `tests/` — інтеграційні/прикладні тести (див. generate-tests.js).

Вихідний код поділяється на модулі, які розташовані в теках в теці `source`:
- `colors-css` — модулі, що реалізують кольори
- `common-css` — модулі, що реалізують загальні стилі
- `common-js` — модулі, що реалізують загальні функції
- `components` — модулі, що реалізують компоненти
- `core` — модулі, що реалізують ядро бібліотеки
- `datetime` — модуль, що реалізує компоненти для роботи з датою та часом
- `dom` — модуль, що реалізує компоненти для роботи з DOM
- `extensions` — модулі, що реалізують розширення стандартних JavaScript об'єктів
- `farbe` — модуль, що реалізує роботу з кольором
- `guardian` — модуль, що реалізує функції валідації даних
- `hooks` — модулі, що реалізують хуки (`useMemo`, `useState`, `useEffect`, тощо)
- `html` — модулі, що реалізують функції для створення HTML елементів на JavaScript
- `i18n` — модулі, що реалізують функції для роботи з локалізацією
- `icons` — модулі, що реалізують функції для роботи з іконками
- `include` — LESS модулі, що реалізують змінні стилів та міксіни
- `model` — модуль, що реалізує функції для роботи з реактивною моделлю даних
- `reset` — модуль, що реалізує скидання стилів
- `router` — модуль, що реалізує функції для роботи з маршрутизацією для SPA
- `string` — модуль, що реалізує функції для роботи з рядками

Окремі файли в теці `source`:
- `index.js` — точка входу для бандлерів, включає в зборку всі компоненти та стилі
- `i18n.js` — точка входу для бандлерів, включає всі локалізації
- `icons.js` — точка входу для бандлерів, включає всі іконки
- `runtime.js` — точка входу для бандлерів, включає в зборку всі функції, які не є компонентами і стилями
- `default.js` — точка входу для бандлерів, включає в зборку `reset`, `common{css,js}`, `i18n`, `runtime`, and all `component`

### 2.1. Core - Ядро бібліотеки
Ядро бібліотеки реалізовано в теці `source/core`. Воно містить основні функції та класи, які використовуються в інших модулях. Основні компоненти ядра:
- `global.js` — глобальні змінні  
- `metro.js` — глобальний об'єкт, який реалізує функції для роботи з компонентами.
- `component.js` — базовий клас для компонентів.
- `props.js` - enum для властивостей компонентів.

### 2.2. Common CSS - Загальні стилі
Загальні стилі розташовані в теці `common-css`. Кожен файл являє собою окремий модуль з класами, які реалізують одну специфічну поведінку.

### 2.3. Common JS - Загальні функції
Загальні функції розташовані в теці `common-js`. Файл містить різноманітні функції, які не є компонентами або стилями, але використовуються в різних компонентах.

### 2.4. Colors CSS - Кольори
Стилі кольору розташовані в теці `colors-css`. Кожен файл являє собою окремий модуль з класами, які реалізують одну специфічну поведінку.

### 2.5. i18n - Локалізація
Локалізація розташована в теці `i18n`. Файл містить локалізовані строки для компонентів.

### 2.6. Components - Компоненти
Кожен компонент має свою теку, в якій розташовані файли `index.js`, `[component-name].less`, `[component-name].js`.
Також, у теці компонента, можуть бути розташовані додаткові включення компонентів, які використовуються поточним компонентом.

#### Складові компонента:
+ `[component-name].less` — файл стилів компонента, який містить стилі компонента та кольорові складові для світлої та темної тем.
+ `[component-name].js` — файл JavaScript, який містить код компонента.
+ `index.js` — файл, який імплементує компонент, щоб його можна було використовувати в інших модулях.

#### Додаткові файли:
+ `[component-name].test.js` — файл з тестами для компонента, який використовує фреймворк Latte.
+ `README.md` — файл з документацією для компонента, який містить приклади використання, параметри, методи API та інші деталі.

#### Javascript шаблон компонента:

```js
((Metro, $) => {
    let MyObjectDefaultConfig = {
        onMyObjectCreate: Metro.noop,
    };

    Metro.myObjectSetup = (options) => {
        MyObjectDefaultConfig = $.extend({}, MyObjectDefaultConfig, options);
    };

    if (typeof window.metroMyObjectSetup !== "undefined") {
        Metro.myObjectSetup(window.metroMyObjectSetup);
    }

    Metro.Component("name", {
        init: function (options, elem) {
            this._super(elem, options, MyObjectDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent("component-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
```

#### Стилі компонента.
Стилі компонента мають бути написані в LESS файлі, який містить стилі для світлої та темної теми за наступним шаблоном:

```less
:root {
    // Світла тема
    --component-color: #191919;
    --component-size: 64px;
}

.dark-side {
    // Темна тема
    --component-color: #ffffff;
    --component-size: 64px;
}

.component-class-name {
    // Додаткові змінні стилів
    // Стилі компонента

    &.component-subclass-name {
        // Додаткові стилі
    }
   
   .child-element {
        // Стилі для дочірніх елементів
    }
}
```

Основний CSS класс компонента має бути названий як і компонент, з використанням kebab-case (наприклад: `action-button`).
Інши класи компонента мають бути названі з використанням kebab-case за методою БЕМ (блок-елемент__модіфікатор).

## 3. Документація

Цей посібник надає інструкції щодо створення документації для компонентів Metro UI.

Документація повинна бути у форматі `Markdown` та розміщена у файлі `README.md` у каталозі кожного компонента.
Якщо файл `README.md` вже існує, його слід видалити і створити новий, відповідно до поточних вимог.

## Документація повинна описати такі аспекти компонента:
1. Назва компонента та його короткий опис
2. Ініціалізація компонента
3. Параметри компонента
    - Тип параметра (тип даних, наприклад: `string`, `number
    - Значення за замовчуванням (якщо є)
    - Опис параметра
      3.1. Типи параметрів:
    - параметри, які починаються з `cls` (CSS класи) - це CSS класи, які додаються до компонента, елемента, або його дочірніх елементів
    - параметри, які починаються з `on` - це атрибути подій, які викликаються при певних діях користувача (наприклад: `onClick`, `onChange`, тощо)
4. API methods (excluding those starting with an underscore)
5. How to style the component using CSS variables and available CSS classes

Якщо є відповідний приклад компонента в теці `examples` (зазвичай це файл з назвою компонента: `component.html`, `component-{...}.html`, `component-....html`), його слід використовувати як приклад використання компонента.

### Компоненти, які реалізують логіку через завантаження даних
Для компонентів, які використовують завантаження даних, слід описати, як це зробити, які параметри використовуються для цього, якій формат має бути в завантажених даних, та як обробляються дані.

## Типи компонентів
1. Компоненти, які створюються за допомогою фабричного метода `Metro.Component()`.
2. Компоненти, які не реалізуються за допомогою фабричного метода `Metro.Component()`, але мають JavaScript файл, якій реалізує компонент.
3. Компоненти які реалізуються лише в стилях (у таких компонентах відсутній файл `[component-name].js`)

## Ініціалізація компонентів
Компоненти, які створюються за допомогою фабричного метода `Metro.Component()`, можуть бути ініціалізовані за допомогою атрибуту `data-role` на HTML елементі,
якій буде використовувати цей компонент, або через фабричний метод `Metro.makePlugin()`.

```html
<div data-role="component-name"></div>
```
або
```javascript
const element = Metro.makePlugin("#element", "component-name");
```
### Додаткові параметри
Додаткові параметри для ініціалізації компонента можна вказати в атрибутах HTML елемента, на якому ініціалізується компонент, за допомогою атрибутів,
які починаються з `data-` і використовують формат `dashed-name` (наприклад: `data-show-marker="true"`).

Для деяких компонентів реалізовані додаткові методи ініціалізації, зазвичай для таких компонентів створюється окремий неймспейс в об'єкті `Metro` (наприклад: `Metro.notify`, `Metro.toast`).

### Використання функції `Metro.makePlugin()`
Функція `Metro.makePlugin()` дозволяє ініціалізувати компонент програмно. Вона є універсальним методом для створення та ініціалізації компонентів Metro UI.

Функція приймає три параметри:

- селектор елемента, на якому потрібно ініціалізувати компонент
- назву компонента
- опціонально, об'єкт з параметрами компонента.

### Стилі компонента

Головний CSS класс компонента автоматично додається до елемента, на якому ініціалізується компонент і його не потрібно вказувати в HTML коді компонента.
Додаткові CSS класи компонента можна вказати в атрибутах HTML елемента, на якому ініціалізується компонент, за допомогою атрибуту `data-cls-*`.

```html

### Component API

Доступ до API компоненту можна отримати за допомогою функції `Metro.getPlugin()`, яка приймає селектор елемента, та назву компонента і повертає об'єкт компонента.

```js
const accordion = Metro.getPlugin("#myAccordion", "accordion");
```

## Структура Readme.md
Документація для кожного компонента повинна мати чітку структуру, яка включає:

### Documentation Structure

#### **Title and Description**
   ```markdown
   # Component Name
   
   Brief description of what the component does and its main features.
   ```

#### **Dependencies**
Залежності, які потрібні для коректної роботи компонента, можна визначити в файлі index.js компонента через додаткові імпорти.
   ```markdown
   ## Dependencies
   
   List any dependencies required for the component to function properly.
   - Dependency 1
   - Dependency 2
   ```

#### **Usage Examples**
   ```markdown
   ## Usage
   
   ### Basic Usage
   
   ```html
   <!-- Example HTML code -->
   <div data-role="component-name"></div>
   ```

### Additional Configurations

   ```html
   <!-- More examples showing different configurations -->
   ```

#### **Plugin Parameters**
   ```markdown
   ## Plugin Parameters
   
   | Parameter | Type | Default | Description |
   | --------- | ---- | ------- | ----------- |
   | `paramName` | type | default | Description of parameter |
   ```

#### Example of Parameter Usage
   ```html
   <div data-role="component-name" data-param-name="value"></div>
   ```

#### **Events**
   ```markdown
   ## Events
   
   | Event | Description |
   | ----- | ----------- |
   | `onEventName` | Description of event |
   ```

#### Example of Event Usage
   ```html
   <div data-role="component-name" data-on-{event-name}="onEvent"></div>

    <script>
         function onEvent(event) {
             // Handle the event
            ...
         }
    </script>
   ```

#### **API Methods**
   ```markdown
   ## API Methods

   + `Method1(arg)` - Description of what the method does.
   + `Method2(arg)` - Description of what the method does.
   
   #### Example of Method Usage
   ```javascript
   const comp = Metro.getPlugin('#element', 'component-name');
   comp.methodName();
   ```

#### **CSS Variables**
   ```markdown
   ## Styling with CSS Variables
   
   | Variable | Default (Light) | Dark Mode | Description |
   | -------- | --------------- | --------- | ----------- |
   | `--variable-name` | value | value | Description of variable |
   
   ### Example of Custom Styling
   
   ```css
   /* Custom styling example */
   #my-element {
       --variable-name: custom-value;
   }
   ```

#### **CSS Classes**
   ```markdown
   ## Available CSS Classes
   
   ### Base Classes
   - `.class-name` - Description
   
   ### Modifiers
   - `.modifier-class` - Description
   ```

#### **Additional Notes**
   ```markdown
   ## Additional Notes
   
   Any additional information that might be useful for users of the component.
   ```

#### **Best Practices**
   ```markdown
   ## Best Practices
   
   - Use the component in a way that adheres to its intended use.
   - Avoid modifying the component's internal structure directly.
   - Always check for updates and compatibility with the latest version of Metro UI.
   ```

### How to Create Documentation

For each component that needs documentation:

1. **Examine the Component Files**:
    - Look at the JavaScript file (e.g., `component-name.js`) to understand:
        - Default configuration options (usually in a variable like `ComponentDefaultConfig`)
        - Events (usually in the configuration with names like `onEvent`)
        - Styles options (usually in the configuration with names like `clsElementName`)
        - API methods (public methods that don't start with underscore or `#`)

    - Look at the LESS (CSS)) file (e.g., `component-name.less` or `component-name.css`) to understand:
        - CSS variables (usually defined in `:root` and `.dark-side` selectors)
        - Available CSS classes and their purpose
      
    - Look at the HTML examples in `examples/` to see how the component is used in practice.
    - Look the component test files (e.g., `component-name.test.js`) to see how the component is tested.

2. **Create the README.md File**:
    - Use the structure outlined above
    - Include practical examples showing different configurations
    - Document all parameters, methods, events, and styling options
    - Provide clear descriptions for each item

3. **Test the Documentation**:
    - Ensure all examples are correct and work as expected
    - Verify that all parameters, methods, and CSS variables are accurately documented


## 4. Тестування (@olton/latte)

У репозиторії використовується Latte (DOM режим, jsdom) для юніт/інтеграційних тестів. Більшість компонентних тестів завантажує `lib/metro.js` і `lib/metro.css` через DOM-утиліти Latte, а прикладні — відкривають HTML із `examples/`.

- Корисні команди
  - `npm run test` — запустити всі тести (файлові патерни: `**/*.{test,spec}.{js,ts,jsx,tsx}`).
  - `npm run test:components` — тести лише для компонентів: `source/components/**/*.test.js`.
  - `npm run test:ci` — без прогрес-барів (для CI).
  - `npm run test:trace` — розширений лог, стек-трейси.

- Запуск вибірково (важливо для Windows)
  - Для параметра `--include` використовуйте шляхи з прямими слешами `/`, навіть у Windows. Наприклад:
    - Правильно: `npx latte --dom --include=tests/guidelines-demo.test.js`
    - Неправильно: `npx latte --dom --include=tests\guidelines-demo.test.js` (у нашому середовищі це не знаходило тести)

- Попередні умови
  - Якщо тест завантажує артефакти з `lib/`, перед цим виконайте `npm run dev` або `npm run build`.

- Приклади шаблонів тестів
  1) Мінімальний sanity-тест (не потребує `lib`):
  ```js
  import { describe, it, expect } from "@olton/latte";

  describe("Guidelines demo", () => {
      it("sanity", () => {
          expect(1).toBe(1)
      })
  })
  ```
  Запуск лише цього тесту: `npx latte --dom --include=tests/guidelines-demo.test.js`

  2) Компонентний тест (приклад із шаблону):
  ```js
  import { suite, it, expect, beforeAll, DOM, beforeEach } from "@olton/latte"

  let Metro = null

  beforeAll(async () => {
      const metro_js = `./lib/metro.js`
      const metro_css = `./lib/metro.css`

      DOM.js.fromFile(metro_js)
      DOM.css.fromFile(metro_css)

      Metro = await DOM.waitForObject('Metro')
  })

  beforeEach(() => {
      document.body.innerHTML = ''
  })

  suite("Accordion Component Tests", () => {
      it("should initialize", async () => {
          document.body.innerHTML = `<div id="acc"></div>`
          Metro.makePlugin("#acc", "accordion")
          const inst = Metro.getPlugin("#acc", "accordion")
          expect(inst).not.toBeNull()
      })
  })
  ```

  3) Тест прикладу (відкриття HTML із examples/):
  ```js
  import {beforeAll, afterAll, describe, it, expect, getFileUrl, B} from "@olton/latte";

  beforeAll(async () => { await B.create() })
  afterAll(async () => { await B.bye() })

  describe("any.html tests", () => {
      it("any.html", async () => {
          await B.visit(`${getFileUrl("./examples/any.html")}`)
          expect(B.error).toBeNull(B.error)
      })
  })
  ```

- Генерація тестів за прикладами
  - Скрипт `generate-tests.js` формує тести в `tests/` на основі файлів у `examples/` (і перед цим видаляє існуючі файли в `tests/`). Використовуйте його обережно, якщо в `tests/` є ручні тести.

### Додавання нових тестів

- Де розміщувати
  - Для компонентів: `source/components/<name>/<name>.test.js` (переважно компонентні юніт/інтеграційні тести).
  - Для прикладів/інтеграційних сценаріїв: `tests/*.test.js` або згенерувати через `generate-tests.js`.

- Рекомендації
  - Не змішуйте інші фреймворки тестування (jest/vitest тощо). Проєкт стандартизовано на Latte.
  - Для DOM-орієнтованих тестів обнуляйте `document.body` у `beforeEach`.
  - Якщо тест очікує присутність Metro у глобальному неймспейсі — завантажуйте `lib/metro.js` та `lib/metro.css` через `DOM.js.fromFile` і `DOM.css.fromFile`, та чекайте на об’єкт `Metro` через `DOM.waitForObject('Metro')`.

## 5. Стиль коду (Biome)

- Конфігурація: `biome.json`.
  - Formatter: ввімкнено; indentWidth = 4, indentStyle = space, lineWidth = 120, lineEnding = lf.
  - Linter: `rules.recommended = true`.
  - JavaScript formatter: `quoteStyle = "double"`.
  - Coverage: `files.includes = ["source/**/*.js", "!**/*.test.js"]` — тобто тестові файли не форматуються та не лінтяться цим тарґетом.
- Команда: `npm run check` (виконає `biome check --write ./source`).

## 6. Contribution Guidelines

+ Перед внесенням змін до коду, створіть гілку з назвою, що описує ваші зміни (наприклад: `feature/new-component` або `bugfix/fix-issue-123`).
+ Використовуйте зрозумілі коміти, які описують внесені зміни.
+ Перед створенням pull request, переконайтеся, що ваш код відповідає всім вимогам стилю коду та пройшов всі тести.
+ Якщо ви вносите зміни до документації, переконайтеся, що вона актуальна та зрозуміла.
+ Якщо ви вносите зміни до існуючих компонентів, переконайтеся, що вони не порушують зворотну сумісність.
+ Якщо ви вносите зміни до API, переконайтеся, що вони задокументовані та зрозумілі для користувачів.
+ Якщо ви вносите зміни до стилів, переконайтеся, що вони відповідають вимогам дизайну та не порушують загальний стиль бібліотеки.
+ Якщо ви вносите зміни до тестів, переконайтеся, що вони покривають всі можливі сценарії використання компонента та не порушують існуючі тести.
+ Якщо ви вносите зміни до коду, який реалізує нову функціональність, переконайтеся, що вона протестована та задокументована.

## 7. Додаткові поради для розробки

- Архітектура компонентів Metro UI — через `Metro.Component(...)`, плагіни ініціалізуються `Metro.makePlugin(selector, name, options)` та дістаються через `Metro.getPlugin(selector, name)`.
- Уникайте консольних побічних ефектів у продакшн-режимі (див. змінну `drop` у build.js — за бажанням можна розкоментувати `console`).
- Перед відкриттям прикладів і E2E-тестів переконайтесь, що `lib/metro.js` та `lib/metro.css` актуальні (`npm run dev` під час розробки).
- Для Windows у CLI (Latte) використовуйте прямі слеші в шляхах/ґлобах.

## 8. Ліцензія

Проєкт ліцензовано за MIT. Див. файл [LICENSE](../LICENSE).
