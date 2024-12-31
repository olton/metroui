/* global Metro */
(function(Metro, $) {
    'use strict';

    let SwipeDefaultConfig = {
        swipeThreshold: 32,
        
        onSwipe: Metro.noop,
        onSwipeRight: Metro.noop,
        onSwipeLeft: Metro.noop,
        onSwipeUp: Metro.noop,
        onSwipeDown: Metro.noop,
        onSwipeCreate: Metro.noop
    };

    Metro.swipeSetup = function (options) {
        SwipeDefaultConfig = $.extend({}, SwipeDefaultConfig, options);
    };

    if (typeof window["metroSwipeSetup"] !== undefined) {
        Metro.swipeSetup(window["metroSwipeSetup"]);
    }

    Metro.Component('swipe', {
        init: function( options, elem ) {
            this._super(elem, options, SwipeDefaultConfig, {});
            return this;
        },

        _create: function(){
            this._createEvents();
            this._fireEvent('swipe-create');
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;
            
            element.on("touchstart mousedown", function(e){
                let start = Metro.utils.pageXY(e);

                let swipe = {
                    x: 0,
                    y: 0
                };

                element.on("touchmove mousemove", function(e){
                    let changes = Metro.utils.pageXY(e);
                    swipe.x = changes.x - start.x;
                    swipe.y = changes.y - start.y;
                });

                element.on("touchend mouseup", function(e){
                    let direction = "";
                    
                    if (Math.abs(swipe.x) > o.swipeThreshold || Math.abs(swipe.y) > o.swipeThreshold) {
                        if (Math.abs(swipe.x) > Math.abs(swipe.y)) {
                            if (swipe.x > 0) {
                                direction = "right";
                                that._fireEvent("swipe-right", {
                                    start,
                                    swipe, 
                                });
                            } else {
                                direction = "left";
                                that._fireEvent("swipe-left", {
                                    start,
                                    swipe,
                                });
                            }
                        } else {
                            if (swipe.y > 0) {
                                direction = "down";
                                that._fireEvent("swipe-down", {
                                    start,
                                    swipe,
                                });
                            } else {
                                direction = "up";
                                that._fireEvent("swipe-up", {
                                    start,
                                    swipe,
                                });
                            }
                        }
                        that._fireEvent("swipe", {
                            start,
                            swipe,
                            direction
                        });
                    }
                    
                    element.off("touchmove mousemove");
                    element.off("touchend mouseup");
                });
            });
        },

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, m4q));