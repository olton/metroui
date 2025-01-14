/**
 * global Metro, datetime, Datetime, METRO_LOCALE
 *
 * @format
 */

(function (Metro, $) {
    "use strict";
    var Utils = Metro.utils;
    var CountdownDefaultConfig = {
        countdownDeferred: 0,
        stopOnBlur: true,
        animate: "none",
        ease: "linear",
        duration: 600,
        inputFormat: null,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        date: null,
        start: true,
        clsCountdown: "",
        clsPart: "",
        clsZero: "",
        clsAlarm: "",
        clsDays: "",
        clsHours: "",
        clsMinutes: "",
        clsSeconds: "",
        onAlarm: Metro.noop,
        onTick: Metro.noop,
        onZero: Metro.noop,
        onBlink: Metro.noop,
        onCountdownCreate: Metro.noop,
    };

    Metro.countdownSetup = function (options) {
        CountdownDefaultConfig = $.extend({}, CountdownDefaultConfig, options);
    };

    if (typeof globalThis["metroCountdownSetup"] !== undefined) {
        Metro.countdownSetup(globalThis["metroCountdownSetup"]);
    }

    Metro.Component("countdown", {
        init: function (options, elem) {
            this._super(elem, options, CountdownDefaultConfig, {
                breakpoint: new Date().getTime(),
                blinkInterval: null,
                tickInterval: null,
                zeroDaysFired: false,
                zeroHoursFired: false,
                zeroMinutesFired: false,
                zeroSecondsFired: false,
                fontSize: parseInt(Utils.getStyleOne(elem, "font-size")),
                current: {
                    d: 0,
                    h: 0,
                    m: 0,
                    s: 0,
                },
                inactiveTab: false,
                id: Utils.elementId("countdown"),
                duration: 600,
            });

            return this;
        },

        _create: function () {
            var o = this.options;

            this.duration = +o.duration <= 0 || +o.duration >= 1000 ? 600 : +o.duration;

            this._build();
            this._createEvents();
        },

        _setBreakpoint: function () {
            var o = this.options;
            var dm = 86400000,
                hm = 3600000,
                mm = 60000,
                sm = 1000;

            this.breakpoint = datetime().time();

            if (o.date) {
                this.breakpoint = (o.inputFormat ? Datetime.from(o.date, o.inputFormat) : datetime(o.date)).time();
            }

            if (parseInt(o.days) > 0) {
                this.breakpoint += parseInt(o.days) * dm;
            }
            if (parseInt(o.hours) > 0) {
                this.breakpoint += parseInt(o.hours) * hm;
            }
            if (parseInt(o.minutes) > 0) {
                this.breakpoint += parseInt(o.minutes) * mm;
            }
            if (parseInt(o.seconds) > 0) {
                this.breakpoint += parseInt(o.seconds) * sm;
            }
        },

        _build: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var parts = ["days", "hours", "minutes", "seconds"];
            var dm = 24 * 60 * 60 * 1000;
            var delta_days;
            var now = datetime().time();
            var digit;
            const strings = this.strings;

            if (!element.attr("id")) {
                element.attr("id", Utils.elementId("countdown"));
            }

            if (!Utils.isValue(element.attr("id"))) {
                element.attr("id", Utils.elementId("countdown"));
            }

            element.addClass("countdown").addClass(o.clsCountdown);

            this._setBreakpoint();

            delta_days = Math.round((that.breakpoint - now) / dm);

            $.each(parts, function () {
                var part = $("<div>")
                    .addClass("part " + this)
                    .addClass(o.clsPart)
                    .attr("data-label", strings[`label_${this}`])
                    .appendTo(element);

                if (this === "days") {
                    part.addClass(o.clsDays);
                }
                if (this === "hours") {
                    part.addClass(o.clsHours);
                }
                if (this === "minutes") {
                    part.addClass(o.clsMinutes);
                }
                if (this === "seconds") {
                    part.addClass(o.clsSeconds);
                }

                $("<div>").addClass("digit").appendTo(part);
                $("<div>").addClass("digit").appendTo(part);

                if (this === "days" && delta_days >= 100) {
                    for (var i = 0; i < String(Math.round(delta_days / 100)).length; i++) {
                        $("<div>").addClass("digit").appendTo(part);
                    }
                }
            });

            digit = element.find(".digit");
            digit.append($("<span class='digit-placeholder'>").html("0"));
            digit.append($("<span class='digit-value'>").html("0"));

            this._fireEvent("countdown-create", {
                element: element,
            });

            if (o.start === true) {
                this.start();
            } else {
                this.tick();
            }
        },

        _createEvents: function () {
            var that = this;
            $(document).on(
                "visibilitychange",
                function () {
                    if (document.hidden) {
                        that.pause();
                    } else {
                        that.resume();
                    }
                },
                { ns: this.id },
            );
        },

        blink: function () {
            var element = this.element;
            element.toggleClass("blink");

            this._fireEvent("blink", {
                time: this.current,
            });
        },

        tick: function () {
            var element = this.element,
                o = this.options;
            var dm = 24 * 60 * 60,
                hm = 60 * 60,
                mm = 60,
                sm = 1;
            var left,
                now = datetime().time();
            var d, h, m, s;
            var days = element.find(".days"),
                hours = element.find(".hours"),
                minutes = element.find(".minutes"),
                seconds = element.find(".seconds");

            left = Math.floor((this.breakpoint - now) / 1000);

            if (left <= -1) {
                this.stop();
                element.addClass(o.clsAlarm);

                this._fireEvent("alarm", {
                    time: now,
                });

                return;
            }

            d = Math.floor(left / dm);

            left -= d * dm;
            if (this.current.d !== d) {
                this.current.d = d;
                this.draw("days", d);
            }

            if (d === 0) {
                if (this.zeroDaysFired === false) {
                    this.zeroDaysFired = true;
                    days.addClass(o.clsZero);

                    this._fireEvent("zero", {
                        part: "days",
                        value: days,
                    });
                }
            }

            h = Math.floor(left / hm);
            left -= h * hm;
            if (this.current.h !== h) {
                this.current.h = h;
                this.draw("hours", h);
            }

            if (d === 0 && h === 0) {
                if (this.zeroHoursFired === false) {
                    this.zeroHoursFired = true;
                    hours.addClass(o.clsZero);

                    this._fireEvent("zero", {
                        part: "hours",
                        value: hours,
                    });
                }
            }

            m = Math.floor(left / mm);
            left -= m * mm;
            if (this.current.m !== m) {
                this.current.m = m;
                this.draw("minutes", m);
            }

            if (d === 0 && h === 0 && m === 0) {
                if (this.zeroMinutesFired === false) {
                    this.zeroMinutesFired = true;
                    minutes.addClass(o.clsZero);

                    this._fireEvent("zero", {
                        part: "minutes",
                        value: minutes,
                    });
                }
            }

            s = Math.floor(left / sm);
            if (this.current.s !== s) {
                this.current.s = s;
                this.draw("seconds", s);
            }

            if (d === 0 && h === 0 && m === 0 && s === 0) {
                if (this.zeroSecondsFired === false) {
                    this.zeroSecondsFired = true;
                    seconds.addClass(o.clsZero);

                    this._fireEvent("zero", {
                        part: "seconds",
                        value: seconds,
                    });
                }
            }

            this._fireEvent("tick", {
                days: d,
                hours: h,
                minutes: m,
                seconds: s,
            });
        },

        draw: function (part, value) {
            var element = this.element,
                o = this.options;
            var digits, digits_length, digit_value, digit_current, digit;
            var len,
                i,
                duration = this.duration;
            var fontSize = this.fontSize;

            var slideDigit = function (digit, value) {
                var digit_copy,
                    height = digit.height();

                digit.siblings(".-old-digit").remove();
                digit_copy = digit.clone().appendTo(digit.parent());
                digit_copy.css({
                    top: -1 * height + "px",
                });

                digit.addClass("-old-digit").animate({
                    draw: {
                        top: height,
                        opacity: 0,
                    },
                    dur: duration,
                    ease: o.ease,
                    onDone: function () {
                        $(this).remove();
                    },
                });

                digit_copy.html(value).animate({
                    draw: {
                        top: 0,
                        opacity: 1,
                    },
                    dur: duration,
                    ease: o.ease,
                });
            };

            var fadeDigit = function (digit, value) {
                var digit_copy;
                digit.siblings(".-old-digit").remove();
                digit_copy = digit.clone().appendTo(digit.parent());
                digit_copy.css({
                    opacity: 0,
                });

                digit.addClass("-old-digit").animate({
                    draw: {
                        opacity: 0,
                    },
                    dur: duration / 2,
                    ease: o.ease,
                    onDone: function () {
                        $(this).remove();
                    },
                });

                digit_copy.html(value).animate({
                    draw: {
                        opacity: 1,
                    },
                    dur: duration / 2,
                    ease: o.ease,
                });
            };

            var zoomDigit = function (digit, value) {
                var digit_copy,
                    height = digit.height(),
                    fs = fontSize; // parseInt(digit.style("font-size"));

                digit.siblings(".-old-digit").remove();
                digit_copy = digit.clone().appendTo(digit.parent());
                digit_copy.css({
                    top: 0,
                    left: 0,
                    opacity: 1,
                });

                digit.addClass("-old-digit").animate({
                    draw: {
                        top: height,
                        opacity: 0,
                        fontSize: 0,
                    },
                    dur: duration,
                    ease: o.ease,
                    onDone: function () {
                        $(this).remove();
                    },
                });

                digit_copy.html(value).animate({
                    draw: {
                        top: 0,
                        opacity: 1,
                        fontSize: [0, fs],
                    },
                    dur: duration,
                    ease: o.ease,
                });
            };

            value = "" + value;

            if (value.length === 1) {
                value = "0" + value;
            }

            len = value.length;

            digits = element.find("." + part + " .digit:not(.-old-digit)");
            digits_length = digits.length;
            element.find(".-old-digit").remove();

            for (i = 0; i < len; i++) {
                digit = digits.eq(digits_length - 1).find(".digit-value");
                digit_value = Math.floor(parseInt(value) / Math.pow(10, i)) % 10;
                digit_current = parseInt(digit.text());

                digits_length--;

                if (digit_current === digit_value) {
                    continue;
                }

                switch (("" + o.animate).toLowerCase()) {
                    case "slide":
                        slideDigit(digit, digit_value);
                        break;
                    case "fade":
                        fadeDigit(digit, digit_value);
                        break;
                    case "zoom":
                        zoomDigit(digit, digit_value);
                        break;
                    default:
                        digit.html(digit_value);
                }
            }
        },

        start: function () {
            var that = this,
                element = this.element;

            if (element.data("paused") === false) {
                return;
            }

            clearInterval(this.blinkInterval);
            clearInterval(this.tickInterval);

            element.data("paused", false);

            this._setBreakpoint();
            this.tick();

            this.blinkInterval = setInterval(function () {
                that.blink();
            }, 500);
            this.tickInterval = setInterval(function () {
                that.tick();
            }, 1000);
        },

        stop: function () {
            var element = this.element;
            clearInterval(this.blinkInterval);
            clearInterval(this.tickInterval);
            element.data("paused", true);
            element.find(".digit").html("0");
            this.current = {
                d: 0,
                h: 0,
                m: 0,
                s: 0,
            };
        },

        pause: function () {
            clearInterval(this.blinkInterval);
            clearInterval(this.tickInterval);
            this.element.data("paused", true);
        },

        resume: function () {
            var that = this;

            this.element.data("paused", false);
            this.blinkInterval = setInterval(function () {
                that.blink();
            }, 500);
            this.tickInterval = setInterval(function () {
                that.tick();
            }, 1000);
        },

        reset: function () {
            var that = this,
                element = this.element,
                o = this.options;

            clearInterval(this.blinkInterval);
            clearInterval(this.tickInterval);

            element.find(".part").removeClass(o.clsZero);

            var digit = element.find(".digit").clear();

            digit.append($("<span class='digit-placeholder'>").html("0"));
            digit.append($("<span class='digit-value'>").html("0"));

            this._setBreakpoint();

            element.data("paused", false);

            this.tick();

            this.blinkInterval = setInterval(function () {
                that.blink();
            }, 500);
            this.tickInterval = setInterval(function () {
                that.tick();
            }, 1000);
        },

        resetWith: function (val) {
            var that = this,
                element = this.element,
                o = this.options;

            if (typeof val === "string") {
                element.attr("data-date", val);
                o.date = val;
            } else if (typeof val === "object") {
                var keys = ["days", "hours", "minutes", "seconds"];
                $.each(keys, function (i, v) {
                    if (Metro.utils.isValue(val[v])) {
                        element.attr("data-" + v, val[v]);
                        o[v] = val[v];
                    }
                });
            }

            this.reset();
        },

        togglePlay: function () {
            if (this.element.attr("data-pause") === true) {
                this.pause();
            } else {
                this.start();
            }
        },

        isPaused: function () {
            return this.element.data("paused");
        },

        getBreakpoint: function (asDate) {
            return asDate === true ? new Date(this.breakpoint) : this.breakpoint;
        },

        getLeft: function () {
            var dm = 24 * 60 * 60 * 1000,
                hm = 60 * 60 * 1000,
                mm = 60 * 1000,
                sm = 1000;
            var now = new Date().getTime();
            var left_seconds = Math.floor(this.breakpoint - now);
            return {
                days: Math.round(left_seconds / dm),
                hours: Math.round(left_seconds / hm),
                minutes: Math.round(left_seconds / mm),
                seconds: Math.round(left_seconds / sm),
            };
        },

        changeAttribute: function (attr, newVal) {
            switch (attr) {
                case "data-pause":
                    this.togglePlay();
                    break;
                case "data-duration":
                    this.duration = +newVal <= 0 || +newVal >= 1000 ? 600 : +newVal;
                    break;
            }
        },

        destroy: function () {
            clearInterval(this.blinkInterval);
            clearInterval(this.tickInterval);

            $(document).off("visibilitychange", { ns: this.id });

            return this.element;
        },
    });
})(Metro, Dom);
