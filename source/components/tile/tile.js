((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const effects = ["slide-up", "slide-down", "slide-left", "slide-right", "fade", "zoom", "swirl", "switch"];
    let TileDefaultConfig = {
        tileDeferred: 0,
        size: "medium",
        cover: "",
        coverPosition: "center",
        effect: "", // slide-up, slide-down, slide-left, slide-right, fade, zoom, swirl, switch
        effectInterval: 3000,
        effectDuration: 500,
        target: null,
        canTransform: true,
        onTileClick: Metro.noop,
        onTileCreate: Metro.noop,
    };

    Metro.tileSetup = (options) => {
        TileDefaultConfig = $.extend({}, TileDefaultConfig, options);
    };

    if (typeof globalThis.metroTileSetup !== "undefined") {
        Metro.tileSetup(globalThis.metroTileSetup);
    }

    Metro.Component("tile", {
        init: function (options, elem) {
            this._super(elem, options, TileDefaultConfig, {
                effectInterval: false,
                images: [],
                slides: [],
                currentSlide: -1,
                unload: false,
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createTile();
            this._createEvents();

            this._fireEvent("tile-create", {
                element: element,
            });
        },

        _createTile: function () {
            function switchImage(el, img_src, i) {
                setTimeout(() => {
                    el.fadeOut(500, () => {
                        el.css("background-image", `url(${img_src})`);
                        el.fadeIn();
                    });
                }, i * 300);
            }

            const that = this;
            const element = this.element;
            const o = this.options;
            const slides = element.find(".slide");
            const slides2 = element.find(".slide-front, .slide-back");

            element.addClass(`tile-${o.size}`);

            if (o.effect.indexOf("hover-") > -1) {
                element.addClass(`effect-${o.effect}`);
                $.each(slides2, function () {
                    const slide = $(this);

                    if (slide.data("cover") !== undefined) {
                        that._setCover(slide, slide.data("cover"), slide.data("cover-position"));
                    }
                });
            }

            if (effects.includes(o.effect) && slides.length > 1) {
                $.each(slides, function (i) {
                    const slide = $(this);

                    that.slides.push(this);

                    if (slide.data("cover") !== undefined) {
                        that._setCover(slide, slide.data("cover"), slide.data("cover-position"));
                    }

                    if (i > 0) {
                        if (["slide-up", "slide-down"].indexOf(o.effect) > -1) slide.css("top", "100%");
                        if (["slide-left", "slide-right"].indexOf(o.effect) > -1) slide.css("left", "100%");
                        if (["fade", "zoom", "swirl", "switch"].indexOf(o.effect) > -1) slide.css("opacity", 0);
                    }
                });

                this.currentSlide = 0;

                this._runEffects();
            }

            if (o.cover !== "") {
                this._setCover(element, o.cover);
            }

            if (o.effect === "image-set") {
                element.addClass("image-set");

                $.each(element.children("img"), function () {
                    that.images.push(this);
                    $(this).remove();
                });

                const temp = this.images.slice();

                for (let i = 0; i < 5; i++) {
                    const rnd_index = $.random(0, temp.length - 1);
                    const div = $("<div>")
                        .addClass(`img -js-img-${i}`)
                        .css("background-image", `url(${temp[rnd_index].src})`);
                    element.prepend(div);
                    temp.splice(rnd_index, 1);
                }

                let a = [0, 1, 4, 3, 2];

                setInterval(() => {
                    const temp = that.images.slice();
                    const bg = Farbe.Routines.randomColor();

                    element.css("background-color", bg);

                    for (let i = 0; i < a.length; i++) {
                        const rnd_index = $.random(0, temp.length - 1);
                        const div = element.find(`.-js-img-${a[i]}`);
                        switchImage(div, temp[rnd_index].src, i);
                        temp.splice(rnd_index, 1);
                    }

                    a = a.reverse();
                }, 5000);
            }
        },

        _runEffects: function () {
            const o = this.options;

            if (this.effectInterval === false)
                this.effectInterval = setInterval(() => {
                    let current;
                    let next;

                    current = $(this.slides[this.currentSlide]);

                    this.currentSlide++;
                    if (this.currentSlide === this.slides.length) {
                        this.currentSlide = 0;
                    }

                    next = this.slides[this.currentSlide];

                    if (effects.includes(o.effect)) {
                        Metro.Effects[Str.camelCase(o.effect)]($(current)[0], $(next)[0], {
                            duration: o.effectDuration,
                        });
                    }
                }, o.effectInterval);
        },

        _stopEffects: function () {
            $.clearInterval(this.effectInterval);
            this.effectInterval = false;
        },

        _setCover: function (to, src, pos) {
            to.css({
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: pos || this.options.coverPosition,
            });
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.startAll, function (e) {
                const tile = $(this);
                const dim = { w: element.width(), h: element.height() };
                const X = Metro.utils.pageXY(e).x - tile.offset().left;
                const Y = Metro.utils.pageXY(e).y - tile.offset().top;
                let side;

                if (Metro.utils.isRightMouse(e) === false) {
                    if (X < (dim.w * 1) / 3 && (Y < (dim.h * 1) / 2 || Y > (dim.h * 1) / 2)) {
                        side = "left";
                    } else if (X > (dim.w * 2) / 3 && (Y < (dim.h * 1) / 2 || Y > (dim.h * 1) / 2)) {
                        side = "right";
                    } else if (X > (dim.w * 1) / 3 && X < (dim.w * 2) / 3 && Y > dim.h / 2) {
                        side = "bottom";
                    } else {
                        side = "top";
                    }

                    if (o.canTransform === true) tile.addClass(`transform-${side}`);

                    if (o.target !== null) {
                        setTimeout(() => {
                            document.location.href = o.target;
                        }, 100);
                    }

                    that._fireEvent("tile-click", {
                        side: side,
                    });
                }
            });

            element.on([Metro.events.stopAll, Metro.events.leave].join(" "), function () {
                $(this)
                    .removeClass("transform-left")
                    .removeClass("transform-right")
                    .removeClass("transform-top")
                    .removeClass("transform-bottom");
            });
        },

        changeAttribute: () => {},

        destroy: function () {
            const element = this.element;
            element.off(Metro.events.startAll);
            element.off([Metro.events.stopAll, Metro.events.leave].join(" "));
            element.remove();
        },
    });
})(Metro, Dom);
