((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let SidebarDefaultConfig = {
        menuScrollbar: false,
        sidebarDeferred: 0,
        position: "left",
        shift: null,
        staticShift: null,
        toggle: null,
        duration: METRO_ANIMATION_DURATION,
        static: null,
        closeOutside: true,
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onToggle: Metro.noop,
        onStaticSet: Metro.noop,
        onStaticLoss: Metro.noop,
        onSidebarCreate: Metro.noop,
    };

    Metro.sidebarSetup = (options) => {
        SidebarDefaultConfig = $.extend({}, SidebarDefaultConfig, options);
    };

    if (typeof globalThis.metroSidebarSetup !== "undefined") {
        Metro.sidebarSetup(globalThis.metroSidebarSetup);
    }

    Metro.Component("sidebar", {
        init: function (options, elem) {
            this._super(elem, options, SidebarDefaultConfig, {
                toggle_element: null,
                id: Metro.utils.elementId("sidebar"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();
            $(globalThis).resize();
            this._checkStatic();

            this._fireEvent("sidebar-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const header = element.find(".sidebar-header");
            const sheet = Metro.sheet;
            const menu = element.find(".sidebar-menu");
            const size = element.outerWidth();

            element.addClass("sidebar").addClass(`on-${o.position}`);

            if (o.menuScrollbar === false) {
                menu.addClass("hide-scroll");
            }

            if (o.toggle !== null && $(o.toggle).length > 0) {
                this.toggle_element = $(o.toggle);
            }

            if (header.length > 0) {
                if (header.data("image")) {
                    header.css({
                        backgroundImage: `url(${header.data("image")})`,
                    });
                }
            }

            if (o.static !== null) {
                if (o.staticShift !== null) {
                    if (o.position === "left") {
                        Metro.utils.addCssRule(
                            sheet,
                            `@media screen and ${Metro.media_queries[o.static.toUpperCase()]}`,
                            `${o.staticShift}{margin-left: ${size}px; width: calc(100% - ${size}px);}`,
                        );
                    } else {
                        Metro.utils.addCssRule(
                            sheet,
                            `@media screen and ${Metro.media_queries[o.static.toUpperCase()]}`,
                            `${o.staticShift}{margin-right: ${size}px; width: calc(100% - ${size}px);}`,
                        );
                    }
                }
            }
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const toggle = this.toggle_element;

            if (toggle !== null) {
                toggle.on(Metro.events.click, (e) => {
                    this.toggle();
                    e.stopPropagation();
                });
            } else if (o.toggle) {
                $.document().on("click", o.toggle, (e) => {
                    this.toggle();
                    e.stopPropagation();
                });
            }

            if (o.static !== null && Metro.media_modes.includes(o.static)) {
                $(globalThis).on(
                    Metro.events.resize,
                    () => {
                        this._checkStatic();
                    },
                    { ns: this.id },
                );
            }

            element.on(Metro.events.click, ".sidebar-menu .js-sidebar-close", (e) => {
                this.close();
                e.stopPropagation();
            });

            element.on(Metro.events.click, (e) => {
                e.stopPropagation();
            });

            $(document).on(Metro.events.click, () => {
                if (o.closeOutside === true) {
                    if (this.isOpen()) this.close();
                }
            });
        },

        _checkStatic: function () {
            const element = this.element;
            const o = this.options;
            if (Metro.utils.mediaExist(o.static) && !element.hasClass("static")) {
                element.addClass("static");
                element.data("opened", false).removeClass("open");
                if (o.shift !== null) {
                    $.each(o.shift.split(","), function () {
                        $(this).animate({
                            draw: {
                                left: 0,
                            },
                            dur: o.duration,
                        });
                    });
                }

                this._fireEvent("static-set");
            }
            if (!Metro.utils.mediaExist(o.static)) {
                element.removeClass("static");
                this._fireEvent("static-loss");
            }
        },

        isOpen: function () {
            return this.element.data("opened") === true;
        },

        open: function () {
            const element = this.element;
            const o = this.options;

            if (element.hasClass("static")) {
                return;
            }

            element.data("opened", true).addClass("open");

            if (o.shift !== null) {
                $(o.shift).animate({
                    draw: {
                        left: element.outerWidth(),
                    },
                    dur: o.duration,
                });
            }

            this._fireEvent("open");
        },

        close: function () {
            const element = this.element;
            const o = this.options;

            if (element.hasClass("static")) {
                return;
            }

            element.data("opened", false).removeClass("open");

            if (o.shift !== null) {
                $(o.shift).animate({
                    draw: {
                        left: 0,
                    },
                    dur: o.duration,
                });
            }

            this._fireEvent("close");
        },

        toggle: function () {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }

            this._fireEvent("toggle");
        },

        changeAttribute: () => {},

        destroy: function () {
            const element = this.element;
            const o = this.options;
            const toggle = this.toggle_element;

            if (toggle !== null) {
                toggle.off(Metro.events.click);
            }

            if (o.static !== null && Metro.media_modes.includes(o.static)) {
                $(globalThis).off(Metro.events.resize, { ns: this.id });
            }

            element.off(Metro.events.click, ".js-sidebar-close");

            return element;
        },
    });

    Metro.sidebar = {
        isSidebar: (el) => Metro.utils.isMetroObject(el, "sidebar"),

        open: function (el) {
            if (!this.isSidebar(el)) {
                return;
            }
            Metro.getPlugin(el, "sidebar").open();
        },

        close: function (el) {
            if (!this.isSidebar(el)) {
                return;
            }
            Metro.getPlugin(el, "sidebar").close();
        },

        toggle: function (el) {
            if (!this.isSidebar(el)) {
                return;
            }
            Metro.getPlugin(el, "sidebar").toggle();
        },

        isOpen: function (el) {
            if (!this.isSidebar(el)) {
                return;
            }
            return Metro.getPlugin(el, "sidebar").isOpen();
        },
    };
})(Metro, Dom);
