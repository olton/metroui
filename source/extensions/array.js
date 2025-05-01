(() => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    if (typeof Array.prototype.shuffle !== "function") {
        Array.prototype.shuffle = function () {
            let currentIndex = this.length;
            let temporaryValue;
            let randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = this[currentIndex];
                this[currentIndex] = this[randomIndex];
                this[randomIndex] = temporaryValue;
            }

            return this;
        };
    }

    if (typeof Array.prototype.clone !== "function") {
        Array.prototype.clone = function () {
            return this.slice(0);
        };
    }

    if (typeof Array.prototype.unique !== "function") {
        Array.prototype.unique = function () {
            const a = this.concat();
            for (let i = 0; i < a.length; ++i) {
                for (let j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j]) a.splice(j--, 1);
                }
            }

            return a;
        };
    }

    if (typeof Array.prototype.pack !== "function") {
        Array.prototype.pack = function () {
            return this.map((n) => n.trim()).filter(Boolean);
        };
    }
})();
