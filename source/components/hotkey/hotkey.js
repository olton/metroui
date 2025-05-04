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
            224: "meta",
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

        getKey: (e) => {
            let key;
            const k = e.keyCode;
            const char = String.fromCharCode(k).toLowerCase();
            if (e.shiftKey) {
                key = Hotkey.shiftNums[char] ? Hotkey.shiftNums[char] : char;
            } else {
                key = Hotkey.specialKeys[k] === undefined ? char : Hotkey.specialKeys[k];
            }

            return Hotkey.getModifier(e).length ? `${Hotkey.getModifier(e).join("+")}+${key}` : key;
        },

        getModifier: (e) => {
            const m = [];
            if (e.altKey) {
                m.push("alt");
            }
            if (e.ctrlKey || e.metaKey) {
                m.push("ctrl");
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

    function bindKey(key, fn) {
        return this.each(function () {
            $(this).on(`${Metro.events.keydown}.hotkey-method-${key}`, function (e) {
                if (e.repeat) return;

                const _key = Hotkey.getKey(e);
                const el = $(this);
                const href = `${el.attr("href")}`;

                // Перевіряємо, чи це комбінований хоткей
                if (key.includes(" ")) {
                    const keyParts = key.split(" ");

                    // Якщо ми вже очікуємо другу частину
                    if (Hotkey.pendingKey === keyParts[0] && _key === keyParts[1]) {
                        Hotkey.clearPending();

                        // Виконуємо дію
                        if (el.is("a")) {
                            if (href && href.trim() !== "#") {
                                globalThis.location.href = href;
                            }
                        }

                        Metro.utils.exec(fn, [e, _key, key], this);
                        e.preventDefault();
                    }
                    return;
                }

                if (key !== _key) {
                    return;
                }

                if (el.is("a")) {
                    if (href && href.trim() !== "#") {
                        globalThis.location.href = href;
                    }
                }

                Metro.utils.exec(fn, [e, _key, key], this);
            });
        });
    }

    $.fn.hotkey = bindKey;

    if (globalThis.METRO_JQUERY && globalThis.jquery_present) {
        globalThis.jQuery.fn.hotkey = bindKey;
    }

    $(document).on(`${Metro.events.keydown}.hotkey-data`, (e) => {
        const key = Hotkey.getKey(e);

        // Перевіряємо, чи є вже очікування для комбінованого хоткея
        if (Hotkey.pendingKey !== null) {
            // Шукаємо комбінований ключ
            const chordKey = Hotkey.createChordKey(Hotkey.pendingKey, key);

            // Якщо знайдено комбінований хоткей
            if (Metro.utils.keyInObject(Metro.hotkeys, chordKey)) {
                if (Hotkey.executeHotkeyAction(Metro.hotkeys[chordKey], e)) {
                    Hotkey.clearPending();
                    return;
                }
            }
            // Якщо другої частини комбінації не знайдено, продовжуємо обробку поточного ключа
        }

        // Перевіряємо, чи поточний ключ є першою частиною комбінованого хоткея
        const isPartOfChord = Hotkey.isPartOfChordKey(key);

        // Якщо ключ є частиною комбінованого хоткея, встановлюємо очікування
        if (isPartOfChord) {
            Hotkey.setPending(key);
        }

        // Перевіряємо, чи є для поточного ключа окремий хоткей
        if (Metro.utils.keyInObject(Metro.hotkeys, key)) {
            Hotkey.executeHotkeyAction(Metro.hotkeys[key], e);
        }
    });
})(Metro, Dom);
