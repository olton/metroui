((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let FileDefaultConfig = {
        fileDeferred: 0,
        label: "",
        mode: "input",
        buttonTitle: "",
        filesSelectedTitle: "",
        dropTitle: "",
        dropIcon: "📥",
        clearButtonIcon: "❌",
        prepend: "",
        clsComponent: "",
        clsPrepend: "",
        clsButton: "",
        clsCaption: "",
        clsLabel: "",
        onSelect: Metro.noop,
        onFileCreate: Metro.noop,
    };

    Metro.fileSetup = (options) => {
        FileDefaultConfig = $.extend({}, FileDefaultConfig, options);
    };

    if (typeof globalThis.metroFileSetup !== "undefined") {
        Metro.fileSetup(globalThis.metroFileSetup);
    }

    Metro.Component("file", {
        init: function (options, elem) {
            this._super(elem, options, FileDefaultConfig);

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("file-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const container = element
                .wrap("<div>")
                .addClass(
                    (o.mode === "input" ? " file " : o.mode === "button" ? " file-button " : " drop-zone ") +
                        element[0].className,
                )
                .addClass(o.clsComponent);
            const caption = $("<span>").addClass("caption").addClass(o.clsCaption);
            const files = $("<span>").addClass("files").addClass(o.clsCaption);
            let icon;
            let button;

            if (o.mode.includes("drop")) {
                icon = $("<span>").addClass("icon").html(o.dropIcon).appendTo(container);
                caption.html(o.dropTitle || this.strings.label_drop_file).insertAfter(icon);
                files
                    .html((o.filesSelectedTitle || this.strings.label_files_selected).replace("{n}", 0))
                    .insertAfter(caption);

                button = $("<button>")
                    .addClass("button clear-button square")
                    .html(o.clearButtonIcon)
                    .appendTo(container);
            } else {
                caption.insertBefore(element);

                button = $("<button>")
                    .addClass("button select-files-button")
                    .attr("tabindex", -1)
                    .html(o.buttonTitle || this.strings.label_choose_file);
                button.appendTo(container);
                button.addClass(o.clsButton);

                if (container.hasClass("input-small")) {
                    button.addClass("small");
                }

                if (element.attr("dir") === "rtl") {
                    container.addClass("rtl");
                }

                if (o.prepend !== "") {
                    const prepend = $("<div>").html(o.prepend);
                    prepend.addClass("prepend").addClass(o.clsPrepend).appendTo(container);
                }
            }

            element[0].className = "";

            if (o.label) {
                const label = $("<label>")
                    .addClass("label-for-input")
                    .addClass(o.clsLabel)
                    .html(o.label)
                    .insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                } else {
                    const id = Hooks.useId(element[0]);
                    label.attr("for", id);
                    element.attr("id", id);
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const container = element.closest(".file, .drop-zone");
            const caption = element.siblings(".caption");
            const files = element.siblings(".files");
            const form = element.closest("form");

            if (form.length) {
                form.on("reset", () => {
                    that.clear();
                });
            }

            container.on(Metro.events.click, ".select-files-button", () => {
                element[0].click();
            });

            container.on(Metro.events.click, ".clear-button", () => {
                that.clear();
            });

            element.on(Metro.events.change, function () {
                const file_names = [];
                let entry;
                const _files = Array.from(this.files);

                for (const file of _files) {
                    file_names.push(file.name);
                }

                if (o.mode === "input") {
                    entry = file_names.join(", ");
                    caption.html(entry);
                    caption.attr("title", entry);
                } else {
                    files.html(
                        (o.filesSelectedTitle || that.strings.label_files_selected).replace(
                            "{n}",
                            element[0].files.length,
                        ),
                    );
                }

                that._fireEvent("select", {
                    files: this.files,
                });
            });

            element.on(Metro.events.focus, () => {
                container.addClass("focused");
            });
            element.on(Metro.events.blur, () => {
                container.removeClass("focused");
            });

            if (o.mode !== "input") {
                container.on(Metro.events.click, () => {
                    element[0].click();
                });

                container.on("drag dragstart dragend dragover dragenter dragleave drop", (e) => {
                    e.preventDefault();
                });

                container.on("dragenter dragover", () => {
                    container.addClass("drop-on");
                });

                container.on("dragleave", () => {
                    container.removeClass("drop-on");
                });

                container.on("drop", (e) => {
                    element[0].files = e.dataTransfer.files;
                    files.html(
                        (o.filesSelectedTitle || that.strings.label_files_selected).replace(
                            "{n}",
                            element[0].files.length,
                        ),
                    );
                    container.removeClass("drop-on");
                    element.trigger("change");
                });
            }
        },

        clear: function () {
            const element = this.element;
            const o = this.options;

            if (o.mode === "input") {
                element.siblings(".caption").html("");
            } else {
                element
                    .siblings(".files")
                    .html((o.filesSelectedTitle || this.strings.label_files_selected).replace("{n}", 0));
            }

            element[0].value = "";
            element.trigger("change");
        },

        disable: function () {
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function () {
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function () {
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        toggleDir: function () {
            if (this.element.attr("dir") === "rtl") {
                this.element.parent().addClass("rtl");
            } else {
                this.element.parent().removeClass("rtl");
            }
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "disabled":
                    this.toggleState();
                    break;
                case "dir":
                    this.toggleDir();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const o = this.options;
            const parent = element.parent();
            element.off(Metro.events.change);
            parent.off(Metro.events.click, "button");
            if (o.label) {
                parent.prev("label").remove();
            }
            parent.remove();
        },
    });
})(Metro, Dom);
