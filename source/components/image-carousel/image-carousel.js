((Metro, $) => {
    "use strict";

    let ImageCarouselDefaultConfig = {
        thumbnailSize: null,
        animationDuration: 300,
        animationEasing: "linear",
        onSlideChange: Metro.noop,
        onCarouselCreate: Metro.noop,
    };

    Metro.imageCarouselSetup = (options) => {
        ImageCarouselDefaultConfig = $.extend({}, ImageCarouselDefaultConfig, options);
    };

    if (typeof window.metroImageCarouselSetup !== "undefined") {
        Metro.imageCarouselSetup(window.metroImageCarouselSetup);
    }

    Metro.Component("image-carousel", {
        init: function (options, elem) {
            this._super(elem, options, ImageCarouselDefaultConfig, {
                // define instance vars here
                scene: null,
                nextButton: null,
                prevButton: null,
                images: [],
                index: 0,
                animation: false,
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("image-carousel");

            if (o.thumbnailSize) {
                element.cssVar("thumbnail-size", `${o.thumbnailSize}px`);
            }

            this._createStructure();
            this._createEvents();

            this._fireEvent("carousel-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            this.images = [...element.children("img").hide()];

            this.scene = $("<div>").addClass("scene").html("Scene").appendTo(element);
            this.scene.css({
                height: Metro.utils.getInnerSize(this.scene).width,
            });

            const thumbnails = $("<div>").addClass("thumbnails").appendTo(element);
            this.images.forEach((img, index) => {
                const c = $("<div>")
                    .addClass(`thumbnail ${index === 0 ? "active" : ""}`)
                    .appendTo(thumbnails);
                $("<img>").attr("src", img.src).attr("alt", img.src).appendTo(c);
            });

            this.prevButton = $("<button>").addClass("cycle prev-button").appendTo(this.scene);
            this.nextButton = $("<button>").addClass("cycle next-button").appendTo(this.scene);

            this.scene.append(this._createSlide(0).addClass("current"));
        },

        _createEvents: function () {
            const that = this;

            this.prevButton.on(Metro.events.click, (e) => {
                e.preventDefault();
                if (this.index > 0) {
                    this.index--;
                    this.goto(this.index, "prev");
                }
            });

            this.nextButton.on(Metro.events.click, (e) => {
                e.preventDefault();
                if (this.index < this.images.length - 1) {
                    this.index++;
                    this.goto(this.index, "next");
                }
            });

            this.element.on(Metro.events.click, ".thumbnail", function (e) {
                e.preventDefault();
                const thumbnail = $(this);
                const index = thumbnail.index();

                if (index !== that.index) {
                    that.goto(index, index > that.index ? "next" : "prev");
                }
            });

            $("window").on(Metro.events.resize, () => {
                this.scene.css({
                    height: Metro.utils.getInnerSize(this.scene).width,
                });
            });
        },

        _createSlide: function (index) {
            if (index < 0 || index >= this.images.length) {
                return;
            }

            const img = this.images[index].cloneNode(true);
            const slide = $("<div>").addClass("slide").append($(img).show());

            return slide;
        },

        goto: function (index, direction) {
            if (this.animation) {
                return;
            }
            if (index < 0 || index >= this.images.length) {
                return;
            }

            this.animation = true;

            const width = Metro.utils.getInnerSize(this.scene).width;
            const currentSlide = this.scene.find(".slide.current");
            const newSlide = this._createSlide(index)
                .css({ left: direction === "next" ? width : -width })
                .appendTo(this.scene);

            currentSlide.animate({
                draw: {
                    left: direction === "next" ? [0, -width] : [0, width],
                },
                dur: this.options.animationDuration,
                ease: this.options.animationEasing,
                onDone: () => {
                    currentSlide.remove();
                    this.scene.find(".thumbnail.active").removeClass("active");
                    this.scene.find(`.thumbnail:nth-child(${index + 1})`).addClass("active");
                },
            });

            newSlide.animate({
                draw: {
                    left: direction === "next" ? [width, 0] : [-width, 0],
                },
                dur: this.options.animationDuration,
                ease: this.options.animationEasing,
                onDone: () => {
                    newSlide.addClass("current");
                    this.element.find(".thumbnail.active").removeClass("active");
                    this.element.find(`.thumbnail:nth-child(${index + 1})`).addClass("active");
                    this.animation = false;
                    this._fireEvent("slide-change", {
                        index: index,
                        direction: direction,
                        currentSlide: currentSlide,
                        newSlide: newSlide,
                    });
                },
            });

            this.index = index;
        },

        changeAttribute: function (attr, newValue) {
            const element = this.element;
            const o = this.options;

            switch (attr) {
                case "data-thumbnail-size":
                    o.thumbnailSize = newValue;
                    element.cssVar("thumbnail-size", `${newValue}px`);
                    break;
                case "data-animation-duration":
                    o.animationDuration = parseInt(newValue, 10);
                    break;
                case "data-animation-easing":
                    o.animationEasing = newValue;
                    break;
                default:
                    break;
            }
        },

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
