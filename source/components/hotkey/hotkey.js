((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const Hotkey = {
        specialKeys: {
            8: "backspace",
            9: "tab",
            13: "return",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            188: ",",
            190: ".",
            191: "/",
            91: "meta", // Левая клавиша Win
            92: "meta", // Правая клавиша Win
            93: "meta", // Контекстное меню
            224: "meta", // Meta в Firefox
        },

        shiftNums: {
            "~": "`",
            "!": "1",
            "@": "2",
            "#": "3",
            $: "4",
            "%": "5",
            "^": "6",
            "&": "7",
            "*": "8",
            "(": "9",
            ")": "0",
            _: "-",
            "+": "=",
            ":": ";",
            '"': "'",
            "<": ",",
            ">": ".",
            "?": "/",
            "|": "\\",
        },

        shiftNumsInverse: {
            "`": "~",
            1: "!",
            2: "@",
            3: "#",
            4: "$",
            5: "%",
            6: "^",
            7: "&",
            8: "*",
            9: "(",
            0: ")",
            "-": "_",
            "=": "+",
            ";": ": ",
            "'": '"',
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|",
        },

        textAcceptingInputTypes: [
            "text",
            "password",
            "number",
            "email",
            "url",
            "range",
            "date",
            "month",
            "week",
            "time",
            "datetime",
            "datetime-local",
            "search",
            "color",
            "tel",
        ],

        // Змінні для комбінованих хоткеїв
        pendingKey: null,
        pendingTimeout: 1000,
        pendingTimer: null,

        normalizeKey: (key) => {
            // Если ключ содержит пробел (составной хоткей)
            if (key.includes(" ")) {
                const parts = key.split(" ");
                return parts.map(Hotkey.normalizeKey).join(" ");
            }

            // Если ключ не содержит "+", это простая клавиша
            if (!key.includes("+")) {
                return key;
            }

            // Разделяем ключ на модификаторы и основную клавишу
            const parts = key.split("+");
            const mainKey = parts.pop(); // Последняя часть - основная клавиша
            const modifiers = parts.filter((mod) => ["alt", "ctrl", "meta", "shift"].includes(mod));

            // Сортируем модификаторы в фиксированном порядке
            modifiers.sort((a, b) => {
                const order = { alt: 1, ctrl: 2, meta: 3, shift: 4 };
                return order[a] - order[b];
            });

            // Собираем ключ обратно в нормализованном порядке
            return modifiers.length ? `${modifiers.join("+")}+${mainKey}` : mainKey;
        },

        getKey: (e) => {
            let key;
            const k = e.keyCode;
            const char = String.fromCharCode(k).toLowerCase();

            // Проверка для клавиш Meta (Windows/Command)
            if ([91, 92, 93, 224].includes(k)) {
                // Для клавиш Meta возвращаем только "meta"
                key = "meta";
            } else if (k === 18) {
                // Для клавиши Alt возвращаем только "alt"
                key = "alt";
            } else if (k === 17) {
                // Для клавиши Ctrl возвращаем только "ctrl"
                key = "ctrl";
            } else if (k === 16) {
                // Для клавиши Shift возвращаем только "shift"
                key = "shift";
            } else if (e.shiftKey) {
                key = Hotkey.shiftNums[char] ? Hotkey.shiftNums[char] : char;
            } else {
                key = Hotkey.specialKeys[k] === undefined ? char : Hotkey.specialKeys[k];
            }

            // Получаем модификаторы
            const modifiers = Hotkey.getModifier(e);

            // Если ключ уже является модификатором и он присутствует в списке модификаторов,
            // не дублируем его в результате
            if (["alt", "ctrl", "meta", "shift"].includes(key) && modifiers.includes(key)) {
                return modifiers.join("+");
            }

            return modifiers.length ? `${modifiers.join("+")}+${key}` : key;
        },

        getModifier: (e) => {
            const m = [];
            if (e.altKey) {
                m.push("alt");
            }
            if (e.ctrlKey) {
                m.push("ctrl");
            }
            if (e.metaKey) {
                m.push("meta");
            }
            if (e.shiftKey) {
                m.push("shift");
            }
            return m;
        },

        // Метод для формування комбінованого хоткея
        createChordKey: (firstPart, secondPart) => {
            return `${firstPart} ${secondPart}`;
        },

        // Метод для перевірки, чи є ключ в Metro.hotkeys як частина комбінованого хоткея
        isPartOfChordKey: (key) => {
            return Object.keys(Metro.hotkeys).some((hotkey) => hotkey.split(" ")[0] === key);
        },

        // Спільна функція для виконання дії хоткея
        executeHotkeyAction: (hotkeyConfig, e) => {
            const el = $(hotkeyConfig[0]);
            const fn = hotkeyConfig[1];
            const href = `${el.attr("href")}`.trim();

            if (e.repeat && !el.attr("data-repeat")) {
                return false;
            }

            e.preventDefault();

            if (fn) {
                Metro.utils.exec(fn);
            } else {
                if (el.is("a") && href && href.length > 0 && href.trim() !== "#") {
                    globalThis.location.href = href;
                } else {
                    el[0].click();
                }
            }

            return true;
        },

        // Функція для очищення очікування для комбінованого хоткея
        clearPending: () => {
            clearTimeout(Hotkey.pendingTimer);
            Hotkey.pendingKey = null;
        },

        // Функція для встановлення очікування другої частини комбінованого хоткея
        setPending: (key) => {
            Hotkey.pendingKey = key;
            clearTimeout(Hotkey.pendingTimer);
            Hotkey.pendingTimer = setTimeout(Hotkey.clearPending, Hotkey.pendingTimeout);
        },
    };

    function hotkeyHandler(e) {
        const key = Hotkey.getKey(e);
        const normalizedKey = Hotkey.normalizeKey(key);

        // Перевіряємо, чи є вже очікування для комбінованого хоткея
        if (Hotkey.pendingKey !== null) {
            // Шукаємо комбінований ключ
            const chordKey = Hotkey.createChordKey(Hotkey.pendingKey, normalizedKey);

            // Проходим по всем хоткеям и ищем соответствующий
            for (const hotkeyName in Metro.hotkeys) {
                if (Hotkey.normalizeKey(hotkeyName) === chordKey) {
                    if (Hotkey.executeHotkeyAction(Metro.hotkeys[hotkeyName], e)) {
                        Hotkey.clearPending();
                        return;
                    }
                }
            }
        }

        // Перевіряємо, чи поточний ключ є першою частиною комбінованого хоткея
        const isPartOfChord = Object.keys(Metro.hotkeys).some((hotkey) => {
            const parts = hotkey.split(" ");
            return parts.length > 1 && Hotkey.normalizeKey(parts[0]) === normalizedKey;
        });

        // Якщо ключ є частиною комбінованого хоткея, встановлюємо очікування
        if (isPartOfChord) {
            Hotkey.setPending(normalizedKey);
        }

        // Перевіряємо, чи є для поточного ключа окремий хоткей
        for (const hotkeyName in Metro.hotkeys) {
            if (!hotkeyName.includes(" ") && Hotkey.normalizeKey(hotkeyName) === normalizedKey) {
                Hotkey.executeHotkeyAction(Metro.hotkeys[hotkeyName], e);
                return;
            }
        }
    }

    function bindKey(key, fn) {
        const normalizedKey = Hotkey.normalizeKey(key);

        return this.each(function () {
            const el = $(this);
            const isInputElement = el.is("input, textarea") || el.attr("contenteditable") === "true";

            // Для елементів введення використовуємо локальний обробник
            if (isInputElement) {
                const wrappedHandler = (e, pressedKey) => {
                    Metro.utils.exec(fn, [e, pressedKey, key], el[0]);
                };

                el.on(`${Metro.events.keydown}.hotkey-data-${key}`, (e) => {
                    const pressedKey = Hotkey.getKey(e);
                    const normalizedPressedKey = Hotkey.normalizeKey(pressedKey);

                    // Перевірка на очікування комбінованого хоткею
                    if (Hotkey.pendingKey !== null) {
                        const chordKey = Hotkey.createChordKey(Hotkey.pendingKey, normalizedPressedKey);

                        if (normalizedKey === chordKey) {
                            Hotkey.clearPending();
                            e.preventDefault();
                            wrappedHandler(e, pressedKey);
                            return;
                        }
                    }

                    // Перевірка на першу частину комбінованого хоткею
                    if (normalizedKey.includes(" ")) {
                        const keyParts = normalizedKey.split(" ");
                        if (normalizedPressedKey === Hotkey.normalizeKey(keyParts[0])) {
                            Hotkey.setPending(normalizedPressedKey);
                            return;
                        }
                    }

                    // Обробка звичайного хоткею
                    if (normalizedKey === normalizedPressedKey) {
                        e.preventDefault();
                        wrappedHandler(e, pressedKey);
                    }
                });
            }
            // Для решти елементів реєструємо глобальний хоткей
            else {
                // Обробник для глобального хоткею
                const hotkeyHandler = (e) => {
                    if (e.repeat && !el.attr("data-repeat")) {
                        return false;
                    }
                    e.preventDefault();
                    Hotkey.executeHotkeyAction(normalizedKey, e);
                    return true;
                };

                // Реєструємо хоткей у глобальному списку
                if (!Metro.hotkeys) Metro.hotkeys = {};
                Metro.hotkeys[key] = [el, hotkeyHandler];

                // Додаємо атрибут для інформаційних цілей
                el.attr("data-hotkey", key);
            }
        });
    }

    $.fn.hotkey = bindKey;

    if (globalThis.METRO_JQUERY && globalThis.jquery_present) {
        globalThis.jQuery.fn.hotkey = bindKey;
    }

    $(document).on(`${Metro.events.keydown}.hotkey-data`, hotkeyHandler);
})(Metro, Dom);
