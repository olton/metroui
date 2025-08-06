((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let AudioButtonDefaultConfig = {
        audioVolume: 0.5,
        audioSrc: "",
        onStart: Metro.noop,
        onEnd: Metro.noop,
        onProgress: Metro.noop,
        onAudioButtonCreate: Metro.noop,
    };

    Metro.audioButtonSetup = (options) => {
        AudioButtonDefaultConfig = $.extend({}, AudioButtonDefaultConfig, options);
    };

    if (typeof globalThis.metroAudioButtonSetup !== "undefined") {
        Metro.audioButtonSetup(globalThis.metroAudioButtonSetup);
    }

    Metro.Component("audio-button", {
        init: function (options, elem) {
            this._super(elem, options, AudioButtonDefaultConfig, {
                audio: null,
                canPlay: null,
                id: null,
                playing: false,
                duration: 0,
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this.id = Hooks.useId(this.elem);

            this._createStructure();
            this._createEvents();

            this._fireEvent("audioButtonCreate", {
                element: element,
            });
        },

        _createStructure: function () {
            const o = this.options;
            this.audio = new Audio(o.audioSrc);
            this.audio.volume = o.audioVolume;
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const audio = this.audio;

            audio.addEventListener("loadedmetadata", () => {
                this.duration = audio.duration.toFixed(0);
            });

            audio.addEventListener("loadeddata", () => {
                this.canPlay = true;
            });

            audio.addEventListener("ended", () => {
                this.playing = false;
                this._fireEvent("end", {
                    src: o.audioSrc,
                    audio: audio,
                });
            });

            audio.addEventListener("timeupdate", () => {
                const position = audio.currentTime;
                const percent = Math.round((audio.currentTime * 100) / this.duration);
                this._fireEvent("progress", {
                    duration: this.duration,
                    position,
                    percent,
                });
            });

            element.on(
                Metro.events.click,
                () => {
                    this.play();
                },
                { ns: this.id },
            );
        },

        play: function (cb) {
            const element = this.element;
            const o = this.options;
            const audio = this.audio;

            if (this.playing) {
                this.stop();
                return;
            }

            element.addClass("playing");

            if (o.audioSrc !== "" && this.audio.duration && this.canPlay) {
                this.playing = true;
                this._fireEvent("start", {
                    src: o.audioSrc,
                    audio: audio,
                });

                audio.pause();
                audio.currentTime = 0;
                audio.play();

                Metro.utils.exec(cb, [audio], element[0]);
            }
        },

        stop: function (cb) {
            const element = this.element;
            const o = this.options;
            const audio = this.audio;

            this.playing = false;

            element.removeClass("playing");

            audio.pause();
            audio.currentTime = 0;

            this._fireEvent("end", {
                src: o.audioSrc,
                audio: audio,
            });

            Metro.utils.exec(cb, [audio], element[0]);
        },

        changeAttribute: function (attributeName) {
            const element = this.element;
            const o = this.options;
            const audio = this.audio;

            const changeSrc = () => {
                const src = element.attr("data-audio-src");
                if (src && src.trim() !== "") {
                    o.audioSrc = src;
                    audio.src = src;
                }
            };

            const changeVolume = () => {
                const volume = Number.parseFloat(element.attr("data-audio-volume"));
                if (isNaN(volume)) {
                    return;
                }
                o.audioVolume = volume;
                audio.volume = volume;
            };

            if (attributeName === "data-audio-src") {
                changeSrc();
            }

            if (attributeName === "data-audio-volume") {
                changeVolume();
            }
        },

        destroy: function () {
            const element = this.element;

            element.off(Metro.events.click, { ns: this.id });
            element.remove();
        },
    });

    Metro.playSound = (data) => {
        const src = typeof data === "string" ? data : data.audioSrc;
        const volume = data?.audioVolume ? data.audioVolume : 0.5;

        if (!src) {
            return;
        }

        const audio = new Audio(src);
        audio.volume = Number.parseFloat(volume);

        audio.addEventListener("loadeddata", function () {
            if (data?.onAudioStart) Metro.utils.exec(data.onAudioStart, [src], this);
            this.play();
        });

        audio.addEventListener("ended", function () {
            if (data?.onAudioEnd) Metro.utils.exec(data.onAudioEnd, [null], this);
        });
    };
})(Metro, Dom);
