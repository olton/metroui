(function(Metro, $) {
    'use strict';

    let ActionButtonDefaultConfig = {
        onClick: Metro.noop,
        onActionClick: Metro.noop,
        onActionButtonCreate: Metro.noop
    };

    Metro.actionButtonSetup = function (options) {
        ActionButtonDefaultConfig = $.extend({}, ActionButtonDefaultConfig, options);
    };

    if (typeof window["metroActionButtonSetup"] !== undefined) {
        Metro.actionButtonSetup(window["metroActionButtonSetup"]);
    }

    Metro.Component('action-button', {
        init: function( options, elem ) {
            this._super(elem, options, ActionButtonDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            const that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('action-button-create');
        },

        _createStructure: function(){
            const that = this, element = this.element, o = this.options;
            const actions = element.find(".actions li, .actions button");

            element.addClass("action-button");
            element.cssVar("num-actions", actions.length);
            if (actions.length > 8) {
                element.cssVar("action-shift", 60 + (actions.length - 8) * 6 + "px");
            }
            actions.each(function(index){
                $(this).cssVar("action-index", index).addClass("sub-action");
            });
            element.children("button").addClass("main-action");
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;
            element.on(Metro.events.click, ".actions li, .actions button", function(){
                that._fireEvent("action-click", {action: this});
            })
            
            element.on(Metro.events.click, ".action-button", function(){
                that._fireEvent("click");
            });
        },

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));