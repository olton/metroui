/* global Metro */
/* eslint-disable */
(function(Metro, $) {
    'use strict';

    var SearcherDefaultConfig = {
        onSearcherCreate: Metro.noop
    };

    Metro.searcherSetup = function (options) {
        SearcherDefaultConfig = $.extend({}, SearcherDefaultConfig, options);
    };

    if (typeof globalThis["metroSearcherSetup"] !== undefined) {
        Metro.searcherSetup(globalThis["metroSearcherSetup"]);
    }

    Metro.Component('searcher', {
        init: function( options, elem ) {
            this._super(elem, options, SearcherDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('searcher-create');
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
/* eslint-enable */