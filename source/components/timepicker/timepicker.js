((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let TimePickerDefaultConfig = {
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

    Metro.timePickerSetup = (options) => {
        TimePickerDefaultConfig = $.extend({}, TimePickerDefaultConfig, options);
    };

    if (typeof globalThis.metroTimePickerSetup !== "undefined") {
        Metro.timePickerSetup(globalThis.metroTimePickerSetup);
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
                id: Metro.utils.elementId("time-picker"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;
            let i;

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

            if (element.val() === "" && !Metro.utils.isValue(o.value)) {
                o.value = datetime().format("HH:mm:ss");
            }

            this.value = (element.val() !== "" ? element.val() : `${o.value}`).toArray(":");

            for (i = 0; i < 3; i++) {
                if (this.value[i] === undefined || this.value[i] === null) {
                    this.value[i] = 0;
                } else {
                    this.value[i] = Number.parseInt(this.value[i]);
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
            const o = this.options;

            if (o.hoursStep > 1) {
                this.value[0] = Metro.utils.nearest(this.value[0], o.hoursStep, true);
            }
            if (o.minutesStep > 1) {
                this.value[1] = Metro.utils.nearest(this.value[1], o.minutesStep, true);
            }
            if (o.minutesStep > 1) {
                this.value[2] = Metro.utils.nearest(this.value[2], o.secondsStep, true);
            }
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const strings = this.strings;
            let picker;
            let hours;
            let minutes;
            let seconds;
            let i;
            let timeWrapper;
            let selectBlock;

            const id = Hooks.useId(element[0]);
            
            picker = $("<div>")
                .addClass(`wheel-picker time-picker ${element[0].className}`)
                .addClass(o.clsPicker);

            if (!picker.attr("id")) {
                picker.attr("id", id);
            }

            picker.insertBefore(element);
            element.attr("readonly", true).appendTo(picker);

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(picker);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            timeWrapper = $("<div>").addClass("time-wrapper").appendTo(picker);

            if (o.hours === true) {
                hours = $("<div>").attr("data-title", strings.label_hours).addClass("hours").addClass(o.clsPart).addClass(o.clsHours).appendTo(timeWrapper);
            }
            if (o.minutes === true) {
                minutes = $("<div>")
                    .attr("data-title", strings.label_minutes)
                    .addClass("minutes")
                    .addClass(o.clsPart)
                    .addClass(o.clsMinutes)
                    .appendTo(timeWrapper);
            }
            if (o.seconds === true) {
                seconds = $("<div>")
                    .attr("data-title", strings.label_seconds)
                    .addClass("seconds")
                    .addClass(o.clsPart)
                    .addClass(o.clsSeconds)
                    .appendTo(timeWrapper);
            }

            const selectWrapper = $("<div>").addClass("select-wrapper").appendTo(picker)
            selectBlock = $("<div>").addClass("select-block").appendTo(selectWrapper);
            if (o.hours === true) {
                hours = $("<ul>").addClass("sel-hours").appendTo(selectBlock);
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(hours);
                for (i = 0; i < 24; i = i + o.hoursStep) {
                    $("<li>")
                        .addClass(`js-hours-${i}`)
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
                        .addClass(`js-minutes-${i}`)
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
                        .addClass(`js-seconds-${i}`)
                        .html(Str.lpad(i, "0", 2))
                        .data("value", i)
                        .appendTo(seconds);
                }
                for (i = 0; i < o.distance; i++) $("<li>").html("&nbsp;").data("value", -1).appendTo(seconds);
            }

            selectBlock.height((o.distance * 2 + 1) * 40);

            const actionBlock = $("<div>").addClass("action-block").appendTo(selectWrapper)
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
                    { ns: that.id },
                );

                $(document).on(
                    "touchend",
                    () => {
                        $(document).off(Metro.events.move, { ns: that.id });
                        $(document).off(Metro.events.stop, { ns: that.id });
                    },
                    { ns: that.id },
                );
            });

            picker.on(Metro.events.click, (e) => {
                if (that.isOpen === false) that.open();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-ok", (e) => {
                const sh = picker.find(".sel-hours li.active");
                const sm = picker.find(".sel-minutes li.active");
                const ss = picker.find(".sel-seconds li.active");

                const h = sh.length === 0 ? 0 : sh.data("value")
                const m = sm.length === 0 ? 0 : sm.data("value")
                const s = ss.length === 0 ? 0 : ss.data("value")
                that.value = [h, m, s];
                that._normalizeValue();
                that._set();

                that.close();
                e.stopPropagation();
            });

            picker.on(Metro.events.click, ".action-cancel", (e) => {
                that.close();
                e.stopPropagation();
            });

            const scrollLatency = 150;
            $.each(["hours", "minutes", "seconds"], function () {
                const list = picker.find(`.sel-${this}`);

                const scrollFn = Hooks.useDebounce((e) => {
                    let target;

                    that.listTimer[this] = null;

                    target = Math.round(Math.ceil(list.scrollTop()) / 40);

                    if (this === "hours" && o.hoursStep) {
                        target *= Number.parseInt(o.hoursStep);
                    }
                    if (this === "minutes" && o.minutesStep) {
                        target *= Number.parseInt(o.minutesStep);
                    }
                    if (this === "seconds" && o.secondsStep) {
                        target *= Number.parseInt(o.secondsStep);
                    }

                    const targetElement = list.find(`.js-${this}-${target}`)
                    const scrollTop = targetElement.position().top - o.distance * 40
                    list.find(".active").removeClass("active");

                    list[0].scrollTop = scrollTop;
                    targetElement.addClass("active");
                    Metro.utils.exec(o.onScroll, [targetElement, list, picker], list[0]);
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
                Metro.utils.exec(o.onScroll, [target, list, picker], list[0]);
            })

            picker.on(Metro.events.click, ".action-now", (e) => {
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
            const element = this.element;
            const o = this.options;
            const picker = this.picker;
            let h = "00";
            let m = "00";
            let s = "00";

            if (o.hours === true) {
                h = Number.parseInt(this.value[0]);
                picker.find(".hours").html(Str.lpad(h, "0", 2));
            }
            if (o.minutes === true) {
                m = Number.parseInt(this.value[1]);
                picker.find(".minutes").html(Str.lpad(m, "0", 2));
            }
            if (o.seconds === true) {
                s = Number.parseInt(this.value[2]);
                picker.find(".seconds").html(Str.lpad(s, "0", 2));
            }

            element.val([h, m, s].join(":")).trigger("change");

            this._fireEvent("set", {
                val: this.value,
                elementVal: element.val(),
            });
        },

        open: function () {
            const o = this.options;
            const picker = this.picker;
            let h;
            let m;
            let s;
            let h_list;
            let m_list;
            let s_list;
            const items = picker.find("li");
            const select_wrapper = picker.find(".select-wrapper");
            let h_item;
            let m_item;
            let s_item;

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
            
            const animateList = (list, item) => {
                list.scrollTop(0).animate({
                    draw: {
                        scrollTop: item.position().top - o.distance * 40 + list.scrollTop(),
                    },
                    dur: 100,
                });
            };

            if (o.hours === true) {
                h = Number.parseInt(this.value[0]);
                h_list = picker.find(".sel-hours");
                h_item = h_list.find(`li.js-hours-${h}`).addClass("active");
                animateList(h_list, h_item);
            }
            if (o.minutes === true) {
                m = Number.parseInt(this.value[1]);
                m_list = picker.find(".sel-minutes");
                m_item = m_list.find(`li.js-minutes-${m}`).addClass("active");
                animateList(m_list, m_item);
            }
            if (o.seconds === true) {
                s = Number.parseInt(this.value[2]);
                s_list = picker.find(".sel-seconds");
                s_item = s_list.find(`li.js-seconds-${s}`).addClass("active");
                animateList(s_list, s_item);
            }

            this.isOpen = true;

            this._fireEvent("open", {
                val: this.value,
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
                val: this.value,
            });
        },

        _convert: (t) => {
            let result;

            if (Array.isArray(t)) {
                result = t;
            } else if (typeof t.getMonth === "function") {
                result = [t.getHours(), t.getMinutes(), t.getSeconds()];
            } else if (Metro.utils.isObject(t)) {
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
            const element = this.element;
            const picker = this.picker;

            $.each(["hours", "minutes", "seconds"], function () {
                picker.find(`.sel-${this}`).off("scroll");
            });

            picker.off(Metro.events.start, ".select-block ul");
            picker.off(Metro.events.click);
            picker.off(Metro.events.click, ".action-ok");
            picker.off(Metro.events.click, ".action-cancel");

            element.remove();
        },
    });

    $(document).on(Metro.events.click, () => {
        $.each($(".time-picker"), function () {
            $(this)
                .find("input")
                .each(function () {
                    Metro.getPlugin(this, "timepicker").close();
                });
        });
    });
})(Metro, Dom);
