(() => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    String.prototype.toArray = function (delimiter = ",", type = "string", format = "", locale = "en") {
        const a = `${this}`.split(delimiter);
        return a.map((s) => {
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
                    result = !format ? datetime(s) : Datetime.from(s, format, locale || "en-US");
                    break;
                default:
                    result = s.trim();
            }

            return result;
        });
    };

    String.prototype.capitalize = function () {
        return this.substring(0, 1).toUpperCase() + this.substring(1);
    };
})();
