((Metro, $) => {
    "use strict";

    let CatalogMenuDefaultConfig = {
        toggle: null, // Selector for toggle element
        onCatalogCreate: Metro.noop,
    };

    Metro.catalogMenuSetup = (options) => {
        CatalogMenuDefaultConfig = $.extend({}, CatalogMenuDefaultConfig, options);
    };

    if (typeof window.metroCatalogMenuSetup !== "undefined") {
        Metro.catalogMenuSetup(window.metroCatalogMenuSetup);
    }

    Metro.Component("catalog-menu", {
        init: function (options, elem) {
            this._super(elem, options, CatalogMenuDefaultConfig, {
                // define instance vars here
                toggle: null,
            });
            return this;
        },

        _create: function () {
            this._calcResize();

            this._createStructure();
            this._createEvents();

            this._fireEvent("catalog-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            if (o.toggle) {
                this.toggle = $(o.toggle);
                if (this.toggle.length === 0) {
                    this.toggle = null;
                }
            }

            element.addClass("catalog-menu");
        },

        _createEvents: function () {
            const element = this.element;

            if (this.toggle) {
                this.toggle.on("click", () => {
                    element.toggleClass("menu-active");
                });
            }

            $("window").on("resize.catalog-menu", () => {
                this._calcResize();
            });
        },

        _calcResize: function () {
            const element = this.element;
            const { width } = Metro.utils.getInnerSize(element.parent());

            element.cssVar("catalog-content-width", width + "px");
        },

        changeAttribute: (attr, val) => {},

        destroy: function () {
            $("window").off("resize.catalog-menu");
            this.element.remove();
        },
    });
})(Metro, Dom);
