((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let ImageMagnifierDefaultConfig = {
        imageMagnifierDeferred: 0,
        width: "100%",
        height: "auto",
        lensSize: 100,
        lensType: "square", // square, circle
        magnifierZoom: 2,
        magnifierMode: "glass", // glass, zoom
        magnifierZoomElement: null,

        clsMagnifier: "",
        clsLens: "",
        clsZoom: "",

        onMagnifierMove: Metro.noop,
        onImageMagnifierCreate: Metro.noop,
    };

    Metro.imageMagnifierSetup = (options) => {
        ImageMagnifierDefaultConfig = $.extend({}, ImageMagnifierDefaultConfig, options);
    };

    if (typeof globalThis.metroImageMagnifierSetup !== "undefined") {
        Metro.imageMagnifierSetup(globalThis.metroImageMagnifierSetup);
    }

    Metro.Component("image-magnifier", {
        init: function (options, elem) {
            this._super(elem, options, ImageMagnifierDefaultConfig, {
                zoomElement: null,
                id: Metro.utils.elementId("image-magnifier"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("image-magnifier-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            let magnifier;
            let element_width;
            let element_height;
            const image = element.find("img");

            if (image.length === 0) {
                throw new Error("Image not defined");
            }

            if (!Metro.utils.isValue(element.attr("id"))) {
                element.attr("id", Metro.utils.elementId("image-magnifier"));
            }

            element
                .addClass("image-magnifier")
                .css({
                    width: o.width,
                })
                .addClass(o.clsMagnifier);

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

            const x = element_width / 2 - o.lensSize / 2;
            const y = element_height / 2 - o.lensSize / 2;

            if (o.magnifierMode === "glass") {
                magnifier = $("<div>").addClass("image-magnifier-glass").appendTo(element);
                magnifier
                    .css({
                        width: o.lensSize,
                        height: o.lensSize,
                        borderRadius: o.lensType !== "circle" ? 0 : "50%",
                        top: y,
                        left: x,
                        backgroundImage: `url(${image[0].src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `-${(x * o.magnifierZoom) - o.lensSize / 4 + 4}px -${(y * o.magnifierZoom) - o.lensSize / 4 + 4}px`,
                        backgroundSize: `${image[0].width * o.magnifierZoom}px ${image[0].height * o.magnifierZoom}px`,
                    })
                    .addClass(o.clsLens);
            } else {
                magnifier = $("<div>").addClass("image-magnifier-glass").appendTo(element);
                magnifier
                    .css({
                        width: o.lensSize,
                        height: o.lensSize,
                        borderRadius: 0,
                        borderWidth: 1,
                        top: y,
                        left: x,
                    })
                    .addClass(o.clsLens);

                if (!Metro.utils.isValue(o.magnifierZoomElement) || $(o.magnifierZoomElement).length === 0) {
                    this.zoomElement = $("<div>").insertAfter(element);
                } else {
                    this.zoomElement = $(o.magnifierZoomElement);
                }

                const zoom_element_width = magnifier[0].offsetWidth * o.magnifierZoom;
                const zoom_element_height = magnifier[0].offsetHeight * o.magnifierZoom;
                const cx = zoom_element_width / o.lensSize;
                const cy = zoom_element_height / o.lensSize;

                this.zoomElement
                    .css({
                        width: zoom_element_width,
                        height: zoom_element_height,
                        backgroundImage: `url(${image[0].src})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `-${x * cx}px -${y * cy}px`,
                        backgroundSize: `${image[0].width * cx}px ${image[0].height * cy}px`,
                    })
                    .addClass(o.clsZoom);
            }
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const glass = element.find(".image-magnifier-glass");
            const glass_size = glass[0].offsetWidth / 2;
            const image = element.find("img")[0];
            const zoomElement = this.zoomElement;
            let cx;
            let cy;

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    const x = element.width() / 2 - o.lensSize / 2;
                    const y = element.height() / 2 - o.lensSize / 2;

                    if (o.magnifierMode === "glass") {
                        glass.css({
                            backgroundPosition: `-${(x * o.magnifierZoom) - o.lensSize / 4 + 4}px -${(y * o.magnifierZoom) - o.lensSize / 4 + 4}px`,
                            backgroundSize: `${image.width * o.magnifierZoom}px ${image.height * o.magnifierZoom}px`,
                        });
                    }
                },
                { ns: this.id },
            );

            if (o.magnifierMode !== "glass") {
                cx = zoomElement[0].offsetWidth / glass_size / 2;
                cy = zoomElement[0].offsetHeight / glass_size / 2;

                zoomElement.css({
                    backgroundSize: `${image.width * cx}px ${image.height * cy}px`,
                });
            }

            const lens_move = (pos) => {
                let x;
                let y;
                const magic = 4;
                const zoom = Number.parseInt(o.magnifierZoom);

                if (o.magnifierMode === "glass") {
                    x = pos.x;
                    y = pos.y;

                    if (x > image.width - glass_size / zoom) {
                        x = image.width - glass_size / zoom;
                    }
                    if (x < glass_size / zoom) {
                        x = glass_size / zoom;
                    }
                    if (y > image.height - glass_size / zoom) {
                        y = image.height - glass_size / zoom;
                    }
                    if (y < glass_size / zoom) {
                        y = glass_size / zoom;
                    }

                    glass.css({
                        top: y - glass_size,
                        left: x - glass_size,
                        backgroundPosition: `-${(x * zoom) - glass_size + magic}px -${(y * zoom) - glass_size + magic}px`,
                    });
                } else {
                    x = pos.x - glass_size;
                    y = pos.y - glass_size;

                    if (x > image.width - glass_size * 2) {
                        x = image.width - glass_size * 2;
                    }
                    if (x < 0) {
                        x = 0;
                    }
                    if (y > image.height - glass_size * 2) {
                        y = image.height - glass_size * 2;
                    }
                    if (y < 0) {
                        y = 0;
                    }

                    glass.css({
                        top: y,
                        left: x,
                    });

                    zoomElement.css({
                        backgroundPosition: `-${x * cx}px -${y * cy}px`,
                    });
                }
            };

            element.on(Metro.events.move, (e) => {
                const pos = Metro.utils.getCursorPosition(image, e);

                lens_move(pos);

                this._fireEvent("magnifier-move", {
                    pos: pos,
                    glass: glass[0],
                    zoomElement: zoomElement ? zoomElement[0] : undefined,
                });

                e.preventDefault();
            });

            element.on(Metro.events.leave, () => {
                const x = element.width() / 2 - o.lensSize / 2;
                const y = element.height() / 2 - o.lensSize / 2;

                glass.animate({
                    draw: {
                        top: y,
                        left: x,
                    },
                });

                lens_move({
                    x: x + o.lensSize / 2,
                    y: y + o.lensSize / 2,
                });
            });
        },

        changeAttribute: (attr, val) => {},

        destroy: function () {
            const element = this.element;
            element.off(Metro.events.move);
            element.off(Metro.events.leave);
            element.remove();
        },
    });
})(Metro, Dom);
