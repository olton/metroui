((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let SpinnerDefaultConfig = {
        spinnerDeferred: 0,
        label: "",
        step: 1,
        plusIcon: "+",
        minusIcon: "-",
        buttonsPosition: "default",
        defaultValue: 0,
        minValue: null,
        maxValue: null,
        fixed: 0,
        repeatThreshold: 2000,
        hideCursor: false,
        clsSpinner: "",
        clsSpinnerInput: "",
        clsSpinnerButton: "",
        clsSpinnerButtonPlus: "",
        clsSpinnerButtonMinus: "",
        clsLabel: "",
        onBeforeChange: Metro.noop_true,
        onChange: Metro.noop,
        onPlusClick: Metro.noop,
        onMinusClick: Metro.noop,
        onArrowUp: Metro.noop,
        onArrowDown: Metro.noop,
        onButtonClick: Metro.noop,
        onArrowClick: Metro.noop,
        onSpinnerCreate: Metro.noop,
    };

    Metro.spinnerSetup = (options) => {
        SpinnerDefaultConfig = $.extend({}, SpinnerDefaultConfig, options);
    };

    if (typeof globalThis.metroSpinnerSetup !== "undefined") {
        Metro.spinnerSetup(globalThis.metroSpinnerSetup);
    }

    Metro.Component("spinner", {
        init: function (options, elem) {
            this._super(elem, options, SpinnerDefaultConfig, {
                repeat_timer: false,
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("spinner-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const spinner = $("<div>")
                .addClass("spinner")
                .addClass(`buttons-${o.buttonsPosition}`)
                .addClass(element[0].className)
                .addClass(o.clsSpinner);
            const button_plus = $("<button>")
                .attr("type", "button")
                .addClass("button spinner-button spinner-button-plus")
                .addClass(`${o.clsSpinnerButton} ${o.clsSpinnerButtonPlus}`)
                .html(o.plusIcon);
            const button_minus = $("<button>")
                .attr("type", "button")
                .addClass("button spinner-button spinner-button-minus")
                .addClass(`${o.clsSpinnerButton} ${o.clsSpinnerButtonMinus}`)
                .html(o.minusIcon);
            const init_value = element.val().trim();

            if (!Metro.utils.isValue(init_value)) {
                element.val(0);
            }

            element[0].className = "";

            spinner.insertBefore(element);
            element.appendTo(spinner).addClass(o.clsSpinnerInput);

            element.addClass("metro-input");

            button_plus.appendTo(spinner);
            button_minus.appendTo(spinner);

            if (o.hideCursor === true) {
                spinner.addClass("hide-cursor");
            }

            if (o.label) {
                const label = $("<label>")
                    .addClass("label-for-input")
                    .addClass(o.clsLabel)
                    .html(o.label)
                    .insertBefore(spinner);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                } else {
                    const id = Hooks.useId(element[0]);
                    label.attr("for", id);
                    element.attr("id", id);
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (o.disabled === true || element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const spinner = element.closest(".spinner");
            let repeat_timer;

            const spinnerButtonClick = (plus) => {
                const events = [
                    plus ? "plus-click" : "minus-click",
                    plus ? "arrow-up" : "arrow-down",
                    "button-click",
                    "arrow-click",
                ];
                const curr = +element.val();
                let val = +element.val();
                const step = +o.step;

                if (plus) {
                    val += step;
                } else {
                    val -= step;
                }

                this._setValue(val.toFixed(o.fixed), true);

                this._fireEvents(events, {
                    curr: curr,
                    val: val,
                    elementVal: element.val(),
                    button: plus ? "plus" : "minus",
                });
            };

            spinner.on(
                Metro.events.startAll,
                ".spinner-button",
                function (e) {
                    const plus = $(this).hasClass("spinner-button-plus");
                    repeat_timer = setInterval(() => {
                        spinnerButtonClick(plus);
                    }, 100);
                },
                { passive: true },
            );

            spinner.on(
                Metro.events.stopAll,
                ".spinner-button",
                (e) => {
                    clearInterval(repeat_timer);
                },
                { passive: true },
            );

            spinner.on(
                Metro.events.click,
                ".spinner-button",
                function (e) {
                    const plus = $(this).hasClass("spinner-button-plus");
                    spinnerButtonClick(plus);
                },
                { passive: true },
            );

            spinner.on(Metro.events.click, (e) => {
                $(".focused").removeClass("focused");
                spinner.addClass("focused");

                e.preventDefault();
                e.stopPropagation();
            });
        },

        _setValue: function (val = 0, trigger_change = false) {
            const element = this.element;
            const o = this.options;

            if (Metro.utils.exec(o.onBeforeChange, [val], element[0]) !== true) {
                return;
            }

            let _val = +val;

            if (_val > Number(o.maxValue)) {
                _val = Number(o.maxValue);
            }

            if (_val < Number(o.minValue)) {
                _val = Number(o.minValue);
            }

            element.val(val);

            this._fireEvent("change", { val: val }, false, true);

            if (trigger_change === true) {
                element.fire("change", {
                    val: val,
                });
            }
        },

        val: function (val) {
            const element = this.element;
            const o = this.options;
            if (!Metro.utils.isValue(val)) {
                return element.val();
            }

            this._setValue(val.toFixed(o.fixed), true);
        },

        toDefault: function () {
            const o = this.options;
            const val = Metro.utils.isValue(o.defaultValue) ? Number(o.defaultValue) : 0;
            this._setValue(val.toFixed(o.fixed), true);

            this._fireEvent("change", {
                val: val,
            });
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

        changeAttribute: function (attributeName) {
            const element = this.element;

            const changeValue = () => {
                const val = element.attr("value").trim();
                if (Metro.utils.isValue(val)) {
                    this._setValue(Number(val), false);
                }
            };

            switch (attributeName) {
                case "disabled":
                    this.toggleState();
                    break;
                case "value":
                    changeValue();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const o = this.options;
            const spinner = element.closest(".spinner");
            const spinner_buttons = spinner.find(".spinner-button");

            spinner.off(Metro.events.click);
            spinner_buttons.off(Metro.events.start);
            spinner_buttons.off(Metro.events.stop);
            element.off(Metro.events.keydown);
            spinner.off(Metro.events.keyup);

            if (o.label) {
                spinner.prev("label").remove();
            }
            spinner.remove();
        },
    });

    $(document).on(Metro.events.click, () => {
        $(".spinner").removeClass("focused");
    });
})(Metro, Dom);
