/* global Metro, Cake */

/**
 * Component Vegas based on Vegas by Jay Salvat (http://jaysalvat.com/)
 * Original code https://github.com/jaysalvat/vegas
 * MIT License, Copyright 2018 Jay Salvat
 *
 * Adaptation for Metro UI by Serhii Pimenov,
 * Copyright 2020 Serhii Pimenov
 */

(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var VegasDefaultConfig = {
        duration: 4000,
        animationDuration: null,
        transitionDuration: null,
        transition: "fade",
        animation: null,
        slides: [],
        shuffle: false,
        align: "center",
        valign: "center",
        loop: true,
        autoplay: true,
        mute: true,
        cover: true,
        preload: true,
        timer: true,
        overlay: 2,
        color: null,
        volume: 1,
        onPlay: Metro.noop,
        onPause: Metro.noop,
        onEnd: Metro.noop,
        onWalk: Metro.noop,
        onNext: Metro.noop,
        onPrev: Metro.noop,
        onJump: Metro.noop,
        onVegasCreate: Metro.noop
    };

    Metro.vegasSetup = function (options) {
        VegasDefaultConfig = $.extend({}, VegasDefaultConfig, options);
    };

    if (typeof globalThis["metroVegasSetup"] !== undefined) {
        Metro.vegasSetup(globalThis["metroVegasSetup"]);
    }

    Metro.Component('vegas', {

        videoCache: {},

        init: function( options, elem ) {
            this.transitions = [
                "fade", "fade2",
                "slideLeft", "slideLeft2",
                "slideRight", "slideRight2",
                "slideUp", "slideUp2",
                "slideDown", "slideDown2",
                "zoomIn", "zoomIn2",
                "zoomOut", "zoomOut2",
                "swirlLeft", "swirlLeft2",
                "swirlRight", "swirlRight2"
            ];
            this.animations = [
                "kenburns",
                "kenburnsUp",
                "kenburnsDown",
                "kenburnsRight",
                "kenburnsLeft",
                "kenburnsUpLeft",
                "kenburnsUpRight",
                "kenburnsDownLeft",
                "kenburnsDownRight"
            ];

            this.support = {
                objectFit:  'objectFit'  in document.body.style,
                video: !/(Android|webOS|Phone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent)
            }

            this._super(elem, options, VegasDefaultConfig, {
                slide: 0,
                slides: null,
                total: 0,
                noshow: false,
                paused: false,
                ended: false,
                timer: null,
                overlay: null,
                first: true,
                timeout: false
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            this.slides = Utils.isObject(o.slides) || [];
            this.total = this.slides.length;
            this.noshow = this.total < 2;
            this.paused = !o.autoplay || this.noshow;

            if (o.shuffle) {
                this.slides.shuffle();
            }

            if (o.preload) {
                this._preload();
            }

            this._createStructure();
            this._createEvents();

            this._fireEvent("vegas-create", {
                element: element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var isBody = element[0].tagName === 'BODY';
            var wrapper;

            if (!isBody) {
                element.css('height', element.css('height')); // it is not clear why this line

                wrapper = $('<div class="vegas-wrapper">')
                    .css('overflow', element.css('overflow'))
                    .css('padding',  element.css('padding'));

                if (!element.css('padding')) {
                    wrapper
                        .css('padding-top',    element.css('padding-top'))
                        .css('padding-bottom', element.css('padding-bottom'))
                        .css('padding-left',   element.css('padding-left'))
                        .css('padding-right',  element.css('padding-right'));
                }

                element.children().appendTo(wrapper);
                element.clear();
            }

            element.addClass("vegas-container");

            if (!isBody) {
                element.append(wrapper);
            }

            if (o.timer) {
                this.timer = $('<div class="vegas-timer"><div class="vegas-timer-progress">');
                element.append(this.timer);
            }

            if (o.overlay) {
                this.overlay = $('<div class="vegas-overlay">').addClass('overlay' + (typeof o.overlay === 'boolean' || isNaN(o.overlay) ? 2 : +o.overlay));
                element.append(this.overlay);
            }

            setTimeout(function(){
                Utils.exec(o.onPlay, null, element[0]);
                that._goto(that.slide);
            },1)
        },

        _createEvents: function(){
        },

        _preload: function(){
            var img, i;

            for (i = 0; i < this.slides.length; i++) {

                var obj = this.slides[i];

                if (obj.src) {
                    img = new Image();
                    img.src = this.slides[i].src;
                }

                if (obj.video) {
                    if (obj.video instanceof Array) {
                        this._video(obj.video);
                    } else {
                        this._video(obj.video.src);
                    }
                }
            }
        },

        _slideShow: function () {
            var that = this, o = this.options;

            if (this.total > 1 && !this.ended && !this.paused && !this.noshow) {
                this.timeout = setTimeout(function () {
                    that.next();
                }, o.duration);
            }
        },

        _timer: function (state) {
            var that = this, o = this.options;

            clearTimeout(this.timeout);

            if (!this.timer) {
                return;
            }

            this.timer
                .removeClass('vegas-timer-running')
                .find('div')
                .css('transition-duration', '0ms');

            if (this.ended || this.paused || this.noshow) {
                return;
            }

            if (state) {
                setTimeout(function () {
                    that.timer
                        .addClass('vegas-timer-running')
                        .find('div')
                        .css('transition-duration', +o.duration - 100 + 'ms');
                }, 100);
            }
        },

        _fadeSoundIn: function(video, duration){
            var o = this.options;

            $.animate({
                el: video,
                draw: {
                    volume: +o.volume
                },
                dur: duration
            })
        },

        _fadeSoundOut: function(video, duration){
            $.animate({
                el: video,
                draw: {
                    volume: 0
                },
                dur: duration
            })
        },

        _video: function(sources){
            var video, source;
            var cacheKey = sources.toString();

            if (this.videoCache[cacheKey]) {
                return this.videoCache[cacheKey];
            }

            if (!Array.isArray(sources)) {
                sources = [sources];
            }

            video = document.createElement("video");
            video.preload = true;

            sources.forEach(function(src){
                source = document.createElement("source");
                source.src = src;
                video.appendChild(source);
            });

            this.videoCache[cacheKey] = video;

            return video;
        },

        _goto: function(n){
            var that = this, element = this.element, o = this.options;

            if (typeof this.slides[n] === 'undefined') {
                n = 0;
            }

            this.slide = n;

            var $slide, $inner, video, img, $video;
            var slides = element.children(".vegas-slide");
            var obj = this.slides[n];
            var cover = o.cover;
            var transition, animation;
            var transitionDuration, animationDuration;

            if (this.first) {
                this.first = false;
            }

            if (cover !== 'repeat') {
                if (cover === true) {
                    cover = 'cover';
                } else if (cover === false) {
                    cover = 'contain';
                }
            }

            if (o.transition === 'random') {
                transition = $.random(this.transitions);
            } else {
                transition = o.transition ? o.transition : this.transitions[0];
            }

            if (o.animation === 'random') {
                animation = $.random(this.animations);
            } else {
                animation = o.animation ? o.animation : this.animations[0];
            }

            if (!o.transitionDuration) {
                transitionDuration = +o.duration;
            } else if (o.transitionDuration === 'auto' || +o.transitionDuration > +o.duration) {
                transitionDuration = +o.duration;
            } else {
                transitionDuration = +o.transitionDuration;
            }

            if (!o.animationDuration) {
                animationDuration = +o.duration;
            } else if (o.animationDuration === 'auto' || +o.animationDuration > +o.duration) {
                animationDuration = +o.duration;
            } else {
                animationDuration = +o.animationDuration;
            }

            $slide = $("<div>").addClass("vegas-slide").addClass('vegas-transition-' + transition);

            if (this.support.video && obj.video) {
                video = obj.video instanceof Array ? this._video(obj.video) : this._video(obj.video.src);
                video.loop = obj.video.loop ? obj.video.loop : o.loop;
                video.muted = obj.video.mute ? obj.video.mute : o.mute;

                if (!video.muted) {
                    this._fadeSoundIn(video, transitionDuration);
                } else {
                    video.pause();
                }

                $video = $(video)
                    .addClass('vegas-video')
                    .css('background-color', o.color || '#000000');

                if (this.support.objectFit) {
                    $video
                        .css('object-position', o.align + ' ' + o.valign)
                        .css('object-fit', cover)
                        .css('width',  '100%')
                        .css('height', '100%');
                } else if (cover === 'contain') {
                    $video
                        .css('width',  '100%')
                        .css('height', '100%');
                }

                $slide.append($video);
            } else {
                img = new Image();
                $inner = $("<div>").addClass('vegas-slide-inner')
                    .css({
                        backgroundImage: 'url("'+obj.src+'")',
                        backgroundColor: o.color || '#000000',
                        backgroundPosition: o.align + ' ' + o.valign
                    });

                if (cover === 'repeat') {
                    $inner.css('background-repeat', 'repeat');
                } else {
                    $inner.css('background-size', cover);
                }

                if (animation) {
                    $inner
                        .addClass('vegas-animation-' + animation)
                        .css('animation-duration',  animationDuration + 'ms');
                }

                $slide.append($inner);
            }

            if (slides.length) {
                slides.eq(slides.length - 1).after($slide);
            } else {
                element.prepend($slide);
            }

            slides
                .css('transition', 'all 0ms')
                .each(function(){
                    this.className  = 'vegas-slide';

                    if (this.tagName === 'VIDEO') {
                        this.className += ' vegas-video';
                    }

                    if (transition) {
                        this.className += ' vegas-transition-' + transition;
                        this.className += ' vegas-transition-' + transition + '-in';
                    }
                }
            );

            this._timer(false);

            function go(){
                that._timer(true);
                setTimeout(function () {
                    slides
                        .css('transition', 'all ' + transitionDuration + 'ms')
                        .addClass('vegas-transition-' + transition + '-out');

                    slides.each(function () {
                        var video = slides.find('video').get(0);

                        if (video) {
                            video.volume = 1;
                            that._fadeSoundOut(video, transitionDuration);
                        }
                    });

                    $slide
                        .css('transition', 'all ' + transitionDuration + 'ms')
                        .addClass('vegas-transition-' + transition + '-in');

                    for (var i = 0; i < slides.length - 1; i++) {
                        slides.eq(i).remove();
                    }

                    that._fireEvent("walk", {
                        slide: that.current(true)
                    });

                    that._slideShow();
                }, 100);
            }

            if (video) {
                if (video.readyState === 4) {
                    video.currentTime = 0;
                }

                video.play();
                go();
            } else {
                img.src = obj.src;

                if (img.complete) {
                    go();
                } else {
                    img.onload = go;
                }
            }
        },

        _end: function(){
            this.ended = this.options.autoplay;
            this._timer(false);

            this._fireEvent("end", {
                slide: this.current(true)
            });
        },

        play: function(){
            if (!this.paused) {
                return ;
            }

            this._fireEvent("play", {
                slide: this.current(true)
            });

            this.paused = false;
            this.next();
        },

        pause: function(){
            this._timer(false);
            this.paused = true;

            this._fireEvent("pause", {
                slide: this.current(true)
            });
        },

        toggle: function(){
            this.paused ? this.play() : this.pause();
        },

        playing: function(){
            return !this.paused && !this.noshow;
        },

        current: function (advanced) {
            if (advanced) {
                return {
                    slide: this.slide,
                    data:  this.slides[this.slide]
                };
            }
            return this.slide;
        },

        jump: function(n){
            if (n <= 0 || n > this.slides.length || n === this.slide + 1) {
                return this;
            }

            this.slide = n - 1;

            this._fireEvent("jump", {
                slide: this.current(true)
            })

            this._goto(this.slide);
        },

        next: function(){
            var o = this.options;

            this.slide++;

            if (this.slide >= this.slides.length) {
                if (!o.loop) {
                    return this._end();
                }

                this.slide = 0;
            }

            this._fireEvent("next", {
                slide: this.current(true)
            });

            this._goto(this.slide);
        },

        prev: function(){
            var o = this.options;

            this.slide--;

            if (this.slide < 0) {
                if (!o.loop) {
                    this.slide++;
                    return this._end();
                }

                this.slide = this.slides.length - 1;
            }

            this._fireEvent("prev", {
                slide: this.current(true)
            });

            this._goto(this.slide);
        },

        changeAttribute: function(attr){
            var element = this.element, o = this.options;
            var propName = Str.camelCase(attr.replace("data-", ""));

            if (propName === 'slides') {
                o.slides = element.attr('data-slides');
                this.slides = Utils.isObject(o.slides) || [];
                this.total = this.slides.length;
                this.noshow = this.total < 2;
                this.paused = !this.options.autoplay || this.noshow;
            } else {
                if (typeof VegasDefaultConfig[propName] !== 'undefined')
                    o[propName] = JSON.parse(element.attr(attr));
            }
        },

        destroy: function(){
            var element = this.element, o = this.options;

            clearTimeout(this.timeout);
            element.removeClass('vegas-container');
            element.find('> .vegas-slide').remove();
            element.find('> .vegas-wrapper').children().appendTo(element);
            element.find('> .vegas-wrapper').remove();

            if (o.timer) {
                this.timer.remove();
            }

            if (o.overlay) {
                this.overlay.remove();
            }

            return element[0];
        }
    });
}(Metro, Dom));