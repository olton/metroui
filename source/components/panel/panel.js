/** @format */

(function (Metro, $) {
    "use strict";
    var PanelDefaultConfig = {
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

    Metro.panelSetup = function (options) {
        PanelDefaultConfig = $.extend({}, PanelDefaultConfig, options);
    };

    if (typeof globalThis["metroPanelSetup"] !== undefined) {
        Metro.panelSetup(globalThis["metroPanelSetup"]);
    }

    Metro.Component("panel", {
        init: function (options, elem) {
            this._super(elem, options, PanelDefaultConfig);

            return this;
        },

        _addCustomButtons: function (buttons) {
            var element = this.element,
                o = this.options;
            var title = element.closest(".panel").find(".panel-title");
            var buttonsContainer,
                customButtons = [];

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
                buttonsContainer = $("<div>")
                    .addClass("custom-buttons")
                    .appendTo(title);
            } else {
                buttonsContainer.find(".btn-custom").off(Metro.events.click);
                buttonsContainer.html("");
            }

            $.each(customButtons, function () {
                var item = this;
                var customButton = $("<span>");

                customButton
                    .addClass("button btn-custom")
                    .addClass(o.clsCustomButton)
                    .addClass(item.cls)
                    .attr("tabindex", -1)
                    .html(item.html);

                if (item.attr && typeof item.attr === "object") {
                    $.each(item.attr, function (k, v) {
                        customButton.attr(Str.dashedName(k), v);
                    });
                }

                customButton.data("action", item.onclick);

                buttonsContainer.prepend(customButton);
            });

            title.on(Metro.events.click, ".btn-custom", function (e) {
                if (Metro.utils.isRightMouse(e)) return;
                var button = $(this);
                var action = button.data("action");
                Metro.utils.exec(action, [button], this);
            });

            return this;
        },

        _create: function () {
            var element = this.element,
                o = this.options;
            var panel = $("<div>").addClass("panel").addClass(o.clsPanel);
            var id = o.id ? o.id : Metro.utils.elementId("panel");
            var original_classes = element[0].className;
            var title;

            panel.attr("id", id).addClass(original_classes);
            panel.insertBefore(element);
            element.appendTo(panel);

            element[0].className = "";
            element
                .addClass("panel-content")
                .addClass(o.clsContent)
                .appendTo(panel);

            if (
                o.titleCaption !== "" ||
                o.titleIcon !== "" ||
                o.collapsible === true
            ) {
                title = $("<div>").addClass("panel-title").addClass(o.clsTitle);

                if (o.titleCaption !== "") {
                    $("<span>")
                        .addClass("caption")
                        .addClass(o.clsTitleCaption)
                        .html(o.titleCaption)
                        .appendTo(title);
                }

                if (o.titleIcon !== "") {
                    $(o.titleIcon)
                        .addClass("icon")
                        .addClass(o.clsTitleIcon)
                        .appendTo(title);
                }

                if (o.collapsible === true) {
                    var collapseToggle = $("<span>")
                        .addClass("dropdown-toggle marker-center active-toggle")
                        .addClass(o.clsCollapseToggle)
                        .appendTo(title);
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
                var dragElement;

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

            if (o.width !== "auto" && parseInt(o.width) >= 0) {
                panel.outerWidth(parseInt(o.width));
            }

            if (o.height !== "auto" && parseInt(o.height) >= 0) {
                panel.outerHeight(parseInt(o.height));
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
            var element = this.element;
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
            var element = this.element;
            if (Metro.utils.isMetroObject(element, "collapse") === false) {
                return;
            }
            Metro.getPlugin(element, "collapse").expand();
        },

        /* eslint-disable-next-line */
        changeAttribute: function (attributeName) {},

        destroy: function () {
            var element = this.element,
                o = this.options;

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
