((Metro, $) => {
    let HoverBoxDefaultConfig = {
        onHoverBoxCreate: Metro.noop,
    };

    Metro.hoverBoxSetup = (options) => {
        HoverBoxDefaultConfig = $.extend({}, HoverBoxDefaultConfig, options);
    };

    if (typeof window.metroHoverBoxSetup !== "undefined") {
        Metro.hoverBoxSetup(window.metroHoverBoxSetup);
    }

    Metro.Component("hoverbox", {
        init: function (options, elem) {
            this._super(elem, options, HoverBoxDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("hover-box-create");
        },

        _createStructure: function () {
            const element = this.element;

            element.addClass("hover-box");
            element.cssVar("size", `${element.height() / 2}px`);
        },

        _createEvents: function () {
            const element = this.element;
            element.on(Metro.events.move, (e) => {
                const rect = element[0].getBoundingClientRect();
                const x = e.pageX - (rect.left + window.scrollX);
                const y = e.pageY - (rect.top + window.scrollY);

                element.cssVar("x", `${Math.round(x)}px`).cssVar("y", `${Math.round(y)}px`);
            });
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
