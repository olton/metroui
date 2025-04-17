/* global Metro */
(function(Metro, $) {
    'use strict';

    let CustomCheckboxDefaultConfig = {
        customCheckboxDeferred: 0,

        stateOn: "☑",
        stateOff: "☐",

        captionOn: "",
        captionOff: "",
        captionPosition: "right",

        clsCustomCheckbox: "",
        clsIcon: "",
        clsIconOn: "",
        clsIconOff: "",
        clsCaption: "",
        clsCaptionOn: "",
        clsCaptionOff: "",

        onCustomCheckboxCreate: Metro.noop
    };

    Metro.customCheckboxSetup = function (options) {
        CustomCheckboxDefaultConfig = $.extend({}, CustomCheckboxDefaultConfig, options);
    };

    if (typeof globalThis["metroCustomCheckboxSetup"] !== "undefined") {
        Metro.customCheckboxSetup(globalThis["metroCustomCheckboxSetup"]);
    }

    Metro.Component('custom-checkbox', {
        init: function( options, elem ) {
            this._super(elem, options, CustomCheckboxDefaultConfig);

            return this;
        },

        _create: function(){
            const element = this.element, o = this.options;
            const container = element.wrap( $("<label>").addClass("custom-checkbox").addClass(o.clsCustomCheckbox) );
            const icon = $("<span>").addClass("icon").addClass(o.clsIcon).appendTo(container);

            element.attr("type", "checkbox");

            if (element.attr("readonly")) {
                element.on("click", function(e){
                    e.preventDefault();
                })
            }

            if (o.stateOn) {
                $("<span>").addClass("state-on").addClass(o.clsIconOn).html(o.stateOn).appendTo(icon)
            }
            if (o.stateOff) {
                $("<span>").addClass("state-off").addClass(o.clsIconOff).html(o.stateOff).appendTo(icon)
            }
            
            if (o.captionOn || o.captionOff) {
                const caption = $("<span>").addClass("caption").addClass(o.clsCaption).appendTo(container);
                if (o.captionOn) {
                    $("<span>").addClass("caption-state-on").addClass(o.clsCaptionOn).html(o.captionOn).appendTo(caption);
                }
                if (o.captionOff) {
                    $("<span>").addClass("caption-state-off").addClass(o.clsCaptionOff).html(o.captionOff).appendTo(caption);
                }
            }
            
            if (o.captionPosition === 'left') {
                container.addClass("caption-left");
            }

            element[0].className = '';

            if (element.is(':disabled')) {
                this.disable();
            } else {
                this.enable();
            }

            this._fireEvent("customCheckbox-create");
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
            const element = this.element;

            if (!Metro.utils.isValue(v)) {
                element.prop("checked", !Metro.utils.bool(element.prop("checked")));
            } else {
                element.prop("checked", v === 1);
            }

            return this;
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
            }
        },

        destroy: function(){
            return this.element;
        }
    });
}(Metro, Dom));