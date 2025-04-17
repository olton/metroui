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

    if (typeof globalThis["metroAppBarSetup"] !== "undefined") {
        Metro.appBarSetup(globalThis["metroAppBarSetup"]);
    }

    Metro.Component("app-bar", {
        init: function (options, elem) {
            this._super(elem, options, AppBarDefaultConfig, {
                id: null,
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this.id = element.attr("id") || Hooks.useId(this.elem);
            
            this._createStructure();
            this._createEvents();

            this._fireEvent("app-bar-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element,
              o = this.options
            let hamburger,
              menu,
              elementColor = Utils.getStyleOne(element, 'background-color')

            element.addClass("app-bar").attr("role", "navigation");

            hamburger = element.find(".hamburger");
            if (hamburger.length === 0) {
                hamburger = $("<button>")
                  .attr("type", "button")
                  .addClass("hamburger menu-down")
                  .attr("aria-label", "Toggle menu")
                  .attr("aria-expanded", "false")
                  .attr("aria-controls", "app-bar-menu-" + this.id);


                for (let i = 0; i < 3; i++) {
                    $("<span>").addClass("line").appendTo(hamburger);
                }
            }

            element.prepend(hamburger);
            menu = element.find(".app-bar-menu");

            if (menu.length > 0) {
                menu.attr("id", "app-bar-menu-" + this.id);
                menu.attr("role", "menubar");
            }

            if (menu.length === 0) {
                hamburger.css("display", "none");
            } else {
                // Додаємо атрибути доступності для меню
                menu.find("li").attr("role", "menuitem");
                menu.find("li a").attr("tabindex", "0");

                // Додаємо атрибути для вкладених меню
                menu.find("li:has(ul)").attr("aria-haspopup", "true");
                menu.find("li ul").attr("role", "menu").attr("aria-hidden", "true");
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
        },

        _createEvents: function () {
            const that = this,
              element = this.element,
              o = this.options
            const menu = element.find('.app-bar-menu')
            const hamburger = element.find('.hamburger')

            element.on(Metro.events.click, ".hamburger", function () {
                if (menu.length === 0) return;
                const collapsed = menu.hasClass('collapsed')
                if (collapsed) {
                    that.open();
                } else {
                    that.close();
                }
            });

            // Додаємо підтримку клавіатурної навігації
            hamburger.on("keydown", function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) { // Enter або Space
                    e.preventDefault();
                    hamburger.trigger("click");
                }
            });

            // Додаємо обробку клавіш для пунктів меню
            menu.find("li a").on("keydown", function(e) {
                if (e.keyCode === 13 || e.keyCode === 32) { // Enter або Space
                    e.preventDefault();
                    $(this).trigger("click");
                }

                if (e.keyCode === 27) { // Escape
                    e.preventDefault();
                    that.close();
                    hamburger.focus();
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
            const that = this,
              element = this.element,
              o = this.options
            const menu = element.find('.app-bar-menu')
            const hamburger = element.find('.hamburger')

            that._fireEvent("before-menu-close", {
                menu: menu[0],
            });

            hamburger.attr("aria-expanded", "false");
            menu.find("ul").attr("aria-hidden", "true");

            menu.slideUp(o.duration, function () {
                menu.addClass("collapsed").removeClass("opened");
                hamburger.removeClass("active");

                that._fireEvent("menu-close", {
                    menu: menu[0],
                });
            });
        },

        open: function () {
            const that = this,
              element = this.element,
              o = this.options
            const menu = element.find('.app-bar-menu')
            const hamburger = element.find('.hamburger')

            that._fireEvent("before-menu-open", {
                menu: menu[0],
            });

            hamburger.attr("aria-expanded", "true");
            menu.find("ul").attr("aria-hidden", "false");

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
            const element = this.element
            element.off(Metro.events.click, ".hamburger");
            $(globalThis).off(Metro.events.resize, { ns: this.id });
            element.remove();
        },
    });
})(Metro, Dom);
