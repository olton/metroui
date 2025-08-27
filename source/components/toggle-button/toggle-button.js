((Metro, $) => {
    "use strict";

    let ToggleButtonDefaultConfig = {
        onChange: Metro.noop,
        onButtonClick: Metro.noop,
        onToggleButtonCreate: Metro.noop,
    };

    Metro.toggleButtonSetup = (options) => {
        ToggleButtonDefaultConfig = $.extend({}, ToggleButtonDefaultConfig, options);
    };

    if (typeof window.metroToggleButtonSetup !== "undefined") {
        Metro.toggleButtonSetup(window.metroToggleButtonSetup);
    }

    Metro.Component("toggle-button", {
        init: function (options, elem) {
            this._super(elem, options, ToggleButtonDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("toggle-buttons-create");
        },

        _createStructure: function () {
            const element = this.element;

            element.addClass("toggle-button");

            const buttons = element.children("button.active");
            if (buttons.length === 0) {
                element.children("button").first().addClass("active");
            }
            if (buttons.length > 1) {
                buttons.removeClass("active");
                buttons.first().addClass("active");
            }
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on("click", "button", function () {
                const toggleButton = $(this);

                that._fireEvent("button-click", { button: toggleButton });

                if (toggleButton.hasClass("active")) {
                    return;
                }

                element.find("button").removeClass("active");
                toggleButton.addClass("active");

                that._fireEvent("change", { button: toggleButton });
            });
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
