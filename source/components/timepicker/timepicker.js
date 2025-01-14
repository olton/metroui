/** @format */

(function (Metro, $) {
    "use strict";
    var Utils = Metro.utils;
    var TimePickerDefaultConfig = {
        label: "",
        timepickerDeferred: 0,
        hoursStep: 1,
        minutesStep: 1,
        secondsStep: 1,
        value: null,
        distance: 3,
        hours: true,
        minutes: true,
        seconds: true,
        showLabels: true,
        scrollSpeed: 4,
        copyInlineStyles: false,
        openMode: "auto",
        clsPicker: "",
        clsPart: "",
        clsHours: "",
        clsMinutes: "",
        clsSeconds: "",
        clsLabel: "",
        clsButton: "",
        clsOkButton: "",
        clsCancelButton: "",
        okButtonIcon: "✓",
        cancelButtonIcon: "𐄂",
        onSet: Metro.noop,
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onScroll: Metro.noop,
        onTimePickerCreate: Metro.noop,
    };

    Metro.timePickerSetup = function (options) {
        TimePickerDefaultConfig = $.extend({}, TimePickerDefaultConfig, options);
    };

    if (typeof globalThis["metroTimePickerSetup"] !== undefined) {
        Metro.timePickerSetup(globalThis["metroTimePickerSetup"]);
    }

    Metro.Component("time-picker", {
        init: function (options, elem) {
            this._super(elem, options, TimePickerDefaultConfig, {
                picker: null,
                isOpen: false,
                value: [],
                listTimer: {
                    hours: null,
                    minutes: null,
                    seconds: null,
                },
                id: Utils.elementId("time-picker"),
            });

            return this;
        },

        _create: function () {
            var element = this.element,
                o = this.options;
            var i;

            if (o.distance < 1) {
                o.distance = 1;
            }

            if (o.hoursStep < 1) {
                o.hoursStep = 1;
            }
            if (o.hoursStep > 23) {
                o.hoursStep = 23;
            }

            if (o.minutesStep < 1) {
                o.minutesStep = 1;
            }
            if (o.minutesStep > 59) {
                o.minutesStep = 59;
            }

            if (o.secondsStep < 1) {
                o.secondsStep = 1;
            }
            if (o.secondsStep > 59) {
                o.secondsStep = 59;
            }

            if (element.val() === "" && !Utils.isValue(o.value)) {
                o.value = datetime().format("HH:mm:ss");
            }

            this.value = (element.val() !== "" ? element.val() : "" + o.value).toArray(":");

            for (i = 0; i < 3; i++) {
                if (this.value[i] === undefined || this.value[i] === null) {
                    this.value[i] = 0;
                } else {
                    this.value[i] = parseInt(this.value[i]);
                }
            }

            this._normalizeValue();

            this._createStructure();
            this._createEvents();
            this._set();

            this._fireEvent("time-picker-create", {
                element: element,
            });
        },

        _normalizeValue: function () {
            var o = this.options;

            if (o.hoursStep > 1) {
                this.value[0] = Utils.nearest(this.value[0], o.hoursStep, true);
            }
            if (o.minutesStep > 1) {
                this.value[1] = Utils.nearest(this.value[1], o.minutesStep, true);
            }
            if (o.minutesStep > 1) {
                this.value[2] = Utils.nearest(this.value[2], o.secondsStep, true);
            }
        },

        _createStructure: function () {
            var element = this.element,
                o = this.options,
                strings = this.strings;
            var picker, hours, minutes, seconds, i;
            var timeWrapper, selectWrapper, selectBlock, actionBlock;
            
            var id = Utils.elementId("timepicker");
            
            picker = $("<div>")
                .addClass("wheel-picker time-picker " + element[0].className)
                .addClass(o.clsPicker);

            if (!picker.attr("id")) {
                picker.attr("id", id);
            }

            picker.insertBefore(element);
            element.attr("readonly", true).appendTo(picker);

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(picker);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            timeWrapper = $("<div>").addClass("time-wrapper").appendTo(picker);

            if (o.hours === true) {
                hours = $("<div>").attr("data-title", strings["label_hours"]).addClass("hours").addClass(o.clsPart).addClass(o.clsHours).appendTo(timeWrapper);
            }
            if (o.minutes === true) {
                minutes = $("<div>")
                    .attr("data-title", strings["label_minutes"])
                    .addClass("minutes")
                    .addClass(o.clsPart)
                    .addClass(o.clsMinutes)
                    .appendTo(timeWrapper);
            }
            if (o.seconds === true) {
                seconds = $("<div>")
                    .attr("data-title", strings["label_seconds"])
                    .addClass("seconds")
                    .addClass(o.clsPart)
                    .addClass(o.clsSeconds)
                    .appendTo(timeWrapper);
            }

            selectWrapper = $("<div>").addClass("select-wrapper").appendTo(picker);

            selectBlock = $("<div>").addClass("select-block").appendTo(selectWrapper);
            if (o.hours === true) {
                hours = $("<ul>").addClass("sel-hours").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(hours);
                for (i = 0; i < 24; i = i + o.hoursStep) {
                    $("<li>")
                        .addClass("js-hours-" + i)
                        .html(Str.lpad(i, "0", 2))
                        .data("value", i)
                        .appendTo(hours);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(hours);
            }
            if (o.minutes === true) {
                minutes = $("<ul>").addClass("sel-minutes").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(minutes);
                for (i = 0; i < 60; i = i + o.minutesStep) {
                    $("<li>")
                        .addClass("js-minutes-" + i)
                        .html(Str.lpad(i, "0", 2))
                        .data("value", i)
                        .appendTo(minutes);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(minutes);
            }
            if (o.seconds === true) {
                seconds = $("<ul>").addClass("sel-seconds").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(seconds);
                for (i = 0; i < 60; i = i + o.secondsStep) {
                    $("<li>")
                        .addClass("js-seconds-" + i)
                        .html(Str.lpad(i, "0", 2))
                        .data("value", i)
                        .appendTo(seconds);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(seconds);
            }

            selectBlock.height((o.distance * 2 + 1) * 40);

            actionBlock = $("<div>").addClass("action-block").appendTo(selectWrapper);
            $("<button>")
                .attr("type", "button")
                .addClass("button action-now")
                .addClass(o.clsButton)
                .addClass(o.clsTodayButton)
                .html(`<span class="caption">${this.strings.label_now}</span>`)
                .appendTo(actionBlock);
            $("<button>")
                .attr("type", "button")
                .addClass("button action-ok")
                .addClass(o.clsButton)
                .addClass(o.clsOkButton)
                .html(`<span class="icon">${o.okButtonIcon}</span>`)
                .appendTo(actionBlock);
            $("<button>")
                .attr("type", "button")
                .addClass("button action-cancel")
                .addClass(o.clsButton)
                .addClass(o.clsCancelButton)
                .html(`<span class="icon">${o.cancelButtonIcon}</span>`)
                .appendTo(actionBlock);

            element[0].className = "";
            if (o.copyInlineStyles === true) {
                for (i = 0; i < element[0].style.length; i++) {
                    picker.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            if (o.showLabels === true) {
                picker.addClass("show-labels");
            }

            if (element.prop("disabled")) {
                picker.addClass("disabled");
            }

            this.picker = picker;
        },

        _createEvents: function () {
            var that = this,
                o = this.options;
            var picker = this.picker;

            picker.on("touchstart", ".select-block ul", function (e) {
                if (e.changedTouches) {
                    return;
                }

                var target = this;
                var pageY = Utils.pageXY(e).y;

                $(document).on(
                    "touchmove",
                    function (e) {
                        target.scrollTop -= o.scrollSpeed * (pageY > Utils.pageXY(e).y ? -1 : 1);

                        pageY = Utils.pageXY(e).y;
                    },
                    { ns: that.id },
                );

                $(document).on(
                    "touchend",
                    function () {
                        $(document).off(Metro.events.move, { ns: that.id });
                        $(document).off(Metro.events.stop, { ns: that.id });
                    },
                    { ns: that.id },
                );
            });

            picker.on(Metro.events.click, function (e) {
                if (that.isOpen === false) that.open();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-ok", function (e) {
                var h, m, s;
                var sh = picker.find(".sel-hours li.active"),
                    sm = picker.find(".sel-minutes li.active"),
                    ss = picker.find(".sel-seconds li.active");

                h = sh.length === 0 ? 0 : sh.data("value");
                m = sm.length === 0 ? 0 : sm.data("value");
                s = ss.length === 0 ? 0 : ss.data("value");

                that.value = [h, m, s];
                that._normalizeValue();
                that._set();

                that.close();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-cancel", function (e) {
                that.close();
                e.stopPropagation();
            });

            var scrollLatency = 150;
            $.each(["hours", "minutes", "seconds"], function () {
                var part = this,
                    list = picker.find(".sel-" + part);

                const scrollFn = Hooks.useDebounce(function (e) {
                    var target, targetElement, scrollTop;

                    that.listTimer[part] = null;

                    target = Math.round(Math.ceil(list.scrollTop()) / 40);

                    if (part === "hours" && o.hoursStep) {
                        target *= parseInt(o.hoursStep);
                    }
                    if (part === "minutes" && o.minutesStep) {
                        target *= parseInt(o.minutesStep);
                    }
                    if (part === "seconds" && o.secondsStep) {
                        target *= parseInt(o.secondsStep);
                    }

                    targetElement = list.find(".js-" + part + "-" + target);
                    scrollTop = targetElement.position().top - o.distance * 40;

                    list.find(".active").removeClass("active");

                    list[0].scrollTop = scrollTop;
                    targetElement.addClass("active");
                    Utils.exec(o.onScroll, [targetElement, list, picker], list[0]);
                }, scrollLatency);
                
                list.on("scroll", scrollFn);
            });

            picker.on(Metro.events.click, "ul li", function (e) {
                const target = $(this)
                const list = target.closest("ul")
                const scrollTop = target.position().top - o.distance * 40;
                list.find(".active").removeClass("active");
                $.animate({
                    el: list[0],
                    draw: {
                        scrollTop
                    },
                    dur: 300,
                })
                list[0].scrollTop = scrollTop;
                target.addClass("active");
                Utils.exec(o.onScroll, [target, list, picker], list[0]);
            })

            picker.on(Metro.events.click, ".action-now", function (e) {
                const now = datetime()
                const hour = now.hour()
                const minute = now.minute()
                const second = now.second()

                picker.find(`.sel-hours li.js-hours-${hour}`).click();
                picker.find(`.sel-minutes li.js-minutes-${minute}`).click();
                picker.find(`.sel-seconds li.js-seconds-${second}`).click();

                e.preventDefault();
                e.stopPropagation();
            })
        },

        _set: function () {
            var element = this.element,
                o = this.options;
            var picker = this.picker;
            var h = "00",
                m = "00",
                s = "00";

            if (o.hours === true) {
                h = parseInt(this.value[0]);
                picker.find(".hours").html(Str.lpad(h, "0", 2));
            }
            if (o.minutes === true) {
                m = parseInt(this.value[1]);
                picker.find(".minutes").html(Str.lpad(m, "0", 2));
            }
            if (o.seconds === true) {
                s = parseInt(this.value[2]);
                picker.find(".seconds").html(Str.lpad(s, "0", 2));
            }

            element.val([h, m, s].join(":")).trigger("change");

            this._fireEvent("set", {
                val: this.value,
                elementVal: element.val(),
            });
        },

        open: function () {
            var o = this.options;
            var picker = this.picker;
            var h, m, s;
            var h_list, m_list, s_list;
            var items = picker.find("li");
            var select_wrapper = picker.find(".select-wrapper");
            var h_item, m_item, s_item;

            $.each($(".time-picker"), function () {
                $(this)
                    .find("input")
                    .each(function () {
                        Metro.getPlugin(this, "timepicker").close();
                    });
            });
            
            select_wrapper.show(0);
            items.removeClass("active");

            if (o.openMode === "auto") {
                if (!Metro.utils.inViewport(select_wrapper[0])) {
                    select_wrapper.parent().addClass("drop-up-select");
                }
                if (!Metro.utils.inViewport(select_wrapper[0])) {
                    select_wrapper.parent().removeClass("drop-up-select");
                    select_wrapper.parent().addClass("drop-as-dialog");
                }
            } else {
                if (o.openMode === "dialog") {
                    select_wrapper.parent().addClass("drop-as-dialog");
                } else if (o.openMode === "up") {
                    select_wrapper.parent().addClass("drop-up-select");
                }
            }
            
            var animateList = function (list, item) {
                list.scrollTop(0).animate({
                    draw: {
                        scrollTop: item.position().top - o.distance * 40 + list.scrollTop(),
                    },
                    dur: 100,
                });
            };

            if (o.hours === true) {
                h = parseInt(this.value[0]);
                h_list = picker.find(".sel-hours");
                h_item = h_list.find("li.js-hours-" + h).addClass("active");
                animateList(h_list, h_item);
            }
            if (o.minutes === true) {
                m = parseInt(this.value[1]);
                m_list = picker.find(".sel-minutes");
                m_item = m_list.find("li.js-minutes-" + m).addClass("active");
                animateList(m_list, m_item);
            }
            if (o.seconds === true) {
                s = parseInt(this.value[2]);
                s_list = picker.find(".sel-seconds");
                s_item = s_list.find("li.js-seconds-" + s).addClass("active");
                animateList(s_list, s_item);
            }

            this.isOpen = true;

            this._fireEvent("open", {
                val: this.value,
            });
        },

        close: function () {
            var picker = this.picker, o = this.options;
            picker.find(".select-wrapper").hide(0);
            if (o.openMode === "auto") {
                picker.find(".select-wrapper").parent().removeClass("drop-up-select drop-as-dialog");
            }
            this.isOpen = false;

            this._fireEvent("close", {
                val: this.value,
            });
        },

        _convert: function (t) {
            var result;

            if (Array.isArray(t)) {
                result = t;
            } else if (typeof t.getMonth === "function") {
                result = [t.getHours(), t.getMinutes(), t.getSeconds()];
            } else if (Utils.isObject(t)) {
                result = [t.h, t.m, t.s];
            } else {
                result = t.toArray(":");
            }

            return result;
        },

        val: function (t) {
            if (t === undefined) {
                return this.element.val();
            }
            this.value = this._convert(t);
            this._normalizeValue();
            this._set();
        },

        time: function (t) {
            if (t === undefined) {
                return {
                    h: this.value[0],
                    m: this.value[1],
                    s: this.value[2],
                };
            }

            this.value = this._convert(t);
            this._normalizeValue();
            this._set();
        },

        date: function (t) {
            if (t === undefined || typeof t.getMonth !== "function") {
                return datetime().hour(this.value[0]).minute(this.value[1]).second(this.value[2]).ms(0).val();
            }

            this.value = this._convert(t);
            this._normalizeValue();
            this._set();
        },

        disable: function () {
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function () {
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function () {
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        changeAttribute: function (attr, newValue) {
            switch (attr) {
                case "data-value":
                    this.val(newValue);
                    break;
                case "disabled":
                    this.toggleState();
                    break;
            }
        },

        destroy: function () {
            var element = this.element;
            var picker = this.picker;

            $.each(["hours", "minutes", "seconds"], function () {
                picker.find(".sel-" + this).off("scroll");
            });

            picker.off(Metro.events.start, ".select-block ul");
            picker.off(Metro.events.click);
            picker.off(Metro.events.click, ".action-ok");
            picker.off(Metro.events.click, ".action-cancel");

            return element;
        },
    });

    $(document).on(Metro.events.click, function () {
        $.each($(".time-picker"), function () {
            $(this)
                .find("input")
                .each(function () {
                    Metro.getPlugin(this, "timepicker").close();
                });
        });
    });
})(Metro, Dom);
