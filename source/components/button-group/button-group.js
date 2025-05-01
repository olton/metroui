((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let ButtonGroupDefaultConfig = {
        buttongroupDeferred: 0,
        targets: "button",
        clsActive: "",
        requiredButton: false,
        mode: Metro.groupMode.ONE,
        onButtonClick: Metro.noop,
        onButtonGroupCreate: Metro.noop,
    };

    Metro.buttonGroupSetup = (options) => {
        ButtonGroupDefaultConfig = $.extend({}, ButtonGroupDefaultConfig, options);
    };

    if (typeof globalThis.metroButtonGroupSetup !== "undefined") {
        Metro.buttonGroupSetup(globalThis.metroButtonGroupSetup);
    }

    Metro.Component("button-group", {
        init: function (options, elem) {
            this._super(elem, options, ButtonGroupDefaultConfig, {
                active: null,
                id: Metro.utils.elementId("button-group"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createGroup();
            this._createEvents();

            this._fireEvent("button-group-create", {
                element: element,
            });
        },

        _createGroup: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("button-group");

            const buttons = element.find(o.targets);
            const buttons_active = element.find(".active");

            if (o.mode === Metro.groupMode.ONE && buttons_active.length === 0 && o.requiredButton === true) {
                $(buttons[0]).addClass("active");
            }

            if (o.mode === Metro.groupMode.ONE && buttons_active.length > 1) {
                buttons.removeClass("active").removeClass(o.clsActive);
                $(buttons[0]).addClass("active");
            }

            element.find(".active").addClass("js-active").addClass(o.clsActive);
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.click, o.targets, function () {
                const el = $(this);

                that._fireEvent("button-click", {
                    button: this,
                });

                if (o.mode === Metro.groupMode.ONE && el.hasClass("active")) {
                    return;
                }

                if (o.mode === Metro.groupMode.ONE) {
                    element.find(o.targets).removeClass(o.clsActive).removeClass("active js-active");
                    el.addClass("active").addClass(o.clsActive).addClass("js-active");
                } else {
                    el.toggleClass("active").toggleClass(o.clsActive).toggleClass("js-active");
                }
            });
        },

        changeAttribute: (attributeName) => {},

        destroy: function () {
            const element = this.element;
            const o = this.options;
            element.off(Metro.events.click, o.targets);
            element.remove();
        },
    });
})(Metro, Dom);
