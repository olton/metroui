/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var AudioButtonDefaultConfig = {
        audioVolume: 0.5,
        audioSrc: "",
        onAudioStart: Metro.noop,
        onAudioEnd: Metro.noop,
        onAudioButtonCreate: Metro.noop
    };

    Metro.audioButtonSetup = function (options) {
        AudioButtonDefaultConfig = $.extend({}, AudioButtonDefaultConfig, options);
    };

    if (typeof globalThis["metroAudioButtonSetup"] !== undefined) {
        Metro.audioButtonSetup(globalThis["metroAudioButtonSetup"]);
    }

    Metro.Component('audio-button', {
        init: function( options, elem ) {

            this._super(elem, options, AudioButtonDefaultConfig, {
                audio: null,
                canPlay: null,
                id: Utils.elementId("audioButton")
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent('audioButtonCreate', {
                element: element
            });
        },

        _createStructure: function(){
            var o = this.options;
            this.audio = new Audio(o.audioSrc);
            this.audio.volume = o.audioVolume;
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var audio = this.audio;

            audio.addEventListener('loadeddata', function(){
                that.canPlay = true;
            });

            audio.addEventListener('ended', function(){
                that._fireEvent("audioEnd", {
                    src: o.audioSrc,
                    audio: audio
                });
            })

            element.on(Metro.events.click, function(){
                that.play();
            }, {ns: this.id});
        },

        play: function(cb){
            var element = this.element, o = this.options;
            var audio = this.audio;

            if (o.audioSrc !== "" && this.audio.duration && this.canPlay) {

                this._fireEvent("audioStart", {
                    src: o.audioSrc,
                    audio: audio
                });

                audio.pause();
                audio.currentTime = 0;
                audio.play();

                Utils.exec(cb, [audio], element[0]);
            }
        },

        stop: function(cb){
            var element = this.element, o = this.options;
            var audio = this.audio;

            audio.pause();
            audio.currentTime = 0;

            this._fireEvent("audioEnd", {
                src: o.audioSrc,
                audio: audio
            });

            Utils.exec(cb, [audio], element[0]);
        },

        changeAttribute: function(attributeName){
            var element = this.element, o = this.options;
            var audio = this.audio;

            var changeSrc = function(){
                var src = element.attr('data-audio-src');
                if (src && src.trim() !== "") {
                    o.audioSrc = src;
                    audio.src = src;
                }
            }

            var changeVolume = function(){
                var volume = parseFloat(element.attr('data-audio-volume'));
                if (isNaN(volume)) {
                    return ;
                }
                o.audioVolume = volume;
                audio.volume = volume;
            }

            if (attributeName === 'data-audio-src') {
                changeSrc();
            }

            if (attributeName === 'data-audio-volume') {
                changeVolume();
            }
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.click, {ns: this.id});
        }
    });

    Metro["playSound"] = function(data){
        var audio;
        var src = typeof data === "string" ? data : data.audioSrc;
        var volume = data && data.audioVolume ? data.audioVolume : 0.5;

        if (!src) {
            return;
        }

        audio = new Audio(src);
        audio.volume = parseFloat(volume);

        audio.addEventListener('loadeddata', function(){
            if (data && data.onAudioStart)
                Utils.exec(data.onAudioStart, [src], this);
            this.play();
        });

        audio.addEventListener('ended', function(){
            if (data && data.onAudioEnd)
                Utils.exec(data.onAudioEnd, [null], this);
        });
    };
}(Metro, Dom));