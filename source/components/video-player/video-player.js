((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let VideoPlayerDefaultConfig = {
        videoDeferred: 0,
        src: null,

        poster: "",
        logo: "",
        logoHeight: 32,
        logoWidth: "auto",
        logoTarget: "",

        volume: 0.5,
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
        onVideoPlayerCreate: Metro.noop,
    };

    Metro.videoPlayerSetup = (options) => {
        VideoPlayerDefaultConfig = $.extend({}, VideoPlayerDefaultConfig, options);
    };

    if (typeof globalThis.metroVideoPlayerSetup !== "undefined") {
        Metro.videoPlayerSetup(globalThis.metroVideoPlayerSetup);
    }

    Metro.Component("video-player", {
        init: function (options, elem) {
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
                id: Metro.utils.elementId("video-player"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

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
                player: this.player,
            });
        },

        _createPlayer: function () {
            const element = this.element;
            const o = this.options;
            const video = this.video;
            const player = $("<div>").addClass(`media-player video-player ${element[0].className}`);
            const preloader = $("<div>").addClass("preloader").appendTo(player);
            const logo = $("<a>").attr("href", o.logoTarget).addClass("logo").appendTo(player);

            player.insertBefore(element);
            element.appendTo(player);

            $.each(["muted", "autoplay", "controls", "height", "width", "loop", "poster", "preload"], function () {
                element.removeAttr(this);
            });

            element.attr("preload", "auto");

            if (o.poster !== "") {
                element.attr("poster", o.poster);
            }

            video.volume = o.volume;

            preloader.activity({
                type: "cycle",
                style: "color",
            });

            preloader.hide();

            this.preloader = preloader;

            if (o.logo !== "") {
                $("<img>")
                    .css({
                        height: o.logoHeight,
                        width: o.logoWidth,
                    })
                    .attr("src", o.logo)
                    .appendTo(logo);
            }

            if (o.src !== null) {
                this._setSource(o.src);
            }

            element[0].className = "";

            this.player = player;
        },

        _setSource: function (src) {
            const element = this.element;

            element.find("source").remove();
            element.removeAttr("src");
            if (Array.isArray(src)) {
                $.each(src, function () {
                    if (this.src === undefined) return;
                    $("<source>")
                        .attr("src", this.src)
                        .attr("type", this.type !== undefined ? this.type : "")
                        .appendTo(element);
                });
            } else {
                element.attr("src", src);
            }
        },

        _createControls: function () {
            const element = this.element;
            const o = this.options;
            const video = this.elem;

            const controls = $("<div>").addClass("controls").addClass(o.clsControls).insertAfter(element);

            const stream = $("<div>").addClass("stream").appendTo(controls);
            const streamSlider = $("<input>").addClass("stream-slider ultra-thin cycle-marker").appendTo(stream);

            const volume = $("<div>").addClass("volume").appendTo(controls);
            const volumeSlider = $("<input>").addClass("volume-slider ultra-thin cycle-marker").appendTo(volume);

            const infoBox = $("<div>").addClass("info-box").appendTo(controls);

            if (o.showInfo !== true) {
                infoBox.hide();
            }

            Metro.makePlugin(streamSlider, "slider", {
                clsMarker: "bg-red",
                clsHint: "bg-cyan fg-white",
                clsComplete: "bg-cyan",
                hint: true,
                onStart: () => {
                    if (!video.paused) video.pause();
                },
                onStop: (val) => {
                    if (video.seekable.length > 0) {
                        video.currentTime = ((this.duration * val) / 100).toFixed(0);
                    }
                    if (video.paused && video.currentTime > 0) {
                        video.play();
                    }
                },
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
                onChangeValue: (val) => {
                    video.volume = val / 100;
                },
            });

            this.volume = volumeSlider;

            if (o.showVolume !== true) {
                volume.hide();
            }

            let loop;

            if (o.showLoop === true)
                loop = $("<button>")
                    .attr("type", "button")
                    .addClass("button square loop")
                    .html(o.loopIcon)
                    .appendTo(controls);
            if (o.showPlay === true)
                $("<button>").attr("type", "button").addClass("button square play").html(o.playIcon).appendTo(controls);
            if (o.showStop === true)
                $("<button>").attr("type", "button").addClass("button square stop").html(o.stopIcon).appendTo(controls);
            if (o.showMute === true)
                $("<button>").attr("type", "button").addClass("button square mute").html(o.muteIcon).appendTo(controls);
            if (o.showFull === true)
                $("<button>")
                    .attr("type", "button")
                    .addClass("button square full")
                    .html(o.screenMoreIcon)
                    .appendTo(controls);

            if (o.loop === true) {
                loop.addClass("active");
                element.attr("loop", "loop");
            }

            this._setVolume();

            if (o.muted) {
                this.volumeBackup = video.volume;
                Metro.getPlugin(this.volume, "slider").val(0);
                video.volume = 0;
            }

            infoBox.html("00:00 / 00:00");
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const video = this.elem;
            const player = this.player;

            element.on("loadstart", () => {
                this.preloader.show();
            });

            element.on("loadedmetadata", () => {
                this.duration = video.duration.toFixed(0);
                this._setInfo(0, this.duration);
                Metro.utils.exec(o.onMetadata, [video, player], element[0]);
            });

            element.on("canplay", () => {
                this._setBuffer();
                this.preloader.hide();
            });

            element.on("progress", () => {
                this._setBuffer();
            });

            element.on("timeupdate", () => {
                const position = Math.round((video.currentTime * 100) / this.duration);
                this._setInfo(video.currentTime, this.duration);
                Metro.getPlugin(this.stream, "slider").val(position);
                Metro.utils.exec(o.onTime, [video.currentTime, this.duration, video, player], element[0]);
            });

            element.on("waiting", () => {
                this.preloader.show();
            });

            element.on("loadeddata", () => {});

            element.on("play", () => {
                player.find(".play").html(o.pauseIcon);
                Metro.utils.exec(o.onPlay, [video, player], element[0]);
                this._onMouse();
            });

            element.on("pause", () => {
                player.find(".play").html(o.playIcon);
                Metro.utils.exec(o.onPause, [video, player], element[0]);
                this._offMouse();
            });

            element.on("stop", () => {
                Metro.getPlugin(this.stream, "slider").val(0);
                Metro.utils.exec(o.onStop, [video, player], element[0]);
                this._offMouse();
            });

            element.on("ended", () => {
                Metro.getPlugin(this.stream, "slider").val(0);
                Metro.utils.exec(o.onEnd, [video, player], element[0]);
                this._offMouse();
            });

            element.on("volumechange", () => {
                this._setVolume();
            });

            player.on(Metro.events.click, ".play", () => {
                if (video.paused) {
                    this.play();
                } else {
                    this.pause();
                }
            });

            player.on(Metro.events.click, ".stop", () => {
                this.stop();
            });

            player.on(Metro.events.click, ".mute", () => {
                this._toggleMute();
            });

            player.on(Metro.events.click, ".loop", () => {
                this._toggleLoop();
            });

            player.on(Metro.events.click, ".full", () => {
                this.fullscreen = !this.fullscreen;
                player.find(".full").html(this.fullscreen === true ? o.screenLessIcon : o.screenMoreIcon);
                if (o.fullScreenMode === Metro.fullScreenMode.WINDOW) {
                    if (this.fullscreen === true) {
                        player.addClass("full-screen");
                    } else {
                        player.removeClass("full-screen");
                    }
                } else {
                    if (this.fullscreen === true) {
                        Metro.requestFullScreen(video);

                        if (this.fullScreenInterval === false)
                            this.fullScreenInterval = setInterval(() => {
                                if (Metro.inFullScreen() === false) {
                                    this.fullscreen = false;
                                    clearInterval(this.fullScreenInterval);
                                    this.fullScreenInterval = false;
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

            $(globalThis).on(
                Metro.events.keyup,
                (e) => {
                    if (this.fullscreen && e.keyCode === 27) {
                        player.find(".full").click();
                    }
                },
                { ns: this.id },
            );

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    this._setAspectRatio();
                },
                { ns: this.id },
            );
        },

        _onMouse: function () {
            const o = this.options;
            const player = this.player;

            player.on(Metro.events.enter, () => {
                const controls = player.find(".controls");
                if (o.controlsHide > 0 && controls.style("display") === "none") {
                    controls.stop(true).fadeIn(500, () => {
                        controls.css("display", "flex");
                    });
                }
            });

            player.on(Metro.events.leave, () => {
                const controls = player.find(".controls");
                if (o.controlsHide > 0 && Number.parseInt(controls.style("opacity")) === 1) {
                    setTimeout(() => {
                        controls.stop(true).fadeOut(500);
                    }, o.controlsHide);
                }
            });
        },

        _offMouse: function () {
            const player = this.player;
            const o = this.options;
            const controls = player.find(".controls");

            player.off(Metro.events.enter);
            player.off(Metro.events.leave);

            if (o.controlsHide > 0 && controls.style("display") === "none") {
                controls.stop(true).fadeIn(500, () => {
                    controls.css("display", "flex");
                });
            }
        },

        _toggleLoop: function () {
            const loop = this.player.find(".loop");
            if (loop.length === 0) return;
            loop.toggleClass("active");
            if (loop.hasClass("active")) {
                this.element.attr("loop", "loop");
            } else {
                this.element.removeAttr("loop");
            }
        },

        _toggleMute: function () {
            this.muted = !this.muted;
            if (this.muted === false) {
                this.video.volume = this.volumeBackup;
            } else {
                this.volumeBackup = this.video.volume;
                this.video.volume = 0;
            }
            Metro.getPlugin(this.volume, "slider").val(this.muted === false ? this.volumeBackup * 100 : 0);
        },

        _setInfo: function (a, b) {
            this.player
                .find(".info-box")
                .html(
                    `${Metro.utils.secondsToFormattedString(Math.round(a))} / ${Metro.utils.secondsToFormattedString(Math.round(b))}`,
                );
        },

        _setBuffer: function () {
            const buffer = this.video.buffered.length
                ? Math.round((Math.floor(this.video.buffered.end(0)) / Math.floor(this.video.duration)) * 100)
                : 0;
            Metro.getPlugin(this.stream, "slider").buff(buffer);
        },

        _setVolume: function () {
            const video = this.video;
            const player = this.player;
            const o = this.options;

            const volumeButton = player.find(".mute");
            const volume = video.volume * 100;

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

        _setAspectRatio: function () {
            const player = this.player;
            const o = this.options;
            const width = player.outerWidth();
            let height;

            switch (o.aspectRatio) {
                case Metro.aspectRatio.SD:
                    height = Metro.utils.aspectRatioH(width, "4/3");
                    break;
                case Metro.aspectRatio.CINEMA:
                    height = Metro.utils.aspectRatioH(width, "21/9");
                    break;
                default:
                    height = Metro.utils.aspectRatioH(width, "16/9");
            }

            player.outerHeight(height);
        },

        aspectRatio: function (ratio) {
            this.options.aspectRatio = ratio;
            this._setAspectRatio();
        },

        play: function (src) {
            if (src) {
                this._setSource(src);
            }

            if (this.element.attr("src") === undefined && this.element.find("source").length === 0) {
                return;
            }

            this.isPlaying = true;

            this.video.play();
        },

        pause: function () {
            this.isPlaying = false;
            this.video.pause();
        },

        resume: function () {
            if (this.video.paused) {
                this.play();
            }
        },

        stop: function () {
            this.isPlaying = false;
            this.video.pause();
            this.video.currentTime = 0;
            Metro.getPlugin(this.stream, "slider").val(0);
            this._offMouse();
        },

        setVolume: function (v) {
            if (typeof v === "undefined") {
                return this.video.volume;
            }

            let new_volume = Number.parseFloat(v);

            if (new_volume > 1) {
                new_volume /= 100;
            }

            this.video.volume = new_volume;

            Metro.getPlugin(this.volume[0], "slider").val(v * 100);
        },

        loop: function () {
            this._toggleLoop();
        },

        mute: function () {
            this._toggleMute();
        },

        changeAspectRatio: function () {
            this.options.aspectRatio = this.element.attr("data-aspect-ratio");
            this._setAspectRatio();
        },

        changeSource: function () {
            const src = JSON.parse(this.element.attr("data-src"));
            this.play(src);
        },

        changeVolume: function () {
            const volume = this.element.attr("data-volume");
            this.setVolume(volume);
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "data-aspect-ratio":
                    this.changeAspectRatio();
                    break;
                case "data-src":
                    this.changeSource();
                    break;
                case "data-volume":
                    this.changeVolume();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const player = this.player;

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

            $(globalThis).off(Metro.events.keyup, { ns: this.id });
            $(globalThis).off(Metro.events.resize, { ns: this.id });

            return element;
        },
    });
})(Metro, Dom);
