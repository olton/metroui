/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var ImageCompareDefaultConfig = {
        imagecompareDeferred: 0,
        width: "100%",
        height: "auto",
        onSliderMove: Metro.noop,
        onImageCompareCreate: Metro.noop
    };

    Metro.imageCompareSetup = function (options) {
        ImageCompareDefaultConfig = $.extend({}, ImageCompareDefaultConfig, options);
    };

    if (typeof globalThis["metroImageCompareSetup"] !== undefined) {
        Metro.imageCompareSetup(globalThis["metroImageCompareSetup"]);
    }

    Metro.Component('image-compare', {
        init: function( options, elem ) {
            this._super(elem, options, ImageCompareDefaultConfig, {
                id: Utils.elementId("image-compare")
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("image-compare-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var container, container_overlay, slider;
            var images, element_width, element_height;

            if (!Utils.isValue(element.attr("id"))) {
                element.attr("id", Utils.elementId("image-compare"));
            }

            element.addClass("image-compare").css({
                width: o.width
            });

            element_width = element.width();

            switch (o.height) {
                case "16/9": element_height = Utils.aspectRatioH(element_width, o.height); break;
                case "21/9": element_height = Utils.aspectRatioH(element_width, o.height); break;
                case "4/3": element_height = Utils.aspectRatioH(element_width, o.height); break;
                case "auto": element_height = Utils.aspectRatioH(element_width, "16/9"); break;
                default: element_height = o.height;
            }

            element.css({
                height: element_height
            });

            container = $("<div>").addClass("image-container").appendTo(element);
            container_overlay = $("<div>").addClass("image-container-overlay").appendTo(element).css({
                width: element_width / 2
            });

            slider = $("<div>").addClass("image-slider").appendTo(element);
            slider.css({
                top: element_height / 2 - slider.height() / 2,
                left: element_width / 2 - slider.width() / 2
            });

            images = element.find("img");

            $.each(images, function(i){
                var img = $("<div>").addClass("image-wrapper");
                img.css({
                    width: element_width,
                    height: element_height,
                    backgroundImage: "url("+this.src+")"
                });
                img.appendTo(i === 0 ? container : container_overlay);
            });
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            var overlay = element.find(".image-container-overlay");
            var slider = element.find(".image-slider");

            slider.on(Metro.events.startAll, function(){
                var w = element.width();
                $(document).on(Metro.events.moveAll, function(e){
                    var x = Utils.getCursorPositionX(element[0], e), left_pos;
                    if (x < 0) x = 0;
                    if (x > w) x = w;
                    overlay.css({
                        width: x
                    });
                    left_pos = x - slider.width() / 2;
                    slider.css({
                        left: left_pos
                    });

                    that._fireEvent("slider-move", {
                        x: x,
                        l: left_pos
                    });
                }, {ns: that.id});

                $(document).on(Metro.events.stopAll, function(){
                    $(document).off(Metro.events.moveAll, {ns: that.id});
                    $(document).off(Metro.events.stopAll, {ns: that.id});
                }, {ns: that.id})
            });

            $(globalThis).on(Metro.events.resize, function(){
                var element_width = element.width(), element_height;

                if (o.width !== "100%") {
                    return ;
                }

                switch (o.height) {
                    case "16/9": element_height = Utils.aspectRatioH(element_width, o.height); break;
                    case "21/9": element_height = Utils.aspectRatioH(element_width, o.height); break;
                    case "4/3": element_height = Utils.aspectRatioH(element_width, o.height); break;
                    case "auto": element_height = Utils.aspectRatioH(element_width, "16/9"); break;
                    default: element_height = o.height;
                }

                element.css({
                    height: element_height
                });

                $.each(element.find(".image-wrapper"), function(){
                    $(this).css({
                        width: element_width,
                        height: element_height
                    })
                });

                element.find(".image-container-overlay").css({
                    width: element_width / 2
                });

                slider.css({
                    top: element_height / 2 - slider.height() / 2,
                    left: element_width / 2 - slider.width() / 2
                });

            }, {ns: this.id});
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.start);
            $(globalThis).off(Metro.events.resize, {ns: this.id});

            return element;
        }
    });
}(Metro, Dom));