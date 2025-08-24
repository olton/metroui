(() => {
    /**
     * Number.prototype.format(n, x, s, c)
     *
     * @param  n {number} : length of decimal
     * @param  x {number}: length of whole part
     * @param  s {string}: sections delimiter
     * @param  c {string}: decimal delimiter
     */
    Number.prototype.format = function (n, x = 3, s = ",", c = ".") {
        const re = `\\d(?=(\\d{${x || 3}})+${n > 0 ? "\\D" : "$"})`;
        const num = this.toFixed(Math.max(0, ~~n));

        return (c ? num.replace(".", c) : num).replace(new RegExp(re, "g"), `$&${s || ","}`);
    };
})();
