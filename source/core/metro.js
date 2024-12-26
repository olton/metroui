/** @format */
import {Props} from "./props.js";

(function () {
    "use strict";

    var $ = m4q;

    if (typeof m4q === "undefined") {
        throw new Error("Metro UI requires m4q helper!");
    }

    if (!("MutationObserver" in window)) {
        throw new Error("Metro UI requires MutationObserver!");
    }

    var isTouch = "ontouchstart" in window || navigator["MaxTouchPoints"] > 0 || navigator["msMaxTouchPoints"] > 0;

    var normalizeComponentName = function (name) {
        return typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase();
    };

    var Metro = {
        version: "__VERSION__",
        build_time: "__BUILD_TIME__",
        buildNumber: 0,
        isTouchable: isTouch,
        fullScreenEnabled: document.fullscreenEnabled,
        sheet: null,
        
        hotkeys: {},
        locales: {},
        utils: {},
        colors: {},
        dialog: null,
        pagination: null,
        md5: null,
        storage: null,
        export: null,
        animations: null,
        cookie: null,
        template: null,
        defaults: {},

        info: function () {
            if (typeof globalThis["METRO_LIB_INFO"] !== "undefined") {
                Metro.welcome()
            }
        },

        welcome: function () {
            console.info(
                `%c METRO UI %c v${Metro.version} %c ${Metro.build_time} `,
                "color: pink; font-weight: bold; background: #800000",
                "color: white; background: darkgreen",
                "color: white; background: #0080fe;",
            );

            if (globalThis.$ && $.info) $.info();
            if (globalThis.Hooks && Hooks.info) Hooks.info();
            if (globalThis.html && html.info) html.info();
            if (globalThis.Animation && Animation.info) Animation.info();
            if (globalThis.Farbe && Farbe.info) Farbe.info();
            if (globalThis.Datetime && Datetime.info) Datetime.info();
            if (globalThis.Str && Str.info) Str.info();
            if (globalThis.G && G.info) G.info();
        },

        aboutDlg: function () {
            alert("Metro UI - v" + Metro.version);
        },

        observe: function () {
            var observer, observerCallback;
            var observerConfig = {
                childList: true,
                attributes: true,
                subtree: true,
            };
            observerCallback = function (mutations) {
                mutations.map(function (mutation) {
                    if (mutation.type === "attributes" && mutation.attributeName !== "data-role") {
                        if (mutation.attributeName === "data-hotkey") {
                            Metro.initHotkeys([mutation.target], true);
                        } else {
                            var element = $(mutation.target);
                            var mc = element.data("metroComponent");
                            var attr = mutation.attributeName,
                                newValue = element.attr(attr),
                                oldValue = mutation.oldValue;

                            if (mc !== undefined) {
                                element.fire("attr-change", {
                                    attr: attr,
                                    newValue: newValue,
                                    oldValue: oldValue,
                                    __this: element[0],
                                });

                                $.each(mc, function () {
                                    var plug = Metro.getPlugin(element, this);
                                    if (plug && typeof plug.changeAttribute === "function") {
                                        plug.changeAttribute(attr, newValue, oldValue);
                                    }
                                });
                            }
                        }
                    } else if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        var i,
                            widgets = [];
                        var $node,
                            node,
                            nodes = mutation.addedNodes;

                        if (nodes.length) {
                            for (i = 0; i < nodes.length; i++) {
                                node = nodes[i];
                                $node = $(node);

                                if ($node.attr("data-role") !== undefined) {
                                    widgets.push(node);
                                }

                                $.each($node.find("[data-role]"), function () {
                                    var o = this;
                                    if (widgets.indexOf(o) !== -1) {
                                        return;
                                    }
                                    widgets.push(o);
                                });
                            }

                            if (widgets.length) Metro.initWidgets(widgets, "observe");
                        }
                    } else {
                        //console.log(mutation);
                    }
                });
            };
            observer = new MutationObserver(observerCallback);
            observer.observe($("html")[0], observerConfig);
        },

        init: function () {
            var widgets = $("[data-role]");
            var hotkeys = $("[data-hotkey]");
            var html = $("html");

            Metro.i18n.load(html.attr("lang"));

            if (globalThis.METRO_BLUR_IMAGE) {
                html.addClass("use-blur-image");
            }

            if (globalThis.METRO_SHOW_INFO) {
                Metro.info(true);
            }

            if (isTouch === true) {
                html.addClass("touchable-device");
            }

            Metro.sheet = Metro.utils.newCssSheet();

            Metro.utils.addCssRule(Metro.sheet, "*, *::before, *::after", "box-sizing: border-box;");

            globalThis.METRO_MEDIA = [];
            $.each(Metro.media_queries, function (key, query) {
                if (Metro.utils.media(query)) {
                    globalThis.METRO_MEDIA.push(Metro.media_mode[key]);
                }
            });

            Metro.observe();

            Metro.initHotkeys(hotkeys);
            Metro.initWidgets(widgets, "init");

            if (globalThis.METRO_CLOAK_REMOVE !== "fade") {
                $(".m4-cloak").removeClass("m4-cloak");
                $(".cloak").removeClass("cloak");
                $(globalThis).fire("metro-initiated");
            } else {
                $(".m4-cloak, .cloak").animate({
                    draw: {
                        opacity: [0, 1],
                    },
                    dur: 300,
                    onDone: function () {
                        $(".m4-cloak").removeClass("m4-cloak");
                        $(".cloak").removeClass("cloak");
                        $(globalThis).fire("metro-initiated");
                    },
                });
            }

            $(document).on("click", "[data-copy-to-clipboard]", function (e) {
                const val = $(this).attr("data-copy-to-clipboard");
                Metro.utils.copy2clipboard(val);
                if (Metro.toast) {
                    Metro.toast.create(`Data copied to clipboard!`);
                }
            });

            if (METRO_SMOOTH_SCROLL) {
                const smoothLinks = document.querySelectorAll('a.smooth-scroll[href^="#"]');
                for (let smoothLink of smoothLinks) {
                    smoothLink.addEventListener("click", function (e) {
                        e.preventDefault();
                        const id = smoothLink.getAttribute("href");

                        document.querySelector(id).scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    });
                }
            }
        },

        initHotkeys: function (hotkeys, redefine) {
            $.each(hotkeys, function () {
                var element = $(this);
                var hotkey = element.attr("data-hotkey") ? element.attr("data-hotkey").toLowerCase() : false;
                var fn = element.attr("data-hotkey-func") ? element.attr("data-hotkey-func") : false;

                if (hotkey === false) {
                    return;
                }

                if (element.data("hotKeyBonded") === true && redefine !== true) {
                    return;
                }

                Metro.hotkeys[hotkey] = [this, fn];
                element.data("hotKeyBonded", true);
                element.fire("hot-key-bonded", {
                    __this: element[0],
                    hotkey: hotkey,
                    fn: fn,
                });
            });
        },

        initWidgets: function (widgets) {
            var that = this;

            $.each(widgets, function () {
                var $this = $(this),
                    roles;

                if (!this.hasAttribute("data-role")) {
                    return;
                }

                roles = $this.attr("data-role").split(/\s*,\s*/);

                roles.map(function (func) {
                    var $$ = Metro.utils.$();
                    var _func = normalizeComponentName(func);

                    if ($$.fn[_func] !== undefined && $this.attr("data-role-" + _func) === undefined) {
                        try {
                            $$.fn[_func].call($this);
                            $this.attr("data-role-" + _func, true);

                            var mc = $this.data("metroComponent");

                            if (mc === undefined) {
                                mc = [_func];
                            } else {
                                mc.push(_func);
                            }
                            $this.data("metroComponent", mc);

                            $this.fire("create", {
                                __this: $this[0],
                                name: _func,
                            });
                            $(document).fire("component-create", {
                                element: $this[0],
                                name: _func,
                            });
                        } catch (e) {
                            console.error("Error creating component " + func + " for ", $this[0]);
                            throw e;
                        }
                    }
                });
            });

            Metro.i18n.updateUI();
        },

        plugin: function (name, object) {
            var _name = normalizeComponentName(name);

            var register = function ($) {
                $.fn[_name] = function (options) {
                    return this.each(function () {
                        $.data(this, _name, Object.create(object).init(options, this));
                    });
                };
            };

            register(m4q);

            if (globalThis.useJQuery) {
                register(jQuery);
            }
        },

        pluginExists: function (name) {
            var $ = globalThis.useJQuery ? jQuery : m4q;
            return typeof $.fn[normalizeComponentName(name)] === "function";
        },

        destroyPlugin: function (element, name) {
            var p, mc;
            var el = $(element);
            var _name = normalizeComponentName(name);

            p = Metro.getPlugin(el, _name);

            if (typeof p === "undefined") {
                console.warn("Component " + name + " can not be destroyed: the element is not a Metro UI component.");
                return;
            }

            if (typeof p["destroy"] !== "function") {
                console.warn("Component " + name + " can not be destroyed: method destroy not found.");
                return;
            }

            p["destroy"]();
            mc = el.data("metroComponent");
            Metro.utils.arrayDelete(mc, _name);
            el.data("metroComponent", mc);
            $.removeData(el[0], _name);
            el.removeAttr("data-role-" + _name);
        },

        destroyPluginAll: function (element) {
            var el = $(element);
            var mc = el.data("metroComponent");

            if (mc !== undefined && mc.length > 0)
                $.each(mc, function () {
                    Metro.destroyPlugin(el[0], this);
                });
        },

        noop: function () {},
        noop_true: function () {
            return true;
        },
        noop_false: function () {
            return false;
        },
        noop_arg: function (a) {
            return a;
        },

        requestFullScreen: function (element) {
            if (element["mozRequestFullScreen"]) {
                element["mozRequestFullScreen"]();
            } else if (element["webkitRequestFullScreen"]) {
                element["webkitRequestFullScreen"]();
            } else if (element["msRequestFullscreen"]) {
                element["msRequestFullscreen"]();
            } else {
                element.requestFullscreen().catch(function (err) {
                    console.warn("Error attempting to enable full-screen mode: " + err.message + " " + err.name);
                });
            }
        },

        exitFullScreen: function () {
            if (document["mozCancelFullScreen"]) {
                document["mozCancelFullScreen"]();
            } else if (document["webkitCancelFullScreen"]) {
                document["webkitCancelFullScreen"]();
            } else if (document["msExitFullscreen"]) {
                document["msExitFullscreen"]();
            } else {
                document.exitFullscreen().catch(function (err) {
                    console.warn("Error attempting to disable full-screen mode: " + err.message + " " + err.name);
                });
            }
        },

        inFullScreen: function () {
            var fsm = document.fullscreenElement || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"];
            return fsm !== undefined;
        },

        $: function () {
            return globalThis.useJQuery ? jQuery : m4q;
        },

        get$el: function (el) {
            return Metro.$()($(el)[0]);
        },

        get$elements: function (el) {
            return Metro.$()($(el));
        },

        // TODO add if name is not defined, return one or array of plugins
        getPlugin: function (el, name) {
            var _name = normalizeComponentName(name);
            var $el = Metro.get$el(el);
            return $el.length ? $el.data(_name) : undefined;
        },

        makePlugin: function (el, name, options) {
            var _name = normalizeComponentName(name);
            var $el = Metro.get$elements(el);
            return $el.length && typeof $el[_name] === "function" ? $el[_name](options) : undefined;
        },

        Component: function (nameName, compObj) {
            var name = normalizeComponentName(nameName);
            var Utils = Metro.utils;
            var component = $.extend(
                { name: name },
                {
                    _super: function (el, options, defaults, setup) {
                        var self = this;

                        this.elem = el;
                        this.element = $(el);
                        this.options = $.extend({}, defaults, options);
                        this.component = this.elem;
                        this.locale = "en";
                        this.strings = {};

                        this._setOptionsFromDOM();
                        this._runtime();
                        this._setLocale();

                        if (setup && typeof setup === "object") {
                            $.each(setup, function (key, val) {
                                self[key] = val;
                            });
                        }

                        this._createExec();
                    },

                    _setOptionsFromDOM: function () {
                        var element = this.element,
                            o = this.options;

                        $.each(element.data(), function (key, value) {
                            if (key in o) {
                                try {
                                    o[key] = JSON.parse(value);
                                } catch (e) {
                                    o[key] = value;
                                }
                            }
                        });
                    },

                    _runtime: function () {
                        var element = this.element,
                            mc;
                        var roles = (element.attr("data-role") || "")
                            .toArray(",")
                            .map(function (v) {
                                return normalizeComponentName(v);
                            })
                            .filter(function (v) {
                                return v.trim() !== "";
                            });

                        if (!element.attr("data-role-" + this.name)) {
                            element.attr("data-role-" + this.name, true);
                            if (roles.indexOf(this.name) === -1) {
                                roles.push(this.name);
                                element.attr("data-role", roles.join(","));
                            }

                            mc = element.data("metroComponent");
                            if (mc === undefined) {
                                mc = [this.name];
                            } else {
                                mc.push(this.name);
                            }
                            element.data("metroComponent", mc);
                        }
                    },

                    _createExec: function () {
                        var that = this,
                            timeout = this.options[this.name + "Deferred"];

                        if (timeout) {
                            setTimeout(function () {
                                that._create();
                            }, timeout);
                        } else {
                            that._create();
                        }
                    },

                    _fireEvent: function (eventName, data, log, noFire, context = null) {
                        var element = this.element,
                            o = this.options;
                        var _data;
                        var event = str(eventName).camelCase().capitalize(false).value;

                        data = $.extend({}, data, { __this: element[0] });

                        _data = data ? Object.values(data) : {};

                        if (log) {
                            console.warn(log);
                            console.warn("Event: " + "on" + event);
                            console.warn("Data: ", data);
                            console.warn("Element: ", element[0]);
                        }

                        if (noFire !== true) element.fire(event.toLowerCase(), data);

                        return Utils.exec(o["on" + event], _data, context ? context : element[0]);
                    },

                    _fireEvents: function (events, data, log, noFire, context) {
                        var that = this,
                            _events;

                        if (arguments.length === 0) {
                            return;
                        }

                        if (arguments.length === 1) {
                            $.each(events, function () {
                                var ev = this;
                                that._fireEvent(ev.name, ev.data, ev.log, ev.noFire, context);
                            });

                            return Utils.objectLength(events);
                        }

                        if (!Array.isArray(events) && typeof events !== "string") {
                            return;
                        }

                        _events = Array.isArray(events) ? events : events.toArray(",");

                        $.each(_events, function () {
                            that._fireEvent(this, data, log, noFire, context);
                        });
                    },

                    _setLocale: function () {
                        const lang = this.element.closest("[lang]");
                        if (lang.length > 0) {
                            this.locale = lang.attr("lang");
                        } else {
                            this.locale = $("html").attr("lang") || "en";
                        }
                        this.strings = $.extend({}, Metro.locales["en"], Metro.locales[this.locale]);
                    },

                    getComponent: function () {
                        return this.component;
                    },

                    getComponentName: function () {
                        return this.name;
                    },
                },
                compObj,
            );

            Metro.plugin(name, component);

            return component;
        },

        fetch: {
            status: function (response) {
                return response.ok ? Promise.resolve(response) : Promise.reject(new Error(response.statusText));
            },

            json: function (response) {
                return response.json();
            },

            text: function (response) {
                return response.text();
            },

            form: function (response) {
                return response.formData();
            },

            blob: function (response) {
                return response.blob();
            },

            buffer: function (response) {
                return response.arrayBuffer();
            },
        },

        i18n: {
            load(lang = "en") {
                Metro.locale = Metro.locales[lang];
            },

            add(id, data) {
                Metro.locales[id] = data;
            },

            get(key, locale) {
                return Metro.locales[locale][key] || "";
            },

            updateUI(from = document, locale = "en") {
                from.querySelectorAll("[data-i18n]").forEach((el) => {
                    const key = el.getAttribute("data-i18n");
                    el.innerHTML = Metro.i18n.get(key, (locale = "en"));
                });
            },
        },
    };

    Object.assign(Metro,  Props)

    $(globalThis).on(Metro.events.resize, function () {
        globalThis.METRO_MEDIA = [];
        $.each(Metro.media_queries, function (key, query) {
            if (Metro.utils.media(query)) {
                globalThis.METRO_MEDIA.push(Metro.media_mode[key]);
            }
        });
    });

    globalThis.Metro = Metro;

    if (globalThis.METRO_INIT === true) {
        $(function () {
            Metro.init();
        });
    }
    
    return Metro;
})();
