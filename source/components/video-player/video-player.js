/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var VideoPlayerDefaultConfig = {
        videoDeferred: 0,
        src: null,

        poster: "",
        logo: "",
        logoHeight: 32,
        logoWidth: "auto",
        logoTarget: "",

        volume: .5,
        loop: false,
        autoplay: false,

        fullScreenMode: Metro.fullScreenMode.DESKTOP,
        aspectRatio: Metro.aspectRatio.HD,

        controlsHide: 3000,

        showLoop: true,
        showPlay: true,
        showStop: true,
        showMute: true,
        showFull: true,
        showStream: true,
        showVolume: true,
        showInfo: true,

        loopIcon: "🔁",
        stopIcon: "⏹",
        playIcon: "▶",
        pauseIcon: "⏸",
        muteIcon: "🔇",
        volumeLowIcon: "🔈",
        volumeMediumIcon: "🔉",
        volumeHighIcon: "🔊",
        screenMoreIcon: "⬜",
        screenLessIcon: "⬚",

        onPlay: Metro.noop,
        onPause: Metro.noop,
        onStop: Metro.noop,
        onEnd: Metro.noop,
        onMetadata: Metro.noop,
        onTime: Metro.noop,
        onVideoPlayerCreate: Metro.noop
    };

    Metro.videoPlayerSetup = function (options) {
        VideoPlayerDefaultConfig = $.extend({}, VideoPlayerDefaultConfig, options);
    };

    if (typeof globalThis["metroVideoPlayerSetup"] !== undefined) {
        Metro.videoPlayerSetup(globalThis["metroVideoPlayerSetup"]);
    }

    Metro.Component('video-player', {
        init: function( options, elem ) {
            this._super(elem, options, VideoPlayerDefaultConfig, {
                fullscreen: false,
                preloader: null,
                player: null,
                video: elem,
                stream: null,
                volume: null,
                volumeBackup: 0,
                muted: false,
                fullScreenInterval: false,
                isPlaying: false,
                id: Utils.elementId('video-player')
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            if (Metro.fullScreenEnabled === false) {
                o.fullScreenMode = Metro.fullScreenMode.WINDOW;
            }

            this._createPlayer();
            this._createControls();
            this._createEvents();
            this._setAspectRatio();

            if (o.autoplay === true) {
                this.play();
            }

            this._fireEvent("video-player-create", {
                element: element,
                player: this.player
            });
        },

        _createPlayer: function(){
            var element = this.element, o = this.options, video = this.video;
            var player = $("<div>").addClass("media-player video-player " + element[0].className);
            var preloader = $("<div>").addClass("preloader").appendTo(player);
            var logo = $("<a>").attr("href", o.logoTarget).addClass("logo").appendTo(player);

            player.insertBefore(element);
            element.appendTo(player);

            $.each(['muted', 'autoplay', 'controls', 'height', 'width', 'loop', 'poster', 'preload'], function(){
                element.removeAttr(this);
            });

            element.attr("preload", "auto");

            if (o.poster !== "") {
                element.attr("poster", o.poster);
            }

            video.volume = o.volume;

            preloader.activity({
                type: "cycle",
                style: "color"
            });

            preloader.hide();

            this.preloader = preloader;

            if (o.logo !== "") {
                $("<img>")
                    .css({
                        height: o.logoHeight,
                        width: o.logoWidth
                    })
                    .attr("src", o.logo).appendTo(logo);
            }

            if (o.src !== null) {
                this._setSource(o.src);
            }

            element[0].className = "";

            this.player = player;
        },

        _setSource: function(src){
            var element = this.element;

            element.find("source").remove();
            element.removeAttr("src");
            if (Array.isArray(src)) {
                $.each(src, function(){
                    var item = this;
                    if (item.src === undefined) return ;
                    $("<source>").attr('src', item.src).attr('type', item.type !== undefined ? item.type : '').appendTo(element);
                });
            } else {
                element.attr("src", src);
            }
        },

        _createControls: function(){
            var that = this, element = this.element, o = this.options, video = this.elem;

            var controls = $("<div>").addClass("controls").addClass(o.clsControls).insertAfter(element);

            var stream = $("<div>").addClass("stream").appendTo(controls);
            var streamSlider = $("<input>").addClass("stream-slider ultra-thin cycle-marker").appendTo(stream);

            var volume = $("<div>").addClass("volume").appendTo(controls);
            var volumeSlider = $("<input>").addClass("volume-slider ultra-thin cycle-marker").appendTo(volume);

            var infoBox = $("<div>").addClass("info-box").appendTo(controls);

            if (o.showInfo !== true) {
                infoBox.hide();
            }

            Metro.makePlugin(streamSlider, "slider", {
                clsMarker: "bg-red",
                clsHint: "bg-cyan fg-white",
                clsComplete: "bg-cyan",
                hint: true,
                onStart: function(){
                    if (!video.paused) video.pause();
                },
                onStop: function(val){
                    if (video.seekable.length > 0) {
                        video.currentTime = (that.duration * val / 100).toFixed(0);
                    }
                    if (video.paused && video.currentTime > 0) {
                        video.play();
                    }
                }
            });

            this.stream = streamSlider;

            if (o.showStream !== true) {
                stream.hide();
            }

            Metro.makePlugin(volumeSlider, "slider", {
                clsMarker: "bg-red",
                clsHint: "bg-cyan fg-white",
                hint: true,
                value: o.volume * 100,
                onChangeValue: function(val){
                    video.volume = val / 100;
                }
            });

            this.volume = volumeSlider;

            if (o.showVolume !== true) {
                volume.hide();
            }

            var loop;

            if (o.showLoop === true) loop = $("<button>").attr("type", "button").addClass("button square loop").html(o.loopIcon).appendTo(controls);
            if (o.showPlay === true) $("<button>").attr("type", "button").addClass("button square play").html(o.playIcon).appendTo(controls);
            if (o.showStop === true) $("<button>").attr("type", "button").addClass("button square stop").html(o.stopIcon).appendTo(controls);
            if (o.showMute === true) $("<button>").attr("type", "button").addClass("button square mute").html(o.muteIcon).appendTo(controls);
            if (o.showFull === true) $("<button>").attr("type", "button").addClass("button square full").html(o.screenMoreIcon).appendTo(controls);

            if (o.loop === true) {
                loop.addClass("active");
                element.attr("loop", "loop");
            }

            this._setVolume();

            if (o.muted) {
                that.volumeBackup = video.volume;
                Metro.getPlugin(that.volume, 'slider').val(0);
                video.volume = 0;
            }

            infoBox.html("00:00 / 00:00");
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options, video = this.elem, player = this.player;

            element.on("loadstart", function(){
                that.preloader.show();
            });

            element.on("loadedmetadata", function(){
                that.duration = video.duration.toFixed(0);
                that._setInfo(0, that.duration);
                Utils.exec(o.onMetadata, [video, player], element[0]);
            });

            element.on("canplay", function(){
                that._setBuffer();
                that.preloader.hide();
            });

            element.on("progress", function(){
                that._setBuffer();
            });

            element.on("timeupdate", function(){
                var position = Math.round(video.currentTime * 100 / that.duration);
                that._setInfo(video.currentTime, that.duration);
                Metro.getPlugin(that.stream, 'slider').val(position);
                Utils.exec(o.onTime, [video.currentTime, that.duration, video, player], element[0]);
            });

            element.on("waiting", function(){
                that.preloader.show();
            });

            element.on("loadeddata", function(){

            });

            element.on("play", function(){
                player.find(".play").html(o.pauseIcon);
                Utils.exec(o.onPlay, [video, player], element[0]);
                that._onMouse();
            });

            element.on("pause", function(){
                player.find(".play").html(o.playIcon);
                Utils.exec(o.onPause, [video, player], element[0]);
                that._offMouse();
            });

            element.on("stop", function(){
                Metro.getPlugin(that.stream, 'slider').val(0);
                Utils.exec(o.onStop, [video, player], element[0]);
                that._offMouse();
            });

            element.on("ended", function(){
                Metro.getPlugin(that.stream, 'slider').val(0);
                Utils.exec(o.onEnd, [video, player], element[0]);
                that._offMouse();
            });

            element.on("volumechange", function(){
                that._setVolume();
            });

            player.on(Metro.events.click, ".play", function(){
                if (video.paused) {
                    that.play();
                } else {
                    that.pause();
                }
            });

            player.on(Metro.events.click, ".stop", function(){
                that.stop();
            });

            player.on(Metro.events.click, ".mute", function(){
                that._toggleMute();
            });

            player.on(Metro.events.click, ".loop", function(){
                that._toggleLoop();
            });

            player.on(Metro.events.click, ".full", function(){
                that.fullscreen = !that.fullscreen;
                player.find(".full").html(that.fullscreen === true ? o.screenLessIcon : o.screenMoreIcon);
                if (o.fullScreenMode === Metro.fullScreenMode.WINDOW) {
                    if (that.fullscreen === true) {
                        player.addClass("full-screen");
                    } else {
                        player.removeClass("full-screen");
                    }
                } else {
                    if (that.fullscreen === true) {

                        Metro.requestFullScreen(video);

                        if (that.fullScreenInterval === false) that.fullScreenInterval = setInterval(function(){
                            if (Metro.inFullScreen() === false) {
                                that.fullscreen = false;
                                clearInterval(that.fullScreenInterval);
                                that.fullScreenInterval = false;
                                player.find(".full").html(o.screenMoreIcon);
                            }

                        }, 1000);
                    } else {
                        Metro.exitFullScreen();
                    }
                }

                // if (that.fullscreen === true) {
                //     $(document).on(Metro.events.keyup + ".video-player", function(e){
                //         if (e.keyCode === 27) {
                //             player.find(".full").click();
                //         }
                //     });
                // } else {
                //     $(document).off(Metro.events.keyup + ".video-player");
                // }
            });

            $(globalThis).on(Metro.events.keyup, function(e){
                if (that.fullscreen && e.keyCode === 27) {
                    player.find(".full").click();
                }
            }, {ns: this.id});

            $(globalThis).on(Metro.events.resize, function(){
                that._setAspectRatio();
            }, {ns: this.id});

        },

        _onMouse: function(){
            var o = this.options, player = this.player;

            player.on(Metro.events.enter, function(){
                var controls = player.find(".controls");
                if (o.controlsHide > 0 && controls.style('display') === 'none') {
                    controls.stop(true).fadeIn(500, function(){
                        controls.css("display", "flex");
                    });
                }
            });

            player.on(Metro.events.leave, function(){
                var controls = player.find(".controls");
                if (o.controlsHide > 0 && parseInt(controls.style('opacity')) === 1) {
                    setTimeout(function () {
                        controls.stop(true).fadeOut(500);
                    }, o.controlsHide);
                }
            });
        },

        _offMouse: function(){
            var player = this.player, o = this.options;
            var controls = player.find(".controls");

            player.off(Metro.events.enter);
            player.off(Metro.events.leave);

            if (o.controlsHide > 0 && controls.style('display') === 'none') {
                controls.stop(true).fadeIn(500, function(){
                    controls.css("display", "flex");
                });
            }
        },

        _toggleLoop: function(){
            var loop = this.player.find(".loop");
            if (loop.length === 0) return ;
            loop.toggleClass("active");
            if (loop.hasClass("active")) {
                this.element.attr("loop", "loop");
            } else {
                this.element.removeAttr("loop");
            }
        },

        _toggleMute: function(){
            this.muted = !this.muted;
            if (this.muted === false) {
                this.video.volume = this.volumeBackup;
            } else {
                this.volumeBackup = this.video.volume;
                this.video.volume = 0;
            }
            Metro.getPlugin(this.volume, 'slider').val(this.muted === false ? this.volumeBackup * 100 : 0);
        },

        _setInfo: function(a, b){
            this.player.find(".info-box").html(Utils.secondsToFormattedString(Math.round(a)) + " / " + Utils.secondsToFormattedString(Math.round(b)));
        },

        _setBuffer: function(){
            var buffer = this.video.buffered.length ? Math.round(Math.floor(this.video.buffered.end(0)) / Math.floor(this.video.duration) * 100) : 0;
            Metro.getPlugin(this.stream, 'slider').buff(buffer);
        },

        _setVolume: function(){
            var video = this.video, player = this.player, o = this.options;

            var volumeButton = player.find(".mute");
            var volume = video.volume * 100;
            if (volume > 1 && volume < 30) {
                volumeButton.html(o.volumeLowIcon);
            } else if (volume >= 30 && volume < 60) {
                volumeButton.html(o.volumeMediumIcon);
            } else if (volume >= 60 && volume <= 100) {
                volumeButton.html(o.volumeHighIcon);
            } else {
                volumeButton.html(o.muteIcon);
            }
        },

        _setAspectRatio: function(){
            var player = this.player, o = this.options;
            var width = player.outerWidth();
            var height;

            switch (o.aspectRatio) {
                case Metro.aspectRatio.SD: height = Utils.aspectRatioH(width, "4/3"); break;
                case Metro.aspectRatio.CINEMA: height = Utils.aspectRatioH(width, "21/9"); break;
                default: height = Utils.aspectRatioH(width, "16/9");
            }

            player.outerHeight(height);
        },

        aspectRatio: function(ratio){
            this.options.aspectRatio = ratio;
            this._setAspectRatio();
        },

        play: function(src){
            if (src !== undefined) {
                this._setSource(src);
            }

            if (this.element.attr("src") === undefined && this.element.find("source").length === 0) {
                return ;
            }

            this.isPlaying = true;

            this.video.play();
        },

        pause: function(){
            this.isPlaying = false;
            this.video.pause();
        },

        resume: function(){
            if (this.video.paused) {
                this.play();
            }
        },

        stop: function(){
            this.isPlaying = false;
            this.video.pause();
            this.video.currentTime = 0;
            Metro.getPlugin(this.stream, 'slider').val(0);
            this._offMouse();
        },

        setVolume: function(v){
            if (v === undefined) {
                return this.video.volume;
            }

            if (v > 1) {
                v /= 100;
            }

            this.video.volume = v;
            Metro.getPlugin(this.volume[0], 'slider').val(v*100);
        },

        loop: function(){
            this._toggleLoop();
        },

        mute: function(){
            this._toggleMute();
        },

        changeAspectRatio: function(){
            this.options.aspectRatio = this.element.attr("data-aspect-ratio");
            this._setAspectRatio();
        },

        changeSource: function(){
            var src = JSON.parse(this.element.attr('data-src'));
            this.play(src);
        },

        changeVolume: function(){
            var volume = this.element.attr("data-volume");
            this.setVolume(volume);
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case "data-aspect-ratio": this.changeAspectRatio(); break;
                case "data-src": this.changeSource(); break;
                case "data-volume": this.changeVolume(); break;
            }
        },

        destroy: function(){
            var element = this.element, player = this.player;

            Metro.getPlugin(this.stream, "slider").destroy();
            Metro.getPlugin(this.volume, "slider").destroy();

            element.off("loadstart");
            element.off("loadedmetadata");
            element.off("canplay");
            element.off("progress");
            element.off("timeupdate");
            element.off("waiting");
            element.off("loadeddata");
            element.off("play");
            element.off("pause");
            element.off("stop");
            element.off("ended");
            element.off("volumechange");

            player.off(Metro.events.click, ".play");
            player.off(Metro.events.click, ".stop");
            player.off(Metro.events.click, ".mute");
            player.off(Metro.events.click, ".loop");
            player.off(Metro.events.click, ".full");

            $(globalThis).off(Metro.events.keyup,{ns: this.id});
            $(globalThis).off(Metro.events.resize,{ns: this.id});

            return element;
        }
    });
}(Metro, Dom));