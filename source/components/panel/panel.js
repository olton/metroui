((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const toggleImage = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"></path></svg>`;

    let PanelDefaultConfig = {
        panelDeferred: 0,
        id: null,
        titleCaption: "",
        titleIcon: "",
        collapsible: false,
        collapsed: false,
        collapseDuration: 100,
        width: "auto",
        height: "auto",
        draggable: false,

        customButtons: null,
        clsCustomButton: "",

        clsPanel: "",
        clsTitle: "",
        clsTitleCaption: "",
        clsTitleIcon: "",
        clsContent: "",
        clsCollapseToggle: "",

        onCollapse: Metro.noop,
        onExpand: Metro.noop,
        onDragStart: Metro.noop,
        onDragStop: Metro.noop,
        onDragMove: Metro.noop,
        onPanelCreate: Metro.noop,
    };

    Metro.panelSetup = (options) => {
        PanelDefaultConfig = $.extend({}, PanelDefaultConfig, options);
    };

    if (typeof globalThis.metroPanelSetup !== "undefined") {
        Metro.panelSetup(globalThis.metroPanelSetup);
    }

    Metro.Component("panel", {
        init: function (options, elem) {
            this._super(elem, options, PanelDefaultConfig);

            return this;
        },

        _addCustomButtons: function (buttons) {
            const element = this.element;
            const o = this.options;
            const title = element.closest(".panel").find(".panel-title");
            let buttonsContainer;
            let customButtons = [];

            customButtons = Metro.utils.isObject(buttons);
            if (!customButtons) {
                console.warn("Unknown format for custom buttons", buttons);
                return;
            }

            if (title.length === 0) {
                console.warn("No place for custom buttons");
                return;
            }

            buttonsContainer = title.find(".custom-buttons");

            if (buttonsContainer.length === 0) {
                buttonsContainer = $("<div>").addClass("custom-buttons").appendTo(title);
            } else {
                buttonsContainer.find(".btn-custom").off(Metro.events.click);
                buttonsContainer.html("");
            }

            $.each(customButtons, function () {
                const customButton = $("<span>");

                customButton
                    .addClass("button btn-custom")
                    .addClass(o.clsCustomButton)
                    .addClass(this.cls)
                    .attr("tabindex", -1)
                    .html(this.html);

                if (this.attr && typeof this.attr === "object") {
                    $.each(this.attr, (k, v) => {
                        customButton.attr(Str.dashedName(k), v);
                    });
                }

                customButton.data("action", this.onclick);

                buttonsContainer.prepend(customButton);
            });

            title.on(Metro.events.click, ".btn-custom", function (e) {
                if (Metro.utils.isRightMouse(e)) return;
                const button = $(this);
                const action = button.data("action");
                Metro.utils.exec(action, [button], this);
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;
            const panel = $("<div>").addClass("panel").addClass(o.clsPanel);
            const id = o.id ? o.id : Metro.utils.elementId("panel");
            const original_classes = element[0].className;
            let title;

            panel.attr("id", id).addClass(original_classes);
            panel.insertBefore(element);
            element.appendTo(panel);

            element[0].className = "";
            element.addClass("panel-content").addClass(o.clsContent).appendTo(panel);

            if (o.titleCaption !== "" || o.titleIcon !== "" || o.collapsible === true) {
                title = $("<div>").addClass("panel-title").addClass(o.clsTitle);

                if (o.titleCaption !== "") {
                    $("<span>").addClass("caption").addClass(o.clsTitleCaption).html(o.titleCaption).appendTo(title);
                }

                if (o.titleIcon !== "") {
                    $(o.titleIcon).addClass("icon").addClass(o.clsTitleIcon).appendTo(title);
                }

                if (o.collapsible === true) {
                    const collapseToggle = $("<span>")
                        .addClass("dropdown-toggle marker-center active-toggle")
                        .addClass(o.clsCollapseToggle)
                        .appendTo(title);

                    collapseToggle.append(toggleImage);

                    Metro.makePlugin(element, "collapse", {
                        toggleElement: collapseToggle,
                        duration: o.collapseDuration,
                        onCollapse: o.onCollapse,
                        onExpand: o.onExpand,
                    });

                    if (o.collapsed === true) {
                        this.collapse();
                    }
                }

                title.appendTo(panel);
            }

            if (title && Metro.utils.isValue(o.customButtons)) {
                this._addCustomButtons(o.customButtons);
            }

            if (o.draggable === true) {
                let dragElement;

                if (title) {
                    dragElement = title.find(".caption, .icon");
                } else {
                    dragElement = panel;
                }

                Metro.makePlugin(panel, "draggable", {
                    dragContext: panel[0],
                    dragElement: dragElement,
                    onDragStart: o.onDragStart,
                    onDragStop: o.onDragStop,
                    onDragMove: o.onDragMove,
                });
            }

            if (o.width !== "auto" && Number.parseInt(o.width) >= 0) {
                panel.outerWidth(Number.parseInt(o.width));
            }

            if (o.height !== "auto" && Number.parseInt(o.height) >= 0) {
                panel.outerHeight(Number.parseInt(o.height));
                element.css({ overflow: "auto" });
            }

            this.panel = panel;

            this._fireEvent("panel-create", {
                element: element,
                panel: panel,
            });
        },

        customButtons: function (buttons) {
            return this._addCustomButtons(buttons);
        },

        collapse: function () {
            const element = this.element;
            if (Metro.utils.isMetroObject(element, "collapse") === false) {
                return;
            }
            Metro.getPlugin(element, "collapse").collapse();
        },

        open: function () {
            this.expand();
        },

        close: function () {
            this.collapse();
        },

        expand: function () {
            const element = this.element;
            if (Metro.utils.isMetroObject(element, "collapse") === false) {
                return;
            }
            Metro.getPlugin(element, "collapse").expand();
        },

        changeAttribute: (attr, val) => {},

        destroy: function () {
            const element = this.element;
            const o = this.options;

            if (o.collapsible === true) {
                Metro.getPlugin(element, "collapse").destroy();
            }

            if (o.draggable === true) {
                Metro.getPlugin(element, "draggable").destroy();
            }

            return element;
        },
    });
})(Metro, Dom);
