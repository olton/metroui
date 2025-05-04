((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let TagInputDefaultConfig = {
        autocomplete: null,
        autocompleteUnique: true,
        autocompleteUrl: null,
        autocompleteUrlMethod: "GET",
        autocompleteUrlKey: null,
        autocompleteDivider: ",",
        autocompleteListHeight: 200,

        label: "",
        size: "normal",
        tagInputDeferred: 0,
        static: false,
        clearButton: true,
        clearButtonIcon: "❌",

        randomColor: false,
        maxTags: 0,
        tagSeparator: ",",
        tagTrigger: "Enter, Space, Comma",
        backspace: true,

        clsComponent: "",
        clsInput: "",
        clsClearButton: "",
        clsTag: "",
        clsTagTitle: "",
        clsTagAction: "",
        clsLabel: "",

        onBeforeTagAdd: Metro.noop_true,
        onTagAdd: Metro.noop,
        onBeforeTagRemove: Metro.noop_true,
        onTagRemove: Metro.noop,
        onTag: Metro.noop,
        onClear: Metro.noop,
        onTagTrigger: Metro.noop,
        onTagInputCreate: Metro.noop,
    };

    Metro.tagInputSetup = (options) => {
        TagInputDefaultConfig = $.extend({}, TagInputDefaultConfig, options);
    };

    if (typeof globalThis.metroTagInputSetup !== "undefined") {
        Metro.tagInputSetup(globalThis.metroTagInputSetup);
    }

    Metro.Component("tag-input", {
        init: function (options, elem) {
            this._super(elem, options, TagInputDefaultConfig, {
                values: [],
                triggers: [],
                autocomplete: [],
            });

            return this;
        },

        _create: function () {
            this.triggers = `${this.options.tagTrigger}`.toArray(",");

            if (this.triggers.includes("Space") || this.triggers.includes("Spacebar")) {
                this.triggers.push(" ");
                this.triggers.push("Spacebar");
            }

            if (this.triggers.includes("Comma")) {
                this.triggers.push(",");
            }

            this._createStructure();
            this._createEvents();

            this._fireEvent("tag-input-create", {
                element: this.element,
            });
        },

        _createStructure: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            let container;
            let clearButton;
            const values = element.val().trim();

            container = element.wrap("<div>").addClass(`tag-input ${element[0].className}`).addClass(o.clsComponent);

            container.addClass(`input-${o.size}`);

            element[0].className = "";

            element.addClass("original-input");
            const input = $("<input type='text'>").addClass("input-wrapper").addClass(o.clsInput).attr("size", 1);
            input.appendTo(container);

            if (o.clearButton !== false && !element[0].readOnly) {
                container.addClass("padding-for-clear");
                clearButton = $("<button>")
                    .addClass("button input-clear-button")
                    .attr("tabindex", -1)
                    .attr("type", "button")
                    .html(o.clearButtonIcon);
                clearButton.appendTo(container);
            }

            if (Metro.utils.isValue(values)) {
                $.each(values.toArray(o.tagSeparator), function () {
                    that._addTag(this);
                });
            }

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

            if (o.static === true || element.attr("readonly") !== undefined) {
                container.addClass("static-mode");
            }

            if (!Metro.utils.isNull(o.autocomplete) || !Metro.utils.isNull(o.autocompleteUrl)) {
                $("<div>")
                    .addClass("autocomplete-list")
                    .css({
                        maxHeight: o.autocompleteListHeight,
                        display: "none",
                    })
                    .appendTo(container);
            }

            if (Metro.utils.isValue(o.autocomplete)) {
                const autocomplete_obj = Metro.utils.isObject(o.autocomplete);

                if (autocomplete_obj !== false) {
                    this.autocomplete = autocomplete_obj;
                } else {
                    this.autocomplete = o.autocomplete.toArray(o.autocompleteDivider);
                }
            }

            if (Metro.utils.isValue(o.autocompleteUrl)) {
                fetch(o.autocompleteUrl, {
                    method: o.autocompleteUrlMethod,
                })
                    .then((response) => response.text())
                    .then((data) => {
                        let newData = [];

                        try {
                            newData = JSON.parse(data);
                            if (o.autocompleteUrlKey) {
                                newData = newData[o.autocompleteUrlKey];
                            }
                        } catch (e) {
                            newData = data.split("\n");
                        }

                        that.autocomplete = that.autocomplete.concat(newData);
                    });
            }
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const container = element.closest(".tag-input");
            const input = container.find(".input-wrapper");
            const autocompleteList = container.find(".autocomplete-list");

            input.on(Metro.events.focus, () => {
                container.addClass("focused");
            });

            input.on(Metro.events.blur, () => {
                container.removeClass("focused");
            });

            input.on(Metro.events.inputchange, () => {
                input.attr("size", Math.ceil(input.val().length / 2) + 2);
            });

            input.on(Metro.events.keydown, (e) => {
                const val = input.val().trim();
                const key = e.key;

                if (key === "Enter") e.preventDefault();

                if (o.backspace === true && key === "Backspace" && val.length === 0) {
                    if (that.values.length > 0) {
                        that.values.splice(-1, 1);
                        element.siblings(".tag").last().remove();
                        element.val(that.values.join(o.tagSeparator));
                    }
                    return;
                }

                if (val === "") {
                    return;
                }

                if (!that.triggers.includes(key)) {
                    return;
                }

                that._fireEvent("tag-trigger", {
                    key: key,
                });

                input.val("");
                that._addTag(val);
                input.attr("size", 1);
            });

            input.on(Metro.events.keyup, (e) => {
                const val = input.val();
                const key = e.key;

                if (that.triggers.includes(key) && val[val.length - 1] === key) {
                    input.val(val.slice(0, -1));
                }
            });

            container.on(Metro.events.click, ".tag .action", function () {
                const tag = $(this).closest(".tag");
                that._delTag(tag);
            });

            container.on(Metro.events.click, () => {
                input.focus();
            });

            container.on(Metro.events.click, ".input-clear-button", () => {
                const val = element.val();
                that.clear();

                that._fireEvent("clear", {
                    val: val,
                });
            });

            input.on(Metro.events.input, function () {
                const val = this.value.toLowerCase();
                that._drawAutocompleteList(val);
            });

            container.on(Metro.events.click, ".autocomplete-list .item", function () {
                const val = $(this).attr("data-autocomplete-value");

                input.val("");
                that._addTag(val);
                input.attr("size", 1);

                autocompleteList.css({
                    display: "none",
                });
                that._fireEvent("autocomplete-select", {
                    value: val,
                });
            });
        },

        _drawAutocompleteList: function (val) {
            const that = this;
            const element = this.element;
            const o = this.options;
            const container = element.closest(".tag-input");
            const input = container.find(".input-wrapper");
            const autocompleteList = container.find(".autocomplete-list");

            if (autocompleteList.length === 0) {
                return;
            }

            autocompleteList.html("");

            const items = this.autocomplete.filter((item) => item.toLowerCase().indexOf(val) > -1);
            autocompleteList.css({
                display: items.length > 0 ? "block" : "none",
                left: input.position().left,
            });

            $.each(items, function () {
                if (o.autocompleteUnique && that.values.indexOf(this) !== -1) {
                    return;
                }
                const index = this.toLowerCase().indexOf(val);
                let content;
                const item = $("<div>").addClass("item").attr("data-autocomplete-value", this);

                if (index === 0) {
                    content = `<strong>${this.substring(0, val.length)}</strong>${this.substring(val.length)}`;
                } else {
                    content = `${this.substring(0, index)}<strong>${this.substring(index, val.length)}</strong>${this.substring(index + val.length)}`;
                }

                item.html(content).appendTo(autocompleteList);

                that._fireEvent("draw-autocomplete-item", {
                    item: item,
                });
            });
        },

        _addTag: function (val) {
            const element = this.element;
            const o = this.options;
            const container = element.closest(".tag-input");
            const input = container.find(".input-wrapper");
            let tag;
            let remover;
            let tagSize;

            if (container.hasClass("input-large")) {
                tagSize = "large";
            } else if (container.hasClass("input-small")) {
                tagSize = "small";
            }

            if (o.maxTags > 0 && this.values.length === o.maxTags) {
                return;
            }

            if (`${val}`.trim() === "") {
                return;
            }

            if (!Metro.utils.exec(o.onBeforeTagAdd, [val, this.values], element[0])) {
                return;
            }

            tag = $("<span>").addClass("tag").addClass(tagSize).addClass(o.clsTag).insertBefore(input);
            tag.data("value", val);

            const tagStatic =
                o.static ||
                container.hasClass("static-mode") ||
                element.readonly ||
                element.disabled ||
                container.hasClass("disabled");
            if (tagStatic) {
                tag.addClass("static");
            }

            const title = $("<span>").addClass("title").addClass(o.clsTagTitle).html(val);
            remover = $("<span>").addClass("action").addClass(o.clsTagAction).html("&times;");

            title.appendTo(tag);
            remover.appendTo(tag);

            if (o.randomColor === true) {
                const colors = Object.values(Object.assign({}, Farbe.StandardColors, Farbe.MetroColors));

                const bg = colors[$.random(0, colors.length - 1)];
                const bg_r = Farbe.Routines.darken(bg, 15);
                const fg = Farbe.Routines.isDark(bg) ? "#ffffff" : "#000000";

                tag.css({
                    backgroundColor: bg,
                    color: fg,
                });
                remover.css({
                    backgroundColor: bg_r,
                    color: fg,
                });
            }

            this.values.push(val);
            element.val(this.values.join(o.tagSeparator));

            this._fireEvent("tag-add", {
                tag: tag[0],
                val: val,
                values: this.values,
            });

            this._fireEvent("tag", {
                tag: tag[0],
                val: val,
                values: this.values,
            });
        },

        _delTag: function (tag) {
            const element = this.element;
            const o = this.options;
            const val = tag.data("value");

            if (!Metro.utils.exec(o.onBeforeTagRemove, [tag, val, this.values], element[0])) {
                return;
            }

            Metro.utils.arrayDelete(this.values, val);
            element.val(this.values.join(o.tagSeparator));

            this._fireEvent("tag-remove", {
                tag: tag[0],
                val: val,
                values: this.values,
            });

            this._fireEvent("tag", {
                tag: tag[0],
                val: val,
                values: this.values,
            });

            tag.remove();
        },

        tags: function () {
            return this.values;
        },

        val: function (v) {
            const that = this;
            const element = this.element;
            const o = this.options;
            const container = element.closest(".tag-input");
            let newValues = [];

            if (!Metro.utils.isValue(v)) {
                return this.tags();
            }

            this.values = [];
            container.find(".tag").remove();

            if (typeof v === "string") {
                newValues = `${v}`.toArray(o.tagSeparator);
            } else {
                if (Array.isArray(v)) {
                    newValues = v;
                }
            }

            $.each(newValues, function () {
                that._addTag(this);
            });

            return this;
        },

        append: function (v) {
            const that = this;
            const o = this.options;
            let newValues = this.values;

            if (typeof v === "string") {
                newValues = `${v}`.toArray(o.tagSeparator);
            } else {
                if (Array.isArray(v)) {
                    newValues = v;
                }
            }

            $.each(newValues, function () {
                that._addTag(this);
            });

            return this;
        },

        clear: function () {
            const element = this.element;
            const container = element.closest(".tag-input");

            this.values = [];

            element.val("").trigger("change");

            container.find(".tag").remove();

            return this;
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

        toggleStatic: function (val) {
            const container = this.element.closest(".tag-input");
            let staticMode;

            if (Metro.utils.isValue(val)) {
                staticMode = Metro.utils.bool(val);
            } else {
                staticMode = !container.hasClass("static-mode");
            }

            if (staticMode) {
                container.addClass("static-mode");
            } else {
                container.removeClass("static-mode");
            }
        },

        setAutocompleteList: function (l) {
            const autocomplete_list = Metro.utils.isObject(l);
            if (autocomplete_list !== false) {
                this.autocomplete = autocomplete_list;
            } else if (typeof l === "string") {
                this.autocomplete = l.toArray(this.options.autocompleteDivider);
            }
        },

        changeAttribute: function (attributeName) {
            const element = this.element;
            const o = this.options;

            const changeValue = () => {
                const val = element.attr("value").trim();
                this.clear();
                if (!Metro.utils.isValue(val)) {
                    return;
                }
                this.val(val.toArray(o.tagSeparator));
            };

            switch (attributeName) {
                case "value":
                    changeValue();
                    break;
                case "disabled":
                    this.toggleState();
                    break;
                case "static":
                    this.toggleStatic();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const o = this.options;
            const container = element.closest(".tag-input");
            const input = container.find(".input-wrapper");

            input.off(Metro.events.focus);
            input.off(Metro.events.blur);
            input.off(Metro.events.keydown);
            container.off(Metro.events.click, ".tag .action");
            container.off(Metro.events.click);

            if (o.label) {
                container.prev("label").remove();
            }
            container.remove();
        },
    });

    $(document).on(Metro.events.click, () => {
        $(".tag-input .autocomplete-list").hide();
    });
})(Metro, Dom);
