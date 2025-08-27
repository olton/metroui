((Metro, $) => {
    "use strict";

    let Bar3dDefaultConfig = {
        height: 200,
        barColor: "#22ec1a",
        valueColor: "#191919",
        total: 100,
        value: 60,
        valueSuffix: "",
        animationDuration: 300,
        onBar3dCreate: Metro.noop,
    };

    Metro.bar3dSetup = (options) => {
        Bar3dDefaultConfig = $.extend({}, Bar3dDefaultConfig, options);
    };

    if (typeof window.metroBar3dSetup !== "undefined") {
        Metro.bar3dSetup(window.metroBar3dSetup);
    }

    Metro.Component("bar3d", {
        init: function (options, elem) {
            this._super(elem, options, Bar3dDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("component-create");
        },

        _drawBar: function () {
            const element = this.element;
            const o = this.options;

            const displayValue = o.value + o.valueSuffix;
            const barValue = 100 - Math.round((100 * o.value) / o.total);

            element
                .find(".growing-bar")
                .attr("data-value", displayValue)
                .css({
                    transform: `translateY(${barValue}%)`,
                    backgroundColor: o.barColor,
                });

            element.attr("title", displayValue);
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("bar3d");
            element.html(`
                <div class="side left-side">
                    <div class="growing-bar" data-value="0" style="transition-duration: ${o.animationDuration}"></div>
                </div>
                <div class="side right-side">
                    <div class="growing-bar" data-value="0" style="transition-duration: ${o.animationDuration}"></div>
                </div>
                <div class="side top-side"></div>
                <div class="side bottom-side"></div>
            `);

            if (o.animationDuration > 0) {
                setTimeout(() => {
                    this._drawBar();
                }, 100);
            } else {
                this._drawBar();
            }
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
        },

        changeAttribute: function (attr, newValue) {
            switch (attr) {
                case "data-value": {
                    this.options.value = newValue;
                    this._drawBar();
                    break;
                }
            }
        },

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
