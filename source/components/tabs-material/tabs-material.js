((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let MaterialTabsDefaultConfig = {
        wheelStep: 20,
        materialTabsDeferred: 0,
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

    Metro.materialTabsSetup = (options) => {
        MaterialTabsDefaultConfig = $.extend({}, MaterialTabsDefaultConfig, options);
    };

    if (typeof globalThis.metroMaterialTabsSetup !== "undefined") {
        Metro.materialTabsSetup(globalThis.metroMaterialTabsSetup);
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
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("tabs-create", {
                element: element
            });
        },

        _createStructure: function(){
            const element = this.element;
            const o = this.options;
            const tabs = element.find("li");
            const active_tab = element.find("li.active");
            const wrapper = $("<div>").addClass("tabs-material-wrapper").addClass(o.clsComponent).insertBefore(element);

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
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.click, "li", function(e){
                const tab = $(this);
                const active_tab = element.find("li.active");
                const tab_next = tab.index() > active_tab.index();
                const target = tab.children("a").attr("href");

                e.preventDefault();

                if (Metro.utils.isValue(target) && target[0] === "#") {
                    if (tab.hasClass("active")) return;
                    if (tab.hasClass("disabled")) return;
                    if (Metro.utils.exec(o.onBeforeTabOpen, [tab, target, tab_next], this) === false) return;
                    that.openTab(tab, tab_next);
                }
            });

            element.on(Metro.events.scroll, ()=> {
                const oldScroll = that.scroll;

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

                const scrollable = $(this);
                const dir = e.deltaY > 0 ? -1 : 1;
                const step = o.wheelStep;
                const scroll = scrollable.scrollLeft() - (dir * step)
                scrollable.scrollLeft(scroll);
            }, {
                passive: true
            })
        },

        openTab: function(tab_to_open, tab_next){
            const element = this.element;
            const o = this.options;
            const tabs = element.find("li");
            const magic = 52;
            let target;
            let tab_left;
            let scroll;
            let scrollLeft;

            const tab = $(tab_to_open);

            $.each(tabs, function(){
                const target = $(this).find("a").attr("href");
                if (!Metro.utils.isValue(target)) return;
                if (target[0] === "#" && target.length > 1) {
                    $(target).hide();
                }
            });

            const width = element.width()
            scroll = element.scrollLeft();
            tab_left = tab.position().left;
            const tab_width = tab.width()
            const shift = tab_left + tab_width
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
            if (Metro.utils.isValue(target)) {
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
            const element = this.element;
            const tabs = element.find("li");
            const active_tab = element.find("li.active");
            const tab = tabs.eq(tab_num - 1);
            const tab_next = tabs.index(tab) > tabs.index(active_tab);
            this.openTab(tab, tab_next);
        },

        changeAttribute: ()=> {
        },

        destroy: function(){
            const element = this.element;

            element.off(Metro.events.click, "li");
            element.off(Metro.events.scroll);

            element.remove();
        }
    });
})(Metro, Dom);