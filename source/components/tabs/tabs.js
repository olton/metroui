/**
 * global Metro
 *
 * @format
 */

(function (Metro, $) {
    "use strict";

    var Utils = Metro.utils;
    var TabsDefaultConfig = {
        tabsDeferred: 0,
        expand: false,
        expandPoint: null,
        tabsPosition: "top",
        tabsType: "default",
        updateUri: false,

        clsTabs: "",
        clsTabsList: "",
        clsTabsListItem: "",
        clsTabsListItemActive: "",

        onTab: Metro.noop,
        onTabOpen: Metro.noop,
        onTabClose: Metro.noop,
        onBeforeTab: Metro.noop_true,
        onTabsCreate: Metro.noop,
    };

    Metro.tabsSetup = function (options) {
        TabsDefaultConfig = $.extend({}, TabsDefaultConfig, options);
    };

    if (typeof globalThis["metroTabsSetup"] !== undefined) {
        Metro.tabsSetup(globalThis["metroTabsSetup"]);
    }

    Metro.Component("tabs", {
        init: function (options, elem) {
            this._super(elem, options, TabsDefaultConfig, {
                _targets: [],
                id: Utils.elementId("tabs"),
            });

            return this;
        },

        _create: function () {
            var element = this.element,
                o = this.options;
            var tab = element.find(".active").length > 0 ? $(element.find(".active")[0]) : undefined;

            this._createStructure();
            this._createEvents();

            this._open(tab);

            this._fireEvent("tabs-create", {
                element: element,
            });
        },

        _createStructure: function () {
            var element = this.element,
                o = this.options;
            var parent = element.parent();
            var right_parent = parent.hasClass("tabs");
            var container = right_parent ? parent : $("<div>").addClass("tabs tabs-wrapper");
            var expandTitle, hamburger;

            container.addClass(o.tabsPosition.replace(["-", "_", "+"], " "));

            element.addClass("tabs-list");
            if (o.tabsType !== "default") {
                element.addClass("tabs-" + o.tabsType);
            }
            if (!right_parent) {
                container.insertBefore(element);
                element.appendTo(container);
            }

            element.data("expanded", false);

            expandTitle = $("<div>").addClass("expand-title");
            container.prepend(expandTitle);
            hamburger = container.find(".hamburger");
            if (hamburger.length === 0) {
                hamburger = $("<button>").attr("type", "button").addClass("hamburger menu-down").appendTo(container);
                for (var i = 0; i < 3; i++) {
                    $("<span>").addClass("line").appendTo(hamburger);
                }

                // if (Farbe.Routines.isLight(Utils.getStyleOne(container, "background-color")) === true) {
                //     hamburger.addClass("hamburger-dark");
                // }
            }

            container.addClass(o.clsTabs);
            element.addClass(o.clsTabsList);
            element.children("li").addClass(o.clsTabsListItem);

            if (o.expand === true && !o.tabsPosition.includes("vertical")) {
                container.addClass("tabs-expand");
            } else {
                if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint) && !o.tabsPosition.includes("vertical")) {
                    container.addClass("tabs-expand");
                }
            }

            if (o.tabsPosition.includes("vertical")) {
                container.addClass("tabs-expand");
            }
        },

        _createEvents: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var container = element.parent();

            $(globalThis).on(
                Metro.events.resize,
                function () {
                    if (o.tabsPosition.includes("vertical")) {
                        return;
                    }

                    if (o.expand === true && !o.tabsPosition.includes("vertical")) {
                        container.addClass("tabs-expand");
                    } else {
                        if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint) && !o.tabsPosition.includes("vertical")) {
                            if (!container.hasClass("tabs-expand")) container.addClass("tabs-expand");
                        } else {
                            if (container.hasClass("tabs-expand")) container.removeClass("tabs-expand");
                        }
                    }
                },
                { ns: this.id },
            );

            container.on(Metro.events.click, ".hamburger, .expand-title", function () {
                if (element.data("expanded") === false) {
                    element.addClass("expand");
                    element.data("expanded", true);
                    container.find(".hamburger").addClass("active");
                } else {
                    element.removeClass("expand");
                    element.data("expanded", false);
                    container.find(".hamburger").removeClass("active");
                }
            });

            element.on(Metro.events.click, "a", function (e) {
                var link = $(this);
                var href = link.attr("href").trim();
                var tab = link.parent("li");

                that._fireEvent("tab", {
                    tab: tab[0],
                    target: tab.children("a").attr("href"),
                });

                if (tab.hasClass("active")) {
                    e.preventDefault();
                }

                if (element.data("expanded") === true) {
                    element.removeClass("expand");
                    element.data("expanded", false);
                    container.find(".hamburger").removeClass("active");
                }

                if (Utils.exec(o.onBeforeTab, [tab, element], tab[0]) !== true) {
                    return false;
                }

                if (Utils.isValue(href) && href[0] === "#") {
                    that._open(tab);
                    e.preventDefault();
                }
            });

            $(globalThis).on("hashchange", function (e) {
                var hash, tab;

                if (o.updateUri) {
                    hash = globalThis.location.hash;
                    tab = that._findTabByTarget(hash);
                    that._open($(tab));
                }
            });
        },

        _findTabByTarget: function (target) {
            var element = this.element;
            var tabs = element.find("li");
            var tab = undefined;

            tabs.each(function (i, el) {
                if (!tab && $(el).children("a").attr("href") === target) {
                    tab = el;
                }
            });

            return tab;
        },

        _collectTargets: function () {
            var that = this,
                element = this.element;
            var tabs = element.find("li");

            this._targets = [];

            $.each(tabs, function () {
                var target = $(this).find("a").attr("href").trim();
                if (target.length > 1 && target[0] === "#") {
                    that._targets.push(target);
                }
            });
        },

        _open: function (tab) {
            var element = this.element,
                o = this.options;
            var tabs = element.find("li");
            var expandTitle = element.siblings(".expand-title");
            var activeTab = element.find("li.active");

            if (tabs.length === 0) {
                return;
            }

            this._collectTargets();

            if (tab === undefined) {
                tab = $(tabs[0]);
            }

            var target = tab.find("a").attr("href");

            if (target === undefined) {
                return;
            }

            tabs.removeClass("active").removeClass(o.clsTabsListItemActive);
            if (tab.parent().hasClass("d-menu")) {
                tab.parent().parent().addClass("active");
            } else {
                tab.addClass("active");
            }

            $.each(this._targets, function () {
                var t = $(this);
                if (t.length > 0) t.hide();
            });

            if (target !== "#" && target[0] === "#") {
                if (o.updateUri) {
                    globalThis.location.hash = target;
                }
                $(target).show();
            }

            expandTitle.html(tab.find("a").html());

            tab.addClass(o.clsTabsListItemActive);

            if (!activeTab.is(tab)) {
                this._fireEvent("tab-open", {
                    tab: tab[0],
                    target: tab.children("a").attr("href"),
                });

                this._fireEvent("tab-close", {
                    tab: activeTab[0],
                    target: activeTab.children("a").attr("href"),
                });
            }
        },

        next: function () {
            var element = this.element;
            var next,
                active_tab = element.find("li.active");

            next = active_tab.next("li");
            if (next.length > 0) {
                this._open(next);
            }
        },

        prev: function () {
            var element = this.element;
            var next,
                active_tab = element.find("li.active");

            next = active_tab.prev("li");
            if (next.length > 0) {
                this._open(next);
            }
        },

        openByTarget: function (target) {
            var tab = this._findTabByTarget(target);
            if (tab) {
                this._open($(tab));
            }
        },

        open: function (tab) {
            var element = this.element;
            var tabs = element.find("li");

            if (!Utils.isValue(tab)) {
                tab = 1;
            }

            if (Utils.isInt(tab)) {
                if (Utils.isValue(tabs[tab - 1])) this._open($(tabs[tab - 1]));
            } else {
                this._open($(tab));
            }
        },

        changeAttribute: function () {},

        destroy: function () {
            var element = this.element;
            var container = element.parent();

            $(globalThis).off(Metro.events.resize, { ns: this.id });

            container.off(Metro.events.click, ".hamburger, .expand-title");

            element.off(Metro.events.click, "a");

            return element;
        },
    });
})(Metro, Dom);
