/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var ResizerDefaultConfig = {
        resizerDeferred: 0,
        onMediaPoint: Metro.noop,
        onMediaPointEnter: Metro.noop,
        onMediaPointLeave: Metro.noop,
        onWindowResize: Metro.noop,
        onElementResize: Metro.noop,
        onResizerCreate: Metro.noop
    };

    Metro.resizerSetup = function (options) {
        ResizerDefaultConfig = $.extend({}, ResizerDefaultConfig, options);
    };

    if (typeof globalThis["metroResizerSetup"] !== "undefined") {
        Metro.resizerSetup(globalThis["metroResizerSetup"]);
    }

    Metro.Component('resizer', {
        init: function( options, elem ) {
            this._super(elem, options, ResizerDefaultConfig, {
                size: {width: 0, height: 0},
                media: globalThis.METRO_MEDIA,
                id: Utils.elementId("resizer")
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this.size = {
                width: element.width(),
                height: element.height()
            };

            this._createStructure();
            this._createEvents();

            this._fireEvent("resizer-create", {
                element: element
            });
        },

        _createStructure: function(){
        },

        _createEvents: function(){
            var that = this, element = this.element;
            var win = $.window();

            win.on("resize", function(){
                var windowWidth = win.width(), windowHeight = win.height();
                var elementWidth = element.width(), elementHeight = element.height();
                var oldSize = that.size;
                var point;

                that._fireEvent("window-resize", {
                    width: windowWidth,
                    height: windowHeight,
                    media: globalThis.METRO_MEDIA
                });

                if (that.size.width !== elementWidth || that.size.height !== elementHeight) {
                    that.size = {
                        width: elementWidth,
                        height: elementHeight
                    };

                    that._fireEvent("element-resize", {
                        width: elementWidth,
                        height: elementHeight,
                        oldSize: oldSize,
                        media: globalThis.METRO_MEDIA
                    });

                }

                if (that.media.length !== globalThis.METRO_MEDIA.length) {
                    if (that.media.length > globalThis.METRO_MEDIA.length) {
                        point = that.media.filter(function(x){
                            return !globalThis.METRO_MEDIA.includes(x);
                        });

                        that._fireEvent("media-point-leave", {
                            point: point,
                            media: globalThis.METRO_MEDIA
                        });

                    } else {
                        point = globalThis.METRO_MEDIA.filter(function(x){
                            return !that.media.includes(x);
                        });

                        that._fireEvent("media-point-enter", {
                            point: point,
                            media: globalThis.METRO_MEDIA
                        });
                    }

                    that.media = globalThis.METRO_MEDIA;

                    that._fireEvent("media-point", {
                        point: point,
                        media: globalThis.METRO_MEDIA
                    });
                }
            }, {ns: this.id});
        },

        changeAttribute: function(){
        },

        destroy: function(){
            $(globalThis).off("resize", {ns: this.id});
        }
    });
}(Metro, Dom));