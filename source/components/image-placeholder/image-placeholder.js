/* global Metro */
(function(Metro, $) {
    'use strict';

    var ImagePlaceholderDefaultConfig = {
        size: "100x100",
        width: null,
        height: null,
        color: "#f8f8f8",
        textColor: "#292929",
        font: "12px sans-serif",
        text: "",
        showText: true,
        onImagePlaceholderCreate: Metro.noop
    };

    Metro.imagePlaceholderSetup = function (options) {
        ImagePlaceholderDefaultConfig = $.extend({}, ImagePlaceholderDefaultConfig, options);
    };

    if (typeof globalThis["metroImagePlaceholderSetup"] !== "undefined") {
        Metro.imagePlaceholderSetup(globalThis["metroImagePlaceholderSetup"]);
    }

    Metro.Component('image-placeholder', {
        init: function( options, elem ) {
            this._super(elem, options, ImagePlaceholderDefaultConfig, {
                // define instance vars here
                width: 0,
                height: 0
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('image-placeholder-create');
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var size = o.size.toArray("x");

            this.width = o.width ? o.width : size[0];
            this.height = o.height ? o.height : size[1];

            element.attr("src", this._createPlaceholder());
        },

        _createEvents: function(){
        },

        _createPlaceholder: function(){
            var o = this.options;
            var canvas = document.createElement("canvas"),
                context = canvas.getContext("2d");

            var width = this.width, height = this.height;

            canvas.width = parseInt(width);
            canvas.height = parseInt(height);

            // background
            context.clearRect(0, 0, width, height);
            context.fillStyle = o.color;
            context.fillRect(0, 0, width, height);

            // text
            context.fillStyle = o.textColor;
            context.font = o.font;

            context.translate(width / 2, height / 2);
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            if (o.showText)
                context.fillText(o.text ? o.text : width + " \u00d7 " + height, 0, 0);

            return canvas.toDataURL();
        },

        // changeAttribute: function(attr, newValue){
        // },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));