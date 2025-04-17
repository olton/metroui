/* global Metro */
(function(Metro, $) {
    'use strict';

    var SidenavCounterDefaultConfig = {
        compacted: false,
        toggle: null,
        expandPoint: "fs",
        onMenuItemClick: Metro.noop,
        onCollapse: Metro.noop,
        onExpand: Metro.noop,
        onSidenavCreate: Metro.noop
    };

    Metro.sidenavCounterSetup = function (options) {
        SidenavCounterDefaultConfig = $.extend({}, SidenavCounterDefaultConfig, options);
    };

    if (typeof globalThis["metroSidenavCounterSetup"] !== "undefined") {
        Metro.sidenavCounterSetup(globalThis["metroSidenavCounterSetup"]);
    }

    Metro.Component('sidenav-counter', {
        init: function( options, elem ) {
            this._super(elem, options, SidenavCounterDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('sidenav-create');
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;

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
            var that = this, element = this.element, o = this.options;

            if (o.toggle) {
                $(o.toggle).on("click", function() {
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

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));