/**
 * @format
 */

(function (Metro, $) {
    "use strict";

    var Utils = Metro.utils;
    var TagInputDefaultConfig = {
        autocomplete: null,
        autocompleteUnique: true,
        autocompleteUrl: null,
        autocompleteUrlMethod: "GET",
        autocompleteUrlKey: null,
        autocompleteDivider: ",",
        autocompleteListHeight: 200,

        label: "",
        size: "normal",
        taginputDeferred: 0,
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

    Metro.tagInputSetup = function (options) {
        TagInputDefaultConfig = $.extend({}, TagInputDefaultConfig, options);
    };

    if (typeof globalThis["metroTagInputSetup"] !== undefined) {
        Metro.tagInputSetup(globalThis["metroTagInputSetup"]);
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
            this.triggers = ("" + this.options.tagTrigger).toArray(",");

            if (
                this.triggers.includes("Space") ||
                this.triggers.includes("Spacebar")
            ) {
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
            var that = this,
                element = this.element,
                o = this.options;
            var container, input, clearButton;
            var values = element.val().trim();

            container = $("<div>")
                .addClass("tag-input " + element[0].className)
                .addClass(o.clsComponent)
                .insertBefore(element);
            element.appendTo(container);

            container.addClass("input-" + o.size);

            element[0].className = "";

            element.addClass("original-input");
            input = $("<input type='text'>")
                .addClass("input-wrapper")
                .addClass(o.clsInput)
                .attr("size", 1);
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

            if (Utils.isValue(values)) {
                $.each(values.toArray(o.tagSeparator), function () {
                    that._addTag(this);
                });
            }

            if (o.label) {
                var label = $("<label>")
                    .addClass("label-for-input")
                    .addClass(o.clsLabel)
                    .html(o.label)
                    .insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
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

            if (
                !Utils.isNull(o.autocomplete) ||
                !Utils.isNull(o.autocompleteUrl)
            ) {
                $("<div>")
                    .addClass("autocomplete-list")
                    .css({
                        maxHeight: o.autocompleteListHeight,
                        display: "none",
                    })
                    .appendTo(container);
            }

            if (Utils.isValue(o.autocomplete)) {
                var autocomplete_obj = Utils.isObject(o.autocomplete);

                if (autocomplete_obj !== false) {
                    this.autocomplete = autocomplete_obj;
                } else {
                    this.autocomplete = o.autocomplete.toArray(
                        o.autocompleteDivider,
                    );
                }
            }

            if (Utils.isValue(o.autocompleteUrl)) {
                fetch(o.autocompleteUrl, {
                    method: o.autocompleteUrlMethod,
                })
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (data) {
                        var newData = [];

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
            var that = this,
                element = this.element,
                o = this.options;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");
            var autocompleteList = container.find(".autocomplete-list");

            input.on(Metro.events.focus, function () {
                container.addClass("focused");
            });

            input.on(Metro.events.blur, function () {
                container.removeClass("focused");
            });

            input.on(Metro.events.inputchange, function () {
                input.attr("size", Math.ceil(input.val().length / 2) + 2);
            });

            input.on(Metro.events.keydown, function (e) {
                var val = input.val().trim();
                var key = e.key;

                if (key === "Enter") e.preventDefault();

                if (
                    o.backspace === true &&
                    key === "Backspace" &&
                    val.length === 0
                ) {
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

            input.on(Metro.events.keyup, function (e) {
                var val = input.val();
                var key = e.key;

                if (
                    that.triggers.includes(key) &&
                    val[val.length - 1] === key
                ) {
                    input.val(val.slice(0, -1));
                }
            });

            container.on(Metro.events.click, ".tag .action", function () {
                var tag = $(this).closest(".tag");
                that._delTag(tag);
            });

            container.on(Metro.events.click, function () {
                input.focus();
            });

            container.on(
                Metro.events.click,
                ".input-clear-button",
                function () {
                    var val = element.val();
                    that.clear();

                    that._fireEvent("clear", {
                        val: val,
                    });
                },
            );

            input.on(Metro.events.input, function () {
                var val = this.value.toLowerCase();
                that._drawAutocompleteList(val);
            });

            container.on(
                Metro.events.click,
                ".autocomplete-list .item",
                function () {
                    var val = $(this).attr("data-autocomplete-value");

                    input.val("");
                    that._addTag(val);
                    input.attr("size", 1);

                    autocompleteList.css({
                        display: "none",
                    });
                    that._fireEvent("autocomplete-select", {
                        value: val,
                    });
                },
            );
        },

        _drawAutocompleteList: function (val) {
            var that = this,
                element = this.element,
                o = this.options;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");
            var autocompleteList = container.find(".autocomplete-list");
            var items;

            if (autocompleteList.length === 0) {
                return;
            }

            autocompleteList.html("");

            items = this.autocomplete.filter(function (item) {
                return item.toLowerCase().indexOf(val) > -1;
            });

            autocompleteList.css({
                display: items.length > 0 ? "block" : "none",
                left: input.position().left,
            });

            $.each(items, function () {
                if (o.autocompleteUnique && that.values.indexOf(this) !== -1) {
                    return;
                }

                var v = this;
                var index = v.toLowerCase().indexOf(val),
                    content;
                var item = $("<div>")
                    .addClass("item")
                    .attr("data-autocomplete-value", v);

                if (index === 0) {
                    content =
                        "<strong>" +
                        v.substr(0, val.length) +
                        "</strong>" +
                        v.substr(val.length);
                } else {
                    content =
                        v.substr(0, index) +
                        "<strong>" +
                        v.substr(index, val.length) +
                        "</strong>" +
                        v.substr(index + val.length);
                }

                item.html(content).appendTo(autocompleteList);

                that._fireEvent("draw-autocomplete-item", {
                    item: item,
                });
            });
        },

        _addTag: function (val) {
            var element = this.element,
                o = this.options;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");
            var tag, title, remover;
            var tagSize, tagStatic;

            if (container.hasClass("input-large")) {
                tagSize = "large";
            } else if (container.hasClass("input-small")) {
                tagSize = "small";
            }

            if (o.maxTags > 0 && this.values.length === o.maxTags) {
                return;
            }

            if (("" + val).trim() === "") {
                return;
            }

            if (!Utils.exec(o.onBeforeTagAdd, [val, this.values], element[0])) {
                return;
            }

            tag = $("<span>")
                .addClass("tag")
                .addClass(tagSize)
                .addClass(o.clsTag)
                .insertBefore(input);
            tag.data("value", val);

            tagStatic =
                o.static ||
                container.hasClass("static-mode") ||
                element.readonly ||
                element.disabled ||
                container.hasClass("disabled");
            if (tagStatic) {
                tag.addClass("static");
            }

            title = $("<span>")
                .addClass("title")
                .addClass(o.clsTagTitle)
                .html(val);
            remover = $("<span>")
                .addClass("action")
                .addClass(o.clsTagAction)
                .html("&times;");

            title.appendTo(tag);
            remover.appendTo(tag);

            if (o.randomColor === true) {
                var colors = Object.values(
                        Object.assign(
                            {},
                            Farbe.StandardColors,
                            Farbe.MetroColors,
                        ),
                    ),
                    bg,
                    fg,
                    bg_r;

                bg = colors[$.random(0, colors.length - 1)];
                bg_r = Farbe.Routines.darken(bg, 15);
                fg = Farbe.Routines.isDark(bg) ? "#ffffff" : "#000000";

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
            var element = this.element,
                o = this.options;
            var val = tag.data("value");

            if (
                !Utils.exec(
                    o.onBeforeTagRemove,
                    [tag, val, this.values],
                    element[0],
                )
            ) {
                return;
            }

            Utils.arrayDelete(this.values, val);
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
            var that = this,
                element = this.element,
                o = this.options;
            var container = element.closest(".tag-input");
            var newValues = [];

            if (!Utils.isValue(v)) {
                return this.tags();
            }

            this.values = [];
            container.find(".tag").remove();

            if (typeof v === "string") {
                newValues = ("" + v).toArray(o.tagSeparator);
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
            var that = this,
                o = this.options;
            var newValues = this.values;

            if (typeof v === "string") {
                newValues = ("" + v).toArray(o.tagSeparator);
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
            var element = this.element;
            var container = element.closest(".tag-input");

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
            var container = this.element.closest(".tag-input");
            var staticMode;

            if (Utils.isValue(val)) {
                staticMode = Utils.bool(val);
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
            var autocomplete_list = Utils.isObject(l);
            if (autocomplete_list !== false) {
                this.autocomplete = autocomplete_list;
            } else if (typeof l === "string") {
                this.autocomplete = l.toArray(this.options.autocompleteDivider);
            }
        },

        changeAttribute: function (attributeName) {
            var that = this,
                element = this.element,
                o = this.options;

            var changeValue = function () {
                var val = element.attr("value").trim();
                that.clear();
                if (!Utils.isValue(val)) {
                    return;
                }
                that.val(val.toArray(o.tagSeparator));
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
            var element = this.element;
            var container = element.closest(".tag-input");
            var input = container.find(".input-wrapper");

            input.off(Metro.events.focus);
            input.off(Metro.events.blur);
            input.off(Metro.events.keydown);
            container.off(Metro.events.click, ".tag .action");
            container.off(Metro.events.click);

            return element;
        },
    });

    $(document).on(Metro.events.click, function () {
        $(".tag-input .autocomplete-list").hide();
    });
})(Metro, Dom);
