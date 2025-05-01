((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let CounterDefaultConfig = {
        startOnViewport: false,
        counterDeferred: 0,
        duration: 2000,
        value: 0,
        from: 0,
        timeout: 0,
        delimiter: ",",
        prefix: "",
        suffix: "",
        size: 16,
        onStart: Metro.noop,
        onStop: Metro.noop,
        onTick: Metro.noop,
        onCounterCreate: Metro.noop,
    };

    Metro.counterSetup = (options) => {
        CounterDefaultConfig = $.extend({}, CounterDefaultConfig, options);
    };

    if (typeof globalThis.metroCounterSetup !== "undefined") {
        Metro.counterSetup(globalThis.metroCounterSetup);
    }

    Metro.Component("counter", {
        init: function (options, elem) {
            this._super(elem, options, CounterDefaultConfig, {
                numbers: [],
                html: $(elem).html(),
                started: false,
                id: Metro.utils.elementId("counter"),
            });

            return this;
        },

        _create: function () {
            this._createStruct();
            this._createEvents();
            this._fireEvent("counter-create");
        },

        _createStruct: function () {
            const element = this.element;
            const elem = this.elem;
            const o = this.options;
            this.elem.value = 0;
            element.css("font-size", this.options.size);
        },

        _createEvents: function () {
            const o = this.options;

            if (o.startOnViewport) {
                Hooks.useEvent({
                    effect: () => {
                        this.start();
                    },
                    target: this.elem,
                    event: Hooks.EVENTS.VIEWPORT,
                });
            }
        },

        start: function (val, from) {
            const that = this;
            const elem = this.elem;
            const o = this.options;

            if (Metro.utils.isValue(from)) {
                o.from = +from;
            }

            if (Metro.utils.isValue(val)) {
                o.value = +val;
            }

            this.started = true;
            const _from = o.from;
            const _to = o.value;

            this._fireEvent("start");

            $.animate({
                el: elem,
                draw: {
                    value: [_from, _to],
                },
                defer: o.timeout,
                dur: o.duration,
                onFrame: function () {
                    that._fireEvent("tick", {
                        value: this.value,
                    });
                    this.innerHTML = o.prefix + Number(this.value).format(0, 0, o.delimiter) + o.suffix;
                },
                onDone: () => {
                    // this.innerHTML = o.prefix + Number(o.value).format(0, 0, o.delimiter) + o.suffix
                    that._fireEvent("stop");
                },
            });
        },

        reset: function () {
            this.started = false;
            this.element.html(this.html);
        },

        changeAttribute: function (attr, val) {
            const o = this.options;

            if (attr === "data-value") {
                o.value = +val;
            }
            if (attr === "data-from") {
                o.from = +val;
            }
        },

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
