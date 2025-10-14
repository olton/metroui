((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let ClockDefaultConfig = {
        clockDeferred: 0,
        show: "row",
        showTime: true,
        showDate: true,
        dateFormat: "DD.MM.YYYY",
        useUtc: false,
        timeZone: 0,
        digital: false,
        size: 0,
        hourFormat: 24,
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
                _tickInterval: null,
                _secondInterval: null,
                locale: "en",
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            const langElement = element.closest("[lang]");
            if (langElement.length) {
                this.locale = langElement.attr("lang") || "en";
            }

            element.addClass("clock");
            if (o.show === "column") {
                element.addClass("show-column");
            }

            if (o.digital) {
                element.addClass("digital");
            }

            if (o.size) {
                element.cssVar("clock-font-size", `${o.size}px`);
            }

            element.html(`
                <span class="clock-time">
                    <span class="clock-hours">00</span>
                    <span class="clock-divider">:</span>
                    <span class="clock-minutes">00</span>
                    <span class="clock-ampm"></span>
                </span> 
                <span class="clock-date"></span> 
            `);

            if (o.showTime === false) {
                element.find(".clock-time").hide();
            }
            if (o.showDate === false) {
                element.find(".clock-date").hide();
            }

            this._draw();

            this._fireEvent("clock-create", {
                element: element,
            });

            this.start();
        },

        _draw: function () {
            const element = this.element;
            const o = this.options;
            const timestamp = datetime();

            if (o.useUtc) {
                timestamp.utc().add(o.timeZone, "hour");
            }

            const date = timestamp.format(o.dateFormat, this.locale);
            const time_h = o.hourFormat === 24 ? timestamp.hour() : timestamp.hour12();
            const time_m = timestamp.second();

            element.find(".clock-hours").html((time_h < 10 ? "0" : "") + time_h);
            element.find(".clock-minutes").html((time_m < 10 ? "0" : "") + time_m);
            element.find(".clock-date").html(date);
            element.find(".clock-ampm").html(o.hourFormat === 12 ? (timestamp.hour() >= 12 ? "PM" : "AM") : "");
        },

        _second: function () {
            const timestamp = datetime();
            this._draw();
            this._fireEvent("second", {
                timestamp: timestamp,
            });
        },

        _tick: function () {
            const element = this.element;
            const timestamp = datetime();

            element.find(".clock-divider").toggleClass("no-visible");

            this._fireEvent("tick", {
                timestamp: timestamp,
            });
        },

        start: function () {
            this._tickInterval = setInterval(() => {
                this._tick();
            }, 500);
            this._secondInterval = setInterval(() => {
                this._second();
            }, 1000);
        },

        stop: function () {
            clearInterval(this._tickInterval);
            clearInterval(this._secondInterval);
        },

        changeAttribute: function (attr, val) {
            const element = this.element;
            const o = this.options;

            switch (attr) {
                case "data-date-format":
                    o.dateFormat = val;
                    break;
                case "data-show-date":
                    o.showDate = JSON.parse(val);
                    break;
                case "data-show-time":
                    o.showTime = JSON.parse(val);
                    break;
                case "data-show":
                    o.show = ["row", "column"].includes(val) ? val : "row";
                    element.removeClass("show-row show-column").addClass(`show-${o.show}`);
                    break;
            }
        },

        destroy: function () {
            clearInterval(this._clockInterval);
            this._clockInterval = null;
            this.element.remove();
        },
    });
})(Metro, Dom);
