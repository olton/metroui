/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;

    globalThis.CHECKBOX_STATE = {
        CHECKED: 1,
        UNCHECKED: -1,
        INDETERMINATE: 0,
    }

    var CheckboxThreeStateDefaultConfig = {
        checkboxDeferred: 0,
        state: CHECKBOX_STATE.UNCHECKED,
        transition: true,
        style: 1,
        caption: "",
        captionPosition: "right",
        clsCheckbox: "",
        clsCheck: "",
        clsCaption: "",
        onCheckboxCreate: Metro.noop
    };

    Metro.metroCheckboxThreeStateSetup = function (options) {
        CheckboxThreeStateDefaultConfig = $.extend({}, CheckboxThreeStateDefaultConfig, options);
    };

    if (typeof globalThis["metroCheckboxThreeStateSetup"] !== undefined) {
        Metro.metroCheckboxThreeStateSetup(globalThis["metroCheckboxThreeStateSetup"]);
    }

    Metro.Component('checkbox-three-state', {
        init: function( options, elem ) {
            this._super(elem, options, CheckboxThreeStateDefaultConfig, {
                origin: {
                    className: ""
                },
                state: CHECKBOX_STATE.UNCHECKED
            });

            return this;
        },

        _create: function(){
            var o = this.options;

            if (o.state === CHECKBOX_STATE.UNCHECKED || o.state === "unchecked") {
                this.state = CHECKBOX_STATE.UNCHECKED
            } else if (o.state === 0 || o.state === "indeterminate") {
                this.state = CHECKBOX_STATE.INDETERMINATE
            } else {
                this.state = CHECKBOX_STATE.CHECKED
            }

            this._createStructure();
            this._createEvents();
            this._fireEvent("checkbox-create");
        },

        _indeterminate: function(v){
            var element = this.element;

            v = Utils.isNull(v) ? true : Utils.bool(v);

            element[0].indeterminate = v;
            element.attr("data-indeterminate", v);
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var checkbox;
            var check = $("<span>").addClass("check");
            var caption = $("<span>").addClass("caption").html(o.caption);

            element.attr("type", "checkbox");

            if (element.attr("readonly") !== undefined) {
                element.on("click", function(e){
                    e.preventDefault();
                })
            }

            checkbox = element
                .wrap("<label>")
                .addClass("checkbox " + element[0].className)
                .addClass(o.style === 2 ? "style2" : "");

            check.appendTo(checkbox);
            caption.appendTo(checkbox);

            if (o.transition === true) {
                checkbox.addClass("transition-on");
            }

            if (o.captionPosition === 'left') {
                checkbox.addClass("caption-left");
            }

            this.origin.className = element[0].className;
            element[0].className = '';

            checkbox.addClass(o.clsCheckbox);
            caption.addClass(o.clsCaption);
            check.addClass(o.clsCheck);

            if (this.elem.checked && this.state !== CHECKBOX_STATE.INDETERMINATE) {
                this.state = true
            }

            this._drawState()

            if (element.is(':disabled')) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _drawState: function(){
            var elem = this.elem;

            this._indeterminate(false)

            elem.checked = this.state !== CHECKBOX_STATE.UNCHECKED;

            if (this.state === CHECKBOX_STATE.INDETERMINATE) {
                this._indeterminate(true)
            }
        },

        _createEvents: function(){
            var element = this.element,
                check = element.siblings(".check");
            var that = this

            element.on("click", function(){
                that.state++
                if (that.state === 2) {
                    that.state = -1
                }
                that._drawState()
            })

            element.on("focus", function(){
                check.addClass("focused");
            });

            element.on("blur", function(){
                check.removeClass("focused");
            });
        },

        check: function(){
            this.setCheckState(CHECKBOX_STATE.CHECKED)
        },

        uncheck: function(){
            this.setCheckState(CHECKBOX_STATE.UNCHECKED)
        },

        indeterminate: function(){
            this.setCheckState(CHECKBOX_STATE.INDETERMINATE)
        },

        setCheckState: function(state){
            if (state === -1 || state === "unchecked") {
                this.state = CHECKBOX_STATE.UNCHECKED
            } else if (state === 0 || state === "indeterminate") {
                this.state = CHECKBOX_STATE.INDETERMINATE
            } else {
                this.state = CHECKBOX_STATE.CHECKED
            }

            this._drawState();

            return this;
        },

        getCheckState: function(asString){
            if (!asString) {
                return this.state;
            }

            switch (this.state) {
                case -1: return "unchecked";
                case 0: return "indeterminate";
                case 1: return "checked";
            }
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggle: function(){
            this.state++
            if (this.state === 2) {
                this.state = -1
            }
            this._drawState()
        },

        changeAttribute: function(attr, newVal){
            var element = this.element, o = this.options;
            var parent = element.parent();

            var changeStyle = function(){
                var new_style = parseInt(element.attr("data-style"));

                if (!Utils.isInt(new_style)) return;

                o.style = new_style;
                parent.removeClass("style1 style2").addClass("style"+new_style);
            };

            var toggleElementAccessible = function(){
                if (this.elem.disabled) {
                    this.disable();
                } else {
                    this.enable();
                }
            };

            var changeState = function(val){
                this.toggle(val);
            };

            switch (attr) {
                case 'disabled': toggleElementAccessible(); break;
                case 'data-style': changeStyle(); break;
                case 'data-state': changeState(newVal); break;
            }
        },

        destroy: function(){
            var element = this.element;
            element.off("focus");
            element.off("blur");
            return element;
        }
    });
}(Metro, m4q));