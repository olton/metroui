((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let RippleDefaultConfig = {
        rippleDeferred: 0,
        rippleColor: "#fff",
        rippleAlpha: .4,
        rippleTarget: "default",
        onRippleCreate: Metro.noop
    };

    Metro.rippleSetup = (options) => {
        RippleDefaultConfig = $.extend({}, RippleDefaultConfig, options);
    };

    if (typeof globalThis.metroRippleSetup !== "undefined") {
        Metro.rippleSetup(globalThis.metroRippleSetup);
    }

    const getRipple = (target, color = "#fff", alpha = .4, event = false)=> {
        const el = $(target);
        const rect = Metro.utils.rect(el[0]);
        let x;
        let y;

        if (el.length === 0) {
            return ;
        }

        if (el.css('position') === 'static') {
            el.css('position', 'relative');
        }

        el.css({
            overflow: 'hidden'
        });

        $(".ripple").remove();

        const size = Math.max(el.outerWidth(), el.outerHeight());

        // Add the element
        const ripple = $("<span class='ripple'></span>").css({
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
            top: `${y}px`,
            left: `${x}px`
        }).addClass("rippleEffect");

        setTimeout(()=> {
            ripple.remove();
        }, 400);
    };

    Metro.Component('ripple', {
        init: function( options, elem ) {
            this._super(elem, options, RippleDefaultConfig);
            return this;
        },

        _create: function(){
            const element = this.element;
            const o = this.options;
            const target = o.rippleTarget === 'default' ? null : o.rippleTarget;

            element.on(Metro.events.click, target, function(e){
                getRipple(this, o.rippleColor, o.rippleAlpha, e);
            });

            this._fireEvent("riopple-create", {
                element: element
            });
        },

        changeAttribute: function(attributeName){
            const element = this.element;
            const o = this.options;

            function changeColor(){
                const color = element.attr("data-ripple-color");
                if (!Farbe.Routines.isColor(color)) {
                    return;
                }
                o.rippleColor = color;
            }

            function changeAlpha(){
                const alpha = +element.attr("data-ripple-alpha");
                if (Number.isNaN(alpha)) {
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
            const element = this.element;
            const o = this.options;
            const target = o.rippleTarget === 'default' ? null : o.rippleTarget;
            element.off(Metro.events.click, target);
        }
    });

    Metro.ripple = getRipple;
})(Metro, Dom);