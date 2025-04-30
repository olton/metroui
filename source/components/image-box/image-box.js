((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let ImageBoxDefaultConfig = {
        image: null,
        size: "cover",
        repeat: false,
        color: "transparent",
        attachment: "scroll",
        origin: "border",
        onImageBoxCreate: Metro.noop
    };

    Metro.imageBoxSetup = (options) => {
        ImageBoxDefaultConfig = $.extend({}, ImageBoxDefaultConfig, options);
    };

    if (typeof globalThis.metroImageBoxSetup !== "undefined") {
        Metro.imageBoxSetup(globalThis.metroImageBoxSetup);
    }

    Metro.Component('image-box', {
        init: function( options, elem ) {
            this._super(elem, options, ImageBoxDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            this._createStructure();

            this._fireEvent('image-box-create');
        },

        _createStructure: function(){
            const element = this.element;

            element.addClass("image-box");

            this._drawImage();
        },

        _drawImage: function(){
            const element = this.element;
            const o = this.options;
            const image = new Image();
            let portrait;

            if (!element.attr("data-original"))
                element.attr("data-original", o.image);

            element.css({
                backgroundImage: `url(${o.image})`,
                backgroundSize: o.size,
                backgroundRepeat: o.repeat ? "repeat" : "no-repeat",
                backgroundColor: o.color,
                backgroundAttachment: o.attachment,
                backgroundOrigin: o.origin
            });

            image.src = o.image;
            image.onload = function(){
                portrait = this.height >= this.width;
                element
                    .removeClass("image-box__portrait image-box__landscape")
                    .addClass(`image-box__${portrait ? "portrait" : "landscape"}`);
            }
        },

        changeAttribute: function(attr, newValue){
            const attrName = attr.replace("data-", "");

            if (["image", "size", "repeat", "color", "attachment", "origin"].indexOf(attrName) > -1) {
                this.options[attrName] = newValue;
                this._drawImage();
            }
        },

        destroy: function(){
            return this.element;
        }
    });
})(Metro, Dom);