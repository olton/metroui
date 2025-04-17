/** @format */

(function (Metro, $) {
    "use strict";

    let CalendarPickerDefaultConfig = {
        label: "",
        value: "",
        calendarpickerDeferred: 0,
        nullValue: true,
        useNow: false,
        prepend: "",
        dialogMode: false,
        dialogPoint: 640,
        dialogOverlay: true,
        overlayColor: "#000000",
        overlayAlpha: 0.5,
        size: "100%",
        format: METRO_DATE_FORMAT,
        inputFormat: null,
        clearButton: false,
        calendarButtonIcon: "📅",
        clearButtonIcon: "❌",
        copyInlineStyles: false,
        openMode: "auto",
        clsPicker: "",
        clsInput: "",
        clsPrepend: "",
        clsLabel: "",
        onDayClick: Metro.noop,
        onCalendarPickerCreate: Metro.noop,
        onCalendarShow: Metro.noop,
        onCalendarHide: Metro.noop,
        onChange: Metro.noop,
        onPickerChange: Metro.noop,
        onMonthChange: Metro.noop,
        onYearChange: Metro.noop,
    };

    Metro.calendarPickerSetup = function (options) {
        CalendarPickerDefaultConfig = $.extend({}, CalendarPickerDefaultConfig, options);
    };

    if (typeof globalThis["metroCalendarPickerSetup"] !== "undefined") {
        Metro.calendarPickerSetup(globalThis["metroCalendarPickerSetup"]);
    }

    Metro.Component("calendar-picker", {
        init: function (options, elem) {
            const time = datetime();
            this._super(elem, options, $.extend({}, Metro.defaults.Calendar, {}, CalendarPickerDefaultConfig), {
                value: null,
                value_date: null,
                calendar: null,
                overlay: null,
                id: Metro.utils.elementId("calendar-picker"),
                time: [time.hour(), time.minute()],
            });

            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("calendar-picker-create", {
                element: this.element,
            });
        },

        _correctTime: function (time) {
            const h = Str.lpad(time[0], "0", 2);
            const m = Str.lpad(time[1], "0", 2);
            return `${h}:${m}`
        },
        
        _createStructure: function () {
            const that = this,
                element = this.element,
                o = this.options,
                locale = this.locale;
            const container = $("<div>").addClass("input " + element[0].className + " calendar-picker");
            const buttons = $("<div>").addClass("button-group");
            let calendarButton,
                clearButton,
                cal = $("<div>");
            let curr, _curr, initTime, initHours, initMinutes, elementValue, preset
            const body = $("body");

            element.attr("type", "text");
            element.attr("autocomplete", "off");
            element.attr("readonly", true);

            if (Metro.utils.isValue(o.initialTime)) {
                this.time = o.initialTime.trim().split(":");
            }

            if (Metro.utils.isValue(o.initialHours)) {
                this.time[0] = parseInt(o.initialHours);
            }

            if (Metro.utils.isValue(o.initialMinutes)) {
                this.time[1] = parseInt(o.initialMinutes);
            }

            curr = ("" + o.value).trim() !== "" ? o.value : element.val().trim();
            preset = curr ? curr : ""

            if (!Metro.utils.isValue(curr)) {
                if (o.useNow) {
                    this.value = datetime().addDay(1).align("day").addMinute(new Date().getTimezoneOffset());
                    this.time = [this.value.hour(), this.value.minute()];
                }
            } else {
                _curr = curr.split(" ");
                this.value = (!o.inputFormat ? datetime(_curr[0]) : Datetime.from(_curr[0], o.inputFormat, locale)).addDay(1).align("day").addMinute(new Date().getTimezoneOffset());
                if (_curr[1]) {
                    this.time = _curr[1].trim().split(":");
                }
            }

            elementValue = !curr && o.nullValue === true ? "" : datetime(that.value).format(o.format, locale);

            if (o.showTime && this.time && elementValue) {
                elementValue += " " + this._correctTime(this.time)
            }

            element.val(elementValue);

            container.insertBefore(element);
            element.appendTo(container);
            buttons.appendTo(container);
            cal.appendTo(o.dialogMode ? body : container);

            if (this.time && this.time.length) {
                initHours = this.time[0];
                if (typeof this.time[1] !== "undefined") initMinutes = this.time[1];
            }

            initTime = o.initialTime;

            if (o.initialHours) {
                initHours = o.initialHours;
            }

            if (o.initialHours) {
                initMinutes = o.initialMinutes;
            }

            Metro.makePlugin(cal, "calendar", {
                showTime: o.showTime,
                initialTime: initTime,
                initialHours: initHours,
                initialMinutes: initMinutes,
                clsCalendarTime: o.clsCalendarTime,
                clsTime: o.clsTime,
                clsTimeHours: o.clsTimeHours,
                clsTimeMinutes: o.clsTimeMinutes,
                clsTimeButton: o.clsTimeButton,
                clsTimeButtonPlus: o.clsTimeButtonPlus,
                clsTimeButtonMinus: o.clsTimeButtonMinus,

                wide: o.wide,
                widePoint: o.widePoint,

                format: o.format,
                inputFormat: o.inputFormat,
                pickerMode: true,
                show: preset,
                preset: preset,
                weekStart: o.weekStart,
                outside: o.outside,
                buttons: false,
                headerFormat: o.headerFormat,

                clsCalendar: [o.clsCalendar, "calendar-for-picker", o.dialogMode ? "dialog-mode" : ""].join(" "),
                clsCalendarHeader: o.clsCalendarHeader,
                clsCalendarContent: o.clsCalendarContent,
                clsCalendarFooter: "d-none",
                clsCalendarMonths: o.clsCalendarMonths,
                clsCalendarYears: o.clsCalendarYears,
                clsToday: o.clsToday,
                clsSelected: o.clsSelected,
                clsExcluded: o.clsExcluded,

                ripple: o.ripple,
                rippleColor: o.rippleColor,
                exclude: o.exclude,
                minDate: o.minDate,
                maxDate: o.maxDate,
                yearsBefore: o.yearsBefore,
                yearsAfter: o.yearsAfter,
                special: o.special,
                events: o.events,
                showHeader: false,
                showFooter: false,
                multiSelect: false,
                showWeekNumber: o.showWeekNumber,
                onDayClick: function (sel, day, time, el) {
                    const date = datetime(sel[0]).addDay(1).align("day").addMinute(new Date().getTimezoneOffset());
                    // const date = datetime(sel[0]).align("day");
                    let elementValue;

                    that._removeOverlay();

                    that.value = date;
                    that.time = time;

                    elementValue = date.format(o.format, locale);

                    if (o.showTime) {
                        elementValue += " " + that._correctTime(time);
                    }

                    element.val(elementValue);
                    element.trigger("change");
                    cal.removeClass("open open-up");
                    cal.hide();

                    that._fireEvent("change", {
                        val: that.value.val(),
                        time: that.time,
                    });

                    that._fireEvent("day-click", {
                        sel: sel,
                        day: day,
                        time: time,
                        el: el,
                    });

                    that._fireEvent("picker-change", {
                        val: that.value.val(),
                        time: that.time,
                    });
                },
                onTimeChange: function (time) {
                    let elementValue, h, m;

                    that.time = time;

                    if (!that.value) {
                        that.value = datetime();
                    }
                    elementValue = that.value.format(o.format, that.locale);

                    if (o.showTime) {
                        elementValue += " " + that._correctTime(time);
                    }

                    element.val(elementValue);

                    that._fireEvent("change", {
                        val: that.value.val(),
                        time: that.time,
                    });

                    that._fireEvent("picker-change", {
                        val: that.value.val(),
                        time: that.time,
                    });
                },
                onMonthChange: o.onMonthChange,
                onYearChange: o.onYearChange,
            });

            this.calendar = cal;

            if (o.clearButton === true) {
                clearButton = $("<button>").addClass("button input-clear-button").attr("tabindex", -1).attr("type", "button").html(o.clearButtonIcon);
                clearButton.appendTo(buttons);
            }

            calendarButton = $("<button>").addClass("button input-calendar-button").attr("tabindex", -1).attr("type", "button").html(o.calendarButtonIcon);
            calendarButton.appendTo(buttons);

            if (o.prepend !== "") {
                const prepend = $("<div>").html(o.prepend);
                prepend.addClass("prepend").addClass(o.clsPrepend).appendTo(container);
            }

            if (element.attr("dir") === "rtl") {
                container.addClass("rtl");
            }

            if (String(o.size).indexOf("%") > -1) {
                container.css({
                    width: o.size,
                });
            } else {
                container.css({
                    width: parseInt(o.size) + "px",
                });
            }

            element[0].className = "";

            if (o.copyInlineStyles === true) {
                $.each(Metro.utils.getInlineStyles(element), function (key, value) {
                    container.css(key, value);
                });
            }

            container.addClass(o.clsPicker);
            element.addClass(o.clsInput);

            if (o.dialogOverlay === true) {
                this.overlay = that._overlay();
            }

            if (o.dialogMode === true) {
                container.addClass("dialog-mode");
            } else {
                if (Metro.utils.media("(max-width: " + o.dialogPoint + "px)")) {
                    container.addClass("dialog-mode");
                    this.calendar.addClass("dialog-mode");
                }
            }

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                } else {
                    const id = Hooks.useId(element[0])
                    label.attr("for", id);
                    element.attr("id", id);
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _createEvents: function () {
            const that = this,
                element = this.element,
                o = this.options;
            const container = element.parent();
            const clear = container.find(".input-clear-button");
            const cal = this.calendar;
            const cal_plugin = Metro.getPlugin(cal[0], "calendar");
            const calendar = this.calendar;

            $(globalThis).on(
                Metro.events.resize,
                function () {
                    if (o.dialogMode !== true) {
                        if (Metro.utils.media("(max-width: " + o.dialogPoint + "px)")) {
                            container.addClass("dialog-mode");
                            calendar.appendTo("body").addClass("dialog-mode");
                        } else {
                            container.removeClass("dialog-mode");
                            calendar.appendTo(container).removeClass("dialog-mode");
                        }
                    }
                },
                { ns: this.id },
            );

            if (clear.length > 0)
                clear.on(Metro.events.click, function (e) {
                    element.val("").trigger("change").blur(); // TODO change blur
                    that.value = null;
                    e.preventDefault();
                    e.stopPropagation();
                });

            // datetime(day).addDay(1).align("day").addMinute(new Date().getTimezoneOffset());
            container.on(Metro.events.click, "button, input", function (e) {
                const value = that.value ? that.value : datetime().addDay(1).align("day").addMinute(new Date().getTimezoneOffset());
                const presetValue = value.format("YYYY/MM/DD");

                value.align("day");

                if (cal.hasClass("open") === false && cal.hasClass("open-up") === false) {
                    $(".calendar-picker .calendar").removeClass("open open-up").hide();

                    cal_plugin.setPreset([presetValue]);
                    cal_plugin.setShow(value);

                    if (container.hasClass("dialog-mode")) {
                        that.overlay.appendTo($("body"));
                    }
                    cal.addClass("open");
                    if (o.openMode === "auto") {
                        if ( !Metro.utils.inViewport(cal[0]) ) {
                            cal.addClass("open-up");
                        }
                        if ( !Metro.utils.inViewport(cal[0]) ) {
                            cal.removeClass("open-up");
                        }
                    } else {
                        if (o.openMode === "up") {
                            cal.addClass("open-up");
                        }
                    }

                    that._fireEvent("calendar-show", {
                        calendar: cal,
                    });
                } else {
                    that._removeOverlay();
                    cal.removeClass("open open-up");

                    that._fireEvent("calendar-hide", {
                        calendar: cal,
                    });
                }

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.blur, function () {
                container.removeClass("focused");
            });
            element.on(Metro.events.focus, function () {
                container.addClass("focused");
            });
            element.on(Metro.events.change, function () {
                Metro.utils.exec(o.onChange, [that.value.val()], element[0]);
            });

            container.on(Metro.events.click, function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        },

        _overlay: function () {
            const o = this.options;

            const overlay = $("<div>");
            overlay.addClass("overlay for-calendar-picker").addClass(o.clsOverlay);

            if (o.overlayColor === "transparent") {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Farbe.Routines.toRGBA(o.overlayColor, o.overlayAlpha),
                });
            }

            return overlay;
        },

        _removeOverlay: function () {
            $("body").find(".overlay.for-calendar-picker").remove();
        },

        clear: function () {
            this.value = datetime();
            this.time = [datetime().hour(), datetime().minute()];
            this.element.val("");
        },

        val: function (v, f) {
            const element = this.element,
                o = this.options;
            let elementValue, h, m;

            if (arguments.length === 0 || Metro.utils.isNull(v)) {
                return {
                    date: this.value.val(),
                    time: this.time,
                };
            }

            if (v === "") {
                return this.clear();
            }

            if (f) {
                o.inputFormat = f;
            }

            const _curr = v.split(" ");
            this.value = !o.inputFormat ? datetime(_curr[0]) : Datetime.from(_curr[0], o.inputFormat, this.locale);
            if (_curr[1]) {
                this.time = _curr[1].trim().split(":");
            }

            this.value.align("day");
            Metro.getPlugin(this.calendar, "calendar").setTime(this.time);

            elementValue = this.value.format(o.format);

            if (o.showTime && this.time && elementValue) {
                elementValue += " " + this._correctTime(this.time)
            }

            element.val(elementValue);
            element.trigger("change");
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

        getTime: function (asString = false) {
            let h, m;
            
            h = Str.lpad(this.time[0], "0", 2);
            m = Str.lpad(this.time[1], "0", 2);

            return asString ? h + ":" + m : this.time;
        },

        changeAttribute: function (attributeName, newValue) {
            const that = this;
            const cal = Metro.getPlugin(this.calendar[0], "calendar");

            switch (attributeName) {
                case "value":
                    that.val(newValue);
                    break;
                case "disabled":
                    this.toggleState();
                    break;
                case "data-special":
                    cal.setSpecial(newValue);
                    break;
                case "data-exclude":
                    cal.setExclude(newValue);
                    break;
                case "data-min-date":
                    cal.setMinDate(newValue);
                    break;
                case "data-max-date":
                    cal.setMaxDate(newValue);
                    break;
                case "data-value":
                    that.val(newValue);
                    break;
            }
        },

        destroy: function () {
            const element = this.element, o = this.options;
            const container = element.parent();
            const clear = container.find(".input-clear-button");

            $(globalThis).off(Metro.events.resize, { ns: this.id });
            clear.off(Metro.events.click);
            container.off(Metro.events.click, "button, input");
            element.off(Metro.events.blur);
            element.off(Metro.events.focus);
            element.off(Metro.events.change);

            Metro.getPlugin(this.calendar, "calendar").destroy();

            if (o.label) {
                container.prev("label").remove()
            }
            container.remove()
        },
    });

    $(document).on(Metro.events.click, ".overlay.for-calendar-picker", function () {
        $(this).remove();
        $(".calendar-for-picker.open").removeClass("open open-up");
    });

    $(document).on(Metro.events.click, function () {
        $(".calendar-picker .calendar").removeClass("open open-up");
    });
})(Metro, Dom);
