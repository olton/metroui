(function(Metro, $) {
    'use strict';
    let AnimationDefaultConfig = {
        duration: METRO_ANIMATION_DURATION,
        ease: "linear"
    }

    Metro.Effects = {
        switchIn: function(el){
            $(el)
                .hide()
                .css({
                    left: 0,
                    top: 0
                })
                .show();
        },

        switchOut: function(el){
            $(el).hide();
        },

        switch: function(current, next){
            this.switchOut(current);
            this.switchIn(next);
        },

        slideUpIn: function(el, o){
            let op, $el = $(el);
            const h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    top: h,
                    left: 0,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        top: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideUpOut: function(el, o){
            let op, $el = $(el);
            const h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        top: -h,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideUp: function(current, next, o){
            this.slideUpOut(current, o);
            this.slideUpIn(next, o);
        },

        slideDownIn: function(el, o){
            let op, $el = $(el);
            const h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    left: 0,
                    top: -h,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        top: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideDownOut: function(el, o){
            let op, $el = $(el);
            const h = $el.parent().outerHeight(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        top: h,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideDown: function(current, next, o){
            this.slideDownOut(current, o);
            this.slideDownIn(next, o);
        },

        slideLeftIn: function(el, o){
            let op, $el = $(el);
            const w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    left: w,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        left: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideLeftOut: function(el, o){
            let op, $el = $(el);
            const w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        left: -w,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideLeft: function(current, next, o){
            this.slideLeftOut(current, o);
            this.slideLeftIn(next, o);
        },

        slideRightIn: function(el, o){
            let op, $el = $(el);
            const w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    left: -w,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        left: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideRightOut: function(el, o){
            let op, $el = $(el);
            const w = $el.parent().outerWidth(true);

            op = $.extend({}, AnimationDefaultConfig, o);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        left:  w,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        slideRight: function(current, next, o){
            this.slideRightOut(current, o);
            this.slideRightIn(next, o);
        },

        fadeIn: function(el, o){
            const op = $.extend({}, AnimationDefaultConfig, o);
            const $el = $(el);

            $el
                .css({
                    top: 0,
                    left: 0,
                    opacity: 0
                })
                .animate({
                    draw: {
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        fadeOut: function(el, o){
            const op = $.extend({}, AnimationDefaultConfig, o);
            const $el = $(el);

            $el
                .animate({
                    draw: {
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        fade: function(current, next, o){
            this.fadeOut(current, o);
            this.fadeIn(next, o);
        },

        zoomIn: function(el, o){
            const op = $.extend({}, AnimationDefaultConfig, o);
            const $el = $(el);

            $el
                .css({
                    top: 0,
                    left: 0,
                    opacity: 0,
                    transform: "scale(3)",
                    zIndex: 2
                })
                .animate({
                    draw: {
                        scale: 1,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        zoomOut: function(el, o){
            const op = $.extend({}, AnimationDefaultConfig, o);
            const $el = $(el);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        scale: 3,
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        zoom: function(current, next, o){
            this.zoomOut(current, o);
            this.zoomIn(next, o);
        },

        swirlIn: function(el, o){
            const op = $.extend({}, AnimationDefaultConfig, o);
            const $el = $(el);

            $el
                .css({
                    top: 0,
                    left: 0,
                    opacity: 0,
                    transform: "scale(3) rotate(180deg)",
                    zIndex: 2
                })
                .animate({
                    draw: {
                        scale: 1,
                        rotate: 0,
                        opacity: 1
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        swirlOut: function(el, o){
            const op = $.extend({}, AnimationDefaultConfig, o);
            const $el = $(el);

            $el
                .css({
                    zIndex: 1
                })
                .animate({
                    draw: {
                        scale: 3,
                        rotate: "180deg",
                        opacity: 0
                    },
                    dur: op.duration,
                    ease: op.ease
                });
        },

        swirl: function(current, next, o){
            this.swirlOut(current, o);
            this.swirlIn(next, o);
        }
    };
}(Metro, Dom));