/**
 * global Metro
 *
 * @format
 */

(function (Metro, $) {
    "use strict";
    var Utils = Metro.utils;
    var SelectDefaultConfig = {
        id: "",
        label: "",
        size: "normal",
        selectDeferred: 0,
        clearButton: false,
        clearButtonIcon: "❌",
        usePlaceholder: false,
        placeholder: "",
        addEmptyValue: false,
        emptyValue: "",
        duration: 0,
        prepend: "",
        append: "",
        filterPlaceholder: "Search...",
        filter: false,
        copyInlineStyles: false,
        dropHeight: 200,
        dropWidth: null,
        dropFullSize: false,
        // checkDropUp: true,
        // dropUp: false,
        openMode: "auto",
        showGroupName: false,
        shortTag: true,

        clsSelect: "",
        clsSelectInput: "",
        clsPrepend: "",
        clsAppend: "",
        clsOption: "",
        clsOptionActive: "",
        clsOptionGroup: "",
        clsDropList: "",
        clsDropContainer: "",
        clsSelectedItem: "",
        clsSelectedItemAction: "",
        clsLabel: "",
        clsGroupName: "",

        onClear: Metro.noop,
        onChange: Metro.noop,
        onUp: Metro.noop,
        onDrop: Metro.noop,
        onItemSelect: Metro.noop,
        onItemDeselect: Metro.noop,
        onSelectCreate: Metro.noop,
    };

    Metro.selectSetup = function (options) {
        SelectDefaultConfig = $.extend({}, SelectDefaultConfig, options);
    };

    if (typeof globalThis["metroSelectSetup"] !== undefined) {
        Metro.selectSetup(globalThis["metroSelectSetup"]);
    }

    Metro.Component("select", {
        init: function (options, elem) {
            this._super(elem, options, SelectDefaultConfig, {
                list: null,
                placeholder: null,
                observer: null,
            });

            return this;
        },

        _create: function () {
            var element = this.element;

            this._createSelect();
            this._createEvents();

            this._fireEvent("select-create", {
                element: element,
            });
        },

        _setPlaceholder: function () {
            var element = this.element,
                o = this.options;
            var input = element.siblings(".select-input");
            if (
                o.usePlaceholder === true &&
                (!Utils.isValue(element.val()) || element.val() == o.emptyValue)
            ) {
                input.html(this.placeholder);
            }
        },

        _addTag: function (val, data) {
            var element = this.element,
                o = this.options;
            var tag,
                tagSize,
                container = element.closest(".select");
            const group = data.data("group");
            let html = "<span class='title'>" + val + "</span>"
            
            if (o.showGroupName && group) {
                html +=
                    "&nbsp;<span class='selected-item__group-name " +
                    o.clsGroupName +
                    "'>" +
                    group +
                    "</span>";
            }

            tag = $("<div>")
                .addClass("tag")
                .addClass(o.shortTag ? "short-tag" : "")
                .addClass(o.clsSelectedItem)
                .html(html)
                .data("option", data);
            
            $("<span>")
                .addClass("action unselect-option")
                .addClass(o.clsSelectedItemAction)
                .html("&times;")
                .appendTo(tag);

            if (container.hasClass("input-large")) {
                tagSize = "large";
            } else if (container.hasClass("input-small")) {
                tagSize = "small";
            }

            tag.addClass(tagSize);

            return tag;
        },

        _addOption: function (item, parent, input, multiple, group) {
            var option = $(item);
            var l, a;
            var element = this.element,
                o = this.options;
            var html = Utils.isValue(option.attr("data-template"))
                ? option.attr("data-template").replace("$1", item.text)
                : item.text;
            var displayValue = option.attr("data-display");

            l = $("<li>")
                .addClass(o.clsOption)
                .data("option", item)
                .attr("data-text", item.text)
                .attr("data-value", item.value ? item.value : "");
            a = $("<a>").html(html);

            const optionIcon = option.attr("data-icon")
            if (optionIcon) {
                a.prepend($("<span>").addClass("icon").html(optionIcon));
            }
            
            if (displayValue) {
                l.attr("data-display", displayValue);
                html = displayValue;
            }

            l.addClass(item.className);

            l.data("group", group);

            if (option.is(":disabled")) {
                l.addClass("disabled");
            }

            if (option.is(":selected")) {
                let g = ""
                
                if (o.showGroupName && group) {
                    g =
                        "&nbsp;<span class='selected-item__group-name " +
                        o.clsGroupName +
                        "'>" +
                        group +
                        "</span>";
                }

                if (multiple) {
                    l.addClass("d-none");
                    input.append(this._addTag(a.html(), l));
                } else {
                    html = a.html() + g
                    element.val(item.value);
                    input.html(html);
                    element.fire("change", {
                        val: item.value,
                    });
                    l.addClass("active");
                }
            }

            l.append(a).appendTo(parent);
        },

        _addOptionGroup: function (item, parent, input, multiple) {
            var that = this,
                o = this.options;
            var group = $(item);

            $("<li>")
                .html(item.label)
                .addClass("group-title")
                .addClass(o.clsOptionGroup)
                .appendTo(parent);

            $.each(group.children(), function () {
                that._addOption(this, parent, input, multiple, item.label);
            });
        },

        _createOptions: function () {
            var that = this,
                element = this.element,
                o = this.options,
                select = element.parent();
            var list = select.find("ul").empty();
            var selected = element.find("option[selected]").length > 0;
            var multiple = element[0].multiple;
            var input = element.siblings(".select-input");

            element.siblings(".select-input").empty();

            if (o.addEmptyValue === true) {
                element.prepend(
                    $(
                        "<option " +
                            (!selected ? "selected" : "") +
                            " value='" +
                            o.emptyValue +
                            "' class='d-none'></option>",
                    ),
                );
            }

            $.each(element.children(), function () {
                if (this.tagName === "OPTION") {
                    that._addOption(this, list, input, multiple, null);
                } else if (this.tagName === "OPTGROUP") {
                    that._addOptionGroup(this, list, input, multiple);
                }
            });
        },

        _createSelect: function () {
            var that = this,
                element = this.element,
                o = this.options;

            var container = $("<label>");
            var multiple = element[0].multiple;
            var select_id = Utils.elementId("select");
            var buttons = $("<div>").addClass("button-group");
            var input,
                drop_container,
                drop_container_input,
                list,
                filter_input,
                dropdown_toggle;
            var checkboxID = Utils.elementId("select-focus-trigger");
            var checkbox = $("<input type='checkbox'>")
                .addClass("select-focus-trigger")
                .attr("id", checkboxID);

            this.placeholder = $("<span>")
                .addClass("placeholder")
                .html(o.placeholder);

            container
                .attr("id", o.id ? o.id : select_id)
                .attr("for", checkboxID);
            container[0].className = Metro.utils.classNames(
                element[0].className,
                "input-" + o.size,
                "select",
                o.clsSelect,
            );

            dropdown_toggle = $("<span>").addClass("dropdown-toggle");
            dropdown_toggle.appendTo(container);

            if (multiple) {
                container.addClass("multiple");
            }

            container.insertBefore(element);
            element.appendTo(container);
            buttons.appendTo(container);
            checkbox.appendTo(container);

            input = $("<div>")
                .addClass("select-input")
                .addClass(o.clsSelectInput)
                .attr("name", "__" + select_id + "__");
            drop_container = $("<div>")
                .addClass("drop-container")
                .addClass(o.clsDropContainer);

            if (o.dropFullSize === false) {
                if (o.dropWidth) {
                    drop_container.css({
                        width: +o.dropWidth,
                    });
                }
            } else {
                container.addClass("drop-full-size");
            }

            drop_container_input = $("<div>").appendTo(drop_container);
            list = $("<ul>")
                .addClass("option-list")
                .addClass(o.clsDropList)
                .css({
                    "max-height": o.dropHeight,
                });
            filter_input = $(
                `<input type='text' data-role='input' data-clear-button-icon="${o.clearButtonIcon}">`,
            )
                .attr("placeholder", o.filterPlaceholder)
                .appendTo(drop_container_input);

            container.append(input);
            container.append(drop_container);

            drop_container.append(drop_container_input);

            if (o.filter !== true) {
                drop_container_input.hide();
            }

            drop_container.append(list);

            this._createOptions();

            this._setPlaceholder();

            Metro.makePlugin(drop_container, "dropdown", {
                dropFilter: ".select",
                duration: o.duration,
                toggleElement: [container],
                // checkDropUp: o.checkDropUp,
                // dropUp: o.dropUp,
                openMode: o.openMode,
                onDrop: function () {
                    var dropped, target;
                    dropdown_toggle.addClass("active-toggle");
                    dropped = $(".select .drop-container");
                    $.each(dropped, function () {
                        var drop = $(this);
                        if (drop.is(drop_container)) {
                            return;
                        }
                        var dataDrop = Metro.getPlugin(drop, "dropdown");
                        if (dataDrop && dataDrop.close) {
                            dataDrop.close();
                        }
                    });

                    filter_input.val("").trigger(Metro.events.keyup); //.focus();

                    target =
                        list.find("li.active").length > 0
                            ? $(list.find("li.active")[0])
                            : undefined;
                    if (target !== undefined) {
                        list[0].scrollTop =
                            target.position().top -
                            (list.height() - target.height()) / 2;
                    }

                    that._fireEvent("drop", {
                        list: list[0],
                    });
                },
                onUp: function () {
                    dropdown_toggle.removeClass("active-toggle");

                    that._fireEvent("up", {
                        list: list[0],
                    });
                },
            });

            this.list = list;

            if (o.clearButton === true && !element[0].readOnly) {
                var clearButton = $("<button>")
                    .addClass("button input-clear-button")
                    .addClass(o.clsClearButton)
                    .attr("tabindex", -1)
                    .attr("type", "button")
                    .html(o.clearButtonIcon);
                clearButton.appendTo(buttons);
            } else {
                buttons.addClass("d-none");
            }

            if (o.prepend !== "" && !multiple) {
                var prepend = $("<div>").html(o.prepend);
                prepend
                    .addClass("prepend")
                    .addClass(o.clsPrepend)
                    .appendTo(container);
            }

            if (o.append !== "" && !multiple) {
                var append = $("<div>").html(o.append);
                append
                    .addClass("append")
                    .addClass(o.clsAppend)
                    .appendTo(container);
            }

            if (o.copyInlineStyles === true) {
                for (var i = 0, l = element[0].style.length; i < l; i++) {
                    container.css(
                        element[0].style[i],
                        element.css(element[0].style[i]),
                    );
                }
            }

            if (element.attr("dir") === "rtl") {
                container.addClass("rtl").attr("dir", "rtl");
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

            this.observer = new MutationObserver(this._updateSelect.bind(this));
            this.observer.observe(element[0], {
                childList: true,
                subtree: true,
            });
        },

        _updateSelect: function (mutation) {
            for (let record of mutation) {
                if (record.type === "childList") {
                    if (
                        record.addedNodes.length ||
                        record.removedNodes.length
                    ) {
                        this._createOptions();
                    }
                }
            }
        },

        _createEvents: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var container = element.closest(".select");
            var drop_container = container.find(".drop-container");
            var input = element.siblings(".select-input");
            var filter_input = drop_container.find("input");
            var list = drop_container.find("ul");
            var clearButton = container.find(".input-clear-button");
            var checkbox = container.find(".select-focus-trigger");

            checkbox.on("focus", function () {
                container.addClass("focused");
            });

            checkbox.on("blur", function () {
                container.removeClass("focused");
            });

            clearButton.on(Metro.events.click, function (e) {
                element.val(o.emptyValue);
                if (element[0].multiple) {
                    list.find("li").removeClass("d-none");
                }

                input.clear();
                that._setPlaceholder();

                e.preventDefault();
                e.stopPropagation();

                that._fireEvent("clear");
                that._fireEvent("change", {
                    selected: that.getSelected(),
                });
            });

            element.on(Metro.events.change, function () {
                that._setPlaceholder();
            });

            container.on(Metro.events.click, function () {
                $(".focused").removeClass("focused");
                container.addClass("focused");
            });

            input.on(Metro.events.click, function () {
                $(".focused").removeClass("focused");
                container.addClass("focused");
            });

            list.on(Metro.events.click, "li", function (e) {
                if ($(this).hasClass("group-title")) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                var leaf = $(this);
                var displayValue = leaf.attr("data-display");
                var val = leaf.data("value");
                var group = leaf.data("group");
                var html = displayValue
                    ? displayValue
                    : leaf.children("a").html();
                var selected;
                var option = leaf.data("option");
                var options = element.find("option");

                if (o.showGroupName && group) {
                    html +=
                        "&nbsp;<span class='selected-item__group-name " +
                        o.clsGroupName +
                        "'>" +
                        group +
                        "</span>";
                }

                if (element[0].multiple) {
                    leaf.addClass("d-none");
                    input.append(that._addTag(html, leaf));
                } else {
                    list.find("li.active")
                        .removeClass("active")
                        .removeClass(o.clsOptionActive);
                    leaf.addClass("active").addClass(o.clsOptionActive);
                    input.html(html);
                    Metro.getPlugin(drop_container, "dropdown").close();
                }

                $.each(options, function () {
                    if (this === option) {
                        this.selected = true;
                    }
                });

                that._fireEvent("item-select", {
                    val: val,
                    option: option,
                    leaf: leaf[0],
                });

                selected = that.getSelected();

                that._fireEvent("change", {
                    selected: selected,
                });
            });

            input.on("click", ".tag .action", function (e) {
                var item = $(this).closest(".tag");
                var leaf = item.data("option");
                var option = leaf.data("option");
                var selected;

                leaf.removeClass("d-none");
                $.each(element.find("option"), function () {
                    if (this === option) {
                        this.selected = false;
                    }
                });
                item.remove();

                that._fireEvent("item-deselect", {
                    option: option,
                });

                selected = that.getSelected();

                that._fireEvent("change", {
                    selected: selected,
                });

                e.preventDefault();
                e.stopPropagation();
            });

            filter_input.on(Metro.events.keyup, function () {
                var filter = this.value.toUpperCase();
                var li = list.find("li");
                var i, a;
                for (i = 0; i < li.length; i++) {
                    if ($(li[i]).hasClass("group-title")) continue;
                    a = li[i].getElementsByTagName("a")[0];
                    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        li[i].style.display = "";
                    } else {
                        li[i].style.display = "none";
                    }
                }
            });

            filter_input.on(Metro.events.click, function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            drop_container.on(Metro.events.click, function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        },

        disable: function () {
            this.element.data("disabled", true);
            this.element.closest(".select").addClass("disabled");
        },

        enable: function () {
            this.element.data("disabled", false);
            this.element.closest(".select").removeClass("disabled");
        },

        toggleState: function () {
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        reset: function (to_default) {
            var element = this.element;
            var options = element.find("option");
            var select = element.closest(".select");
            var selected;

            $.each(options, function () {
                this.selected = !Utils.isNull(to_default)
                    ? this.defaultSelected
                    : false;
            });

            this.list.find("li").remove();
            select.find(".select-input").html("");

            this._createOptions();

            selected = this.getSelected();

            this._fireEvent("change", {
                selected: selected,
            });
        },

        getSelected: function () {
            var element = this.element;
            var result = [];

            element.find("option").each(function () {
                if (this.selected) result.push(this.value);
            });

            return result;
        },

        val: function (val) {
            var that = this,
                element = this.element,
                o = this.options;
            var input = element.siblings(".select-input");
            var options = element.find("option");
            var list_items = this.list.find("li");
            var result = [];
            var multiple = element.attr("multiple") !== undefined;
            var option;
            var i, html, list_item, option_value, selected, group;

            if (Utils.isNull(val)) {
                $.each(options, function () {
                    if (this.selected) result.push(this.value);
                });
                return multiple ? result : result[0];
            }

            $.each(options, function () {
                this.selected = false;
            });
            list_items.removeClass("active").removeClass(o.clsOptionActive);
            input.html("");

            if (Array.isArray(val) === false) {
                val = [val];
            }

            $.each(val, function () {
                for (i = 0; i < options.length; i++) {
                    option = options[i];
                    html = Utils.isValue(option.getAttribute("data-template"))
                        ? option
                              .getAttribute("data-template")
                              .replace("$1", option.text)
                        : option.text;
                    if ("" + option.value === "" + this) {
                        option.selected = true;
                        break;
                    }
                }

                for (i = 0; i < list_items.length; i++) {
                    list_item = $(list_items[i]);
                    group = list_item.data("group");
                    option_value = list_item.attr("data-value");
                    if ("" + option_value === "" + this) {
                        if (o.showGroupName && group) {
                            html +=
                                "&nbsp;<span class='selected-item__group-name'>" +
                                group +
                                "</span>";
                        }

                        if (multiple) {
                            list_item.addClass("d-none");
                            input.append(that._addTag(html, list_item));

                            // tag = $("<div>").addClass("tag").addClass(o.clsSelectedItem).html("<span class='title'>"+html+"</span>").appendTo(input);
                            // tag.data("option", list_item);
                            // $("<span>").addClass("remover").addClass(o.clsSelectedItemRemover).html("&times;").appendTo(tag);
                        } else {
                            list_item
                                .addClass("active")
                                .addClass(o.clsOptionActive);
                            input.html(html);
                        }
                        break;
                    }
                }
            });

            selected = this.getSelected();

            this._fireEvent("change", {
                selected: selected,
            });
        },

        options: function (op, selected, delimiter) {
            return this.data(op, selected, delimiter);
        },

        data: function (op, selected, delimiter) {
            var element = this.element;
            var option_group, _selected;
            var _delimiter = delimiter || ",";

            if (typeof selected === "string") {
                _selected = selected.toArray(_delimiter).map(function (v) {
                    return isNaN(v) ? v : +v;
                });
            } else if (Array.isArray(selected)) {
                _selected = selected.slice().map(function (v) {
                    return isNaN(v) ? v : +v;
                });
            } else {
                _selected = [];
            }

            element.empty();

            if (typeof op === "string") {
                element.html(op);
            } else if (Utils.isObject2(op)) {
                $.each(op, function (key, val) {
                    if (Utils.isObject2(val)) {
                        option_group = $("<optgroup label=''>")
                            .attr("label", key)
                            .appendTo(element);
                        $.each(val, function (key2, val2) {
                            var op = $("<option>")
                                .attr("value", key2)
                                .text(val2)
                                .appendTo(option_group);
                            if (_selected.indexOf(+key2) > -1) {
                                op.prop("selected", true);
                            }
                        });
                    } else {
                        var op = $("<option>")
                            .attr("value", key)
                            .text(val)
                            .appendTo(element);
                        if (_selected.indexOf(key) > -1) {
                            op.prop("selected", true);
                        }
                    }
                });
            }

            this._createOptions();

            return this;
        },

        addOption: function (val, title, selected) {
            var element = this.element;
            var option = $("<option>")
                .attr("value", val)
                .text(title ? title : val);

            element.append(option);

            if (selected) {
                option.prop("selected", true);
            }

            this._createOptions();

            return this;
        },

        addOptions: function (values) {
            var that = this;

            if (!values) {
                return this;
            }

            if (Array.isArray(values)) {
                $.each(values, function () {
                    var o = this;
                    if (Metro.utils.isObject2(o)) {
                        that.addOption(o.val, o.title, o.selected);
                    } else {
                        that.addOption(o);
                    }
                });
            } else if (Metro.utils.isObject2(values)) {
                $.each(values, function (key, val) {
                    that.addOption(key, val);
                });
            }

            return this;
        },

        removeOption: function (val) {
            var element = this.element;
            var options = element.find("option");

            options.each(function () {
                var $el = $(this);

                if ($el.attr("value") == val) {
                    $el.remove();
                }
            });

            this._createOptions();

            return this;
        },

        removeOptions: function (values) {
            var element = this.element;
            var options = element.find("option");

            if (!values || !Array.isArray(values)) {
                return this;
            }

            options.each(function () {
                var $el = $(this);
                var val = $el.attr("value");

                if (values.indexOf(val) > -1) {
                    $el.remove();
                }
            });

            this._createOptions();

            return this;
        },

        changeAttribute: function (attributeName) {
            if (attributeName === "disabled") {
                this.toggleState();
            }
        },

        destroy: function () {
            var element = this.element;
            var container = element.closest(".select");
            var drop_container = container.find(".drop-container");
            var input = element.siblings(".select-input");
            var filter_input = drop_container.find("input");
            var list = drop_container.find("ul");
            var clearButton = container.find(".input-clear-button");

            container.off(Metro.events.click);
            container.off(Metro.events.click, ".input-clear-button");
            input.off(Metro.events.click);
            filter_input.off(Metro.events.blur);
            filter_input.off(Metro.events.focus);
            list.off(Metro.events.click, "li");
            filter_input.off(Metro.events.keyup);
            drop_container.off(Metro.events.click);
            clearButton.off(Metro.events.click);

            drop_container.data("dropdown").destroy();

            return element;
        },
    });

    $(document).on(
        Metro.events.click,
        function () {
            $(".select").removeClass("focused");
        },
        { ns: "blur-select-elements" },
    );
})(Metro, m4q);
