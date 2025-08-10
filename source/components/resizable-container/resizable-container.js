((Metro, $) => {
    let ResizableContainerDefaultConfig = {
        canResize: true,
        resizePointers: "nw, n, ne, e, se, s, sw, w",
        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        enableResize: true,
        onResizeStart: Metro.noop,
        onResize: Metro.noop,
        onResizeStop: Metro.noop,
        onResizableContainerCreate: Metro.noop,
    };

    Metro.resizableContainerSetup = (options) => {
        ResizableContainerDefaultConfig = $.extend({}, ResizableContainerDefaultConfig, options);
    };

    if (typeof window.metroResizableContainerSetup !== "undefined") {
        Metro.resizableContainerSetup(window.metroResizableContainerSetup);
    }

    Metro.Component("resizable-container", {
        init: function (options, elem) {
            this._super(elem, options, ResizableContainerDefaultConfig, {
                // define instance vars here
                id: null,
                pointers: [],
            });
            return this;
        },

        _create: function () {
            this.id = Hooks.useId(this.elem);
            this.pointers = this.options.resizePointers.toArray(",");

            this._createStructure();
            this._createEvents();

            this._fireEvent("resizable-container-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const zIndex =
                element
                    .find("*")
                    .map((el) => {
                        const z = getComputedStyle(el).zIndex;
                        return !isNaN(z) ? parseInt(z) : 0;
                    })
                    .filter((v) => v !== "auto")
                    .sort((a, b) => b - a)[0] || 0;

            element.addClass("resizable-container");
            if (Metro.utils.getStyleOne(element[0], "position") === "static") {
                element.css("position", "relative");
            }

            const contour = $(`<div>`)
                .addClass("rc-contour")
                .css({ zIndex: zIndex + 1 })
                .appendTo(element);
            for (const p of this.pointers) {
                $(`<div>`)
                    .addClass(`rc-point -${p}`)
                    .css({ zIndex: zIndex + 2 })
                    .attr("data-resize-direction", p)
                    .appendTo(contour);
            }

            if (o.enableResize === false) {
                contour.addClass("disabled");
            }
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;

            const minW = o.minWidth || 0;
            const minH = o.minHeight || 0;
            const maxW = o.maxWidth || 0;
            const maxH = o.maxHeight || 0;

            const clamp = Metro.utils.clamp;

            element.on(Metro.events.startAll, ".rc-point", function (e) {
                if (!o.canResize) return;

                e.preventDefault();
                e.stopPropagation();

                const pointer = $(this).attr("data-resize-direction");
                const startXY = Metro.utils.pageXY(e);
                const { height, width, top, left } = element[0].getBoundingClientRect();
                const { top: pTop, left: pLeft } = element.parent()[0].getBoundingClientRect();

                $(document).on(
                    Metro.events.moveAll,
                    (e) => {
                        const moveXY = Metro.utils.pageXY(e);
                        const deltaX = moveXY.x - startXY.x;
                        const deltaY = moveXY.y - startXY.y;

                        // north (n)
                        if (pointer === "n") {
                            const rawH = height - deltaY;
                            const newH = clamp(rawH, minH, maxH);
                            const effDy = height - newH;
                            const newTop = top + effDy - pTop;

                            element.css({
                                height: `${newH}px`,
                                top: `${newTop}px`,
                            });
                        }

                        // south (s)
                        if (pointer === "s") {
                            const rawH = height + deltaY;
                            const newH = clamp(rawH, minH, maxH);

                            element.css({
                                height: `${newH}px`,
                            });
                        }

                        // east (e)
                        if (pointer === "e") {
                            const rawW = width + deltaX;
                            const newW = clamp(rawW, minW, maxW);

                            element.css({
                                width: `${newW}px`,
                            });
                        }

                        // west (w)
                        if (pointer === "w") {
                            const rawW = width - deltaX;
                            const newW = clamp(rawW, minW, maxW);
                            const effDx = width - newW;
                            const newLeft = left + effDx - pLeft;

                            element.css({
                                width: `${newW}px`,
                                left: `${newLeft}px`,
                            });
                        }

                        // northeast (ne) = n + e
                        if (pointer === "ne") {
                            const rawW = width + deltaX;
                            const newW = clamp(rawW, minW, maxW);

                            const rawH = height - deltaY;
                            const newH = clamp(rawH, minH, maxH);
                            const effDy = height - newH;
                            const newTop = top + effDy - pTop;

                            element.css({
                                width: `${newW}px`,
                                height: `${newH}px`,
                                top: `${newTop}px`,
                            });
                        }

                        // northwest (nw) = n + w
                        if (pointer === "nw") {
                            const rawW = width - deltaX;
                            const newW = clamp(rawW, minW, maxW);
                            const effDx = width - newW;
                            const newLeft = left + effDx - pLeft;

                            const rawH = height - deltaY;
                            const newH = clamp(rawH, minH, maxH);
                            const effDy = height - newH;
                            const newTop = top + effDy - pTop;

                            element.css({
                                width: `${newW}px`,
                                height: `${newH}px`,
                                left: `${newLeft}px`,
                                top: `${newTop}px`,
                            });
                        }

                        // southeast (se) = s + e
                        if (pointer === "se") {
                            const rawW = width + deltaX;
                            const newW = clamp(rawW, minW, maxW);
                            const rawH = height + deltaY;
                            const newH = clamp(rawH, minH, maxH);

                            element.css({
                                width: `${newW}px`,
                                height: `${newH}px`,
                            });
                        }

                        // southwest (sw) = s + w
                        if (pointer === "sw") {
                            const rawW = width - deltaX;
                            const newW = clamp(rawW, minW, maxW);
                            const effDx = width - newW;
                            const newLeft = left + effDx - pLeft;

                            const rawH = height + deltaY;
                            const newH = clamp(rawH, minH, maxH);

                            element.css({
                                width: `${newW}px`,
                                height: `${newH}px`,
                                left: `${newLeft}px`,
                            });
                        }
                    },
                    { ns: that.id },
                );

                $(document).on(
                    Metro.events.stopAll,
                    () => {
                        $(document).off(Metro.events.moveAll, { ns: that.id });
                        $(document).off(Metro.events.stopAll, { ns: that.id });
                    },
                    { ns: that.id },
                );
            });
        },

        enable: function () {
            this.element.find(".rc-contour").removeClass("disabled");
        },

        disable: function () {
            this.element.find(".rc-contour").addClass("disabled");
        },

        changeAttribute: function (attr, val) {
            switch (attr) {
                case "data-enable-resize": {
                    if (val === "true") {
                        this.enable();
                    } else {
                        this.disable();
                    }
                    break;
                }
            }
        },

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
