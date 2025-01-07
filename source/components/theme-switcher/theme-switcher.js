/** @format */

(function (Metro, $) {
    "use strict";

    var ThemeSwitcherDefaultConfig = {
        state: Metro.theme.LIGHT,
        target: "html",
        saveState: true,
        saveStateKey: "THEME:SWITCHER",
        clsDark: "",
        darkSymbol: "🌙",
        lightSymbol: "🌞",
        mode: "switch",
        onThemeSwitcherCreate: Metro.noop,
        onChangeTheme: Metro.noop,
    };

    Metro.themeSwitcherSetup = function (options) {
        ThemeSwitcherDefaultConfig = $.extend({}, ThemeSwitcherDefaultConfig, options);
    };

    if (typeof globalThis["metroThemeSwitcherSetup"] !== undefined) {
        Metro.themeSwitcherSetup(globalThis["metroThemeSwitcherSetup"]);
    }

    Metro.Component("theme-switcher", {
        init: function (options, elem) {
            this._super(elem, options, ThemeSwitcherDefaultConfig, {
                container: null,
                state: null,
                target: null,
            });
            this.state = this.options.state;
            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("theme-switcher-create");
        },

        _createStructure: function () {
            const element = this.element,
                o = this.options;
            let initState = "light";

            if (o.saveState) {
                initState = Metro.storage.getItem(o.saveStateKey, false);
            }

            element.attr("data-light-symbol", o.lightSymbol);
            element.attr("data-dark-symbol", o.darkSymbol);

            Metro.makePlugin(element, "switch");
            
            this.container = element.wrap($("<label>").addClass("theme-switcher"));
            this.container.addClass(`mode-${o.mode}`);

            this.target = $(o.target);
            if (this.target.length === 0) {
                this.target = $("html");
            }

            this._setState(o.saveState ? initState : o.state === Metro.theme.DARK);
            this._updateState();
        },

        _createEvents: function () {
            this.container.on("click", () => {
                this._updateState();
            });

            this._observeClass();
        },

        _observeClass: function () {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "attributes") {
                        if (mutation.attributeName === "class") {
                            this.elem.checked = this.target[0].classList.contains("dark-side");
                        }
                    }
                });
            });
            observer.observe(this.target[0], {
                attributes: true,
                attributeFilter: ["class"],
            });
        },

        _setState: function (state = false) {
            this.elem.checked = state;
        },

        _updateState: function () {
            const usingMeta = $.meta("metro:theme").length > 0
            const o = this.options,
                elem = this.elem,
                target = this.target;

            if (usingMeta) {
                return
            }
            
            if (elem.checked) {
                target.addClass("dark-side").addClass(this.options.clsDark);
            } else {
                target.removeClass("dark-side").addClass(this.options.clsDark);
            }

            if (o.saveState) {
                Metro.storage.setItem(o.saveStateKey, elem.checked);
            }

            this._fireEvent("change-theme", { state: elem.checked });
        },

        val: function (value) {
            if (typeof value === undefined) {
                return this.elem.checked ? Metro.theme.DARK : Metro.theme.LIGHT;
            }
            this._setState(typeof value === "boolean" ? value : value === Metro.theme.DARK);
            this._updateState();
        },

        changeAttribute: function (attr, newValue) {
            if (attr === "data-target") {
                this.target = $(newValue);
                this._updateState();
            }
        },

        destroy: function () {
            this.container.remove();
        },
    });
})(Metro, m4q);
