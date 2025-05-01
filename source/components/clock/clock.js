((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let ClockDefaultConfig = {
        clockDeferred: 0,
        show: "row",
        showTime: true,
        showDate: true,
        dateFormat: "DD.MM.YYYY",
        timeFormat: "HH:mm",
        divider: "&nbsp;&nbsp;",
        twoLines: false,
        onTick: Metro.noop,
        onSecond: Metro.noop,
        onClockCreate: Metro.noop,
    };

    Metro.clockSetup = (options) => {
        ClockDefaultConfig = $.extend({}, ClockDefaultConfig, options);
    };

    if (typeof globalThis.metroClockSetup !== "undefined") {
        Metro.clockSetup(globalThis.metroClockSetup);
    }

    Metro.Component("clock", {
        init: function (options, elem) {
            this._super(elem, options, ClockDefaultConfig, {
                _clockInterval: null,
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("clock");
            if (o.show === "column") {
                element.addClass("show-column");
            }

            this._fireEvent("clock-create", {
                element: element,
            });

            this._tick();

            this._clockInterval = setInterval(() => {
                this._tick();
            }, 500);
            this._secondInterval = setInterval(() => {
                this._second();
            }, 1000);
        },

        _second: function () {
            const timestamp = new Date();

            this._fireEvent("second", {
                timestamp: timestamp,
            });
        },

        _tick: function () {
            const element = this.element;
            const o = this.options;
            const timestamp = datetime();
            let result = "";

            const date = timestamp.format(o.dateFormat);
            const time = timestamp.format(o.timeFormat);

            if (o.showTime) {
                result = `<span class="clock-time">${time}</span>`;
            }

            if (o.showDate) {
                result += `<span class="clock-date">${date}</span>`;
            }

            element.html(result);

            this._fireEvent("tick", {
                timestamp: timestamp,
            });
        },

        changeAttribute: function (attr, val) {
            switch (attr) {
                case "data-date-format":
                    this.options.dateFormat = val;
                    break;
                case "data-time-format":
                    this.options.timeFormat = val;
                    break;
                case "data-show-date":
                    this.options.showDate = JSON.parse(val);
                    break;
                case "data-show-time":
                    this.options.showTime = JSON.parse(val);
                    break;
                case "data-divider":
                    this.options.divider = val;
                    break;
                case "data-two-lines":
                    this.options.twoLines = JSON.parse(val);
                    break;
            }
            this._tick();
        },

        destroy: function () {
            clearInterval(this._clockInterval);
            this._clockInterval = null;
            this.element.remove();
        },
    });
})(Metro, Dom);
