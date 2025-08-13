((Metro, $) => {
    let LinkedBlockDefaultConfig = {
        onLinkedBlockCreate: Metro.noop,
    };

    Metro.linkedBlockSetup = (options) => {
        LinkedBlockDefaultConfig = $.extend({}, LinkedBlockDefaultConfig, options);
    };

    if (typeof window.metroLinkedBlockSetup !== "undefined") {
        Metro.linkedBlockSetup(window.metroLinkedBlockSetup);
    }

    Metro.Component("linked-block", {
        init: function (options, elem) {
            this._super(elem, options, LinkedBlockDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent("component-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
