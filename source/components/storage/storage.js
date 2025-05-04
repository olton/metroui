((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const MetroStorage = (type) => new MetroStorage.init(type);

    MetroStorage.prototype = {
        setKey: function (key) {
            this.key = key;
        },

        getKey: function () {
            return this.key;
        },

        setItem: function (key, value) {
            this.storage.setItem(`${this.key}:${key}`, JSON.stringify(value));
        },

        getItem: function (key, default_value, reviver) {
            let result;
            let value;

            value = this.storage.getItem(`${this.key}:${key}`);

            try {
                result = JSON.parse(value, reviver);
            } catch (e) {
                result = null;
            }
            return Metro.utils.nvl(result, default_value);
        },

        getItemPart: function (key, sub_key, default_value, reviver) {
            let i;
            let val = this.getItem(key, default_value, reviver);

            const _sub_key = sub_key.split("->");
            for (i = 0; i < _sub_key.length; i++) {
                val = val[_sub_key[i]];
            }
            return val;
        },

        delItem: function (key) {
            this.storage.removeItem(`${this.key}:${key}`);
        },

        size: function (unit) {
            let divider;
            switch (unit) {
                case "m":
                case "M": {
                    divider = 1024 * 1024;
                    break;
                }
                case "k":
                case "K": {
                    divider = 1024;
                    break;
                }
                default:
                    divider = 1;
            }
            return JSON.stringify(this.storage).length / divider;
        },
    };

    MetroStorage.init = function (type) {
        this.key = "";
        this.storage = type ? type : globalThis.localStorage;

        return this;
    };

    MetroStorage.init.prototype = MetroStorage.prototype;

    Metro.storage = MetroStorage(globalThis.localStorage);
    Metro.session = MetroStorage(globalThis.sessionStorage);
})(Metro, Dom);
