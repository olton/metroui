((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let SwipeDefaultConfig = {
        swipeThreshold: 32,

        onSwipe: Metro.noop,
        onSwipeRight: Metro.noop,
        onSwipeLeft: Metro.noop,
        onSwipeUp: Metro.noop,
        onSwipeDown: Metro.noop,
        onSwipeCreate: Metro.noop,
    };

    Metro.swipeSetup = (options) => {
        SwipeDefaultConfig = $.extend({}, SwipeDefaultConfig, options);
    };

    if (typeof globalThis.metroSwipeSetup !== "undefined") {
        Metro.swipeSetup(globalThis.metroSwipeSetup);
    }

    Metro.Component("swipe", {
        init: function (options, elem) {
            this._super(elem, options, SwipeDefaultConfig, {});
            return this;
        },

        _create: function () {
            this.element.css({
                userSelect: "none",
            });
            this._createEvents();
            this._fireEvent("swipe-create");
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            element.on("touchstart mousedown", (e) => {
                const start = Metro.utils.pageXY(e);

                const swipe = {
                    x: 0,
                    y: 0,
                };

                element.on("touchmove mousemove", (e) => {
                    const changes = Metro.utils.pageXY(e);
                    swipe.x = changes.x - start.x;
                    swipe.y = changes.y - start.y;
                });

                element.on("touchend mouseup", (e) => {
                    let direction = "";

                    if (Math.abs(swipe.x) > o.swipeThreshold || Math.abs(swipe.y) > o.swipeThreshold) {
                        if (Math.abs(swipe.x) > Math.abs(swipe.y)) {
                            if (swipe.x > 0) {
                                direction = "right";
                                this._fireEvent("swipe-right", {
                                    start,
                                    swipe,
                                });
                            } else {
                                direction = "left";
                                this._fireEvent("swipe-left", {
                                    start,
                                    swipe,
                                });
                            }
                        } else {
                            if (swipe.y > 0) {
                                direction = "down";
                                this._fireEvent("swipe-down", {
                                    start,
                                    swipe,
                                });
                            } else {
                                direction = "up";
                                this._fireEvent("swipe-up", {
                                    start,
                                    swipe,
                                });
                            }
                        }
                        this._fireEvent("swipe", {
                            start,
                            swipe,
                            direction,
                        });
                    }

                    element.off("touchmove mousemove");
                    element.off("touchend mouseup");
                });
            });
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
