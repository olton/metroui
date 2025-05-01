((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let ResizableDefaultConfig = {
        resizableDeferred: 0,
        canResize: true,
        resizeElement: ".resize-element",
        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        preserveRatio: false,
        onResizeStart: Metro.noop,
        onResizeStop: Metro.noop,
        onResize: Metro.noop,
        onResizableCreate: Metro.noop,
    };

    Metro.resizableSetup = (options) => {
        ResizableDefaultConfig = $.extend({}, ResizableDefaultConfig, options);
    };

    if (typeof globalThis.metroResizableSetup !== "undefined") {
        Metro.resizableSetup(globalThis.metroResizableSetup);
    }

    Metro.Component("resizable", {
        init: function (options, elem) {
            this._super(elem, options, ResizableDefaultConfig, {
                resizer: null,
                id: Metro.utils.elementId("resizable"),
            });

            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("resizable-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            element.data("canResize", true);
            element.addClass("resizable-element");

            if (Metro.utils.isValue(o.resizeElement) && element.find(o.resizeElement).length > 0) {
                this.resizer = element.find(o.resizeElement);
            } else {
                this.resizer = $("<span>").addClass("resize-element").appendTo(element);
            }

            element.data("canResize", o.canResize);
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            this.resizer.on(Metro.events.start, (e) => {
                if (element.data("canResize") === false) {
                    return;
                }

                const startXY = Metro.utils.pageXY(e);
                const startWidth = Number.parseInt(element.outerWidth());
                const startHeight = Number.parseInt(element.outerHeight());
                const size = { width: startWidth, height: startHeight };

                element.addClass("stop-pointer");

                this._fireEvent("resize-start", {
                    size: size,
                });

                $(document).on(
                    Metro.events.move,
                    (e) => {
                        const moveXY = Metro.utils.pageXY(e);
                        const size = {
                            width: startWidth + moveXY.x - startXY.x,
                            height: startHeight + moveXY.y - startXY.y,
                        };

                        if (o.maxWidth > 0 && size.width > o.maxWidth) {
                            return true;
                        }
                        if (o.minWidth > 0 && size.width < o.minWidth) {
                            return true;
                        }

                        if (o.maxHeight > 0 && size.height > o.maxHeight) {
                            return true;
                        }
                        if (o.minHeight > 0 && size.height < o.minHeight) {
                            return true;
                        }

                        element.css(size);

                        this._fireEvent("resize", {
                            size: size,
                        });
                    },
                    { ns: this.id },
                );

                $(document).on(
                    Metro.events.stop,
                    () => {
                        element.removeClass("stop-pointer");

                        $(document).off(Metro.events.move, { ns: this.id });
                        $(document).off(Metro.events.stop, { ns: this.id });

                        const size = {
                            width: Number.parseInt(element.outerWidth()),
                            height: Number.parseInt(element.outerHeight()),
                        };

                        this._fireEvent("resize-stop", {
                            size: size,
                        });
                    },
                    { ns: this.id },
                );

                e.preventDefault();
                e.stopPropagation();
            });
        },

        off: function () {
            this.element.data("canResize", false);
        },

        on: function () {
            this.element.data("canResize", true);
        },

        changeAttribute: function (attributeName) {
            const element = this.element;
            const o = this.options;

            const canResize = () => {
                o.canResize = JSON.parse(element.attr("data-can-resize")) === true;
            };

            switch (attributeName) {
                case "data-can-resize":
                    canResize();
                    break;
            }
        },

        destroy: function () {
            this.resizer.off(Metro.events.start);
            return this.element;
        },
    });
})(Metro, Dom);
