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
                pointCount: 0,
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent("linked-block-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            if (!element.id()) {
                element.id(Hooks.useId(element[0]));
            }

            element.addClass("linked-block");

            const sides = ["north-side", "east-side", "south-side", "west-side"];
            sides.forEach((side) => {
                element.append($("<div>").addClass(`side ${side}`));
            });
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
        },

        addPoint(side) {
            const element = this.element;
            const point = $(`<div>`)
                .addClass("link-point")
                .id(`${element.id()}_${this.pointCount++}`);
            const sideElement = element.find(`.${side}-side`);
            sideElement.append(point);
        },

        changeAttribute: (attr, val) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
