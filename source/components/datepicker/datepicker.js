((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let DatePickerDefaultConfig = {
        label: "",
        datepickerDeferred: 0,
        gmt: 0,
        format: "YYYY-MM-DD",
        inputFormat: null,
        value: null,
        distance: 3,
        month: true,
        day: true,
        year: true,
        minYear: null,
        maxYear: null,
        defaultYearDistance: 100,
        scrollSpeed: 4,
        copyInlineStyles: false,
        openMode: "auto",
        clsPicker: "",
        clsPart: "",
        clsMonth: "",
        clsDay: "",
        clsYear: "",
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
        onDatePickerCreate: Metro.noop,
    };

    Metro.datePickerSetup = (options) => {
        DatePickerDefaultConfig = $.extend({}, DatePickerDefaultConfig, options);
    };

    if (typeof globalThis.metroDatePickerSetup !== "undefined") {
        Metro.datePickerSetup(globalThis.metroDatePickerSetup);
    }

    Metro.Component("date-picker", {
        init: function (options, elem) {
            this._super(elem, options, DatePickerDefaultConfig, {
                picker: null,
                isOpen: false,
                value: datetime(),
                listTimer: {
                    day: null,
                    month: null,
                    year: null,
                },
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;
            const locale = this.locale;
            const date = datetime();

            if (o.distance < 1) {
                o.distance = 1;
            }

            if (Metro.utils.isValue(element.val())) {
                o.value = element.val();
            }

            if (Metro.utils.isValue(o.value)) {
                this.value = o.inputFormat ? Datetime.from(o.value, o.inputFormat, locale) : datetime(o.value);
            }

            if (o.minYear === null) {
                o.minYear = date.year() - o.defaultYearDistance;
            }

            if (o.maxYear === null) {
                o.maxYear = date.year() + o.defaultYearDistance;
            }

            this._createStructure();
            this._createEvents();
            this._set();

            this._fireEvent("datepicker-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const locale = this.locale;
            let picker;
            let month;
            let day;
            let year;
            let i;
            let j;
            let dateWrapper;
            let selectBlock;

            const id = Metro.utils.elementId("datepicker");

            picker = $("<div>")
                .addClass(`wheel-picker date-picker ${element[0].className}`)
                .addClass(o.clsPicker);

            if (!picker.attr("id")) {
                picker.attr("id", Hooks.useId(element[0]));
            }
            
            picker.insertBefore(element);
            element.appendTo(picker);

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(picker);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            dateWrapper = $("<div>").addClass("date-wrapper").appendTo(picker);

            if (o.month === true) {
                month = $("<div>").addClass("month").addClass(o.clsPart).addClass(o.clsMonth).appendTo(dateWrapper);
            }
            if (o.day === true) {
                day = $("<div>").addClass("day").addClass(o.clsPart).addClass(o.clsDay).appendTo(dateWrapper);
            }
            if (o.year === true) {
                year = $("<div>").addClass("year").addClass(o.clsPart).addClass(o.clsYear).appendTo(dateWrapper);
            }

            const selectWrapper = $("<div>").addClass("select-wrapper").appendTo(picker)
            selectBlock = $("<div>").addClass("select-block").appendTo(selectWrapper);

            if (o.month === true) {
                month = $("<ul>").addClass("sel-month").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(month);
                for (i = 0; i < 12; i++) {
                    const month_name = Datetime.getLocale(locale).months[i];
                    $("<li>")
                        .addClass(`js-month-${i} js-month-real-${month_name.toLowerCase()}`)
                        .html(month_name)
                        .data("value", i)
                        .appendTo(month);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(month);
            }

            if (o.day === true) {
                day = $("<ul>").addClass("sel-day").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(day);
                for (i = 0; i < 31; i++) {
                    $("<li>")
                        .addClass(`js-day-${i} js-day-real-${i + 1}`)
                        .html(i + 1)
                        .data("value", i + 1)
                        .appendTo(day);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(day);
            }

            if (o.year === true) {
                year = $("<ul>").addClass("sel-year").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(year);
                for (i = o.minYear, j = 0; i <= o.maxYear; i++, j++) {
                    $("<li>")
                        .addClass(`js-year-${j} js-year-real-${i}`)
                        .html(i)
                        .data("value", i)
                        .appendTo(year);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(year);
            }

            selectBlock.height((o.distance * 2 + 1) * 40);

            const actionBlock = $("<div>").addClass("action-block").appendTo(selectWrapper)
            $("<button>")
                .attr("type", "button")
                .addClass("button action-today")
                .addClass(o.clsButton)
                .addClass(o.clsTodayButton)
                .html(`<span class="caption">${this.strings.label_today}</span>`)
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

            if (element.prop("disabled")) {
                picker.addClass("disabled");
            }

            this.picker = picker;
        },

        _createEvents: function () {
            const that = this;
            const o = this.options;
            const picker = this.picker;

            picker.on("touchstart", ".select-block ul", function (e) {
                if (e.changedTouches) {
                    return;
                }
                let pageY = Metro.utils.pageXY(e).y;

                $(document).on(
                    "touchmove",
                    (e) => {
                        this.scrollTop -= o.scrollSpeed * (pageY > Metro.utils.pageXY(e).y ? -1 : 1);

                        pageY = Metro.utils.pageXY(e).y;
                    },
                    { ns: picker.attr("id") },
                );

                $(document).on(
                    "touchend",
                    () => {
                        $(document).off(Metro.events.move, { ns: picker.attr("id") });
                        $(document).off(Metro.events.stop, { ns: picker.attr("id") });
                    },
                    { ns: picker.attr("id") },
                );
            });

            picker.on(Metro.events.click, (e) => {
                if (that.isOpen === false) that.open();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-ok", (e) => {
                const sm = picker.find(".sel-month li.active");
                const sd = picker.find(".sel-day li.active");
                const sy = picker.find(".sel-year li.active");

                const m = sm.length === 0 ? that.value.value.getMonth() : sm.data("value")
                const d = sd.length === 0 ? that.value.value.getDate() : sd.data("value")
                const y = sy.length === 0 ? that.value.value.getFullYear() : sy.data("value")
                that.value = datetime(y, m, d);
                // that._correct();
                that._set();
                that.close();
                
                e.preventDefault();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-cancel", (e) => {
                that.close();
                e.preventDefault();
                e.stopPropagation();
            });

            const scrollLatency = 150;
            $.each(["month", "day", "year"], function () {
                const list = picker.find(`.sel-${this}`);

                const scrollFn = Hooks.useDebounce((e) => {

                    that.listTimer[this] = null;

                    const target = Math.round(Math.ceil(list.scrollTop()) / 40)
                    const targetElement = list.find(`.js-${this}-${target}`)
                    const scrollTop = targetElement.position().top - o.distance * 40
                    list.find(".active").removeClass("active");

                    list[0].scrollTop = scrollTop;
                    targetElement.addClass("active");
                    Metro.utils.exec(o.onScroll, [targetElement, list, picker], list[0]);
                }, scrollLatency)

                list.on("scroll", scrollFn)
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
                Metro.utils.exec(o.onScroll, [target, list, picker], list[0]);
            })
            
            picker.on(Metro.events.click, ".action-today", (e) => {
                const now = datetime()
                const month = now.month()
                const day = now.day()
                const year = now.year()
                
                picker.find(`.sel-month li.js-month-${month}`).click();
                picker.find(`.sel-day li.js-day-real-${day}`).click();
                picker.find(`.sel-year li.js-year-real-${year}`).click();

                e.preventDefault();
                e.stopPropagation();
            })
        },

        _correct: function () {
            const m = this.value.month();
            const d = this.value.day();
            const y = this.value.year();

            this.value = datetime(y, m, d);
        },

        _set: function () {
            const element = this.element;
            const o = this.options;
            const picker = this.picker;
            const m = Datetime.getLocale(this.locale).months[this.value.month()];
            const d = this.value.day();
            const y = this.value.year();

            if (o.month === true) {
                picker.find(".month").html(m);
            }
            if (o.day === true) {
                picker.find(".day").html(d);
            }
            if (o.year === true) {
                picker.find(".year").html(y);
            }

            element.val(this.value.format(o.format, this.locale)).trigger("change");

            this._fireEvent("set", {
                value: this.value.val(),
                elementValue: element.val(),
                picker: picker,
            });
        },

        open: function () {
            const o = this.options;
            const picker = this.picker;
            const m = this.value.month();
            const d = this.value.day() - 1;
            const y = this.value.year();
            const select_wrapper = picker.find(".select-wrapper");

            $.each($(".date-picker"), function () {
                $(this)
                    .find("input")
                    .each(function () {
                        Metro.getPlugin(this, "datepicker").close();
                    });
            });
            
            select_wrapper.show(0);
            picker.find("li").removeClass("active");

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
            
            if (o.month === true) {
                const m_list = picker.find(".sel-month")
                m_list.scrollTop(0).animate({
                    draw: {
                        scrollTop:
                            m_list
                                .find(`li.js-month-${m}`)
                                .addClass("active")
                                .position().top -
                            40 * o.distance,
                    },
                    dur: 100,
                });
            }
            if (o.day === true) {
                const d_list = picker.find(".sel-day")
                d_list.scrollTop(0).animate({
                    draw: {
                        scrollTop:
                            d_list
                                .find(`li.js-day-${d}`)
                                .addClass("active")
                                .position().top -
                            40 * o.distance,
                    },
                    dur: 100,
                });
            }
            if (o.year === true) {
                const y_list = picker.find(".sel-year")
                y_list.scrollTop(0).animate({
                    draw: {
                        scrollTop:
                            y_list
                                .find(`li.js-year-real-${y}`)
                                .addClass("active")
                                .position().top -
                            40 * o.distance,
                    },
                    dur: 100,
                });
            }

            this.isOpen = true;

            this._fireEvent("open", {
                value: this.value.val(),
                picker: picker,
            });
        },

        close: function () {
            const picker = this.picker;
            const o = this.options;
            picker.find(".select-wrapper").hide(0);
            if (o.openMode === "auto") {
                picker.find(".select-wrapper").parent().removeClass("drop-up-select drop-as-dialog");
            }
            this.isOpen = false;

            this._fireEvent("close", {
                value: this.value.val(),
                picker: picker,
            });
        },

        val: function (value) {
            const o = this.options;

            if (!Metro.utils.isValue(value)) {
                return this.element.val();
            }

            this.value = o.inputFormat ? Datetime.from(value, o.inputFormat, this.locale) : datetime(value);

            this._set();
        },

        date: function (t, f) {
            if (t === undefined) {
                return this.value.val();
            }

            try {
                this.value = Datetime.from(t, f, this.locale);
                this._set();
            } catch (e) {
                return false;
            }
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
                case "disabled":
                    this.toggleState();
                    break;
                case "data-value":
                    this.val(newValue);
                    break;
                case "data-format":
                    this.options.format = newValue;
                    this._set();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const picker = this.picker;

            $.each(["moth", "day", "year"], function () {
                picker.find(`.sel-${this}`).off("scroll");
            });

            picker.off(Metro.events.start, ".select-block ul");
            picker.off(Metro.events.click);
            picker.off(Metro.events.click, ".action-ok");
            picker.off(Metro.events.click, ".action-cancel");

            return element;
        },
    });

    $(document).on(Metro.events.click, () => {
        $.each($(".date-picker"), function () {
            $(this)
                .find("input")
                .each(function () {
                    Metro.getPlugin(this, "datepicker").close();
                });
        });
    });
})(Metro, Dom);
