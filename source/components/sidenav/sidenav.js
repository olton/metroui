((Metro, $) => {
    let SidenavDefaultConfig = {
        compacted: false,
        toggle: null,
        expandPoint: "fs",
        onMenuItemClick: Metro.noop,
        onCollapse: Metro.noop,
        onExpand: Metro.noop,
        onSidenavCreate: Metro.noop,
    };

    Metro.sidenavSetup = (options) => {
        SidenavDefaultConfig = $.extend({}, SidenavDefaultConfig, options);
    };

    if (typeof globalThis.metroSidenavSetup !== "undefined") {
        Metro.sidenavSetup(globalThis.metroSidenavSetup);
    }

    Metro.Component("sidenav", {
        init: function (options, elem) {
            this._super(elem, options, SidenavDefaultConfig, {
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

            element.addClass("sidenav");
            if (Metro.utils.mediaExist(o.expandPoint)) {
                element.addClass("expanded");
            }

            if (!element.id()) {
                element.attr("id", Hooks.useId(element[0]));
            }

            const id = element.id();
            const state = Metro.storage.getItem(`sidenav:${id}:compacted`);
            if (state === true) {
                element.removeClass("expanded");
                element.addClass("handmade");
            }

            const items = element.children("li:has(a)");
            items.each((_, item) => {
                const $item = $(item);
                const $a = $item.children("a");
                const $icon = $a.children(".icon");

                $item.title($item.find(".caption").text());

                if ($icon.length === 0) {
                    const [w1, w2] = $a.text().toArray(" ");
                    const caption = w1 ? w1.charAt(0) + (w2 ? w2.charAt(0) : w1.charAt(1)) : "DA";
                    $a.prepend(`<span class='icon'><span class='default-icon text-upper'>${caption}</span></span>`);
                }
            });
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const id = element.id();

            if (o.toggle) {
                $(o.toggle).on("click", () => {
                    element.toggleClass("expanded");
                    element.toggleClass("handmade");
                    Metro.storage.setItem(`sidenav:${id}:compacted`, !element.hasClass("expanded"));
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

        setValue: function (index, value = 0) {
            const element = this.element;
            const item = element.find("li").eq(index);

            item.find(".counter").text(value);
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
