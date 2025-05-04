((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let AudioPlayerDefaultConfig = {
        audioDeferred: 0,
        playlist: null,
        src: null,

        volume: 0.5,
        loop: false,
        autoplay: false,

        showLoop: true,
        showPlay: true,
        showStop: true,
        showMute: true,
        showFull: true,
        showStream: true,
        showVolume: true,
        showInfo: true,

        showPlaylist: true,
        showNext: true,
        showPrev: true,
        showFirst: true,
        showLast: true,
        showForward: true,
        showBackward: true,
        showShuffle: true,
        showRandom: true,

        loopIcon: "🔁",
        stopIcon: "⏹",
        playIcon: "▶",
        pauseIcon: "⏸",
        muteIcon: "🔇",
        volumeLowIcon: "🔈",
        volumeMediumIcon: "🔉",
        volumeHighIcon: "🔊",

        playlistIcon: "📃",
        nextIcon: "→",
        prevIcon: "←",
        firstIcon: "⇤",
        lastIcon: "⇥",
        forwardIcon: "⇉",
        backwardIcon: "⇇",
        shuffleIcon: "🔀",
        randomIcon: "🎲",

        onPlay: Metro.noop,
        onPause: Metro.noop,
        onStop: Metro.noop,
        onEnd: Metro.noop,
        onMetadata: Metro.noop,
        onTime: Metro.noop,
        onAudioPlayerCreate: Metro.noop,
    };

    Metro.audioPlayerSetup = (options) => {
        AudioPlayerDefaultConfig = $.extend({}, AudioPlayerDefaultConfig, options);
    };

    if (typeof globalThis.metroAudioPlayerSetup !== "undefined") {
        Metro.audioPlayerSetup(globalThis.metroAudioPlayerSetup);
    }

    Metro.Component("audio-player", {
        init: function (options, elem) {
            this._super(elem, options, AudioPlayerDefaultConfig, {
                preloader: null,
                player: null,
                audio: elem,
                stream: null,
                volume: null,
                volumeBackup: 0,
                muted: false,
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createPlayer();
            this._createEvents();

            if (o.autoplay === true) {
                this.play();
            }

            this._fireEvent("audio-player-create", {
                element: element,
                player: this.player,
            });
        },

        _createPlayer: function () {
            const element = this.element;
            const o = this.options;
            const audio = this.audio;

            const player = element.wrap("<div>").addClass(`media-player audio-player ${element[0].className}`);

            $.each(["muted", "autoplay", "controls", "height", "width", "loop", "poster", "preload"], function () {
                element.removeAttr(this);
            });

            element.attr("preload", "auto");

            audio.volume = o.volume;

            if (o.src !== null) {
                this._setSource(o.src);
            }

            element[0].className = "";

            this.player = player;

            this._createControls();
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
            const audio = this.elem;

            const controls = $("<div>").addClass("controls").addClass(o.clsControls).insertAfter(element);

            const stream = $("<div>").addClass("stream").appendTo(controls);
            const streamSlider = $("<input>").addClass("stream-slider ultra-thin cycle-marker").appendTo(stream);
            const preloader = $("<div>").addClass("load-audio").appendTo(stream);

            const volume = $("<div>").addClass("volume").appendTo(controls);
            const volumeSlider = $("<input>").addClass("volume-slider ultra-thin cycle-marker").appendTo(volume);

            const infoBox = $("<div>").addClass("info-box").appendTo(controls);

            if (o.showInfo !== true) {
                infoBox.hide();
            }

            preloader.activity({
                type: "metro",
                style: "color",
            });

            preloader.hide(0);

            this.preloader = preloader;

            Metro.makePlugin(streamSlider, "slider", {
                clsMarker: "bg-red",
                clsHint: "bg-cyan fg-white",
                clsComplete: "bg-cyan",
                hint: true,
                onStart: () => {
                    if (!audio.paused) audio.pause();
                },
                onStop: (val) => {
                    if (audio.seekable.length > 0) {
                        audio.currentTime = ((this.duration * val) / 100).toFixed(0);
                    }
                    if (audio.paused && audio.currentTime > 0) {
                        audio.play();
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
                    audio.volume = val / 100;
                },
            });

            this.volume = volumeSlider;

            if (o.showVolume !== true) {
                volume.hide();
            }

            let loop;

            if (o.showLoop === true) {
                loop = $("<button>")
                    .attr("type", "button")
                    .addClass("button square loop")
                    .html(o.loopIcon)
                    .appendTo(controls);
                loop.addClass("active");
                element.attr("loop", "loop");
            }
            if (o.showPlay === true) {
                $("<button>").attr("type", "button").addClass("button square play").html(o.playIcon).appendTo(controls);
            }
            if (o.showStop === true) {
                $("<button>").attr("type", "button").addClass("button square stop").html(o.stopIcon).appendTo(controls);
            }
            if (o.showMute === true) {
                $("<button>").attr("type", "button").addClass("button square mute").html(o.muteIcon).appendTo(controls);
            }

            this._setVolume();

            if (o.muted) {
                this.volumeBackup = audio.volume;
                Metro.getPlugin(this.volume, "slider").val(0);
                audio.volume = 0;
            }

            infoBox.html("00:00 / 00:00");
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const audio = this.elem;
            const player = this.player;

            element.on("loadstart", () => {
                this.preloader.fadeIn();
            });

            element.on("loadedmetadata", () => {
                this.duration = audio.duration.toFixed(0);
                this._setInfo(0, this.duration);
                Metro.utils.exec(o.onMetadata, [audio, player], element[0]);
            });

            element.on("canplay", () => {
                this._setBuffer();
                this.preloader.fadeOut();
            });

            element.on("progress", () => {
                this._setBuffer();
            });

            element.on("timeupdate", () => {
                const position = Math.round((audio.currentTime * 100) / this.duration);
                this._setInfo(audio.currentTime, this.duration);
                Metro.getPlugin(this.stream, "slider").val(position);
                Metro.utils.exec(o.onTime, [audio.currentTime, this.duration, audio, player], element[0]);
            });

            element.on("waiting", () => {
                this.preloader.fadeIn();
            });

            element.on("loadeddata", () => {});

            element.on("play", () => {
                player.find(".play").html(o.pauseIcon);
                Metro.utils.exec(o.onPlay, [audio, player], element[0]);
            });

            element.on("pause", () => {
                player.find(".play").html(o.playIcon);
                Metro.utils.exec(o.onPause, [audio, player], element[0]);
            });

            element.on("stop", () => {
                Metro.getPlugin(this.stream, "slider").val(0);
                Metro.utils.exec(o.onStop, [audio, player], element[0]);
            });

            element.on("ended", () => {
                Metro.getPlugin(this.stream, "slider").val(0);
                Metro.utils.exec(o.onEnd, [audio, player], element[0]);
            });

            element.on("volumechange", () => {
                this._setVolume();
            });

            player.on(Metro.events.click, ".play", () => {
                if (audio.paused) {
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
                this.audio.volume = this.volumeBackup;
            } else {
                this.volumeBackup = this.audio.volume;
                this.audio.volume = 0;
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
            const buffer = this.audio.buffered.length
                ? Math.round((Math.floor(this.audio.buffered.end(0)) / Math.floor(this.audio.duration)) * 100)
                : 0;
            Metro.getPlugin(this.stream, "slider").buff(buffer);
        },

        _setVolume: function () {
            const audio = this.audio;
            const player = this.player;
            const o = this.options;

            const volumeButton = player.find(".mute");
            const volume = audio.volume * 100;
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

        play: function (src) {
            if (src !== undefined) {
                this._setSource(src);
            }

            if (this.element.attr("src") === undefined && this.element.find("source").length === 0) {
                return;
            }

            this.audio.play();
        },

        pause: function () {
            this.audio.pause();
        },

        resume: function () {
            if (this.audio.paused) {
                this.play();
            }
        },

        stop: function () {
            this.audio.pause();
            this.audio.currentTime = 0;
            Metro.getPlugin(this.stream, "slider").val(0);
        },

        setVolume: function (v) {
            if (v === undefined) {
                return this.audio.volume;
            }

            const volume = v > 1 ? v / 100 : v;

            this.audio.volume = v;
            Metro.getPlugin(this.volume, "slider").val(volume * 100);
        },

        loop: function () {
            this._toggleLoop();
        },

        mute: function () {
            this._toggleMute();
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

            element.off("all");
            player.off("all");

            Metro.getPlugin(this.stream, "slider").destroy();
            Metro.getPlugin(this.volume, "slider").destroy();

            return element;
        },
    });
})(Metro, Dom);
