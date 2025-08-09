import { $ } from "@olton/dom";

const normalizeComponentName = (name) => (typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase());

export const Component = (nameName, compObj) => {
    const name = normalizeComponentName(nameName);
    const Utils = Metro.utils;
    const component = $.extend(
        { name: name },
        {
            _super: function (el, options, defaults, setup) {
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
                    $.each(setup, (key, val) => {
                        this[key] = val;
                    });
                }

                this._createExec();
            },

            _setOptionsFromDOM: function () {
                const element = this.element;
                const o = this.options;

                $.each(element.data(), (key, value) => {
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
                const element = this.element;
                let mc;
                const roles = (element.attr("data-role") || "")
                    .toArray(",")
                    .map((v) => normalizeComponentName(v))
                    .filter((v) => v.trim() !== "");

                if (!element.attr(`data-role-${this.name}`)) {
                    element.attr(`data-role-${this.name}`, true);
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
                const timeout = this.options[`${this.name}Deferred`];

                if (timeout) {
                    setTimeout(() => {
                        this._create();
                    }, timeout);
                } else {
                    this._create();
                }
            },

            _fireEvent: function (eventName, data, log, noFire, context = null) {
                const element = this.element;
                const o = this.options;
                const event = str(eventName).camelCase().capitalize(false).value;

                const _data = $.extend({}, data, { __this: element[0] });

                if (log) {
                    console.warn(log);
                    console.warn(`Event: on${event}`);
                    console.warn("Data: ", data);
                    console.warn("Element: ", element[0]);
                }

                if (noFire !== true) element.fire(event.toLowerCase(), data);

                return Utils.exec(o[`on${event}`], Object.values(_data), context ? context : element[0]);
            },

            _fireEvents: function (events, data, log, noFire, context) {
                const that = this;

                if (arguments.length === 0) {
                    return;
                }

                if (arguments.length === 1) {
                    $.each(events, function () {
                        that._fireEvent(this.name, this.data, this.log, this.noFire, context);
                    });

                    return Utils.objectLength(events);
                }

                if (!Array.isArray(events) && typeof events !== "string") {
                    return;
                }

                const _events = Array.isArray(events) ? events : events.toArray(",");
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
                this.strings = $.extend({}, Metro.locales.en, Metro.locales[this.locale]);
            },

            _addLabel: (text, target, { id, dir = "ltr", className } = {}) => {
                if (!text) return;

                const label = $("<label>")
                    .addClass("label-for-input")
                    .addClass(className)
                    .html(text)
                    .insertBefore($(target));
                if (id) {
                    label.attr("for", id);
                }
                if (dir === "rtl") {
                    label.addClass("rtl");
                }
            },

            _setAttributes: (element, attributes) => {
                if (typeof attributes !== "object") return;

                const el = $(element);

                $.each(attributes, (k, v) => {
                    el.attr(Str.dashedName(k), v);
                });
            },

            _waitForRole: async function (role, callback) {
                const element = this.element;
                const _role = normalizeComponentName(role);
                return new Promise((resolve) => {
                    if (element.attr(`data-role-${_role}`)) {
                        resolve(callback());
                    }
                });
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
};
