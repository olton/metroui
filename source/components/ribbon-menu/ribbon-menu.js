/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var RibbonMenuDefaultConfig = {
        ribbonmenuDeferred: 0,
        onStatic: Metro.noop,
        onBeforeTab: Metro.noop_true,
        onTab: Metro.noop,
        onRibbonMenuCreate: Metro.noop
    };

    Metro.ribbonMenuSetup = function (options) {
        RibbonMenuDefaultConfig = $.extend({}, RibbonMenuDefaultConfig, options);
    };

    if (typeof globalThis["metroRibbonMenuSetup"] !== "undefined") {
        Metro.ribbonMenuSetup(globalThis["metroRibbonMenuSetup"]);
    }

    Metro.Component('ribbon-menu', {
        init: function( options, elem ) {
            this._super(elem, options, RibbonMenuDefaultConfig);

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("ribbon-menu-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element;

            element.addClass("ribbon-menu");


            var fluentGroups = element.find(".ribbon-toggle-group");

            $.each(fluentGroups, function(){
                var g = $(this);
                g.buttongroup({
                    clsActive: "active"
                });
                var gw = 0;
                var btns = g.find(".ribbon-icon-button");
                $.each(btns, function(){
                    var b = $(this);
                    var w = b.outerWidth(true);
                    if (w > gw) gw = w;
                });
                g.css("width", gw * Math.ceil(btns.length / 3) + 4);
            });

            element.find(".section").addClass("non-active")

            var tabs = element.find(".tabs-holder li:not(.static)");
            var active_tab = element.find(".tabs-holder li.active");

            if (active_tab.length > 0) {
                this.open($(active_tab[0]));
            } else {
                if (tabs.length > 0) {
                    this.open($(tabs[0]));
                }
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            element.on(Metro.events.click, ".tabs-holder li a", function(e){
                var link = $(this);
                var tab = $(this).parent("li");

                if (tab.hasClass("static")) {
                    if (o.onStatic === Metro.noop && link.attr("href") !== undefined) {
                        document.location.href = link.attr("href");
                    } else {
                        that._fireEvent("static", {
                            tab: tab[0]
                        });
                    }
                } else {
                    if (Utils.exec(o.onBeforeTab, [tab[0]], element[0]) === true) {
                        that.open(tab[0]);
                    }
                }
                e.preventDefault();
            })
        },

        open: function(tab){
            var element = this.element;
            var $tab = $(tab);
            var tabs = element.find(".tabs-holder li");
            var sections = element.find(".content-holder .section");
            var target = $tab.children("a").attr("href");
            var target_section = target !== "#" ? element.find(target) : null;

            sections.addClass("non-active")
            tabs.removeClass("active");
            $tab.addClass("active");

            sections.removeClass("active");

            if (target_section) {
                target_section.addClass("active").removeClass("non-active");
            }

            this._fireEvent("tab", {
                tab: $tab[0]
            });
        },

        changeAttribute: function(){
        },

        destroy: function(){
            var element = this.element;
            element.off(Metro.events.click, ".tabs-holder li a");
            return element;
        }
    });
}(Metro, Dom));