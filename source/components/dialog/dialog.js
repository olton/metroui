/** @format */

/*
* customButtons: [
*    {
*        text: "Button",
*        cls: "",
*        onclick: () => {},
*    }
* ]
* */

(function (Metro, $) {
    "use strict";
    var Utils = Metro.utils;
    var DialogDefaultConfig = {
        dialogDeferred: 0,
        closeButton: false,
        leaveOverlayOnClose: false,
        toTop: false,
        toBottom: false,
        title: "",
        content: "",
        customButtons: null,
        actionsAlign: "right",
        defaultActions: true,
        defaultActionButtons: "ok, cancel, help",
        overlay: true,
        overlayColor: "#000000",
        overlayAlpha: 0.5,
        overlayClickClose: false,
        width: "auto",
        height: "auto",
        closeAction: true,
        clsDialog: "",
        clsTitle: "",
        clsContent: "",
        clsAction: "",
        clsDefaultAction: "",
        clsOverlay: "",
        autoHide: 0,
        removeOnClose: false,
        show: false,

        _runtime: false,

        onOk: Metro.noop,
        onCancel: Metro.noop,
        onHelp: Metro.noop,
        onShow: Metro.noop,
        onHide: Metro.noop,
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onDialogCreate: Metro.noop,
    };

    Metro.dialogSetup = function (options) {
        DialogDefaultConfig = $.extend({}, DialogDefaultConfig, options);
    };

    if (typeof globalThis["metroDialogSetup"] !== undefined) {
        Metro.dialogSetup(globalThis["metroDialogSetup"]);
    }

    Metro.Component("dialog", {
        _counter: 0,

        init: function (options, elem) {
            this._super(elem, options, DialogDefaultConfig, {
                interval: null,
                overlay: null,
                id: Utils.elementId("dialog"),
            });

            return this;
        },

        _create: function () {
            this._build();
        },

        _build: function () {
            var that = this,
                element = this.element,
                o = this.options,
                strings = this.strings;
            var body = $("body");
            var overlay;

            element.addClass("dialog");

            if (o.title !== "") {
                this.setTitle(o.title);
            }

            if (o.content !== "") {
                this.setContent(o.content);
            }

            if (o.defaultActions === true || o.customButtons) {
                var buttons = element.find(".dialog-actions");
                var button;

                if (buttons.length === 0) {
                    buttons = $("<div>")
                        .addClass("dialog-actions")
                        .addClass("text-" + o.actionsAlign)
                        .appendTo(element);
                }

                if (o.defaultActions === true && element.find(".dialog-actions > *").length === 0) {
                    for (let b of o.defaultActionButtons.toArray(",")) {
                        button = $("<button>").addClass(b !== "help" ? ".js-dialog-close" : "").addClass(o.clsDefaultAction).html(strings[`label_${b}`]);
                        button.appendTo(buttons);
                        if (b === "ok") {
                            button.on(Metro.events.click, function () {
                                Utils.exec(o.onOk, [element]);
                            });
                        }
                        if (b === "help") {
                            button.on(Metro.events.click, function () {
                                Utils.exec(o.onHelp, [element]);
                            });
                        }
                        if (b === "cancel") {
                            button.on(Metro.events.click, function () {
                                Utils.exec(o.onCancel, [element]);
                            });
                        }
                    }
                }
                
                const customButtons = Utils.isObject(o.customButtons);
                if (Array.isArray(customButtons))
                    $.each(customButtons, function () {
                        var item = this;
                        button = $("<button>").addClass("button").addClass(item.cls).html(item.text);
                        if (item.onclick !== undefined)
                            button.on(Metro.events.click, function () {
                                Utils.exec(item.onclick, [element]);
                            });
                        button.appendTo(buttons);
                    });
            }

            if (o.overlay === true) {
                overlay = this._overlay();
                this.overlay = overlay;
            }

            if (o.closeAction === true) {
                element.on(Metro.events.click, ".js-dialog-close", function () {
                    that.close();
                });
            }

            var closer = element.find("closer");
            if (closer.length === 0) {
                closer = $("<span>").addClass("closer js-dialog-close");
                closer.appendTo(element);
            }
            if (o.closeButton !== true) {
                closer.hide();
            }

            element.css({
                height: o.height,
                visibility: "hidden",
                top: "100%",
            });

            if (o.width !== "auto") {
                element.css({
                    width: o.width,
                });
            }
            
            element.addClass(o.clsDialog);
            element.find(".dialog-title").addClass(o.clsTitle);
            element.find(".dialog-content").addClass(o.clsContent);
            element.find(".dialog-actions").addClass(o.clsAction);

            element.appendTo(body);

            if (o.show) {
                this.open();
            }

            $(globalThis).on(
                Metro.events.resize,
                function () {
                    that.setPosition();
                },
                { ns: this.id },
            );

            this._fireEvent("dialog-create", {
                element: element,
            });
        },

        _overlay: function () {
            var o = this.options;

            var overlay = $("<div>");
            overlay.addClass("overlay").addClass(o.clsOverlay);

            if (o.overlayColor === "transparent") {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Farbe.Routines.toRGBA(Farbe.Routines.parse(o.overlayColor), o.overlayAlpha),
                });
            }

            return overlay;
        },

        hide: function (callback) {
            var element = this.element,
                o = this.options;
            var timeout = 0;
            if (o.onHide !== Metro.noop) {
                timeout = 500;

                this._fireEvent("hide");
            }
            setTimeout(function () {
                Utils.exec(callback, null, element[0]);
                element.css({
                    visibility: "hidden",
                    top: "100%",
                });
            }, timeout);
        },

        show: function (callback) {
            var element = this.element;
            this.setPosition();
            element.css({
                visibility: "visible",
            });

            this._fireEvent("show");

            Utils.exec(callback, null, element[0]);
        },

        setPosition: function () {
            var element = this.element,
                o = this.options;
            var top, bottom;
            if (o.toTop !== true && o.toBottom !== true) {
                top = ($(globalThis).height() - element.outerHeight()) / 2;
                if (top < 0) {
                    top = 0;
                }
                bottom = "auto";
            } else {
                if (o.toTop === true) {
                    top = 0;
                    bottom = "auto";
                }
                if (o.toTop !== true && o.toBottom === true) {
                    bottom = 0;
                    top = "auto";
                }
            }
            element.css({
                top: top,
                bottom: bottom,
                left: ($(globalThis).width() - element.outerWidth()) / 2,
            });
        },

        setContent: function (c) {
            var element = this.element;
            var content = element.find(".dialog-content");
            if (content.length === 0) {
                content = $("<div>").addClass("dialog-content");
                content.appendTo(element);
            }

            if (!Utils.isQ(c) && Utils.isFunc(c)) {
                c = Utils.exec(c);
            }

            if (Utils.isQ(c)) {
                c.appendTo(content);
            } else {
                content.html(c);
            }
        },

        setTitle: function (t) {
            var element = this.element;
            var title = element.find(".dialog-title");
            if (title.length === 0) {
                title = $("<div>").addClass("dialog-title");
                title.appendTo(element);
            }
            title.html(t);
        },

        close: function () {
            var that = this,
                element = this.element,
                o = this.options;

            if (!Utils.bool(o.leaveOverlayOnClose)) {
                $("body").find(".overlay").remove();
            }

            this.hide(function () {
                element.data("open", false);

                that._fireEvent("close");

                if (o.removeOnClose === true) {
                    element.remove();
                }
            });
        },

        open: function () {
            var that = this,
                element = this.element,
                o = this.options;

            if (o.overlay === true && $(".overlay").length === 0) {
                this.overlay.appendTo($("body"));
                if (o.overlayClickClose === true) {
                    this.overlay.on(Metro.events.click, function () {
                        that.close();
                    });
                }
            }

            this.show(function () {
                that._fireEvent("open");

                element.data("open", true);
                if (parseInt(o.autoHide) > 0) {
                    setTimeout(function () {
                        that.close();
                    }, parseInt(o.autoHide));
                }
            });
        },

        toggle: function () {
            var element = this.element;
            if (element.data("open")) {
                this.close();
            } else {
                this.open();
            }
        },

        isOpen: function () {
            return this.element.data("open") === true;
        },

        /* eslint-disable-next-line */
        changeAttribute: function (attributeName) {},

        destroy: function () {
            var element = this.element;

            element.off(Metro.events.click, ".js-dialog-close");
            element.find(".button").off(Metro.events.click);
            $(globalThis).off(Metro.events.resize, { ns: this.id });

            return element;
        },
    });

    Metro.dialog = {
        isDialog: function (el) {
            return Utils.isMetroObject(el, "dialog");
        },

        open: function (el, content, title) {
            if (!this.isDialog(el)) {
                return false;
            }
            var dialog = Metro.getPlugin(el, "dialog");
            if (title !== undefined) {
                dialog.setTitle(title);
            }
            if (content !== undefined) {
                dialog.setContent(content);
            }
            dialog.open();
        },

        close: function (el) {
            if (!this.isDialog(el)) {
                return false;
            }
            Metro.getPlugin($(el)[0], "dialog").close();
        },

        toggle: function (el) {
            if (!this.isDialog(el)) {
                return false;
            }
            Metro.getPlugin($(el)[0], "dialog").toggle();
        },

        isOpen: function (el) {
            if (!this.isDialog(el)) {
                return false;
            }
            Metro.getPlugin($(el)[0], "dialog").isOpen();
        },

        remove: function (el) {
            if (!this.isDialog(el)) {
                return false;
            }
            var dialog = Metro.getPlugin($(el)[0], "dialog");
            dialog.options.removeOnClose = true;
            dialog.close();
        },

        create: function (options) {
            var dlg;

            dlg = $("<div>").appendTo($("body"));

            var dlg_options = $.extend(
                {},
                {
                    show: true,
                    closeAction: true,
                    removeOnClose: true,
                },
                options !== undefined ? options : {},
            );

            dlg_options._runtime = true;

            return Metro.makePlugin(dlg, "dialog", dlg_options);
        },
    };
})(Metro, m4q);
