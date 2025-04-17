/* global Metro, METRO_ANIMATION_DURATION */
(function(Metro, $) {
    'use strict';

    const effects = [
        "slide", "slide-v", "fade", "switch", "zoom", "swirl"
    ];
    let CarouselDefaultConfig = {
        carouselDeferred: 0,
        autoStart: false,
        width: "100%",
        height: "16/9", // 3/4, 21/9
        effect: effects[0],
        effectFunc: "linear",
        direction: "left", //left, right
        duration: 300,
        period: 5000,
        stopOnMouse: true,

        controls: true,
        controlsOnMouse: false,
        controlsOutside: false,
        controlPrev: '&larr;',
        controlNext: '&rarr;',

        bullets: true,
        bulletsStyle: "square", // square, circle, rect, diamond
        bulletsSize: "default", // default, mini, small, large
        bulletsPosition: "default", // default, left, right

        clsCarousel: "",
        clsSlides: "",
        clsSlide: "",
        clsControls: "",
        clsControlNext: "",
        clsControlPrev: "",
        clsBullets: "",
        clsBullet: "",
        clsBulletOn: "",
        clsThumbOn: "",

        onStop: Metro.noop,
        onStart: Metro.noop,
        onPlay: Metro.noop,
        onSlideClick: Metro.noop,
        onBulletClick: Metro.noop,
        onThumbClick: Metro.noop,
        onMouseEnter: Metro.noop,
        onMouseLeave: Metro.noop,
        onNextClick: Metro.noop,
        onPrevClick: Metro.noop,
        onSlideShow: Metro.noop,
        onSlideHide: Metro.noop,
        onCarouselCreate: Metro.noop
    };

    Metro.carouselSetup = function (options) {
        CarouselDefaultConfig = $.extend({}, CarouselDefaultConfig, options);
    };

    if (typeof globalThis["metroCarouselSetup"] !== "undefined") {
        Metro.carouselSetup(globalThis["metroCarouselSetup"]);
    }

    Metro.Component('carousel', {
        init: function( options, elem ) {
            this._super(elem, options, CarouselDefaultConfig, {
                height: 0,
                width: 0,
                slides: [],
                current: null,
                currentIndex: null,
                dir: "left",
                interval: false,
                isAnimate: false,
                id: Metro.utils.elementId("carousel")
            });

            return this;
        },

        _create: function(){
            const element = this.element, o = this.options;
            const slides = element.find(".slide");
            let slides_container = element.find(".slides");

            this.dir = this.options.direction;

            element.addClass("carousel").addClass(o.clsCarousel);

            element.css({
                maxWidth: o.width
            });


            if (o.controlsOutside === true) {
                element.addClass("controls-outside");
            }

            if (slides_container.length === 0) {
                slides_container = $("<div>").addClass("slides").appendTo(element);
                slides.appendTo(slides_container);
            }

            slides.addClass(o.clsSlides);

            if (slides.length > 0) {

                this._createSlides();
                this._createControls();
                this._createBullets();
                this._createEvents();
                this._resize();

                if (o.controlsOnMouse === true) {
                    element.find("[class*=carousel-switch]").fadeOut(0);
                    element.find(".carousel-bullets").fadeOut(0);
                }

                if (o.autoStart === true) {
                    this._start();
                } else {
                    this._fireEvent("slide-show", {
                        current: this.slides[this.currentIndex][0],
                        prev: undefined
                    });
                }

            }

            this._fireEvent("carousel-create", {
                element: element
            });
        },

        _start: function(){
            const that = this, element = this.element, o = this.options;
            let period = o.period;
            const current = this.slides[this.currentIndex];

            if (current.data("period") !== undefined) {
                period = current.data("period");
            }

            if (this.slides.length <= 1) {
                return ;
            }

            if (this.interval === false) this.interval = setTimeout(function run() {
                const t = o.direction === 'left' ? 'next' : 'prior';
                that._slideTo(t, true);
            }, period);

            this._fireEvent("start", {
                element: element
            });
        },

        _stop: function(){
            clearInterval(this.interval);
            this.interval = false;
        },

        _resize: function(){
            const element = this.element, o = this.options;
            const width = element.outerWidth();
            let height;
            let medias = [];

            if (["16/9", "21/9", "4/3"].indexOf(o.height) > -1) {
                height = Metro.utils.aspectRatioH(width, o.height);
            } else {
                if (String(o.height).indexOf("@") > -1) {
                    medias = o.height.substring(1).toArray("|");
                    $.each(medias, function(){
                        const media = this.toArray(",");
                        if (globalThis.matchMedia(media[0]).matches) {
                            if (["16/9", "21/9", "4/3"].indexOf(media[1]) > -1) {
                                height = Metro.utils.aspectRatioH(width, media[1]);
                            } else {
                                height = parseInt(media[1]);
                            }
                        }
                    });
                } else {
                    height = parseInt(o.height);
                }
            }

            element.css({
                height: height
            });
        },

        _createSlides: function(){
            const that = this, element = this.element, o = this.options;
            const slides = element.find(".slide");

            $.each(slides, function(i){
                const slide = $(this);
                if (slide.data("cover") !== undefined) {
                    slide.css({
                        backgroundImage: "url("+slide.data('cover')+")"
                    });
                }

                if (i !== 0) {
                    switch (o.effect) {
                        case "switch":
                        case "slide":
                            slide.css("left", "100%");
                            break;
                        case "slide-v":
                            slide.css("top", "100%");
                            break;
                        case "fade":
                        case "zoom":
                        case "swirl":
                            slide.css("opacity", "0");
                            break;
                    }
                } else {
                    slide.addClass("active-slide");
                }

                slide.addClass(o.clsSlide);

                that.slides.push(slide);
            });

            this.currentIndex = 0;
            this.current = this.slides[this.currentIndex];
        },

        _createControls: function(){
            const element = this.element, o = this.options;
            let next, prev;

            if (o.controls === false) {
                return ;
            }

            next = $('<span>').addClass('carousel-switch-next').addClass(o.clsControls).addClass(o.clsControlNext).html(`<div></div>`);
            prev = $('<span>').addClass('carousel-switch-prev').addClass(o.clsControls).addClass(o.clsControlPrev).html(`<div></div>`);

            if (o.controlNext) {
                next.children("div").html(o.controlNext);
            }

            if (o.controlPrev) {
                prev.children("div").html(o.controlPrev);
            }

            next.appendTo(element);
            prev.appendTo(element);
        },

        _createBullets: function(){
            const element = this.element, o = this.options;
            let bullets, i;

            if (o.bullets === false) {
                return ;
            }

            bullets = $('<div>').addClass("carousel-bullets").addClass(o.bulletsSize+"-size").addClass("bullet-style-"+o.bulletsStyle).addClass(o.clsBullets);
            if (o.bulletsPosition === 'default' || o.bulletsPosition === 'center') {
                bullets.addClass("flex-justify-center");
            } else if (o.bulletsPosition === 'left') {
                bullets.addClass("flex-justify-start");
            } else {
                bullets.addClass("flex-justify-end");
            }

            for (i = 0; i < this.slides.length; i++) {
                const bullet = $('<span>').addClass("carousel-bullet").addClass(o.clsBullet).data("slide", i);
                if (i === 0) {
                    bullet.addClass('bullet-on').addClass(o.clsBulletOn);
                }
                bullet.appendTo(bullets);
            }

            bullets.appendTo(element);
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;

            element.on(Metro.events.click, ".carousel-bullet", function(){
                const bullet = $(this);
                if (that.isAnimate === false) {
                    that._slideToSlide(bullet.data('slide'));
                    that._fireEvent("bullet-click", {
                        bullet: bullet
                    });
                }
            });

            element.on(Metro.events.click, ".carousel-switch-next", function(){
                if (that.isAnimate === false) {
                    that._slideTo("next", false);
                    that._fireEvent("next-click", {
                        button: this
                    });
                }
            });

            element.on(Metro.events.click, ".carousel-switch-prev", function(){
                if (that.isAnimate === false) {
                    that._slideTo("prev", false);
                    that._fireEvent("prev-click", {
                        button: this
                    });
                }
            });

            if (o.stopOnMouse === true && o.autoStart === true) {
                element.on(Metro.events.enter, function () {
                    that._stop();
                    that._fireEvent("mouse-enter", {
                        element: element
                    }, false, true);
                });
                element.on(Metro.events.leave, function () {
                    that._start();
                    that._fireEvent("mouse-leave", {
                        element: element
                    }, false, true);
                });
            }

            if (o.controlsOnMouse === true) {
                element.on(Metro.events.enter, function () {
                    element.find("[class*=carousel-switch]").fadeIn();
                    element.find(".carousel-bullets").fadeIn();
                });
                element.on(Metro.events.leave, function () {
                    element.find("[class*=carousel-switch]").fadeOut();
                    element.find(".carousel-bullets").fadeOut();
                });
            }

            element.on(Metro.events.click, ".slide", function(){
                const slide = $(this);
                that._fireEvent("slide-click", {
                    slide: slide
                });
            });

            $(globalThis).on(Metro.events.resize, function(){
                that._resize();
            }, {ns: this.id});
        },

        _slideToSlide: function(index){
            const element = this.element, o = this.options;
            let current, next, to;

            if (this.slides[index] === undefined) {
                return ;
            }

            if (this.currentIndex === index) {
                return ;
            }

            to = index > this.currentIndex ? "next" : "prev";
            current = this.slides[this.currentIndex];
            next = this.slides[index];

            this.currentIndex = index;

            this._effect(current, next, o.effect, to);

            element.find(".carousel-bullet").removeClass("bullet-on").removeClass(o.clsBulletOn);
            element.find(".carousel-bullet:nth-child("+(this.currentIndex+1)+")").addClass("bullet-on").addClass(o.clsBulletOn);
        },

        _slideTo: function(to, interval){
            const element = this.element, o = this.options;
            let current, next;

            if (to === undefined) {
                to = "next";
            }

            current = this.slides[this.currentIndex];

            if (to === "next") {
                this.currentIndex++;
                if (this.currentIndex >= this.slides.length) {
                    this.currentIndex = 0;
                }
            } else {
                this.currentIndex--;
                if (this.currentIndex < 0) {
                    this.currentIndex = this.slides.length - 1;
                }
            }

            next = this.slides[this.currentIndex];

            this._effect(current, next, o.effect, to, interval);

            element.find(".carousel-bullet").removeClass("bullet-on").removeClass(o.clsBulletOn);
            element.find(".carousel-bullet:nth-child("+(this.currentIndex+1)+")").addClass("bullet-on").addClass(o.clsBulletOn);
        },

        _effect: function(current, next, effect, to, interval){
            const that = this, o = this.options;
            let duration = o.duration;
            let func, effectFunc = o.effectFunc;
            let period = o.period;

            const run = function (f, c, n, o) {
                Metro.Effects[f](c[0], n[0], o);
            };

            if (next.data('duration') !== undefined) {
                duration = next.data('duration');
            }

            if (next.data('effectFunc') !== undefined) {
                effectFunc = next.data('effectFunc');
            }

            if (effect === 'switch') {
                duration = 0;
            }

            current.stop(true);
            next.stop(true);
            this.isAnimate = true;

            setTimeout(function(){that.isAnimate = false;}, duration + 100);

            if (effect === 'slide') {
                func = to === 'next' ? 'slideLeft': 'slideRight';
            } else
            if (effect === 'slide-v') {
                func = to === 'next' ? 'slideUp': 'slideDown';
            } else {
                func = effect;
            }

            if (!effects.includes(effect)) {
                func = "switch";
            }

            run(func, current, next, {duration: duration, ease: effectFunc});

            current.removeClass("active-slide");
            next.addClass("active-slide");

            setTimeout(function(){
                that._fireEvent("slide-show", {
                    current: next[0],
                    prev: current[0]
                })
            }, duration);

            setTimeout(function(){
                that._fireEvent("slide-hide", {
                    current: current[0],
                    next: next[0]
                })
            }, duration);

            if (interval === true) {

                if (next.data('period') !== undefined) {
                    period = next.data('period');
                }

                this.interval = setTimeout(function run() {
                    const t = o.direction === 'left' ? 'next' : 'prior';
                    that._slideTo(t, true);
                }, period);
            }
        },

        toSlide: function(index){
            this._slideToSlide(index);
        },

        next: function(){
            this._slideTo("next");
        },

        prev: function(){
            this._slideTo("prev");
        },

        stop: function () {
            clearInterval(this.interval);
            this._fireEvent("stop");
        },

        play: function(){
            this._start();
            this._fireEvent("play");
        },

        setEffect: function(effect){
            const element = this.element, o = this.options;
            const slides = element.find(".slide");

            if (!effects.includes(effect)) return ;

            o.effect = effect;

            slides.removeStyleProperty("transform").css({
                top: 0,
                left: 0
            });
        },

        changeAttribute: function(attributeName, newValue){
            if (attributeName === 'data-effect') {
                this.setEffect(newValue);
            }
        },

        destroy: function(){
            const element = this.element, o = this.options;

            element.off(Metro.events.click, ".carousel-bullet");
            element.off(Metro.events.click, ".carousel-switch-next");
            element.off(Metro.events.click, ".carousel-switch-prev");

            if (o.stopOnMouse === true && o.autoStart === true) {
                element.off(Metro.events.enter);
                element.off(Metro.events.leave);
            }

            if (o.controlsOnMouse === true) {
                element.off(Metro.events.enter);
                element.off(Metro.events.leave);
            }

            element.off(Metro.events.click, ".slide");
            $(globalThis).off(Metro.events.resize, {ns: this.id});

            return element;
        }
    });
}(Metro, Dom));