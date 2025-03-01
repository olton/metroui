class Model {
    constructor(data = {}) {
        this.elements = [];
        this.data = new Proxy(data, {
            set: (target, property, value) => {
                target[property] = value;
                this.updateDOM(property, value);
                return true;
            }
        });
    }

    // Парсимо DOM для пошуку виразів {{ змінна }}
    parse(rootElement = document.body) {
        const walker = document.createTreeWalker(
            rootElement,
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

        // Ініціалізуємо DOM з поточними значеннями
        this.updateAllDOM();

        return this;
    }

    // Оновлюємо элементи DOM, які того потребують
    updateAllDOM() {
        for (const item of this.elements) {
            const value = this.data[item.propName];
            this.updateNodeContent(item.node, item.template, item.propName, value);
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