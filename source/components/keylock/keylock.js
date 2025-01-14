/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var KeylockDefaultConfig = {
        keylockDeferred: 0,

        stateIconOn: "🔒",
        stateIconOff: "🔓",

        captionOn: "",
        captionOff: "",
        captionPosition: "right",

        clsKeylock: "",
        clsIcon: "",
        clsIconOn: "",
        clsIconOff: "",
        clsCaption: "",
        clsCaptionOn: "",
        clsCaptionOff: "",

        onKeylockCreate: Metro.noop
    };

    Metro.keylockSetup = function (options) {
        KeylockDefaultConfig = $.extend({}, KeylockDefaultConfig, options);
    };

    if (typeof globalThis["metroKeylockSetup"] !== undefined) {
        Metro.keylockSetup(globalThis["metroKeylockSetup"]);
    }

    Metro.Component('keylock', {
        init: function( options, elem ) {
            this._super(elem, options, KeylockDefaultConfig);

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            var container;
            var icon = $("<span>").addClass("icon").addClass(o.clsIcon);
            

            element.attr("type", "checkbox");

            if (element.attr("readonly") !== undefined) {
                element.on("click", function(e){
                    e.preventDefault();
                })
            }

            container = element.wrap(
                $("<label>").addClass("keylock").addClass(o.clsKeylock)
            );

            icon.appendTo(container);
            if (o.stateIconOn) {
                let _icon = $(o.stateIconOn)
                if (_icon.length > 0) {
                    _icon.addClass("state-on").addClass(o.clsIconOn).appendTo(icon)
                } else {
                    $("<span>").addClass("state-on").addClass(o.clsIconOn).html(o.stateIconOn).appendTo(icon)
                }
            }
            if (o.stateIconOff) {
                let _icon = $(o.stateIconOff)
                if (_icon.length > 0) {
                    _icon.addClass("state-off").addClass(o.clsIconOff).appendTo(icon)
                } else {
                    $("<span>").addClass("state-off").addClass(o.clsIconOff).html(o.stateIconOff).appendTo(icon)
                }
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
            
            if (o.transition === true) {
                container.addClass("transition-on");
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

            this._fireEvent("keylock-create");
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

            if (!Utils.isValue(v)) {
                element.prop("checked", !Utils.bool(element.prop("checked")));
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