((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let ResizerDefaultConfig = {
        resizerDeferred: 0,
        onMediaPoint: Metro.noop,
        onMediaPointEnter: Metro.noop,
        onMediaPointLeave: Metro.noop,
        onWindowResize: Metro.noop,
        onElementResize: Metro.noop,
        onResizerCreate: Metro.noop
    };

    Metro.resizerSetup = (options) => {
        ResizerDefaultConfig = $.extend({}, ResizerDefaultConfig, options);
    };

    if (typeof globalThis.metroResizerSetup !== "undefined") {
        Metro.resizerSetup(globalThis.metroResizerSetup);
    }

    Metro.Component('resizer', {
        init: function( options, elem ) {
            this._super(elem, options, ResizerDefaultConfig, {
                size: {width: 0, height: 0},
                media: globalThis.METRO_MEDIA,
                id: Metro.utils.elementId("resizer")
            });

            return this;
        },

        _create: function(){
            const element = this.element;

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

        _createStructure: ()=> {
        },

        _createEvents: function(){
            const element = this.element;
            const win = $.window();

            win.on("resize", ()=> {
                const windowWidth = win.width();
                const windowHeight = win.height();
                const elementWidth = element.width();
                const elementHeight = element.height();
                const oldSize = this.size;
                let point;

                this._fireEvent("window-resize", {
                    width: windowWidth,
                    height: windowHeight,
                    media: globalThis.METRO_MEDIA
                });

                if (this.size.width !== elementWidth || this.size.height !== elementHeight) {
                    this.size = {
                        width: elementWidth,
                        height: elementHeight
                    };

                    this._fireEvent("element-resize", {
                        width: elementWidth,
                        height: elementHeight,
                        oldSize: oldSize,
                        media: globalThis.METRO_MEDIA
                    });

                }

                if (this.media.length !== globalThis.METRO_MEDIA.length) {
                    if (this.media.length > globalThis.METRO_MEDIA.length) {
                        point = this.media.filter((x)=> !globalThis.METRO_MEDIA.includes(x));

                        this._fireEvent("media-point-leave", {
                            point: point,
                            media: globalThis.METRO_MEDIA
                        });

                    } else {
                        point = globalThis.METRO_MEDIA.filter((x)=> !this.media.includes(x));

                        this._fireEvent("media-point-enter", {
                            point: point,
                            media: globalThis.METRO_MEDIA
                        });
                    }

                    this.media = globalThis.METRO_MEDIA;

                    this._fireEvent("media-point", {
                        point: point,
                        media: globalThis.METRO_MEDIA
                    });
                }
            }, {ns: this.id});
        },

        changeAttribute: ()=> {
        },

        destroy: function(){
            $(globalThis).off("resize", {ns: this.id});
        }
    });
})(Metro, Dom);