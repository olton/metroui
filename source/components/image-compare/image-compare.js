((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let ImageCompareDefaultConfig = {
        imageCompareDeferred: 0,
        width: "100%",
        height: "auto",
        onSliderMove: Metro.noop,
        onImageCompareCreate: Metro.noop,
    };

    Metro.imageCompareSetup = (options) => {
        ImageCompareDefaultConfig = $.extend({}, ImageCompareDefaultConfig, options);
    };

    if (typeof globalThis.metroImageCompareSetup !== "undefined") {
        Metro.imageCompareSetup(globalThis.metroImageCompareSetup);
    }

    Metro.Component("image-compare", {
        init: function (options, elem) {
            this._super(elem, options, ImageCompareDefaultConfig, {
                id: Metro.utils.elementId("image-compare"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("image-compare-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            let element_width;
            let element_height;

            if (!Metro.utils.isValue(element.attr("id"))) {
                element.attr("id", Metro.utils.elementId("image-compare"));
            }

            element.addClass("image-compare").css({
                width: o.width,
            });

            element_width = element.width();

            switch (o.height) {
                case "16/9":
                    element_height = Metro.utils.aspectRatioH(element_width, o.height);
                    break;
                case "21/9":
                    element_height = Metro.utils.aspectRatioH(element_width, o.height);
                    break;
                case "4/3":
                    element_height = Metro.utils.aspectRatioH(element_width, o.height);
                    break;
                case "auto":
                    element_height = Metro.utils.aspectRatioH(element_width, "16/9");
                    break;
                default:
                    element_height = o.height;
            }

            element.css({
                height: element_height,
            });

            const container = $("<div>").addClass("image-container").appendTo(element);
            const container_overlay = $("<div>")
                .addClass("image-container-overlay")
                .appendTo(element)
                .css({
                    width: element_width / 2,
                });
            const slider = $("<div>").addClass("image-slider").appendTo(element);
            slider.css({
                top: element_height / 2 - slider.height() / 2,
                left: element_width / 2 - slider.width() / 2,
            });

            const images = element.find("img");
            $.each(images, function (i) {
                const img = $("<div>").addClass("image-wrapper");
                img.css({
                    width: element_width,
                    height: element_height,
                    backgroundImage: `url(${this.src})`,
                });
                img.appendTo(i === 0 ? container : container_overlay);
            });
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            const overlay = element.find(".image-container-overlay");
            const slider = element.find(".image-slider");

            slider.on(Metro.events.startAll, () => {
                const w = element.width();
                $(document).on(
                    Metro.events.moveAll,
                    (e) => {
                        let x = Metro.utils.getCursorPositionX(element[0], e);
                        if (x < 0) x = 0;
                        if (x > w) x = w;
                        overlay.css({
                            width: x,
                        });
                        const left_pos = x - slider.width() / 2;
                        slider.css({
                            left: left_pos,
                        });

                        this._fireEvent("slider-move", {
                            x: x,
                            l: left_pos,
                        });
                    },
                    { ns: this.id },
                );

                $(document).on(
                    Metro.events.stopAll,
                    () => {
                        $(document).off(Metro.events.moveAll, { ns: this.id });
                        $(document).off(Metro.events.stopAll, { ns: this.id });
                    },
                    { ns: this.id },
                );
            });

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    const element_width = element.width();
                    let element_height;

                    if (o.width !== "100%") {
                        return;
                    }

                    switch (o.height) {
                        case "16/9":
                            element_height = Metro.utils.aspectRatioH(element_width, o.height);
                            break;
                        case "21/9":
                            element_height = Metro.utils.aspectRatioH(element_width, o.height);
                            break;
                        case "4/3":
                            element_height = Metro.utils.aspectRatioH(element_width, o.height);
                            break;
                        case "auto":
                            element_height = Metro.utils.aspectRatioH(element_width, "16/9");
                            break;
                        default:
                            element_height = o.height;
                    }

                    element.css({
                        height: element_height,
                    });

                    $.each(element.find(".image-wrapper"), function () {
                        $(this).css({
                            width: element_width,
                            height: element_height,
                        });
                    });

                    element.find(".image-container-overlay").css({
                        width: element_width / 2,
                    });

                    slider.css({
                        top: element_height / 2 - slider.height() / 2,
                        left: element_width / 2 - slider.width() / 2,
                    });
                },
                { ns: this.id },
            );
        },

        changeAttribute: (attr, val) => {},

        destroy: function () {
            const element = this.element;

            element.off(Metro.events.start);
            $(globalThis).off(Metro.events.resize, { ns: this.id });

            element.remove();
        },
    });
})(Metro, Dom);
