(function (Metro, $) {
    "use strict";
    let NavigationViewDefaultConfig = {
        navviewDeferred: 0,
        expandPoint: null,
        // compacted: false,
        toggle: null,
        animate: true,
        activeState: true,
        initialView: "expand",
        onMenuItemClick: Metro.noop,
        onPaneClose: Metro.noop,
        onBeforePaneClose: Metro.noop,
        onPaneOpen: Metro.noop,
        onBeforePaneOpen: Metro.noop,
        onNavviewCreate: Metro.noop,
    };

    Metro.navViewSetup = function (options) {
        NavigationViewDefaultConfig = $.extend({}, NavigationViewDefaultConfig, options);
    };

    if (typeof globalThis["metroNavViewSetup"] !== undefined) {
        Metro.navViewSetup(globalThis["metroNavViewSetup"]);
    }

    Metro.Component("nav-view", {
        init: function (options, elem) {
            this._super(elem, options, NavigationViewDefaultConfig, {
                pane: null,
                content: null,
                paneToggle: null,
                id: null,
                menuScrollDistance: 0,
                menuScrollStep: 0,
            });

            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("navview-create");
        },

        _calcMenuHeight: function () {
            let element = this.element,
                pane,
                menu_container;
            let elements_height = 0;

            pane = element.children(".navview-pane");
            if (pane.length === 0) {
                return;
            }

            menu_container = pane.children(".navview-menu-container");

            if (menu_container.length === 0) {
                return;
            }

            $.each(menu_container.prevAll(), function () {
                elements_height += $(this).outerHeight(true);
            });

            $.each(menu_container.nextAll(), function () {
                elements_height += $(this).outerHeight(true);
            });

            menu_container.css({
                height: "calc(100% - " + elements_height + "px)",
            });

            this.menuScrollStep = 48;
            this.menuScrollDistance = Metro.utils.nearest(menu_container[0].scrollHeight - menu_container.height(), 48);
        },

        _recalc: function () {
            const that = this;
            setTimeout(function () {
                that._calcMenuHeight();
            }, 200);
        },

        _createStructure: function () {
            const element = this.element,
                o = this.options;
            let pane, content, toggle, menu;

            element.addClass("navview");
            if (element.attr("id") === undefined) {
                this.id = Metro.utils.elementId("navview");
                element.attr("id", this.id);
            } else {
                this.id = element.attr("id");
            }

            if (o.initialView !== "compact" && Metro.utils.mediaExist(o.expandPoint)) {
                element.addClass("expanded");
            } else {
                element.addClass("compacted handmade");
            }

            const state = Metro.storage.getItem("navview:compacted");
            if (state === true) {
                element.removeClass("expanded");
                element.addClass("compacted handmade");
            }

            pane = element.children(".navview-pane");
            content = element.children(".navview-content");
            toggle = $(o.toggle);

            menu = pane.children(".navview-menu");
            if (menu.length) {
                menu.prevAll().reverse().wrapAll($("<div>").addClass("navview-container"));
                menu.wrap($("<div>").addClass("navview-menu-container"));

                menu.find("a").each(function () {
                    const a = $(this);
                    const icon = a.children(".icon");
                    const caption = a.children(".caption");
                    if (!icon.length) {
                        a.prepend($("<span>").addClass("icon").html(caption.text()[0]));
                    }
                });
            }

            this.pane = pane.length > 0 ? pane : null;
            this.content = content.length > 0 ? content : null;
            this.paneToggle = toggle.length > 0 ? toggle : null;

            if (o.animate) {
                element.addClass("animate-panes");
            }

            this._recalc();
        },

        _createEvents: function () {
            const that = this,
                element = this.element,
                o = this.options;
            const menu_container = element.find(".navview-menu-container");
            const menu = menu_container.children(".navview-menu");

            menu_container.on(
                "mousewheel",
                function (e) {
                    const pane_width = element.find(".navview-pane").width();
                    const dir = e.deltaY > 0 ? -1 : 1;
                    const step = that.menuScrollStep;
                    const distance = that.menuScrollDistance;
                    const top = parseInt(menu.css("top"));

                    if (pane_width > 50) {
                        return false;
                    }

                    if (dir === -1 && Math.abs(top) <= distance) {
                        menu.css("top", parseInt(menu.css("top")) + step * dir);
                    }

                    if (dir === 1 && top <= -step) {
                        menu.css("top", parseInt(menu.css("top")) + step * dir);
                    }
                },
                {
                    passive: true,
                },
            );

            element.on(Metro.events.click, ".pull-button", function () {
                that._pullClick(this, "pull");
            });

            element.on(Metro.events.click, ".holder", function () {
                that._pullClick(this, "holder");
            });

            element.on(Metro.events.click, ".navview-menu li", function () {
                if (o.activeState === true) {
                    element.find(".navview-menu li.active").removeClass("active");
                    $(this).toggleClass("active");
                }
            });

            element.on(Metro.events.click, ".navview-menu li > a", function () {
                that._fireEvent("menu-item-click", {
                    item: this,
                });
            });

            if (this.paneToggle !== null) {
                this.paneToggle.on(Metro.events.click, function () {
                    //that.pane.toggleClass("open");
                });
            }

            menu.find("a").on(Metro.events.enter, function () {
                if (!element.hasClass("compacted")) {
                    return;
                }
                const a = $(this);
                const r = Metro.utils.rect(this);
                const c = a.children(".caption");
                c.css({
                    position: "fixed",
                    top: r.top,
                    left: r.left + menu_container.width(),
                    borderRadius: 4,
                    paddingLeft: 10,
                    boxShadow: "0 0 5px 0 var(--shadow-color)",
                });
            });

            menu.find("a").on(Metro.events.leave, function () {
                if (!element.hasClass("compacted")) {
                    return;
                }
                const a = $(this);
                const c = a.children(".caption");
                c[0].style = "";
            });

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    this._recalc();

                    if (!element.hasClass("handmade")) {
                        if (Metro.utils.isValue(o.expandPoint) && Metro.utils.mediaExist(o.expandPoint)) {
                            element.removeClass("compacted");
                            element.addClass("expanded");
                        } else {
                            element.removeClass("expanded");
                            element.addClass("compacted");
                        }
                    }
                },
                { ns: this.id },
            );
        },

        _togglePaneMode: function (hand = false) {
            const element = this.element,
                o = this.options;

            element.toggleClass("expanded");
            element.toggleClass("compacted");
            element.toggleClass("handmade");

            if (element.hasClass("compacted")) {
                Metro.storage.setItem("navview:compacted", true);
                Metro.utils.exec(o.onPaneClose, null, this);
            } else {
                Metro.storage.setItem("navview:compacted", false);
                Metro.utils.exec(o.onPaneOpen, null, this);
            }
        },

        _pullClick: function (el, sender) {
            let input,
                target = $(el);

            if (target && target.hasClass("holder")) {
                input = target.parent().find("input");
                setTimeout(function () {
                    input.focus();
                }, 200);
            }

            this._togglePaneMode(sender === "pull");

            this._recalc();

            return true;
        },

        toggle: function () {
            this._togglePaneMode();
        },

        compact: function () {
            const element = this.element;
            element.addClass("compacted handmade");
            element.removeClass("expanded");
            this._recalc();
        },

        expand: function () {
            const element = this.element;
            element.addClass("expanded");
            element.removeClass("compacted handmade");
            this._recalc();
        },

        state(){
            return this.element.hasClass("expanded") ? "expand" : "compact";    
        },
        
        /* eslint-disable-next-line */
        changeAttribute: function (attributeName) {},

        destroy: function () {
            const element = this.element;

            element.off(Metro.events.click, ".pull-button, .holder");
            element.off(Metro.events.click, ".navview-menu li");
            element.off(Metro.events.click, ".navview-menu li > a");

            if (this.paneToggle !== null) {
                this.paneToggle.off(Metro.events.click);
            }

            $(globalThis).off(Metro.events.resize, { ns: this.id });

            element.remove();
        },
    });
})(Metro, Dom);
