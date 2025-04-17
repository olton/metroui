/* global Metro */
(function(Metro, $) {
    'use strict';

    var LightboxDefaultConfig = {
        loop: true,
        source: "img",

        iconClose: "❌",
        iconPrev: "🡐",
        iconNext: "🡒",

        clsNext: "",
        clsPrev: "",
        clsClose: "",
        clsImage: "",
        clsImageContainer: "",
        clsImageWrapper: "",
        clsLightbox: "",

        onDrawImage: Metro.noop,
        onLightboxCreate: Metro.noop
    };

    Metro.lightboxSetup = function (options) {
        LightboxDefaultConfig = $.extend({}, LightboxDefaultConfig, options);
    };

    if (typeof globalThis["metroLightboxSetup"] !== "undefined") {
        Metro.lightboxSetup(globalThis["metroLightboxSetup"]);
    }

    Metro.Component('lightbox', {
        init: function( options, elem ) {
            this._super(elem, options, LightboxDefaultConfig, {
                // define instance vars here
                overlay: null,
                lightbox: null,
                current: null,
                items: []
            });
            return this;
        },

        _create: function(){
            var o = this.options;

            if (!o.source) {
                o.source = "img";
            }

            this._createStructure();
            this._createEvents();

            this._fireEvent('lightbox-create');
        },

        _createStructure: function(){
            var o = this.options;
            var lightbox, overlay;

            overlay = $(".lightbox-overlay");

            if (overlay.length === 0) {
                overlay = $("<div>").addClass("lightbox-overlay").appendTo("body").hide();
            }

            lightbox = $("<div>").addClass("lightbox").addClass(o.clsLightbox).appendTo("body").hide();

            $("<span>").addClass("lightbox__prev").addClass(o.clsPrev).html(o.iconPrev).appendTo(lightbox);
            $("<span>").addClass("lightbox__next").addClass(o.clsNext).html(o.iconNext).appendTo(lightbox);
            $("<span>").addClass("lightbox__closer").addClass(o.clsClose).html(o.iconClose).appendTo(lightbox);
            $("<div>").addClass("lightbox__image").addClass(o.clsImageContainer).appendTo(lightbox);

            this.component = lightbox[0];
            this.lightbox = lightbox;
            this.overlay = overlay;
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var lightbox = $(this.component);

            element.on(Metro.events.click, o.source, function(){
                that.open(this);
            });

            lightbox.on(Metro.events.click, ".lightbox__closer", function(){
                that.close();
            });

            lightbox.on(Metro.events.click, ".lightbox__prev", function(){
                that.prev();
            });

            lightbox.on(Metro.events.click, ".lightbox__next", function(){
                that.next();
            });
        },

        _setupItems: function(){
            var element = this.element, o = this.options;
            var items = element.find(o.source);

            if (items.length === 0) {
                return ;
            }

            this.items = items;
        },

        _goto: function(el){
            var that = this, o = this.options;
            var $el = $(el);
            var img = $("<img>"), src;
            var imageContainer, imageWrapper, activity;

            imageContainer = this.lightbox.find(".lightbox__image");

            imageContainer.find(".lightbox__image-wrapper").remove();
            imageWrapper = $("<div>")
                .addClass("lightbox__image-wrapper")
                .addClass(o.clsImageWrapper)
                .attr("data-title", ($el.attr("alt") || $el.attr("data-title") || ""))
                .appendTo(imageContainer);

            activity = $("<div>").appendTo(imageWrapper);

            Metro.makePlugin(activity, "activity", {
                type: "cycle",
                style: "color"
            });

            this.current = el;

            if (el.tagName === "IMG" || el.tagName === "DIV") {
                src = $el.attr("data-original") || $el.attr("src");
                img.attr("src", src);
                img[0].onload = function(){
                    var port = this.height > this.width;
                    img.addClass(port ? "lightbox__image-portrait" : "lightbox__image-landscape").addClass(o.clsImage);
                    img.attr("alt", $el.attr("alt"));
                    img.appendTo(imageWrapper);
                    activity.remove();
                    that._fireEvent("draw-image", {
                        image: img[0],
                        item: imageWrapper[0]
                    });
                }
            }
        },

        _index: function(el){
            var index = -1;

            this.items.each(function(i){
                if (this === el) {
                    index = i;
                }
            });

            return index;
        },

        next: function(){
            var index, current = this.current;

            index = this._index(current);

            if (index + 1 >= this.items.length) {
                if (this.options.loop) {
                    index = -1;
                } else {
                    return;
                }
            }

            this._goto(this.items[index + 1]);
        },

        prev: function(){
            var index, current = this.current;

            index = this._index(current);

            if (index - 1 < 0) {
                if (this.options.loop) {
                    index = this.items.length;
                } else {
                    return;
                }
            }

            this._goto(this.items[index - 1]);
        },

        open: function(el){
            this._setupItems();

            this._goto(el);

            this.overlay.show();
            this.lightbox.show();

            return this;
        },

        close: function(){
            this.overlay.hide();
            this.lightbox.hide();
        },

        changeAttribute: function(){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));