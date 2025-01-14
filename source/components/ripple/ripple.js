/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var RippleDefaultConfig = {
        rippleDeferred: 0,
        rippleColor: "#fff",
        rippleAlpha: .4,
        rippleTarget: "default",
        onRippleCreate: Metro.noop
    };

    Metro.rippleSetup = function (options) {
        RippleDefaultConfig = $.extend({}, RippleDefaultConfig, options);
    };

    if (typeof globalThis["metroRippleSetup"] !== undefined) {
        Metro.rippleSetup(globalThis["metroRippleSetup"]);
    }

    var getRipple = function(target, color, alpha, event){
        var el = $(target);
        var rect = Utils.rect(el[0]);
        var x, y;

        if (el.length === 0) {
            return ;
        }

        if (!Utils.isValue(color)) {
            color = "#fff";
        }

        if (!Utils.isValue(alpha)) {
            alpha = .4;
        }

        if (el.css('position') === 'static') {
            el.css('position', 'relative');
        }

        el.css({
            overflow: 'hidden'
        });

        $(".ripple").remove();

        var size = Math.max(el.outerWidth(), el.outerHeight());

        // Add the element
        var ripple = $("<span class='ripple'></span>").css({
            width: size,
            height: size
        });

        el.prepend(ripple);

        if (event) {
            // Get touch point x, y
            x = event.pageX - el.offset().left - ripple.width()/2;
            y = event.pageY - el.offset().top - ripple.height()/2;
        } else {
            // Get the center of the element
            x = rect.width / 2 - ripple.width()/2;
            y = rect.height / 2 - ripple.height()/2;
        }

        ripple.css({
            background: Farbe.Routines.toRGBA(Farbe.Routines.parse(color), alpha),
            width: size,
            height: size,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");

        setTimeout(function(){
            ripple.remove();
        }, 400);
    };

    Metro.Component('ripple', {
        init: function( options, elem ) {
            this._super(elem, options, RippleDefaultConfig);
            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            var target = o.rippleTarget === 'default' ? null : o.rippleTarget;

            element.on(Metro.events.click, target, function(e){
                getRipple(this, o.rippleColor, o.rippleAlpha, e);
            });

            this._fireEvent("riopple-create", {
                element: element
            });
        },

        changeAttribute: function(attributeName){
            var element = this.element, o = this.options;

            function changeColor(){
                var color = element.attr("data-ripple-color");
                if (!Farbe.Routines.isColor(color)) {
                    return;
                }
                o.rippleColor = color;
            }

            function changeAlpha(){
                var alpha = +element.attr("data-ripple-alpha");
                if (isNaN(alpha)) {
                    return;
                }
                o.rippleColor = alpha;
            }

            switch (attributeName) {
                case "data-ripple-color": changeColor(); break;
                case "data-ripple-alpha": changeAlpha(); break;
            }
        },

        destroy: function(){
            var element = this.element, o = this.options;
            var target = o.rippleTarget === 'default' ? null : o.rippleTarget;
            element.off(Metro.events.click, target);
        }
    });

    Metro.ripple = getRipple;
}(Metro, Dom));