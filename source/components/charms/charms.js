((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let CharmsDefaultConfig = {
        charmsDeferred: 0,
        position: "right",
        opacity: 1,
        clsCharms: "",
        onCharmCreate: Metro.noop,
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onToggle: Metro.noop,
    };

    Metro.charmsSetup = (options) => {
        CharmsDefaultConfig = $.extend({}, CharmsDefaultConfig, options);
    };

    if (typeof globalThis.metroCharmsSetup !== "undefined") {
        Metro.charmsSetup(globalThis.metroCharmsSetup);
    }

    Metro.Component("charms", {
        init: function (options, elem) {
            this._super(elem, options, CharmsDefaultConfig, {
                origin: {
                    background: "",
                },
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("charm-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("charms").addClass(`${o.position}-side`).addClass(o.clsCharms);

            this.origin.background = element.css("background-color");

            element.css({
                backgroundColor: Farbe.Routines.toRGBA(Metro.utils.getStyleOne(element, "background-color"), o.opacity),
            });
        },

        _createEvents: () => {},

        open: function () {
            const element = this.element;

            element.addClass("open");

            this._fireEvent("open");
        },

        close: function () {
            const element = this.element;

            element.removeClass("open");

            this._fireEvent("close");
        },

        toggle: function () {
            const element = this.element;

            if (element.hasClass("open") === true) {
                this.close();
            } else {
                this.open();
            }

            this._fireEvent("toggle");
        },

        opacity: function (v) {
            const element = this.element;
            const o = this.options;

            if (v === undefined) {
                return o.opacity;
            }

            const opacity = Math.abs(Number.parseFloat(v));
            if (opacity < 0 || opacity > 1) {
                return;
            }
            o.opacity = opacity;

            element.css({
                backgroundColor: Farbe.Routines.toRGBA(Metro.utils.getStyleOne(element, "background-color"), opacity),
            });
        },

        changeOpacity: function () {
            const element = this.element;
            this.opacity(element.attr("data-opacity"));
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "data-opacity":
                    this.changeOpacity();
                    break;
            }
        },

        destroy: function () {
            return this.element;
        },
    });

    Metro.charms = {
        check: (el) => {
            if (Metro.utils.isMetroObject(el, "charms") === false) {
                console.warn("Element is not a charms component");
                return false;
            }
            return true;
        },

        isOpen: function (el) {
            if (this.check(el) === false) return;
            return $(el).hasClass("open");
        },

        open: function (el) {
            if (this.check(el) === false) return;
            Metro.getPlugin(el, "charms").open();
        },

        close: function (el) {
            if (this.check(el) === false) return;
            Metro.getPlugin(el, "charms").close();
        },

        toggle: function (el) {
            if (this.check(el) === false) return;
            Metro.getPlugin(el, "charms").toggle();
        },

        closeAll: () => {
            $("[data-role*=charms]").each(function () {
                Metro.getPlugin(this, "charms").close();
            });
        },

        opacity: function (el, opacity) {
            if (this.check(el) === false) return;
            Metro.getPlugin(el, "charms").opacity(opacity);
        },
    };
})(Metro, Dom);
