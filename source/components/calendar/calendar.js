/** @format */

(function (Metro, $) {
    "use strict";

    let CalendarDefaultConfig = {
        weekStart: null,
        static: false,
        readonly: false,
        showGhost: false,
        events: null,
        startContent: "days",
        showTime: false,
        initialTime: null,
        initialHours: null,
        initialMinutes: null,
        labelTimeHours: null,
        labelTimeMinutes: null,

        animationContent: true,
        animationSpeed: 10,

        calendarDeferred: 0,
        dayBorder: false,
        excludeDay: null,
        prevMonthIcon: "⯇",
        nextMonthIcon: "⯈",
        prevYearIcon: "⯇",
        nextYearIcon: "⯈",
        compact: false,
        wide: false,
        widePoint: null,
        pickerMode: false,
        show: null,
        outside: true,
        buttons: "", //cancel, today, clear, done
        yearsBefore: 100,
        yearsAfter: 100,
        headerFormat: "dddd, MMM DD",
        showHeader: true,
        showFooter: true,
        showWeekNumber: false,

        isDialog: false,
        ripple: false,
        rippleColor: "#cccccc",
        exclude: null,
        preset: null,
        minDate: null,
        maxDate: null,
        weekDayClick: false,
        weekNumberClick: false,
        multiSelect: false,
        special: null,
        format: METRO_DATE_FORMAT,
        inputFormat: null,

        clsCalendar: "",
        clsCalendarHeader: "",
        clsCalendarContent: "",
        clsCalendarFooter: "",
        clsCalendarMonths: "",
        clsCalendarYears: "",
        clsToday: "",
        clsSelected: "",
        clsExcluded: "",
        clsCancelButton: "",
        clsTodayButton: "",
        clsClearButton: "",
        clsDoneButton: "",
        clsEventCounter: "",
        clsWeekend: "",
        clsCurrentWeek: "",
        clsCalendarTime: "",
        clsTime: "",
        clsTimeHours: "",
        clsTimeMinutes: "",
        clsTimeButton: "",
        clsTimeButtonPlus: "",
        clsTimeButtonMinus: "",
        clsSpecial: "",
        clsEvents: "",
        clsEvent: "",

        onCancel: Metro.noop,
        onToday: Metro.noop,
        onClear: Metro.noop,
        onDone: Metro.noop,
        onDayClick: Metro.noop,
        onDrawDay: Metro.noop,
        onDrawMonth: Metro.noop,
        onDrawYear: Metro.noop,
        onWeekDayClick: Metro.noop,
        onWeekNumberClick: Metro.noop,
        onMonthChange: Metro.noop,
        onYearChange: Metro.noop,
        onTimeChange: Metro.noop,
        onHoursChange: Metro.noop,
        onMinutesChange: Metro.noop,
        onCalendarCreate: Metro.noop,
    };

    Metro.calendarSetup = function (options) {
        CalendarDefaultConfig = $.extend({}, CalendarDefaultConfig, options);
    };

    if (typeof globalThis["metroCalendarSetup"] !== undefined) {
        Metro.calendarSetup(globalThis["metroCalendarSetup"]);
    }

    Metro.Component("calendar", {
        init: function (options, elem) {
            const now = datetime().align("day");

            this._super(elem, options, CalendarDefaultConfig, {
                today: now,
                show: now,
                current: {
                    year: now.year(),
                    month: now.month(),
                    day: now.day(),
                },
                preset: [],
                selected: [],
                exclude: [],
                special: [],
                excludeDay: [],
                events: [],
                min: null,
                max: null,
                minYear: null,
                maxYear: null,
                id: Metro.utils.elementId("calendar"),
                time: [datetime().hour(), datetime().minute()],
                content: "days",
                yearDistance: 11,
                yearGroupStart: now.year(),
            });

            return this;
        },

        _create: function () {
            const element = this.element,
                o = this.options;

            this.content = o.startContent;
            this.minYear = this.current.year - this.options.yearsBefore;
            this.maxYear = this.current.year + this.options.yearsAfter;

            element
                .html("")
                .addClass("calendar " + (o.compact === true ? "compact" : ""))
                .addClass(o.clsCalendar);

            if (Metro.utils.isValue(o.initialTime)) {
                this.time = o.initialTime.split(":");
            }

            if (Metro.utils.isValue(o.initialHours) && Metro.utils.between(o.initialHours, 0, 23, true)) {
                this.time[0] = parseInt(o.initialHours);
            }

            if (Metro.utils.isValue(o.initialMinutes) && Metro.utils.between(o.initialMinutes, 0, 59, true)) {
                this.time[1] = parseInt(o.initialMinutes);
            }

            if (o.dayBorder === true) {
                element.addClass("day-border");
            }

            if (Metro.utils.isValue(o.excludeDay)) {
                this.excludeDay = ("" + o.excludeDay).toArray(",", "int");
            }

            if (Metro.utils.isValue(o.preset)) {
                this._dates2array(o.preset, "selected");
            }

            if (Metro.utils.isValue(o.exclude)) {
                this._dates2array(o.exclude, "exclude");
            }

            if (Metro.utils.isValue(o.special)) {
                this._dates2array(o.special, "special");
            }

            if (Metro.utils.isValue(o.events)) {
                this._dates2array(o.events, "events");
            }

            this.min = o.minDate ? (o.inputFormat ? Datetime.from(o.minDate, o.inputFormat) : datetime(o.minDate)).align("day") : null;
            this.max = o.maxDate ? (o.inputFormat ? Datetime.from(o.maxDate, o.inputFormat) : datetime(o.maxDate)).align("day") : null;

            if (o.show) {
                this.show = (!o.show ? datetime() : o.inputFormat ? Datetime.from(o.show, o.inputFormat) : datetime(o.show)).align("day");
                this.current = {
                    year: this.show.year(),
                    month: this.show.month(),
                    day: this.show.day(),
                };
            }

            this._drawCalendar();
            this._createEvents();

            if (o.wide === true) {
                element.addClass("calendar-wide");
            } else {
                if (!Metro.utils.isNull(o.widePoint) && Metro.utils.mediaExist(o.widePoint)) {
                    element.addClass("calendar-wide");
                }
            }

            if (o.ripple === true && Metro.utils.isFunc(element.ripple) !== false) {
                element.ripple({
                    rippleTarget: ".button, .prev-month, .next-month, .prev-year, .next-year, .day",
                    rippleColor: this.options.rippleColor,
                });
            }

            this._fireEvent("calendar-create");
        },

        _dates2array: function (val, category) {
            const that = this,
                o = this.options;
            let dates;

            if (Metro.utils.isNull(val)) {
                return;
            }

            dates = typeof val === "string" ? val.toArray() : Array.isArray(val) ? val : [];

            $.each(dates, function () {
                let _d, date = this;
                try {
                    _d = this._correctDate(o.inputFormat ? Datetime.from(date, o.inputFormat) : datetime(date)).format("YYYY-MM-DD");
                } catch (e) {
                    return;
                }

                that[category].push(_d);
            });
        },
        
        _correctDate: function (date) {
            return datetime(date).addDay(1).align("day").addMinute(new Date().getTimezoneOffset());
        },

        _createEvents: function () {
            const that = this,
                element = this.element,
                o = this.options;

            $(globalThis).on(
                Metro.events.resize,
                function () {
                    if (o.wide !== true) {
                        if (!Metro.utils.isNull(o.widePoint) && Metro.utils.mediaExist(o.widePoint)) {
                            element.addClass("calendar-wide");
                        } else {
                            element.removeClass("calendar-wide");
                        }
                    }
                },
                { ns: this.id },
            );

            element.on(Metro.events.click, ".button-collapse", function () {
                element.toggleClass("calendar-collapsed");
            })
            
            element.on(Metro.events.click, ".prev-year-group, .next-year-group", function () {
                if (o.static) {
                    return;
                }

                if ($(this).hasClass("prev-year-group")) {
                    that.yearGroupStart -= that.yearDistance;
                } else {
                    that.yearGroupStart += that.yearDistance;
                }
                that._drawContent();
            });

            element.on(Metro.events.click, ".prev-month, .next-month, .prev-year, .next-year", function () {
                let new_date,
                    el = $(this);

                if (o.static) {
                    return;
                }

                if (el.hasClass("prev-month")) {
                    new_date = datetime(that.current.year, that.current.month - 1, 1).useLocale(that.locale, true);
                    if (new_date.year() < that.minYear) {
                        return;
                    }
                }
                if (el.hasClass("next-month")) {
                    new_date = datetime(that.current.year, that.current.month + 1, 1).useLocale(that.locale, true);
                    if (new_date.year() > that.maxYear) {
                        return;
                    }
                }
                if (el.hasClass("prev-year")) {
                    new_date = datetime(that.current.year - 1, that.current.month, 1).useLocale(that.locale, true);
                    if (new_date.year() < that.minYear) {
                        return;
                    }
                }
                if (el.hasClass("next-year")) {
                    new_date = datetime(that.current.year + 1, that.current.month, 1).useLocale(that.locale, true);
                    if (new_date.year() > that.maxYear) {
                        return;
                    }
                }

                that.current = {
                    year: new_date.year(),
                    month: new_date.month(),
                    day: new_date.day(),
                };

                setTimeout(
                    function () {
                        that._drawContent();

                        if (el.hasClass("prev-month") || el.hasClass("next-month")) {
                            that._fireEvent("month-change", {
                                current: that.current,
                            });
                        }

                        if (el.hasClass("prev-year") || el.hasClass("next-year")) {
                            that._fireEvent("year-change", {
                                current: that.current,
                            });
                        }
                    },
                    o.ripple ? 300 : 1,
                );
            });

            element.on(Metro.events.click, ".button-today", function () {
                that.toDay();
                that._fireEvent("today", {
                    today: that.today.val(),
                    time: that.time,
                });
            });

            element.on(Metro.events.click, ".button-clear", function () {
                const date = datetime();

                that.selected = [];
                that.time = [date.hour(), date.minute()];
                that.yearGroupStart = date.year();
                that._drawContent();
                that._fireEvent("clear");
            });

            element.on(Metro.events.click, ".button-cancel", function () {
                that._drawContent();
                that._fireEvent("cancel");
            });

            element.on(Metro.events.click, ".button-done", function () {
                that._drawContent();
                that._fireEvent("done", {
                    selected: that.selected,
                    time: that.time,
                });
            });

            if (o.weekDayClick === true) {
                element.on(Metro.events.click, ".week-days .week-day", function (e) {
                    let day,
                        index,
                        days,
                        ii = [];

                    if (o.static || o.readonly) {
                        return;
                    }

                    day = $(this);
                    index = day.index();

                    for (let i = 0; i < 7; i++) {
                        ii.push(index);
                        index += o.showWeekNumber ? 8 : 7;
                    }

                    if (o.multiSelect === true) {
                        days = element.find(".day").filter(function (el) {
                            const $el = $(el);
                            return ii.indexOf($el.index()) > -1 && !$el.hasClass("outside disabled excluded");
                        });

                        $.each(days, function () {
                            const $el = $(this);
                            const day = $el.data("day");

                            if (that.selected.indexOf(day) === -1) {
                                that.selected.push(day);
                                $el.addClass("selected").addClass(o.clsSelected);
                            } else {
                                $el.removeClass("selected").removeClass(o.clsSelected);
                                Metro.utils.arrayDelete(that.selected, day);
                            }
                        });
                    }

                    that._fireEvent("week-day-click", {
                        selected: that.selected,
                        day: day[0],
                    });

                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            if (o.weekNumberClick) {
                element.on(Metro.events.click, ".week-number", function (e) {
                    let $el, wn, index, days;

                    $el = $(this);
                    wn = $el.text();
                    index = $el.index();

                    if (wn === "#") {
                        return;
                    }

                    if (o.static || o.readonly) {
                        return;
                    }

                    if (o.multiSelect === true) {
                        days = element.find(".day").filter(function (el) {
                            const $el = $(el);
                            const elIndex = $el.index();
                            return Metro.utils.between(elIndex, index, index + 8, false) && !$el.hasClass("outside disabled excluded");
                        });

                        $.each(days, function () {
                            const $el = $(this);
                            const day = $el.data("day");

                            if (that.selected.indexOf(day) === -1) {
                                that.selected.push(day);
                                $el.addClass("selected").addClass(o.clsSelected);
                            } else {
                                $el.removeClass("selected").removeClass(o.clsSelected);
                                Metro.utils.arrayDelete(that.selected, day);
                            }
                        });
                    }

                    that._fireEvent("week-number-click", {
                        selected: that.selected,
                        num: wn,
                        numElement: $el[0],
                    });

                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            element.on(Metro.events.click, ".day", function (e) {
                const day = $(this);
                let index, date;

                if (o.static || o.readonly) {
                    return;
                }

                date = day.data("day");
                index = that.selected.indexOf(date);

                if (day.hasClass("outside")) {
                    date = datetime(date);
                    that.current = {
                        year: date.year(),
                        month: date.month(),
                        day: date.day(),
                    };
                    that._drawContent();

                    that._fireEvent("month-change", {
                        current: that.current,
                    });

                    return;
                }

                if (!day.hasClass("disabled")) {
                    if (o.pickerMode === true) {
                        that.selected = [date];
                        that.today = datetime(date);
                        that.current.year = that.today.year();
                        that.current.month = that.today.month();
                        that.current.day = that.today.day();
                        that._drawHeader();
                        that._drawContent();
                    } else {
                        if (index === -1) {
                            if (o.multiSelect === false) {
                                element.find(".day").removeClass("selected").removeClass(o.clsSelected);
                                that.selected = [];
                            }
                            that.selected.push(date);
                            day.addClass("selected").addClass(o.clsSelected);
                        } else {
                            day.removeClass("selected").removeClass(o.clsSelected);
                            Metro.utils.arrayDelete(that.selected, date);
                        }
                    }
                }

                that._fireEvent("day-click", {
                    selected: that.selected,
                    day: day[0],
                    time: that.time,
                });

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".curr-month, .header-day", function (e) {
                that.content = "months";
                that._drawContent();

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".month", function (e) {
                that.current.month = parseInt($(this).attr("data-month"));
                that.content = "days";
                that._drawContent();

                that._fireEvent("month-change", {
                    current: that.current,
                });

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".curr-year, .header-year", function (e) {
                if (that.content === "years") {
                    return;
                }
                that.content = "years";
                that._drawContent();

                e.preventDefault();
                e.stopPropagation();
            });

            element.on(Metro.events.click, ".year", function (e) {
                that.current.year = parseInt($(this).attr("data-year"));
                that.yearGroupStart = that.current.year;
                that.content = "months";
                that._drawContent();

                that._fireEvent("year-change", {
                    current: that.current,
                });

                e.preventDefault();
                e.stopPropagation();
            });
        },

        _drawHeader: function () {
            const element = this.element,
                o = this.options;
            let header = element.find(".calendar-header");

            if (header.length === 0) {
                header = $("<div>").addClass("calendar-header").addClass(o.clsCalendarHeader).appendTo(element);
            }

            header.html("");

            $("<div>").addClass("header-year").html(this.today.year()).appendTo(header);
            $("<div>").addClass("header-day").html(this.today.format(o.headerFormat, this.locale)).appendTo(header);
            
            const headerActions = $("<div>").addClass("header-actions").appendTo(header);

            // $("<button>").addClass("square small button-today").html(`
            //     <svg aria-hidden="true" class="caret" width="16" height="16"  viewBox="0 0 24 24"> 
            //         <path d="M15 17C16.1046 17 17 16.1046 17 15C17 13.8954 16.1046 13 15 13C13.8954 13 13 13.8954 13 15C13 16.1046 13.8954 17 15 17Z"/>
            //         <path d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM5 18V7H19V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18Z" />
            //     </svg>
            // `).attr("title", this.strings.label_today).appendTo(headerActions)

            $("<button>").addClass("square small button-collapse").html(`
                <svg aria-hidden="true" class="caret toggle-collapsed" width="16" height="16" viewBox="0 0 24 24">
                    <path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"></path>
                </svg>
            `).attr("title", this.strings.label_collapse).appendTo(headerActions)
           
            
            if (o.showHeader === false) {
                header.hide();
            }
        },

        _drawFooter: function () {
            const element = this.element,
                o = this.options,
                strings = this.strings;
            let footer = element.find(".calendar-footer");

            if (!o.buttons) {
                return;
            }

            if (footer.length === 0) {
                footer = $("<div>").addClass("calendar-footer").addClass(o.clsCalendarFooter).appendTo(element);
            }

            footer.html("");

            $.each(o.buttons.toArray(","), function () {
                const button = $("<button>")
                    .attr("type", "button")
                    .addClass("button " + `button-${this}` + " " + o["cls" + Str.capitalize(this) + "Button"])
                    .html(strings[`label_${this}`])
                    .appendTo(footer);
                if (this === "cancel" || this === "done") {
                    button.addClass("js-dialog-close");
                }
            });

            if (o.showFooter === false) {
                footer.hide();
            }
        },

        _drawTime: function () {
            const that = this,
                element = this.element,
                o = this.options;
            const strings = this.strings;
            const calendarContent = element.find(".calendar-content");
            const time = $("<div>").addClass("calendar-time").addClass(o.clsCalendarTime).appendTo(calendarContent);
            let inner, hours, minutes, row;
            let h = "" + this.time[0];
            let m = "" + this.time[1];

            const onChange = function (val) {
                const value = parseInt(val);
                if ($(this).attr("data-time-part") === "hours") {
                    that.time[0] = value;
                    that._fireEvent("hours-change", {
                        time: that.time,
                        hours: value,
                    });
                } else {
                    that.time[1] = value;
                    that._fireEvent("minutes-change", {
                        time: that.time,
                        minutes: value,
                    });
                }

                that._fireEvent("time-change", {
                    time: that.time,
                });
            };

            time.append((inner = $("<div>").addClass("calendar-time__inner")));

            inner.append((row = $("<div>").addClass("calendar-time__inner-row")));
            row.append($("<div>").addClass("calendar-time__inner-cell").append($("<span>").html(strings["label_hours"])));
            row.append($("<div>").addClass("calendar-time__inner-cell").append($("<span>").html(strings["label_minutes"])));

            time.append((inner = $("<div>").addClass("calendar-time__inner spinners").addClass(o.clsTime)));
            inner.append(
                (hours = $(
                    "<input type='text' data-cls-spinner-input='" +
                        o.clsTimeHours +
                        "' data-time-part='hours' data-buttons-position='right' data-min-value='0' data-max-value='23'>",
                )
                    .addClass("hours")
                    .addClass(o.compact ? "input-small" : "input-normal")),
            );
            inner.append(
                (minutes = $(
                    "<input type='text' data-cls-spinner-input='" +
                        o.clsTimeMinutes +
                        "' data-time-part='minutes' data-buttons-position='right' data-min-value='0' data-max-value='59'>",
                )
                    .addClass("minutes")
                    .addClass(o.compact ? "input-small" : "input-normal")),
            );

            h = Str.lpad(h, "0", 2);
            m = Str.lpad(m, "0", 2);

            hours.val(h);
            minutes.val(m);

            Metro.makePlugin(inner.find("input[type=text]"), "spinner", {
                onChange: onChange,
                clsSpinnerButton: o.clsTimeButton,
                clsSpinnerButtonPlus: o.clsTimeButtonPlus,
                clsSpinnerButtonMinus: o.clsTimeButtonMinus,
            });

            if (o.showTime === false) {
                time.hide();
            }
        },

        _drawContentDays: function () {
            const that = this,
                element = this.element,
                o = this.options;

            const strings = this.strings;

            let content = element.find(".calendar-content"),
                toolbar,
                weekDays,
                calendarDays;

            const calendar = datetime(this.current.year, this.current.month, this.current.day).useLocale(this.locale, true).calendar(Metro.utils.isValue(o.weekStart) ? o.weekStart : strings["weekStart"]);
            const showDay = this.show.format("YYYY-MM-DD");
            const now = datetime();

            if (content.length === 0) {
                content = $("<div>").addClass("calendar-content").addClass(o.clsCalendarContent).appendTo(element);
            }

            if (o.showWeekNumber) {
                content.addClass("-week-numbers");
            }

            content.empty();

            toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            $("<span>").addClass("prev-month").html(o.prevMonthIcon).appendTo(toolbar);
            $("<span>").addClass("curr-month").html(Datetime.getLocale(this.locale).months[this.current.month]).appendTo(toolbar);
            $("<span>").addClass("next-month").html(o.nextMonthIcon).appendTo(toolbar);

            $("<span>").addClass("prev-year").html(o.prevYearIcon).appendTo(toolbar);
            $("<span>").addClass("curr-year").html(this.current.year).appendTo(toolbar);
            $("<span>").addClass("next-year").html(o.nextYearIcon).appendTo(toolbar);

            weekDays = $("<div>").addClass("week-days").appendTo(content);
            if (o.showWeekNumber) {
                $("<span>").addClass("week-number").html("#").appendTo(weekDays);
            }
            $.each(calendar["weekdays"], function () {
                $("<span>").addClass("week-day").html(this).appendTo(weekDays);
            });

            calendarDays = $("<div>").addClass("days").appendTo(content);

            $.each(calendar["days"], function (i) {
                const day = this;
                const date = that._correctDate(day);
                const outsideDate = date.month() !== that.current.month;

                if (o.showWeekNumber && i % 7 === 0) {
                    $("<span>")
                        .addClass("week-number")
                        .html(`<span class="week-number-content">${date.weekNumber(o.weekStart)}</span>`)
                        .appendTo(calendarDays);
                }

                const _day = date.day(),
                    _data = date.format("YYYY-MM-DD");
                const cell = $("<span>").addClass("day").html(`<span class="day-content">${_day}</span>`).appendTo(calendarDays);

                cell.attr("data-day", _data);

                if (day === showDay) {
                    cell.addClass("showed");
                }

                if (outsideDate) {
                    cell.addClass("outside");
                    if (!o.outside) {
                        cell.empty();
                    }
                }

                if (day === calendar["today"]) {
                    cell.addClass("today");
                }

                if (o.showGhost && date.day() === now.day()) {
                    cell.addClass("coincidental");
                }

                if (that.special.length) {
                    if (that.special.indexOf(day) === -1) {
                        cell.addClass("disabled excluded").addClass(o.clsExcluded);
                    } else {
                        cell.addClass(o.clsSpecial);
                    }
                } else {
                    if (that.selected.indexOf(day) > -1) {
                        cell.addClass("selected").addClass(o.clsSelected);
                    }
                    if (that.exclude.indexOf(day) > -1) {
                        cell.addClass("disabled excluded").addClass(o.clsExcluded);
                    }
                    if (that.min && date.older(that.min)) {
                        cell.addClass("disabled excluded").addClass(o.clsExcluded);
                    }
                    if (that.max && date.younger(that.max)) {
                        cell.addClass("disabled excluded").addClass(o.clsExcluded);
                    }
                }

                if (calendar["weekends"].indexOf(day) !== -1) {
                    cell.addClass(o.clsWeekend);
                }

                if (calendar["week"].indexOf(day) !== -1) {
                    cell.addClass(o.clsCurrentWeek);
                }

                if (that.events.length) {
                    const events = $("<div>").addClass("events").addClass(o.clsEvents).appendTo(cell);
                    $.each(that.events, function () {
                        if (this === day) {
                            const event = $("<div>").addClass("event").addClass(o.clsEvent).appendTo(events);
                            if (!o.clsEvent) {
                                event.css({
                                    backgroundColor: Farbe.Routines.randomColor(),
                                });
                            }
                        }
                    });
                }

                if (o.animationContent) {
                    cell.addClass("to-animate");
                }

                that._fireEvent("draw-day", {
                    date: date.val(),
                    day: date.day(),
                    month: date.month(),
                    year: date.year(),
                    cell: cell[0],
                });
            });

            this._drawTime();
            this._animateContent(".day");
        },

        _drawContentMonths: function () {
            const element = this.element,
                elem = this.elem,
                o = this.options,
                locale = this.locale;

            let content = element.find(".calendar-content");
            let toolbar,
                months,
                month,
                yearToday = datetime().year(),
                monthToday = datetime().month();

            if (content.length === 0) {
                content = $("<div>").addClass("calendar-content").addClass(o.clsCalendarContent).appendTo(element);
            }

            content.clear();

            toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            /**
             * Calendar toolbar
             */

            $("<span>").addClass("prev-year").html(o.prevYearIcon).appendTo(toolbar);
            $("<span>").addClass("curr-year").html(this.current.year).appendTo(toolbar);
            $("<span>").addClass("next-year").html(o.nextYearIcon).appendTo(toolbar);

            content.append((months = $("<div>").addClass("months")));

            let index = 0;
            for (let m of Datetime.getLocale(locale).months) {
                months.append(
                    (month = $("<div>")
                        .attr("data-month", index)
                        .addClass("month")
                        .addClass(index === monthToday && this.current.year === yearToday ? "today" : "")
                        .html(m)),
                );

                if (o.animationContent) {
                    month.addClass("to-animate");
                }

                this._fireEvent("draw-month", {
                    month: index,
                    year: this.current.year,
                    cell: month[0],
                });
                index++;
            }
            Metro.i18n.updateUI(elem, locale);

            this._animateContent(".months .month");
        },

        _drawContentYears: function () {
            const element = this.element,
                o = this.options;
            let content = element.find(".calendar-content");
            let toolbar, years, year;

            if (content.length === 0) {
                content = $("<div>").addClass("calendar-content").addClass(o.clsCalendarContent).appendTo(element);
            }

            content.clear();

            toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            /**
             * Calendar toolbar
             */

            $("<span>").addClass("prev-year-group").html(o.prevYearIcon).appendTo(toolbar);
            $("<span>")
                .addClass("curr-year")
                .html(this.yearGroupStart + " - " + (this.yearGroupStart + this.yearDistance))
                .appendTo(toolbar);
            $("<span>").addClass("next-year-group").html(o.nextYearIcon).appendTo(toolbar);

            content.append((years = $("<div>").addClass("years")));

            for (let i = this.yearGroupStart; i <= this.yearGroupStart + this.yearDistance; i++) {
                years.append(
                    (year = $("<div>")
                        .attr("data-year", i)
                        .addClass("year")
                        .addClass(i === this.current.year ? "today" : "")
                        .html(i)),
                );

                if (o.animationContent) {
                    year.addClass("to-animate");
                }

                if (i < o.minYear || i > o.maxYear) {
                    year.addClass("disabled");
                }

                this._fireEvent("draw-year", {
                    year: i,
                    cell: year[0],
                });
            }

            this._animateContent(".years .year");
        },

        _drawContent: function () {
            switch (this.content) {
                case "years":
                    this._drawContentYears();
                    break;
                case "months":
                    this._drawContentMonths();
                    break;
                default:
                    this._drawContentDays();
            }
            Metro.i18n.updateUI(this.elem, this.locale);
        },

        _drawCalendar: function () {
            const that = this,
                element = this.elem;
            setTimeout(function () {
                that.element.html("");
                that._drawHeader();
                that._drawContent();
                that._drawFooter();
                Metro.i18n.updateUI(element, that.locale);
            }, 0);
        },

        _animateContent: function (target, cls) {
            const element = this.element,
                o = this.options;
            const content = element.find(".calendar-content");

            cls = cls || "to-animate";

            content.find(target).each(function (k) {
                const day = $(this);
                setTimeout(function () {
                    day.removeClass(cls);
                }, o.animationSpeed * k);
            });
        },

        getTime: function (asString = false) {
            let h, m;

            h = Str.lpad(this.time[0], "0", 2);
            m = Str.lpad(this.time[1], "0", 2);

            return asString ? h + ":" + m : this.time;
        },

        setTime: function (time) {
            if (Array.isArray(time)) {
                this.time = time;
            } else {
                this.time = time.split(":");
            }
            this._drawCalendar();
        },

        getPreset: function () {
            return this.preset;
        },

        getSelected: function () {
            return this.selected;
        },

        getExcluded: function () {
            return this.exclude;
        },

        getToday: function () {
            return this.today;
        },

        getCurrent: function () {
            return this.current;
        },

        clearSelected: function () {
            this.selected = [];
            this._drawContent();
        },

        toDay: function () {
            this.today = datetime().align("day");
            this.current = {
                year: this.today.year(),
                month: this.today.month(),
                day: this.today.day(),
            };
            this.time = [datetime().hour(), datetime().minute()];
            this.yearGroupStart = datetime().year();
            this.content = "days";
            this._drawHeader();
            this._drawContent();
        },

        setExclude: function (exclude) {
            const element = this.element,
                o = this.options;
            if (Metro.utils.isNull(exclude) && Metro.utils.isNull(element.attr("data-exclude"))) {
                return;
            }
            o.exclude = !Metro.utils.isNull(exclude) ? exclude : element.attr("data-exclude");
            this._dates2array(o.exclude, "exclude");
            this._drawContent();
        },

        setPreset: function (preset) {
            const element = this.element,
                o = this.options;
            if (Metro.utils.isNull(preset) && Metro.utils.isNull(element.attr("data-preset"))) {
                return;
            }

            o.preset = !Metro.utils.isNull(preset) ? preset : element.attr("data-preset");

            this._dates2array(o.preset, "selected");
            this._drawContent();
        },

        setSpecial: function (special) {
            const element = this.element,
                o = this.options;
            if (Metro.utils.isNull(special) && Metro.utils.isNull(element.attr("data-special"))) {
                return;
            }
            o.special = !Metro.utils.isNull(special) ? special : element.attr("data-special");
            this._dates2array(o.exclude, "special");
            this._drawContent();
        },

        showDate: function (date) {
            return this.setShow(date);
        },

        setShow: function (show) {
            const element = this.element,
                o = this.options;
            const attr = element.attr("data-show");

            if (!show && !attr) {
                return;
            }

            o.show = show ? show : attr;

            if (!o.show) {
                this.show = datetime();
            } else {
                if (typeof o.show === "string" && o.inputFormat) {
                    this.show = Datetime.from(o.show, o.inputFormat);
                } else {
                    this.show = datetime(o.show);
                }
            }

            this.show = this.show.align("day");

            this.current = {
                year: this.show.year(),
                month: this.show.month(),
                day: this.show.day(),
            };

            this._drawContent();
        },

        setMinDate: function (date) {
            const element = this.element,
                o = this.options;
            const attr = element.attr("data-min-date");

            if (!date && !attr) {
                return;
            }

            o.minDate = date ? date : attr;

            this.min = o.minDate ? (o.inputFormat ? Datetime.from(o.minDate, o.inputFormat) : datetime(o.minDate)).align("day") : null;

            this._drawContent();
        },

        setMaxDate: function (date) {
            const element = this.element,
                o = this.options;
            const attr = element.attr("data-max-date");

            o.maxDate = date ? date : attr;

            this.max = o.maxDate ? (o.inputFormat ? Datetime.from(o.maxDate, o.inputFormat) : datetime(o.maxDate)).align("day") : null;

            this._drawContent();
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "data-exclude":
                    this.setExclude();
                    break;
                case "data-preset":
                    this.setPreset();
                    break;
                case "data-special":
                    this.setSpecial();
                    break;
                case "data-show":
                    this.setShow();
                    break;
                case "data-min-date":
                    this.setMinDate();
                    break;
                case "data-max-date":
                    this.setMaxDate();
                    break;
            }
        },

        destroy: function () {
            const element = this.element,
                o = this.options;

            element.off(Metro.events.click, ".prev-month, .next-month, .prev-year, .next-year");
            element.off(Metro.events.click, ".button.today");
            element.off(Metro.events.click, ".button.clear");
            element.off(Metro.events.click, ".button.cancel");
            element.off(Metro.events.click, ".button.done");
            element.off(Metro.events.click, ".week-days .day");
            element.off(Metro.events.click, ".days-row .day");
            element.off(Metro.events.click, ".curr-month");
            element.off(Metro.events.click, ".calendar-months li");
            element.off(Metro.events.click, ".curr-year");
            element.off(Metro.events.click, ".calendar-years li");
            element.off(Metro.events.click);

            if (o.ripple === true) {
                element.data("ripple").destroy();
            }

            $(globalThis).off(Metro.events.resize, { ns: this.id });

            element.remove();
        },
    });

    $(document).on(Metro.events.click, function () {
        $(".calendar .calendar-years").each(function () {
            $(this).removeClass("open");
        });
        $(".calendar .calendar-months").each(function () {
            $(this).removeClass("open");
        });
    });

    Metro.defaults.Calendar = CalendarDefaultConfig;
})(Metro, Dom);
