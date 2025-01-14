/* global Metro */
(function(Metro, $) {
    'use strict';

    var MyObjectDefaultConfig = {
        onMyObjectCreate: Metro.noop
    };

    Metro.myObjectSetup = function (options) {
        MyObjectDefaultConfig = $.extend({}, MyObjectDefaultConfig, options);
    };

    if (typeof window["metroMyObjectSetup"] !== undefined) {
        Metro.myObjectSetup(window["metroMyObjectSetup"]);
    }

    Metro.Component('name', {
        init: function( options, elem ) {
            this._super(elem, options, MyObjectDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('component-create');
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;

        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

        },

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));