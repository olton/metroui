/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var ResizableDefaultConfig = {
        resizableDeferred: 0,
        canResize: true,
        resizeElement: ".resize-element",
        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        preserveRatio: false,
        onResizeStart: Metro.noop,
        onResizeStop: Metro.noop,
        onResize: Metro.noop,
        onResizableCreate: Metro.noop
    };

    Metro.resizableSetup = function (options) {
        ResizableDefaultConfig = $.extend({}, ResizableDefaultConfig, options);
    };

    if (typeof globalThis["metroResizableSetup"] !== "undefined") {
        Metro.resizableSetup(globalThis["metroResizableSetup"]);
    }

    Metro.Component('resizable', {
        init: function( options, elem ) {
            this._super(elem, options, ResizableDefaultConfig, {
                resizer: null,
                id: Utils.elementId("resizable")
            });

            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent("resizable-create");
        },

        _createStructure: function(){
            var element = this.element, o = this.options;

            element.data("canResize", true);
            element.addClass("resizable-element");

            if (Utils.isValue(o.resizeElement) && element.find(o.resizeElement).length > 0) {
                this.resizer = element.find(o.resizeElement);
            } else {
                this.resizer = $("<span>").addClass("resize-element").appendTo(element);
            }

            element.data("canResize", o.canResize);
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            this.resizer.on(Metro.events.start, function(e){

                if (element.data('canResize') === false) {
                    return ;
                }

                var startXY = Utils.pageXY(e);
                var startWidth = parseInt(element.outerWidth());
                var startHeight = parseInt(element.outerHeight());
                var size = {width: startWidth, height: startHeight};

                element.addClass("stop-pointer");

                that._fireEvent("resize-start", {
                    size: size
                });

                $(document).on(Metro.events.move, function(e){
                    var moveXY = Utils.pageXY(e);
                    var size = {
                        width: startWidth + moveXY.x - startXY.x,
                        height: startHeight + moveXY.y - startXY.y
                    };

                    if (o.maxWidth > 0 && size.width > o.maxWidth) {return true;}
                    if (o.minWidth > 0 && size.width < o.minWidth) {return true;}

                    if (o.maxHeight > 0 && size.height > o.maxHeight) {return true;}
                    if (o.minHeight > 0 && size.height < o.minHeight) {return true;}

                    element.css(size);

                    that._fireEvent("resize", {
                        size: size
                    })

                }, {ns: that.id});

                $(document).on(Metro.events.stop, function(){
                    element.removeClass("stop-pointer");

                    $(document).off(Metro.events.move, {ns: that.id});
                    $(document).off(Metro.events.stop, {ns: that.id});

                    var size = {
                        width: parseInt(element.outerWidth()),
                        height: parseInt(element.outerHeight())
                    };

                    that._fireEvent("resize-stop", {
                        size: size
                    });

                }, {ns: that.id});

                e.preventDefault();
                e.stopPropagation();
            });

        },

        off: function(){
            this.element.data("canResize", false);
        },

        on: function(){
            this.element.data("canResize", true);
        },

        changeAttribute: function(attributeName){
            var element = this.element, o = this.options;

            var canResize = function(){
                o.canResize = JSON.parse(element.attr('data-can-resize')) === true;
            };

            switch (attributeName) {
                case "data-can-resize": canResize(); break;
            }
        },

        destroy: function(){
            this.resizer.off(Metro.events.start);
            return this.element;
        }
    });
}(Metro, Dom));