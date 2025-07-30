# Керівні принципи проєкту 

## 1. Структура проєкту

Проєкт дотримується конкретної структури для забезпечення узгодженості в процесі розробки та супроводу.
Вихідний код розташований у теці `source`, а скомпільований — у теці `lib`.

## 2. Структура вихідного коду

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

### 2.1. Компоненти
Кожен компонент має свою теку, в якій розташовані файли `index.js`, `[component-name].less`, `[component-name].js`.
Також, у теці компонента, можуть бути розташовані додаткові включення компонентів, які використовуються поточним компонентом.

### 2.2. Стилі кольору
Стилі кольору розташовані в теці `colors-css`. Кожен файл являє собою окремий модуль з класами, які реалізують одну специфічну поведінку.

### 2.3. Загальні стилі
Загальні стилі розташовані в теці `common-css`. Кожен файл являє собою окремий модуль з класами, які реалізують одну специфічну поведінку.

### 2.4. Загальні функції
Загальні функції розташовані в теці `common-js`. Файл містить різноманітні функції, які не є компонентами або стилями, але використовуються в різних компонентах.

### 2.5. Зовнішні модулі
В теках: `dom`, `html`, `datetime`, `farbe`, `guardian`, `hooks`, `model`, `router`, та `string` розташовані функції, які підключають сторонні модулі для використання з Metro UI.

### 2.6. Ядро бібліотеки
В теці `core` розташовані модулі, які реалізують ядро бібліотеки та глобальний неймспейс `Metro`.

## 3. Створеня компонента

### Складові компонента:
+ `[component-name].less` — файл стилів компонента, який містить стилі компонента та кольорові складові для світлої та темної тем.
+ `[component-name].js` — файл JavaScript, який містить код компонента.
+ `index.js` — файл, який імплементує компонент, щоб його можна було використовувати в інших модулях.

### Додаткові файли:
+ `[component-name].test.js` — файл з тестами для компонента, який використовує фреймворк Latte.
+ `README.md` — файл з документацією для компонента, який містить приклади використання, параметри, методи API та інші деталі.

### Javascript шаблон компонента:

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
### Стилі компонента.
Стилі компонента мають бути написані в LESS файлі, який містить стилі для світлої та темної теми за наступним шаблоном:

```less
@import (once) "../../include/vars";
@import (once) "../../include/mixins;

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

Основний класс компонента має бути названий як і компонент, з використанням kebab-case (наприклад: `action-button`).
Інши класи компонента мають бути названі з використанням kebab-case за методою БЕМ (блок-елемент__модіфікатор).

## 4. Документація компонента

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

2. **Create the README.md File**:
    - Use the structure outlined above
    - Include practical examples showing different configurations
    - Document all parameters, methods, events, and styling options
    - Provide clear descriptions for each item

3. **Test the Documentation**:
    - Ensure all examples are correct and work as expected
    - Verify that all parameters, methods, and CSS variables are accurately documented

## 5. Testing Guidelines

+ Для тестування вихідного коду використовуються тести на основі фреймворку Latte (@olton/latte).
+ Документація з тестування доступна за посиланням: [Latte Documentation](https://latte.org.ua)
+ Тестування вихідного коду є обов'язковим для всіх компонентів, які реалізують нову функціональність або змінюють існуючу.
+ Тестування вихідного коду є необов'язковим для компонентів, які реалізують лише стилі або не змінюють функціональність.
+ Запуск тестів можна здійснити за допомогою команди
```bash
npm run test:components
```
+ Для мокінгу функцій слід використовувать функцію фреймворку Latte: `mock()`
+ Для створення тестових груп використовуються функції фреймворку Latte: `suite()` або `describe()`. Ці функції не можуть бути вкладеними в інші функції.
+ Для створення тестів усередині групи використовується функція фреймворку Latte: `it()`.
+ Для створення окремо стоячих тестів використовується функція фреймворку Latte: `test()`.
+ Тести мають бути написані в окремому файлі, якій розташован в теці відповідного компонента і називатись `[component-name].test.js`.
+ Тести не мають використовувати інші фреймворки окрім Latte (наприклад: jest, vitest, тощо).
+ Якщо тест не проходить і якщо не вказано прямо виправляти помилки, потрібно створити файл з назвою `[component-name].fix.js`, в якому реалізувати пропозиції.

Кожен тестовий файл має починатися з коду завантаження бібліотекі Metro UI:
```javascript
let Metro = null
let $ = null

beforeAll(async () => {
   const metro_js = `./lib/metro.js`
   const metro_css = `./lib/metro.css`

   DOM.js.fromFile(metro_js)
   DOM.css.fromFile(metro_css)

   Metro = await DOM.waitForObject('Metro')
   $ = await DOM.waitForObject('$')
})

beforeEach(() => {
   document.body.innerHTML = '';
})

// Test cases go here
```

## 6. Code Style

+ Для форматування вихідного коду використовується `Biom`.
+ Форматування має відповідати вимогам [JavaScript Standard Style](https://standardjs.com/) за виключенням того, що замість 2-х пробілів, використовується 4 пробіли.

## 7. Contribution Guidelines

+ Перед внесенням змін до коду, створіть гілку з назвою, що описує ваші зміни (наприклад: `feature/new-component` або `bugfix/fix-issue-123`).
+ Використовуйте зрозумілі коміти, які описують внесені зміни.
+ Перед створенням pull request, переконайтеся, що ваш код відповідає всім вимогам стилю коду та пройшов всі тести.
+ Якщо ви вносите зміни до документації, переконайтеся, що вона актуальна та зрозуміла.
+ Якщо ви вносите зміни до існуючих компонентів, переконайтеся, що вони не порушують зворотну сумісність.
+ Якщо ви вносите зміни до API, переконайтеся, що вони задокументовані та зрозумілі для користувачів.
+ Якщо ви вносите зміни до стилів, переконайтеся, що вони відповідають вимогам дизайну та не порушують загальний стиль бібліотеки.
+ Якщо ви вносите зміни до тестів, переконайтеся, що вони покривають всі можливі сценарії використання компонента та не порушують існуючі тести.
+ Якщо ви вносите зміни до коду, який реалізує нову функціональність, переконайтеся, що вона протестована та задокументована.

## 8. License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.