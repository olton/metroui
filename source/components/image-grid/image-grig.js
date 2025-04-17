/* global Metro */
(function(Metro, $) {
    'use strict';

    var Utils = Metro.utils;
    var ImageGridDefaultConfig = {
        useBackground: false,
        backgroundSize: "cover",
        backgroundPosition: "top left",

        clsImageGrid: "",
        clsImageGridItem: "",
        clsImageGridImage: "",

        onItemClick: Metro.noop,
        onDrawItem: Metro.noop,
        onImageGridCreate: Metro.noop
    };

    Metro.imageGridSetup = function (options) {
        ImageGridDefaultConfig = $.extend({}, ImageGridDefaultConfig, options);
    };

    if (typeof globalThis["metroImageGridSetup"] !== "undefined") {
        Metro.imageGridSetup(globalThis["metroImageGridSetup"]);
    }

    Metro.Component('image-grid', {
        init: function( options, elem ) {
            this._super(elem, options, ImageGridDefaultConfig, {
                // define instance vars here
                items: []
            });
            return this;
        },

        _create: function(){
            this.items = this.element.children("img");
            this._createStructure();
            this._createEvents();
            this._fireEvent('image-grid-create');
        },

        _createStructure: function(){
            var element = this.element, o = this.options;

            element.addClass("image-grid").addClass(o.clsImageGrid);

            this._createItems();
        },

        _createEvents: function(){
            var that = this, element = this.element;

            element.on(Metro.events.click, ".image-grid__item", function(){
                that._fireEvent("item-click", {
                    item: this
                });
            });
        },

        _createItems: function(){
            var that = this, element = this.element, o = this.options;
            var items = this.items;

            element.clear();

            items.each(function(){
                var el = $(this);
                var src = this.src;
                var wrapper = $("<div>").addClass("image-grid__item").addClass(o.clsImageGridItem).appendTo(element);
                var img = new Image();

                img.src = src;
                img.onload = function(){
                    var port = this.height >= this.width;
                    wrapper.addClass(port ? "image-grid__item-portrait" : "image-grid__item-landscape");
                    el.addClass(o.clsImageGridImage).appendTo(wrapper);

                    if (o.useBackground) {
                        wrapper
                            .css({
                                background: "url("+src+")",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: o.backgroundSize,
                                backgroundPosition: o.backgroundPosition
                            })
                            .attr("data-original", el.attr("data-original") || src)
                            .attr("data-title", el.attr("alt") || el.attr("data-title") || "");
                        el.visible(false);
                    }

                    that._fireEvent("draw-item", {
                        item: wrapper[0],
                        image: el[0]
                    });
                }
            });
        },

        changeAttribute: function(attr, val){
            var o = this.options;

            if (attr === "data-use-background") {
                o.useBackground = Utils.bool(val);
                this._createItems();
            }

            if (attr === "data-background-size") {
                o.backgroundSize = val;
                this._createItems();
            }

            if (attr === "data-background-position") {
                o.backgroundPosition = val;
                this._createItems();
            }
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));