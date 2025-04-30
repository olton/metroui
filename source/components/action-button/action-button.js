((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let ActionButtonDefaultConfig = {
        onClick: Metro.noop,
        onActionClick: Metro.noop,
        onActionButtonCreate: Metro.noop
    };

    Metro.actionButtonSetup = (options) => {
        ActionButtonDefaultConfig = $.extend({}, ActionButtonDefaultConfig, options);
    };

    if (typeof globalThis.metroActionButtonSetup !== "undefined") {
        Metro.actionButtonSetup(globalThis.metroActionButtonSetup);
    }

    Metro.Component('action-button', {
        init: function( options, elem ) {
            this._super(elem, options, ActionButtonDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('action-button-create');
        },

        _createStructure: function(){
            const element = this.element;
            const actions = element.find(".actions li, .actions button");

            element.addClass("action-button");
            element.cssVar("num-actions", actions.length);
            if (actions.length > 8) {
                element.cssVar("action-shift", `${60 + (actions.length - 8) * 6}px`);
            }
            actions.each(function(index){
                $(this).cssVar("action-index", index).addClass("sub-action");
            });
            element.children("button").addClass("main-action");
        },

        _createEvents: function(){
            const that = this;
            const element = this.element;
            element.on(Metro.events.click, ".actions li, .actions button", function(e){
                that._fireEvent("action-click", {action: this});
            })
            
            element.on(Metro.events.click, ".main-action", function(e){
                e.preventDefault();
                e.stopPropagation();
                $(this).toggleClass("active");
            });
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function(){
            this.element.remove();
        }
    });

    $(document).on("click", (e) => {
        $("[data-role-actionbutton]").each((i, el) => {
            $(el).children("button").removeClass("active");
        })
    });
})(Metro, Dom);