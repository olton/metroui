((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    Metro.utils = {
        nothing: () => {},
        noop: () => {},
        elementId: (prefix) => `${prefix}-${new Date().getTime()}${$.random(1, 1000)}`,
        secondsToTime: (s) => {
            const days = Math.floor((s % 31536000) / 86400);
            const hours = Math.floor(((s % 31536000) % 86400) / 3600);
            const minutes = Math.floor((((s % 31536000) % 86400) % 3600) / 60);
            const seconds = Math.round((((s % 31536000) % 86400) % 3600) % 60);

            return {
                d: days,
                h: hours,
                m: minutes,
                s: seconds,
            };
        },

        secondsToFormattedString: (time) => {
            const sec_num = Number.parseInt(time, 10);
            const hours = Math.floor(sec_num / 3600);
            const minutes = Math.floor((sec_num - hours * 3600) / 60);
            const seconds = sec_num - hours * 3600 - minutes * 60;

            return [Str.lpad(hours, "0", 2), Str.lpad(minutes, "0", 2), Str.lpad(seconds, "0", 2)].join(":");
        },

        func: (f) => new Function("a", f),

        exec: function (f, args, context) {
            let result;
            if (f === undefined || f === null) {
                return false;
            }
            let func = this.isFunc(f);

            if (func === false) {
                func = this.func(f);
            }

            try {
                result = func.apply(context, args);
            } catch (err) {
                result = null;
                if (globalThis.METRO_THROWS === true) {
                    throw err;
                }
            }
            return result;
        },

        embedUrl: (val) => {
            let url = val;
            if (url.indexOf("youtu.be") !== -1) {
                url = `https://www.youtube.com/embed/${val.split("/").pop()}`;
            }
            return `<div class='embed-container'><iframe src='${url}'></iframe></div>`;
        },

        isVisible: function (element) {
            const el = $(element)[0];
            return (
                this.getStyleOne(el, "display") !== "none" &&
                this.getStyleOne(el, "visibility") !== "hidden" &&
                el.offsetParent !== null
            );
        },

        isUrl: (val) =>
            /^(\.\/|\.\.\/|ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(val),

        isTag: (val) => /^<\/?[\w\s="\/.':;#-\/?]+>/gi.test(val),

        isEmbedObject: (val) => {
            const embed = ["iframe", "object", "embed", "video"];
            let result = false;
            $.each(embed, function () {
                if (typeof val === "string" && val.toLowerCase() === this) {
                    result = true;
                } else if (val.nodeType !== undefined && val.tagName.toLowerCase() === this) {
                    result = true;
                }
            });
            return result;
        },

        isVideoUrl: (val) => /youtu\.be|youtube|twitch|vimeo/gi.test(val),

        isDate: function (val, format, locale = "en-US") {
            let result;

            if (this.isDateObject(val)) {
                return true;
            }

            try {
                result = format ? Datetime.from(val, format, locale) : datetime(val);
                return Datetime.isDatetime(result);
            } catch (e) {
                return false;
            }
        },

        isDateObject: (v) => typeof v === "object" && v.getMonth !== undefined,

        isInt: (n) => !Number.isNaN(n) && +n % 1 === 0,

        isFloat: (n) => (!Number.isNaN(n) && +n % 1 !== 0) || /^\d*\.\d+$/.test(n),

        isFunc: function (f) {
            return this.isType(f, "function");
        },

        isObject: function (o) {
            return this.isType(o, "object");
        },

        isObject2: (o) => typeof o === "object" && !Array.isArray(o),

        isType: function (o, t = "undefined") {
            if (!this.isValue(o)) {
                return false;
            }

            // biome-ignore lint/suspicious/useValidTypeof: <explanation>
            if (typeof o === t) {
                return o;
            }

            if (`${t}`.toLowerCase() === "tag" && this.isTag(o)) {
                return o;
            }

            if (`${t}`.toLowerCase() === "url" && this.isUrl(o)) {
                return o;
            }

            if (`${t}`.toLowerCase() === "array" && Array.isArray(o)) {
                return o;
            }

            if ((t !== "string" && this.isTag(o)) || this.isUrl(o)) {
                return false;
            }

            // biome-ignore lint/suspicious/useValidTypeof: <explanation>
            if (typeof window[o] === t) {
                return window[o];
            }

            if (typeof o === "string" && o.indexOf(".") === -1) {
                return false;
            }

            if (typeof o === "string" && /[/\s([]+/gm.test(o)) {
                return false;
            }

            if (typeof o === "number" && t.toLowerCase() !== "number") {
                return false;
            }

            const ns = o.split(".");
            let i;
            let context = window;

            for (i = 0; i < ns.length; i++) {
                context = context[ns[i]];
            }

            // biome-ignore lint/suspicious/useValidTypeof: <explanation>
            return typeof context === t ? context : false;
        },

        $: () => (globalThis.useJQuery ? globalThis.jQuery : Dom),

        isMetroObject: (el, type) => {
            const $el = $(el);
            const el_obj = Metro.getPlugin(el, type);

            if ($el.length === 0) {
                console.warn(`${type} ${el} not found!`);
                return false;
            }

            if (el_obj === undefined) {
                console.warn(
                    `Element not contain role ${type}! Please add attribute data-role="${type}" to element ${el}`,
                );
                return false;
            }

            return true;
        },

        isJQuery: (el) => typeof globalThis.jQuery !== "undefined" && el instanceof globalThis.jQuery,

        isDom: (el) => typeof Dom !== "undefined" && el instanceof Dom,

        isQ: function (el) {
            return this.isJQuery(el) || this.isDom(el);
        },

        isOutsider: function (element) {
            const el = $(element);
            const clone = el.clone();

            clone.removeAttr("data-role").css({
                visibility: "hidden",
                position: "absolute",
                display: "block",
            });
            el.parent().append(clone);

            const inViewport = this.inViewport(clone[0]);
            clone.remove();

            return !inViewport;
        },

        inViewport: function (el) {
            const rect = this.rect(el);

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (globalThis.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (globalThis.innerWidth || document.documentElement.clientWidth)
            );
        },

        viewportOutByWidth: function (el) {
            const rect = this.rect(el);
            const w = globalThis.innerWidth || document.documentElement.clientWidth;

            return rect.right > w;
        },

        viewportOutByHeight: function (el) {
            const rect = this.rect(el);
            const h = globalThis.innerHeight || document.documentElement.clientHeight;

            return rect.bottom > h;
        },

        viewportOut: function (el) {
            return this.viewportOutByWidth(el) || this.viewportOutByHeight(el);
        },

        rect: (el) => el.getBoundingClientRect(),

        getCursorPosition: function (el, e) {
            const a = this.rect(el);
            return {
                x: this.pageXY(e).x - a.left - globalThis.scrollX,
                y: this.pageXY(e).y - a.top - globalThis.scrollY,
            };
        },

        getCursorPositionX: function (el, e) {
            return this.getCursorPosition(el, e).x;
        },

        getCursorPositionY: function (el, e) {
            return this.getCursorPosition(el, e).y;
        },

        objectLength: (obj) => Object.keys(obj).length,

        percent: (total, part, round_value) => {
            if (total === 0) {
                return 0;
            }
            const result = (part * 100) / total;
            return round_value === true ? Math.round(result) : Math.round(result * 100) / 100;
        },

        objectShift: (obj) => {
            let min = 0;
            $.each(obj, (i) => {
                if (min === 0) {
                    min = i;
                } else {
                    if (min > i) {
                        min = i;
                    }
                }
            });
            delete obj[min];

            return obj;
        },

        objectDelete: (obj, key) => {
            if (key in obj) delete obj[key];
        },

        arrayDeleteByMultipleKeys: (arr, keys) => {
            for (const ind of keys) {
                delete arr[ind];
            }
            return arr.filter((item) => item !== undefined);
        },

        arrayDelete: (arr, val) => {
            const i = arr.indexOf(val);
            if (i > -1) arr.splice(i, 1);
        },

        arrayDeleteByKey: (arr, key) => {
            arr.splice(key, 1);
        },

        nvl: (data, other) => (data === undefined || data === null ? other : data),

        objectClone: (obj) => {
            const copy = {};
            for (const key in obj) {
                if ($.hasProp(obj, key)) {
                    copy[key] = obj[key];
                }
            }
            return copy;
        },

        github: async function (repo, callback) {
            const res = await fetch(`https://api.github.com/repos/${repo}`);
            if (!res.ok) return;
            const data = await res.json();
            this.exec(callback, [data]);
        },

        pageHeight: () => {
            const body = document.body;
            const html = document.documentElement;

            return Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight,
            );
        },

        cleanPreCode: (selector) => {
            const els = Array.prototype.slice.call(document.querySelectorAll(selector), 0);

            for (const el of els) {
                const txt = el.textContent
                    .replace(/^[\r\n]+/, "") // strip leading newline
                    .replace(/\s+$/g, "");

                if (/^\S/gm.test(txt)) {
                    el.textContent = txt;
                    continue;
                }

                let mat;
                let str = "";
                const re = /^[\t ]+/gm;
                let len;
                let min = 1e3;

                // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                while ((mat = re.exec(txt))) {
                    len = mat[0].length;

                    if (len < min) {
                        min = len;
                        str = mat[0];
                    }
                }

                if (min === 1e3) continue;

                el.textContent = txt.replace(new RegExp(`^${str}`, "gm"), "").trim();
            }
        },

        coords: (element) => {
            const el = $(element)[0];
            const box = el.getBoundingClientRect();

            return {
                top: box.top + globalThis.pageYOffset,
                left: box.left + globalThis.pageXOffset,
            };
        },

        /**
         * @param {TouchEvent|Event|MouseEvent} e
         * @param t where: client, screen, or page
         * @param s source: touches or changedTouches
         */
        positionXY: function (e, t, s) {
            switch (t) {
                case "client":
                    return this.clientXY(e, s);
                case "screen":
                    return this.screenXY(e, s);
                case "page":
                    return this.pageXY(e, s);
                default:
                    return { x: 0, y: 0 };
            }
        },

        /**
         *
         * @param {TouchEvent|Event|MouseEvent} e
         * @param t source: touches or changedTouches
         * @returns {{x: (*), y: (*)}}
         */
        clientXY: (e, t = "touches") => ({
            x: e[t] ? e[t][0].clientX : e.clientX,
            y: e[t] ? e[t][0].clientY : e.clientY,
        }),

        /**
         *
         * @param {TouchEvent|Event|MouseEvent} e
         * @param t source: touches or changedTouches
         * @returns {{x: (*), y: (*)}}
         */
        screenXY: (e, t = "touches") => ({
            x: e[t] ? e[t][0].screenX : e.screenX,
            y: e[t] ? e[t][0].screenY : e.screenY,
        }),

        /**
         *
         * @param {TouchEvent|Event|MouseEvent} e
         * @param t source: touches or changedTouches
         * @returns {{x: (*), y: (*)}}
         */
        pageXY: (e, t = "touches") => ({
            x: e[t] ? e[t][0].pageX : e.pageX,
            y: e[t] ? e[t][0].pageY : e.pageY,
        }),

        isRightMouse: (e) => ("which" in e ? e.which === 3 : "button" in e ? e.button === 2 : undefined),

        hiddenElementSize: (el, includeMargin = false) => {
            const clone = $(el).clone(true);

            clone.removeAttr("data-role").css({
                visibility: "hidden",
                position: "absolute",
                display: "block",
            });
            $("body").append(clone);

            const width = clone.outerWidth(includeMargin);
            const height = clone.outerHeight(includeMargin);
            clone.remove();
            return {
                width: width,
                height: height,
            };
        },

        getStyle: (element) => {
            const el = $(element)[0];
            return globalThis.getComputedStyle(el);
        },

        getStyleOne: function (el, property) {
            return this.getStyle(el).getPropertyValue(property);
        },

        getInlineStyles: (element) => {
            let i;
            let l;
            const styles = {};
            const el = $(element)[0];
            for (i = 0, l = el.style.length; i < l; i++) {
                const s = el.style[i];
                styles[s] = el.style[s];
            }

            return styles;
        },

        encodeURI: (str) => encodeURI(str).replace(/%5B/g, "[").replace(/%5D/g, "]"),

        updateURIParameter: (uri, key, value) => {
            const re = new RegExp(`([?&])${key}=.*?(&|$)`, "i");
            const separator = uri.indexOf("?") !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, `$1${key}=${value}$2`);
            }
            return `${uri + separator + key}=${value}`;
        },

        getURIParameter: (url = globalThis.location.href, name = "") => {
            const _name = name.replace(/[\[\]]/g, "\\$&");
            const regex = new RegExp(`[?&]${_name}(=([^&#]*)|&|#|$)`);
            const results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return "";
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },

        getLocales: () => Object.keys(Metro.locales),

        addLocale: (locale) => {
            Metro.locales = $.extend({}, Metro.locales, locale);
        },

        aspectRatioH: (width, a) => {
            if (a === "16/9") return (width * 9) / 16;
            if (a === "21/9") return (width * 9) / 21;
            if (a === "4/3") return (width * 3) / 4;
        },

        aspectRatioW: (height, a) => {
            if (a === "16/9") return (height * 16) / 9;
            if (a === "21/9") return (height * 21) / 9;
            if (a === "4/3") return (height * 4) / 3;
        },

        valueInObject: (obj, value) => Object.values(obj).indexOf(value) > -1,

        keyInObject: (obj, key) => Object.keys(obj).indexOf(key) > -1,

        inObject: (obj, key, val) => obj[key] !== undefined && obj[key] === val,

        newCssSheet: (media) => {
            const style = document.createElement("style");

            if (media !== undefined) {
                style.setAttribute("media", media);
            }

            style.appendChild(document.createTextNode(""));

            document.head.appendChild(style);

            return style.sheet;
        },

        addCssRule: (sheet, selector, rules, index) => {
            sheet.insertRule(`${selector}{${rules}}`, index);
        },

        media: (query) => globalThis.matchMedia(query).matches,

        mediaModes: () => globalThis.METRO_MEDIA,

        mediaExist: (media) => globalThis.METRO_MEDIA.indexOf(media) > -1,

        inMedia: (media) =>
            globalThis.METRO_MEDIA.indexOf(media) > -1 &&
            globalThis.METRO_MEDIA.indexOf(media) === globalThis.METRO_MEDIA.length - 1,

        isValue: (val) => val !== undefined && val !== null && val !== "",

        isNull: (val) => val === undefined || val === null,

        isNegative: (val) => Number.parseFloat(val) < 0,

        isPositive: (val) => Number.parseFloat(val) > 0,

        isZero: (val) => Number.parseFloat(val.toFixed(2)) === 0.0,

        between: (val, bottom, top, equals) =>
            equals === true ? val >= bottom && val <= top : val > bottom && val < top,

        parseMoney: (val) => Number(Number.parseFloat(val.replace(/[^0-9-.]/g, ""))),

        parseCard: (val) => val.replace(/[^0-9]/g, ""),

        parsePhone: (val) => this.parseCard(val),

        parseNumber: (val, thousand, decimal) =>
            val.replace(new RegExp(`\\${thousand}`, "g"), "").replace(new RegExp(`\\${decimal}`, "g"), "."),

        nearest: (val, precision, down) => {
            let _val = val / precision;
            _val = Math[down === true ? "floor" : "ceil"](_val) * precision;
            return _val;
        },

        bool: (value) => {
            switch (value) {
                case true:
                case "true":
                case 1:
                case "1":
                case "on":
                case "yes":
                case "+":
                    return true;
                default:
                    return false;
            }
        },

        decCount: (v) => (v % 1 === 0 ? 0 : v.toString().split(".")[1].length),

        classNames: (...args) => {
            const classes = [];
            for (const a of args) {
                if (!a) continue;
                if (typeof a === "string") {
                    classes.push(a);
                } else if (Metro.utils.isObject(a)) {
                    for (const k in a) {
                        if (a[k]) {
                            classes.push(k);
                        }
                    }
                } else {
                    Metro.utils.nothing();
                }
            }
            return classes.join(" ");
        },

        join: (...values) => {
            const sep = values.pop();
            const classes = [];
            for (const a of values) {
                if (!a) continue;
                classes.push(Metro.utils.isObject(a) ? Object.values(a)[0] : a);
            }
            return classes.join(sep);
        },

        copy2clipboard: (v, cb) => {
            navigator.clipboard.writeText(v).then(() => {
                Metro.utils.exec(cb, [v]);
            });
        },

        getCssVar: (v) => {
            const root = document.documentElement;
            const style = getComputedStyle(root);
            return style.getPropertyValue(v);
        },

        scrollTo: (element, options) => {
            const elem = typeof element === "string" ? $(element)[0] : element;
            elem.scrollIntoView({
                ...options,
                behavior: "smooth",
                block: "start",
            });
        },
    };
})(Metro, Dom);
