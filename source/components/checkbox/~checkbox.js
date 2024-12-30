/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var CheckboxDefaultConfig = {
        checkboxDeferred: 0,
        transition: true,
        style: 1,
        caption: "",
        captionPosition: "right",
        indeterminate: false,
        clsCheckbox: "",
        clsCheck: "",
        clsCaption: "",
        onCheckboxCreate: Metro.noop
    };

    Metro.checkboxSetup = function (options) {
        CheckboxDefaultConfig = $.extend({}, CheckboxDefaultConfig, options);
    };

    if (typeof globalThis["metroCheckboxSetup"] !== undefined) {
        Metro.checkboxSetup(globalThis["metroCheckboxSetup"]);
    }

    Metro.Component('checkbox', {
        init: function( options, elem ) {
            this._super(elem, options, CheckboxDefaultConfig, {
                origin: {
                    className: ""
                }
            });

            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();
            this._fireEvent("checkbox-create");
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

            if (o.indeterminate) {
                element[0].indeterminate = true;
            }

            if (element.is(':disabled')) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _createEvents: function(){
            var element = this.element, check = element.siblings(".check");

            element.on("focus", function(){
                check.addClass("focused");
            });

            element.on("blur", function(){
                check.removeClass("focused");
            });
        },

        indeterminate: function(v){
            var element = this.element;

            v = Utils.isNull(v) ? true : Utils.bool(v);

            element[0].indeterminate = v;
            element.attr("data-indeterminate", v);
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

        toggle: function(v){
            var element = this.element;

            this.indeterminate(false);

            if (!Utils.isValue(v)) {
                element.prop("checked", !Utils.bool(element.prop("checked")));
            } else {
                if (v === -1) {
                    this.indeterminate(true);
                } else {
                    element.prop("checked", v === 1);
                }
            }
            return this;
        },

        changeAttribute: function(attributeName){
            var element = this.element, o = this.options;
            var parent = element.parent();

            var changeStyle = function(){
                var new_style = parseInt(element.attr("data-style"));

                if (!Utils.isInt(new_style)) return;

                o.style = new_style;
                parent.removeClass("style1 style2").addClass("style"+new_style);
            };

            var indeterminateState = function(){
                element[0].indeterminate = JSON.parse(element.attr("data-indeterminate")) === true;
            };

            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
                case 'data-indeterminate': indeterminateState(); break;
                case 'data-style': changeStyle(); break;
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