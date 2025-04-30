((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let ImageGridDefaultConfig = {
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

    Metro.imageGridSetup = (options) => {
        ImageGridDefaultConfig = $.extend({}, ImageGridDefaultConfig, options);
    };

    if (typeof globalThis.metroImageGridSetup !== "undefined") {
        Metro.imageGridSetup(globalThis.metroImageGridSetup);
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
            const element = this.element;
            const o = this.options;

            element.addClass("image-grid").addClass(o.clsImageGrid);

            this._createItems();
        },

        _createEvents: function(){
            const that = this;
            const element = this.element;

            element.on(Metro.events.click, ".image-grid__item", function(){
                that._fireEvent("item-click", {
                    item: this
                });
            });
        },

        _createItems: function(){
            const that = this;
            const element = this.element;
            const o = this.options;
            const items = this.items;

            element.clear();

            items.each(function(){
                const el = $(this);
                const src = this.src;
                const wrapper = $("<div>").addClass("image-grid__item").addClass(o.clsImageGridItem).appendTo(element);
                const img = new Image();

                img.src = src;
                img.onload = function(){
                    const port = this.height >= this.width;
                    wrapper.addClass(port ? "image-grid__item-portrait" : "image-grid__item-landscape");
                    el.addClass(o.clsImageGridImage).appendTo(wrapper);

                    if (o.useBackground) {
                        wrapper
                            .css({
                                background: `url(${src})`,
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
            const o = this.options;

            if (attr === "data-use-background") {
                o.useBackground = Metro.utils.bool(val);
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
})(Metro, Dom);