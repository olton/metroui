((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let ViewportCheckDefaultConfig = {
        onViewport: Metro.noop,
        onViewportEnter: Metro.noop,
        onViewportLeave: Metro.noop,
        onViewportCheckCreate: Metro.noop,
    };

    Metro.viewportCheckSetup = (options) => {
        ViewportCheckDefaultConfig = $.extend({}, ViewportCheckDefaultConfig, options);
    };

    if (typeof globalThis.metroViewportCheckSetup !== "undefined") {
        Metro.viewportCheckSetup(globalThis.metroViewportCheckSetup);
    }

    Metro.Component("viewport-check", {
        init: function (options, elem) {
            this._super(elem, options, ViewportCheckDefaultConfig, {
                // define instance vars here
                inViewport: false,
                id: Metro.utils.elementId("viewport-check"),
            });
            return this;
        },

        _create: function () {
            this.inViewport = Metro.utils.inViewport(this.elem);

            this._createEvents();

            this._fireEvent("viewport-check-create");
        },

        _createEvents: function () {
            const elem = this.elem;

            $(globalThis).on(
                Metro.events.scroll,
                () => {
                    const oldState = this.inViewport;

                    this.inViewport = Metro.utils.inViewport(elem);

                    if (oldState !== this.inViewport) {
                        if (this.inViewport) {
                            this._fireEvent("viewport-enter");
                        } else {
                            this._fireEvent("viewport-leave");
                        }
                    }

                    this._fireEvent("viewport", {
                        state: this.inViewport,
                    });
                },
                { ns: this.id },
            );
        },

        state: function () {
            return this.inViewport;
        },

        destroy: function () {
            $(globalThis).off(Metro.events.scroll, { ns: this.id });

            return this.element;
        },
    });
})(Metro, Dom);
