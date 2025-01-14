/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var SpinnerDefaultConfig = {
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
        onSpinnerCreate: Metro.noop
    };

    Metro.spinnerSetup = function (options) {
        SpinnerDefaultConfig = $.extend({}, SpinnerDefaultConfig, options);
    };

    if (typeof globalThis["metroSpinnerSetup"] !== undefined) {
        Metro.spinnerSetup(globalThis["metroSpinnerSetup"]);
    }

    Metro.Component('spinner', {
        init: function( options, elem ) {
            this._super(elem, options, SpinnerDefaultConfig, {
                repeat_timer: false
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("spinner-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var spinner = $("<div>").addClass("spinner").addClass("buttons-"+o.buttonsPosition).addClass(element[0].className).addClass(o.clsSpinner);
            var button_plus = $("<button>").attr("type", "button").addClass("button spinner-button spinner-button-plus").addClass(o.clsSpinnerButton + " " + o.clsSpinnerButtonPlus).html(o.plusIcon);
            var button_minus = $("<button>").attr("type", "button").addClass("button spinner-button spinner-button-minus").addClass(o.clsSpinnerButton + " " + o.clsSpinnerButtonMinus).html(o.minusIcon);
            var init_value = element.val().trim();

            if (!Utils.isValue(init_value)) {
                element.val(0);
            }

            element[0].className = '';

            spinner.insertBefore(element);
            element.appendTo(spinner).addClass(o.clsSpinnerInput);

            element.addClass("metro-input");

            button_plus.appendTo(spinner);
            button_minus.appendTo(spinner);

            if (o.hideCursor === true) {
                spinner.addClass("hide-cursor");
            }

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(spinner);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
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

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var spinner = element.closest(".spinner");
            var spinner_buttons = spinner.find(".spinner-button");
            var value, repeat_timer;

            var spinnerButtonClick = function(plus){
                var events = [plus ? "plus-click" : "minus-click", plus ? "arrow-up" : "arrow-down", "button-click", "arrow-click"];
                var curr = +element.val();
                var val = +element.val();
                var step = +o.step;

                if (plus) {
                    val += step;
                } else {
                    val -= step;
                }

                that._setValue(val.toFixed(o.fixed), true);

                that._fireEvents(events, {
                    curr: curr,
                    val: val,
                    elementVal: element.val(),
                    button: plus ? "plus" : "minus"
                });
            };

            spinner.on(Metro.events.startAll, ".spinner-button", function(e){
                var plus = $(this).hasClass("spinner-button-plus");
                repeat_timer = setInterval(function(){
                    spinnerButtonClick(plus);
                }, 100)
            }, {passive: true});

            spinner.on(Metro.events.stopAll, ".spinner-button", function(e){
                clearInterval(repeat_timer)
            }, {passive: true});

            spinner.on(Metro.events.click, ".spinner-button", function(e){
                var plus = $(this).hasClass("spinner-button-plus");
                spinnerButtonClick(plus);
            }, {passive: true});

            spinner.on(Metro.events.click, function(e){
                $(".focused").removeClass("focused");
                spinner.addClass("focused");

                e.preventDefault();
                e.stopPropagation();
            });
        },

        _setValue: function(val, trigger_change){
            var element = this.element, o = this.options;

            if (Utils.exec(o.onBeforeChange, [val], element[0]) !== true) {
                return ;
            }

            if (Utils.isValue(o.maxValue) && val > Number(o.maxValue)) {
                val =  Number(o.maxValue);
            }

            if (Utils.isValue(o.minValue) && val < Number(o.minValue)) {
                val =  Number(o.minValue);
            }

            element.val(val);

            this._fireEvent("change", {val: val}, false, true);

            if (trigger_change === true) {
                element.fire("change", {
                    val: val
                });
            }
        },

        val: function(val){
            var that = this, element = this.element, o = this.options;
            if (!Utils.isValue(val)) {
                return element.val();
            }

            that._setValue(val.toFixed(o.fixed), true);
        },

        toDefault: function(){
            var o = this.options;
            var val = Utils.isValue(o.defaultValue) ? Number(o.defaultValue) : 0;
            this._setValue(val.toFixed(o.fixed), true);

            this._fireEvent("change", {
                val: val
            });
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        changeAttribute: function(attributeName){
            var that = this, element = this.element;

            var changeValue = function(){
                var val = element.attr('value').trim();
                if (Utils.isValue(val)) {
                    that._setValue(Number(val), false);
                }
            };

            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
                case 'value': changeValue(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var spinner = element.closest(".spinner");
            var spinner_buttons = spinner.find(".spinner-button");

            spinner.off(Metro.events.click);
            spinner_buttons.off(Metro.events.start);
            spinner_buttons.off(Metro.events.stop);
            element.off(Metro.events.keydown);
            spinner.off(Metro.events.keyup);

            return element;
        }
    });

    $(document).on(Metro.events.click, function(){
        $(".spinner").removeClass("focused");
    });
}(Metro, Dom));