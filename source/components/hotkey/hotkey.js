(function(Metro, $) {
    'use strict';

    const Hotkey = {
        specialKeys: {
            8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
            20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
            96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
            104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
            120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 188: ",", 190: ".",
            191: "/", 224: "meta"
        },

        shiftNums: {
            "~": "`", "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7",
            "*": "8", "(": "9", ")": "0", "_": "-", "+": "=", ":": ";", "\"": "'", "<": ",",
            ">": ".", "?": "/", "|": "\\"
        },

        shiftNumsInverse: {
            "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
            "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
            ".": ">", "/": "?", "\\": "|"
        },

        textAcceptingInputTypes: [
            "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
            "datetime-local", "search", "color", "tel"
        ],

        getKey: function (e) {
            let key, k = e.keyCode, char = String.fromCharCode(k).toLowerCase();
            if (e.shiftKey) {
                key = Hotkey.shiftNums[char] ? Hotkey.shiftNums[char] : char;
            } else {
                key = Hotkey.specialKeys[k] === undefined
                    ? char
                    : Hotkey.specialKeys[k];
            }

            return Hotkey.getModifier(e).length ? Hotkey.getModifier(e).join("+") + "+" + key : key;
        },

        getModifier: function (e) {
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
        }
    };

    function bindKey(key, fn){
        return this.each(function(){
            $(this).on(Metro.events.keydown+".hotkey-method-"+key, function(e){
                if (e.repeat) return

                const _key = Hotkey.getKey(e);
                const el = $(this);
                const href = "" + el.attr("href");

                if (key !== _key) {
                    return;
                }

                if (el.is("a")) {
                    if (href && href.trim() !== "#") {
                        globalThis.location.href = href;
                    }
                }

                Metro.utils.exec(fn, [e, _key, key], this);
            })
        })
    }

    $.fn.hotkey = bindKey;

    if (globalThis["METRO_JQUERY"] && globalThis["jquery_present"]) {
        jQuery.fn.hotkey = bindKey;
    }

    $(document).on(Metro.events.keydown + ".hotkey-data", function(e){
        let el, fn, key, href;

        if (
            (METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS && /textarea|input|select/i.test(e.target.nodeName)) ||
            (METRO_HOTKEYS_FILTER_CONTENT_EDITABLE && $(e.target).attr('contenteditable')) ||
            (METRO_HOTKEYS_FILTER_TEXT_INPUTS && Hotkey.textAcceptingInputTypes.indexOf(e.target.type) > -1)
        )
        {
            return;
        }

        key = Hotkey.getKey(e);

        if (Metro.utils.keyInObject(Metro.hotkeys, key)) {
            el = $(Metro.hotkeys[key][0]);
            fn = Metro.hotkeys[key][1];
            href = (""+el.attr("href")).trim();

            if (e.repeat && !el.attr("data-repeat")) {
                return
            }

            e.preventDefault()

            if (fn) {
                Metro.utils.exec(fn);
            } else {
                if (el.is("a") && href && href.length > 0 && href.trim() !== "#") {
                    globalThis.location.href = href;
                } else {
                    el[0].click();
                }
            }
        }
    });
}(Metro, Dom));