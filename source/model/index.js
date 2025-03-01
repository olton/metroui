class Model {
    constructor(data = {}) {
        this.elements = [];
        this.inputs = [];
        this.data = new Proxy(data, {
            set: (target, property, value) => {
                target[property] = value;
                this.updateDOM(property, value);
                this.updateInputs(property, value);
                return true;
            }
        });
    }

    // Парсимо DOM для пошуку виразів {{ змінна }}
    parse(rootElement) {
        let root
        
        if (typeof rootElement === 'string') {
            root = document.querySelector(rootElement);
        } else if (rootElement instanceof HTMLElement) {
            root = rootElement;
        } else {
            root = document.body;
        }
        
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        const regex = /\{\{\s*([^}]+)\s*\}\}/g;

        while (node = walker.nextNode()) {
            let match;
            const text = node.textContent;

            // Зберігаємо початковий текст для шаблону
            const originalText = text;

            // Шукаємо всі вирази {{ змінна }}
            while ((match = regex.exec(text)) !== null) {
                const propName = match[1].trim();

                if (propName in this.data) {
                    this.elements.push({
                        node,
                        propName,
                        template: originalText
                    });
                }
            }
        }

        // Знаходимо всі input-элементи з атрибутом data-model
        this.bindInputs(root);
        
        // Ініціалізуємо DOM з поточними значеннями
        this.updateAllDOM();

        return this;
    }

    // Метод для зв'язування input-елементів із моделлю
    bindInputs(rootElement) {
        const inputs = rootElement.querySelectorAll('input[data-model], textarea[data-model], select[data-model]');

        inputs.forEach(input => {
            const propName = input.getAttribute('data-model');

            if (propName && propName in this.data) {
                // Встановлюємо початкове значення input з моделі
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = Boolean(this.data[propName]);
                } else {
                    input.value = this.data[propName];
                }

                // Зберігаємо input для оновлення при зміні даних
                this.inputs.push({
                    element: input,
                    propName
                });

                // Додаємо слухач подій для оновлення моделі при зміні input
                input.addEventListener('input', () => {
                    let value;

                    if (input.type === 'checkbox') {
                        value = input.checked;
                    } else if (input.type === 'number' || input.type === 'range') {
                        value = parseFloat(input.value);
                    } else {
                        value = input.value;
                    }

                    // Оновлюємо значення моделі (без виклику події, щоб уникнути нескінченного циклу)
                    this.data[propName] = value;
                });
            }
        });
    }

    // Оновлення значень в input-елементах при зміні даних моделі
    updateInputs(propName, value) {
        this.inputs.forEach(item => {
            if (item.propName === propName) {
                const input = item.element;

                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = Boolean(value);
                } else if (input.value !== String(value)) {
                    input.value = value;
                }
            }
        });
    }
    
    // Оновлюємо элементи DOM, які того потребують
    updateAllDOM() {
        for (const item of this.elements) {
            const value = this.data[item.propName];
            this.updateNodeContent(item.node, item.template, item.propName, value);
        }

        // Оновлюємо всі input елементи
        for (const key in this.data) {
            this.updateInputs(key, this.data[key]);
        }
    }

    // Оновлюємо DOM при зміні значення властивості
    updateDOM(propName, value) {
        for (const item of this.elements) {
            if (item.propName === propName) {
                this.updateNodeContent(item.node, item.template, propName, value);
            }
        }
    }

    // Оновлюємо вміст вузла
    updateNodeContent(node, template, propName, value) {
        let result = template;
        const regex = new RegExp(`\\{\\{\\s*${propName}\\s*\\}\\}`, 'g');

        // Змінюємо всі входження {{ змінна }} на значення
        result = result.replace(regex, value);

        // Оновлюємо інші змінні в шаблоні, якщо вони є
        for (const key in this.data) {
            if (key !== propName) {
                const otherRegex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
                result = result.replace(otherRegex, this.data[key]);
            }
        }

        node.textContent = result;
    }

    // Ініціюємо модель на відповідному DOM елементі
    init(rootElement) {
        return this.parse(rootElement);
    }
}

export default Model;