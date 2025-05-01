((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let SidenavCounterDefaultConfig = {
        compacted: false,
        toggle: null,
        expandPoint: "fs",
        onMenuItemClick: Metro.noop,
        onCollapse: Metro.noop,
        onExpand: Metro.noop,
        onSidenavCreate: Metro.noop
    };

    Metro.sidenavCounterSetup = (options) => {
        SidenavCounterDefaultConfig = $.extend({}, SidenavCounterDefaultConfig, options);
    };

    if (typeof globalThis.metroSidenavCounterSetup !== "undefined") {
        Metro.sidenavCounterSetup(globalThis.metroSidenavCounterSetup);
    }

    Metro.Component('sidenav-counter', {
        init: function( options, elem ) {
            this._super(elem, options, SidenavCounterDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('sidenav-create');
        },

        _createStructure: function(){
            const element = this.element;
            const o = this.options;

            element.addClass("sidenav-counter")
            if (Metro.utils.mediaExist(o.expandPoint)) {
                element.addClass("expanded");
            }
            const state = Metro.storage.getItem("sidenav-counter:compacted");
            if (state === true) {
                element.removeClass("expanded");
                element.addClass("handmade");
            }
        },

        _createEvents: function(){
            const element = this.element;
            const o = this.options;

            if (o.toggle) {
                $(o.toggle).on("click", () => {
                    element.toggleClass("expanded");
                    element.toggleClass("handmade");
                    Metro.storage.setItem("sidenav-counter:compacted", !element.hasClass("expanded"));
                })
            }

            $(globalThis).on(Metro.events.resize, () => {
                if (element.hasClass("handmade")) {
                    return
                }
                if (Metro.utils.mediaExist(o.expandPoint)) {
                    element.addClass("expanded");
                } else {
                    element.removeClass("expanded");
                }
            }, {ns: this.id})
        },

        changeAttribute: (attr, newValue)=> {
        },

        destroy: function(){
            this.element.remove();
        }
    });
})(Metro, Dom);