(() => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    String.prototype.toArray = function (delimiter = ",", type = "string", format = "", locale = "en", pack = false) {
        const a = `${this}`.split(delimiter).map((s) => {
            let result;

            switch (type) {
                case "int":
                case "integer":
                    result = Number.isNaN(s) ? s.trim() : Number.parseInt(s);
                    break;
                case "number":
                case "float":
                    result = Number.isNaN(s) ? s : Number.parseFloat(s);
                    break;
                case "date":
                    result = !format ? datetime(s) : Datetime.from(s, format, locale);
                    break;
                case "boolean": {
                    switch (s) {
                        case true:
                        case "true":
                        case 1:
                        case "1":
                        case "on":
                        case "yes":
                        case "+":
                            result = true;
                            break;
                        default:
                            result = false;
                    }
                    break;
                }
                default:
                    result = s.trim();
            }

            return result;
        });
        return pack ? a.pack() : a;
    };
})();
