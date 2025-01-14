/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var MaterialTabsDefaultConfig = {
        wheelStep: 20,
        materialtabsDeferred: 0,
        deep: false,
        fixedTabs: false,
        duration: 300,
        appBar: false,

        clsComponent: "",
        clsTabs: "",
        clsTab: "",
        clsTabActive: "",
        clsMarker: "",

        onBeforeTabOpen: Metro.noop_true,
        onTabOpen: Metro.noop,
        onTabsScroll: Metro.noop,
        onTabsCreate: Metro.noop
    };

    Metro.materialTabsSetup = function (options) {
        MaterialTabsDefaultConfig = $.extend({}, MaterialTabsDefaultConfig, options);
    };

    if (typeof globalThis["metroMaterialTabsSetup"] !== undefined) {
        Metro.materialTabsSetup(globalThis["metroMaterialTabsSetup"]);
    }

    Metro.Component('material-tabs', {
        init: function( options, elem ) {
            this._super(elem, options, MaterialTabsDefaultConfig, {
                marker: null,
                scroll: 0,
                scrollDir: "left"
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("tabs-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var tabs = element.find("li"), active_tab = element.find("li.active");
            var wrapper = $("<div>").addClass("tabs-material-wrapper").addClass(o.clsComponent).insertBefore(element);

            if (o.appBar === true) {
                wrapper.addClass("app-bar-present");
            }
            if (o.appBar === "more") {
                wrapper.addClass("app-bar-present-more");
            }

            element.appendTo(wrapper);
            element.addClass("tabs-material").addClass(o.clsTabs);
            tabs.addClass(o.clsTab);

            if (o.deep === true) {
                element.addClass("deep");
            }

            if (o.fixedTabs === true) {
                element.addClass("fixed-tabs");
            }

            this.marker = element.find(".tab-marker");

            if (this.marker.length === 0) {
                this.marker = $("<span>").addClass("tab-marker").addClass(o.clsMarker).appendTo(element);
            }

            this.openTab(active_tab.length === 0 ? tabs[0] : active_tab[0]);
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            element.on(Metro.events.click, "li", function(e){
                var tab = $(this);
                var active_tab = element.find("li.active");
                var tab_next = tab.index() > active_tab.index();
                var target = tab.children("a").attr("href");

                e.preventDefault();

                if (Utils.isValue(target) && target[0] === "#") {
                    if (tab.hasClass("active")) return;
                    if (tab.hasClass("disabled")) return;
                    if (Utils.exec(o.onBeforeTabOpen, [tab, target, tab_next], this) === false) return;
                    that.openTab(tab, tab_next);
                }
            });

            element.on(Metro.events.scroll, function(){
                var oldScroll = that.scroll;

                that.scrollDir = that.scroll < element[0].scrollLeft ? "left" : "right";
                that.scroll = element[0].scrollLeft;

                that._fireEvent("tabs-scroll", {
                    scrollLeft: element[0].scrollLeft,
                    oldScroll: oldScroll,
                    scrollDir: that.scrollDir
                });

            });

            element.on(Metro.events.mousewheel, function(e){
                if (e.deltaY === undefined) {
                    return ;
                }

                var scroll, scrollable = $(this);
                var dir = e.deltaY > 0 ? -1 : 1;
                var step = o.wheelStep;


                scroll = scrollable.scrollLeft() - ( dir * step);
                scrollable.scrollLeft(scroll);
            }, {
                passive: true
            })
        },

        openTab: function(tab, tab_next){
            var element = this.element, o = this.options;
            var tabs = element.find("li");
            var magic = 52, shift, width, tab_width, target, tab_left, scroll, scrollLeft;

            tab = $(tab);

            $.each(tabs, function(){
                var target = $(this).find("a").attr("href");
                if (!Utils.isValue(target)) return;
                if (target[0] === "#" && target.length > 1) {
                    $(target).hide();
                }
            });

            width = element.width();
            scroll = element.scrollLeft();
            tab_left = tab.position().left;
            tab_width = tab.width();
            shift = tab_left + tab_width;

            tabs.removeClass("active").removeClass(o.clsTabActive);
            tab.addClass("active").addClass(o.clsTabActive);

            if (shift + magic > width + scroll) {
                scrollLeft = scroll + (magic * 2);
            } else if (tab_left < scroll) {
                scrollLeft = tab_left - magic * 2;
            } else {
                scrollLeft = scroll;
            }

            element.animate({
                draw: {
                    scrollLeft: scrollLeft
                },
                dur: o.duration
            });

            this.marker.animate({
                draw: {
                    left: tab_left,
                    width: tab_width
                },
                dur: o.duration
            });

            target = tab.find("a").attr("href");
            if (Utils.isValue(target)) {
                if (target[0] === "#" && target.length > 1) {
                    $(target).show();
                }
            }

            this._fireEvent("tab-open", {
                tab: tab[0],
                target: target,
                tab_next: tab_next
            });
        },

        open: function(tab_num){
            var element = this.element;
            var tabs = element.find("li");
            var active_tab = element.find("li.active");
            var tab = tabs.eq(tab_num - 1);
            var tab_next = tabs.index(tab) > tabs.index(active_tab);
            this.openTab(tab, tab_next);
        },

        changeAttribute: function(){
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.click, "li");
            element.off(Metro.events.scroll);

            return element;
        }
    });
}(Metro, Dom));