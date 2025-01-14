/* global Metro, Cake */
(function(Metro, $) {
    'use strict';
    var CookieDefaultConfig = {
        path: "/",
        expires: null,
        maxAge: null,
        domain: null,
        secure: false,
        samesite: null
    }

    Metro.cookieSetup = function (options) {
        CookieDefaultConfig = $.extend({}, CookieDefaultConfig, options);
    };

    if (typeof globalThis["metroCookieSetup"] !== undefined) {
        Metro.cookieSetup(globalThis["metroCookieSetup"]);
    }

    Metro.cookie = {
        getCookies: function(){
            var a = document.cookie.toArray(";");
            var o = {};
            $.each(a, function(){
                var i = this.split('=');
                o[i[0]] = i[1];
            });
            return o;
        },

        getCookie: function(name){
            var cookieName = encodeURIComponent(name) + "=";
            var cookies = document.cookie.toArray(";");
            var i, cookie;

            for(i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }
                if (cookie.indexOf(cookieName) === 0) {
                    return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
                }
            }
            return null;
        },

        setCookie: function(name, value, options){
            var date;
            var cookieName = encodeURIComponent(name);
            var cookieValue = encodeURIComponent(value);
            var opt, a = [];

            if (options && typeof options !== "object") {
                date = new Date();
                date.setTime(date.getTime()+(parseInt(options)));
                opt = $.extend({}, CookieDefaultConfig, {
                    expires: date.toUTCString()
                });
            } else {
                opt = $.extend({}, CookieDefaultConfig, options);
            }

            $.each(opt, function(key, val){
                if (key !== 'secure' && val) {
                    a.push(Str.dashedName(key) + "=" + val);
                }
                if (key === 'secure' && val === true) {
                    a.push( "secure" );
                }
            });

            document.cookie = cookieName + '=' + cookieValue + "; " +  a.join("; ");
        },

        delCookie: function(name){
            this.setCookie(name, false, {
                maxAge: -1
            });
        }
    };
}(Metro, Dom));