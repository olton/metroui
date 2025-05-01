((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let RibbonMenuDefaultConfig = {
        ribbonMenuDeferred: 0,
        onStatic: Metro.noop,
        onBeforeTab: Metro.noop_true,
        onTab: Metro.noop,
        onRibbonMenuCreate: Metro.noop
    };

    Metro.ribbonMenuSetup = (options) => {
        RibbonMenuDefaultConfig = $.extend({}, RibbonMenuDefaultConfig, options);
    };

    if (typeof globalThis.metroRibbonMenuSetup !== "undefined") {
        Metro.ribbonMenuSetup(globalThis.metroRibbonMenuSetup);
    }

    Metro.Component('ribbon-menu', {
        init: function( options, elem ) {
            this._super(elem, options, RibbonMenuDefaultConfig);

            return this;
        },

        _create: function(){
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("ribbon-menu-create", {
                element: element
            });
        },

        _createStructure: function(){
            const element = this.element;

            element.addClass("ribbon-menu");


            const fluentGroups = element.find(".ribbon-toggle-group");

            $.each(fluentGroups, function(){
                const g = $(this);
                g.buttongroup({
                    clsActive: "active"
                });
                let gw = 0;
                const btns = g.find(".ribbon-icon-button");
                $.each(btns, function(){
                    const b = $(this);
                    const w = b.outerWidth(true);
                    if (w > gw) gw = w;
                });
                g.css("width", gw * Math.ceil(btns.length / 3) + 4);
            });

            element.find(".section").addClass("non-active")

            const tabs = element.find(".tabs-holder li:not(.static)");
            const active_tab = element.find(".tabs-holder li.active");

            if (active_tab.length > 0) {
                this.open($(active_tab[0]));
            } else {
                if (tabs.length > 0) {
                    this.open($(tabs[0]));
                }
            }
        },

        _createEvents: function(){
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.click, ".tabs-holder li a", function(e){
                const link = $(this);
                const tab = $(this).parent("li");

                if (tab.hasClass("static")) {
                    if (o.onStatic === Metro.noop && link.attr("href") !== undefined) {
                        document.location.href = link.attr("href");
                    } else {
                        that._fireEvent("static", {
                            tab: tab[0]
                        });
                    }
                } else {
                    if (Metro.utils.exec(o.onBeforeTab, [tab[0]], element[0]) === true) {
                        that.open(tab[0]);
                    }
                }
                e.preventDefault();
            })
        },

        open: function(tab){
            const element = this.element;
            const $tab = $(tab);
            const tabs = element.find(".tabs-holder li");
            const sections = element.find(".content-holder .section");
            const target = $tab.children("a").attr("href");
            const target_section = target !== "#" ? element.find(target) : null;

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

        changeAttribute: ()=> {
        },

        destroy: function(){
            const element = this.element;
            element.off(Metro.events.click, ".tabs-holder li a");
            return element;
        }
    });
})(Metro, Dom);

// TODO: Add scroll buttons for long lists
