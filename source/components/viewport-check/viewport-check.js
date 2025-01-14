/* global Metro */
(function(Metro, $) {
    'use strict';

    var Utils = Metro.utils;
    var ViewportCheckDefaultConfig = {
        onViewport: Metro.noop,
        onViewportEnter: Metro.noop,
        onViewportLeave: Metro.noop,
        onViewportCheckCreate: Metro.noop
    };

    Metro.viewportCheckSetup = function (options) {
        ViewportCheckDefaultConfig = $.extend({}, ViewportCheckDefaultConfig, options);
    };

    if (typeof globalThis["metroViewportCheckSetup"] !== undefined) {
        Metro.viewportCheckSetup(globalThis["metroViewportCheckSetup"]);
    }

    Metro.Component('viewport-check', {
        init: function( options, elem ) {
            this._super(elem, options, ViewportCheckDefaultConfig, {
                // define instance vars here
                inViewport: false,
                id: Utils.elementId("viewport-check")
            });
            return this;
        },

        _create: function(){
            this.inViewport = Utils.inViewport(this.elem);

            this._createEvents();

            this._fireEvent('viewport-check-create');
        },

        _createEvents: function(){
            var that = this, elem = this.elem;

            $(globalThis).on(Metro.events.scroll, function(){
                var oldState = that.inViewport;

                that.inViewport = Utils.inViewport(elem);

                if (oldState !== that.inViewport) {
                    if (that.inViewport) {
                        that._fireEvent("viewport-enter");
                    } else {
                        that._fireEvent("viewport-leave");
                    }
                }

                that._fireEvent("viewport", {
                    state: that.inViewport
                });
            }, {ns: that.id});
        },

        state: function(){
            return this.inViewport;
        },

        destroy: function(){
            $(globalThis).off(Metro.events.scroll, {ns: this.id});

            return this.element;
        }
    });
}(Metro, Dom));