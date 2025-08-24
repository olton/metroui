((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let SidenavSimpleDefaultConfig = {
        compacted: false,
        toggle: null,
        expandPoint: "fs",
        onMenuItemClick: Metro.noop,
        onCollapse: Metro.noop,
        onExpand: Metro.noop,
        onSidenavCreate: Metro.noop,
    };

    Metro.sidenavSimpleSetup = (options) => {
        SidenavSimpleDefaultConfig = $.extend({}, SidenavSimpleDefaultConfig, options);
    };

    if (typeof globalThis.metroSidenavSimpleSetup !== "undefined") {
        Metro.sidenavSimpleSetup(globalThis.metroSidenavSimpleSetup);
    }

    Metro.Component("sidenav-simple", {
        init: function (options, elem) {
            this._super(elem, options, SidenavSimpleDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("sidenav-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("sidenav-simple");
            if (Metro.utils.mediaExist(o.expandPoint)) {
                element.addClass("expanded");
            }
            const state = Metro.storage.getItem("sidenav-simple:compacted");
            if (state === true) {
                element.removeClass("expanded");
                element.addClass("handmade");
            }

            const items = element.find("li");
            items.each((index, item) => {
                const $item = $(item);
                $item.title($item.find(".title").text());
            });
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            if (o.toggle) {
                $(o.toggle).on("click", () => {
                    element.toggleClass("expanded");
                    element.toggleClass("handmade");
                    Metro.storage.setItem("sidenav-simple:compacted", !element.hasClass("expanded"));
                });
            }

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    if (element.hasClass("handmade")) {
                        return;
                    }
                    if (Metro.utils.mediaExist(o.expandPoint)) {
                        element.addClass("expanded");
                    } else {
                        element.removeClass("expanded");
                    }
                },
                { ns: this.id },
            );
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
