/**
 * global Metro
 *
 * @format
 */

(function (Metro, $) {
    "use strict";

    var Utils = Metro.utils;
    var AppBarDefaultConfig = {
        appbarDeferred: 0,
        expand: false,
        expandPoint: null,
        duration: 100,
        onMenuOpen: Metro.noop,
        onMenuClose: Metro.noop,
        onBeforeMenuOpen: Metro.noop,
        onBeforeMenuClose: Metro.noop,
        onMenuCollapse: Metro.noop,
        onMenuExpand: Metro.noop,
        onAppBarCreate: Metro.noop,
    };

    Metro.appBarSetup = function (options) {
        AppBarDefaultConfig = $.extend({}, AppBarDefaultConfig, options);
    };

    if (typeof globalThis["metroAppBarSetup"] !== undefined) {
        Metro.appBarSetup(globalThis["metroAppBarSetup"]);
    }

    Metro.Component("app-bar", {
        init: function (options, elem) {
            this._super(elem, options, AppBarDefaultConfig, {
                id: Utils.elementId("app-bar"),
            });

            return this;
        },

        _create: function () {
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("app-bar-create", {
                element: element,
            });
        },

        _createStructure: function () {
            var element = this.element,
                o = this.options;
            var hamburger,
                menu,
                elementColor = Utils.getStyleOne(element, "background-color");

            element.addClass("app-bar");
            // console.log(elementColor)
            hamburger = element.find(".hamburger");
            if (hamburger.length === 0) {
                hamburger = $("<button>").attr("type", "button").addClass("hamburger menu-down");
                for (var i = 0; i < 3; i++) {
                    $("<span>").addClass("line").appendTo(hamburger);
                }
            }

            element.prepend(hamburger);
            menu = element.find(".app-bar-menu");

            if (menu.length === 0) {
                hamburger.css("display", "none");
            } else {
                Utils.addCssRule(Metro.sheet, ".app-bar-menu li", "list-style: none!important;"); // This special for IE11 and Edge
            }

            if (hamburger.css("display") === "block") {
                menu.hide().addClass("collapsed");
                hamburger.removeClass("hidden");
            } else {
                hamburger.addClass("hidden");
            }

            if (o.expand === true) {
                element.addClass("app-bar-expand");
                hamburger.addClass("hidden");
            } else {
                if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint)) {
                    element.addClass("app-bar-expand");
                    hamburger.addClass("hidden");
                }
            }

            // $("body").addClass("p-ab")
        },

        _createEvents: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var menu = element.find(".app-bar-menu");
            var hamburger = element.find(".hamburger");

            element.on(Metro.events.click, ".hamburger", function () {
                if (menu.length === 0) return;
                var collapsed = menu.hasClass("collapsed");
                if (collapsed) {
                    that.open();
                } else {
                    that.close();
                }
            });

            $(globalThis).on(
                Metro.events.resize,
                function () {
                    if (o.expand !== true) {
                        if (Utils.isValue(o.expandPoint) && Utils.mediaExist(o.expandPoint)) {
                            element.addClass("app-bar-expand");
                            that._fireEvent("menu-expand");
                        } else {
                            element.removeClass("app-bar-expand");
                            that._fireEvent("menu-collapse");
                        }
                    }

                    if (menu.length === 0) {
                        hamburger.addClass("hidden");
                        return;
                    }

                    menu.removeClass("opened").removeClass("collapsed");

                    if (hamburger.css("display") !== "block") {
                        hamburger.addClass("hidden");
                        menu.show();
                    } else {
                        hamburger.removeClass("hidden");
                        if (hamburger.hasClass("active")) {
                            menu.removeClass("collapsed").addClass("opened");
                        } else {
                            menu.addClass("collapsed").removeClass("opened");
                        }
                    }
                },
                { ns: this.id },
            );
        },

        close: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var menu = element.find(".app-bar-menu");
            var hamburger = element.find(".hamburger");

            that._fireEvent("before-menu-close", {
                menu: menu[0],
            });

            menu.slideUp(o.duration, function () {
                menu.addClass("collapsed").removeClass("opened");
                hamburger.removeClass("active");

                that._fireEvent("menu-close", {
                    menu: menu[0],
                });
            });
        },

        open: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var menu = element.find(".app-bar-menu");
            var hamburger = element.find(".hamburger");

            that._fireEvent("before-menu-open", {
                menu: menu[0],
            });

            menu.slideDown(o.duration, function () {
                menu.removeClass("collapsed").addClass("opened");
                hamburger.addClass("active");

                that._fireEvent("menu-open", {
                    menu: menu[0],
                });
            });
        },

        /* eslint-disable-next-line */
        changeAttribute: function (attributeName) {},

        destroy: function () {
            var element = this.element;
            element.off(Metro.events.click, ".hamburger");
            $(globalThis).off(Metro.events.resize, { ns: this.id });
            return element;
        },
    });
})(Metro, Dom);
