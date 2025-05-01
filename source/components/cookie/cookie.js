((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let CookieDefaultConfig = {
        path: "/",
        expires: null,
        maxAge: null,
        domain: null,
        secure: false,
        samesite: null,
    };

    Metro.cookieSetup = (options) => {
        CookieDefaultConfig = $.extend({}, CookieDefaultConfig, options);
    };

    if (typeof globalThis.metroCookieSetup !== "undefined") {
        Metro.cookieSetup(globalThis.metroCookieSetup);
    }

    Metro.cookie = {
        getCookies: () => {
            const a = document.cookie.toArray(";");
            const o = {};
            $.each(a, function () {
                const i = this.split("=");
                o[i[0]] = i[1];
            });
            return o;
        },

        getCookie: (name) => {
            const cookieName = `${encodeURIComponent(name)}=`;
            const cookies = document.cookie.toArray(";");
            let i;
            let cookie;

            for (i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                while (cookie.charAt(0) === " ") {
                    cookie = cookie.substring(1, cookie.length);
                }
                if (cookie.indexOf(cookieName) === 0) {
                    return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
                }
            }
            return null;
        },

        setCookie: (name, value, options) => {
            let date;
            const cookieName = encodeURIComponent(name);
            const cookieValue = encodeURIComponent(value);
            let opt;
            const a = [];

            if (options && typeof options !== "object") {
                date = new Date();
                date.setTime(date.getTime() + Number.parseInt(options));
                opt = $.extend({}, CookieDefaultConfig, {
                    expires: date.toUTCString(),
                });
            } else {
                opt = $.extend({}, CookieDefaultConfig, options);
            }

            $.each(opt, (key, val) => {
                if (key !== "secure" && val) {
                    a.push(`${Str.dashedName(key)}=${val}`);
                }
                if (key === "secure" && val === true) {
                    a.push("secure");
                }
            });

            document.cookie = `${cookieName}=${cookieValue}; ${a.join("; ")}`;
        },

        delCookie: function (name) {
            this.setCookie(name, false, {
                maxAge: -1,
            });
        },
    };
})(Metro, Dom);
