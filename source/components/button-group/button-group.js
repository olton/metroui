/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var ButtonGroupDefaultConfig = {
        buttongroupDeferred: 0,
        targets: "button",
        clsActive: "",
        requiredButton: false,
        mode: Metro.groupMode.ONE,
        onButtonClick: Metro.noop,
        onButtonGroupCreate: Metro.noop
    };

    Metro.buttonGroupSetup = function(options){
        ButtonGroupDefaultConfig = $.extend({}, ButtonGroupDefaultConfig, options);
    };

    if (typeof globalThis["metroButtonGroupSetup"] !== undefined) {
        Metro.buttonGroupSetup(globalThis["metroButtonGroupSetup"]);
    }

    Metro.Component('button-group', {
        init: function( options, elem ) {
            this._super(elem, options, ButtonGroupDefaultConfig, {
                active: null,
                id: Utils.elementId("button-group")
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createGroup();
            this._createEvents();

            this._fireEvent("button-group-create", {
                element: element
            })
        },

        _createGroup: function(){
            var element = this.element, o = this.options;
            var buttons, buttons_active;

            element.addClass("button-group");

            buttons = element.find( o.targets );
            buttons_active = element.find( ".active" );

            if (o.mode === Metro.groupMode.ONE && buttons_active.length === 0 && o.requiredButton === true) {
                $(buttons[0]).addClass("active");
            }

            if (o.mode === Metro.groupMode.ONE && buttons_active.length > 1) {
                buttons.removeClass("active").removeClass(o.clsActive);
                $(buttons[0]).addClass("active");
            }

            element
                .find( ".active" )
                .addClass("js-active")
                .addClass(o.clsActive);
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            element.on(Metro.events.click, o.targets, function(){
                var el = $(this);

                that._fireEvent("button-click", {
                    button: this
                })

                if (o.mode === Metro.groupMode.ONE && el.hasClass("active")) {
                    return ;
                }

                if (o.mode === Metro.groupMode.ONE) {
                    element.find(o.targets).removeClass(o.clsActive).removeClass("active js-active");
                    el.addClass("active").addClass(o.clsActive).addClass("js-active");
                } else {
                    el.toggleClass("active").toggleClass(o.clsActive).toggleClass("js-active");
                }

            });
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            var element = this.element, o = this.options;
            element.off(Metro.events.click, o.targets);
            return element;
        }

    });
}(Metro, Dom));