/*
* TODO:
*  1. Add keyboard support to autocomplete list
* */

(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var InputDefaultConfig = {
        inputDeferred: 0,

        label: "",

        autocomplete: null,
        autocompleteUrl: null,
        autocompleteUrlMethod: "GET",
        autocompleteUrlKey: null,
        autocompleteDivider: ",",
        autocompleteListHeight: 200,

        history: false,
        historyPreset: "",
        historyDivider: "|",
        preventSubmit: false,
        defaultValue: "",
        size: "default",
        prepend: "",
        append: "",
        copyInlineStyles: false,
        searchButton: false,
        clearButton: true,
        revealButton: true,
        clearButtonIcon: "❌",
        revealButtonIcon: "👀",
        searchButtonIcon: "🔍",
        randomButtonIcon: "🎲",
        customButtons: [],
        searchButtonClick: 'submit',

        badge: null,

        clsComponent: "",
        clsInput: "",
        clsPrepend: "",
        clsAppend: "",
        clsClearButton: "",
        clsRevealButton: "",
        clsCustomButton: "",
        clsSearchButton: "",
        clsLabel: "",

        onAutocompleteSelect: Metro.noop,
        onHistoryChange: Metro.noop,
        onHistoryUp: Metro.noop,
        onHistoryDown: Metro.noop,
        onClearClick: Metro.noop,
        onRevealClick: Metro.noop,
        onSearchButtonClick: Metro.noop,
        onEnterClick: Metro.noop,
        onInputCreate: Metro.noop
    };

    Metro.inputSetup = function (options) {
        InputDefaultConfig = $.extend({}, InputDefaultConfig, options);
    };

    if (typeof globalThis["metroInputSetup"] !== undefined) {
        Metro.inputSetup(globalThis["metroInputSetup"]);
    }

    Metro.Component('input', {
        init: function( options, elem ) {
            this._super(elem, options, InputDefaultConfig, {
                history: [],
                historyIndex: -1,
                autocomplete: []
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("input-create", {
                element: element
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var container = $("<div>").addClass("input " + element[0].className);
            var buttons = $("<div>").addClass("button-group");
            var clearButton, revealButton, searchButton;

            if (Utils.isValue(o.historyPreset)) {
                $.each(o.historyPreset.toArray(o.historyDivider), function(){
                    that.history.push(this);
                });
                that.historyIndex = that.history.length - 1;
            }

            if (element.attr("type") === undefined) {
                element.attr("type", "text");
            }

            container.insertBefore(element);
            element.appendTo(container);
            buttons.appendTo(container);

            if (!Utils.isValue(element.val().trim())) {
                element.val(o.defaultValue);
            }

            if (o.clearButton === true && !element[0].readOnly) {
                clearButton = $("<button>").addClass("button input-clear-button").addClass(o.clsClearButton).attr("tabindex", -1).attr("type", "button").html(o.clearButtonIcon).attr("title", this.strings.label_clear_input);
                clearButton.appendTo(buttons);
            }
            if (element.attr('type') === 'password' && o.revealButton === true) {
                revealButton = $("<button>").addClass("button input-reveal-button").addClass(o.clsRevealButton).attr("tabindex", -1).attr("type", "button").html(o.revealButtonIcon).attr("title", this.strings.label_reveal_password);
                revealButton.appendTo(buttons);
            }
            if (o.searchButton === true) {
                searchButton = $("<button>").addClass("button input-search-button").addClass(o.clsSearchButton).attr("tabindex", -1).attr("type", o.searchButtonClick === 'submit' ? "submit" : "button").html(o.searchButtonIcon).attr("title", this.strings.label_search_input);
                searchButton.appendTo(buttons);
            }

            if (Utils.isValue(o.prepend)) {
                var prepend = $("<div>").html(o.prepend);
                prepend.addClass("prepend").addClass(o.clsPrepend).appendTo(container);
            }

            if (Utils.isValue(o.append)) {
                var append = $("<div>").html(o.append);
                append.addClass("append").addClass(o.clsAppend).appendTo(container);
            }

            const customButtons = Utils.isObject(o.customButtons);
            if (Array.isArray(customButtons)) {
                $.each(customButtons, function(){
                    var item = this;
                    var btn = $("<button>");

                    btn
                        .addClass("button input-custom-button")
                        .addClass(o.clsCustomButton)
                        .addClass(item.cls)
                        .attr("tabindex", -1)
                        .attr("type", "button")
                        .html(item.text);

                    if (item.attr && typeof item.attr === 'object') {
                        $.each(item.attr, function(k, v){
                            btn.attr(Str.dashedName(k), v);
                        });
                    }

                    if (item.onclick) btn.on("click", () => {
                        item.onclick.apply(btn, [element.valueOf(), element]);
                    });
                    
                    btn.appendTo(buttons);
                });
            }

            if (Utils.isValue(element.attr('data-exclaim'))) {
                container.attr('data-exclaim', element.attr('data-exclaim'));
            }

            if (element.attr('dir') === 'rtl' ) {
                container.addClass("rtl").attr("dir", "rtl");
            }

            element[0].className = '';
            if (o.copyInlineStyles === true) {
                for (var i = 0, l = element[0].style.length; i < l; i++) {
                    container.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            container.addClass(o.clsComponent);
            element.addClass(o.clsInput);

            if (o.size !== "default") {
                container.css({
                    width: o.size
                });
            }

            if (!Utils.isNull(o.autocomplete) || !Utils.isNull(o.autocompleteUrl)) {
                $("<div>").addClass("autocomplete-list").css({
                    maxHeight: o.autocompleteListHeight,
                    display: "none"
                }).appendTo(container);
            }

            if (Utils.isValue(o.autocomplete)) {
                var autocomplete_obj = Utils.isObject(o.autocomplete);

                if (autocomplete_obj !== false) {
                    this.autocomplete = autocomplete_obj;
                } else {
                    this.autocomplete = o.autocomplete.toArray(o.autocompleteDivider);
                }
            }

            if (Utils.isValue(o.autocompleteUrl)) {
                fetch(o.autocompleteUrl, {
                    method: o.autocompleteUrlMethod
                }).then(function(response){
                    return response.text()
                }).then(function(data){
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

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(container);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (o.badge) {
                container.append($("<div>").addClass("badge").html(o.badge))
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
            
            this.component = container
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var container = element.closest(".input");
            var autocompleteList = container.find(".autocomplete-list");

            container.on(Metro.events.click, ".input-clear-button", function(){
                var curr = element.val();
                element.val(Utils.isValue(o.defaultValue) ? o.defaultValue : "").fire('clear').fire('change').fire('keyup').focus();
                if (autocompleteList.length > 0) {
                    autocompleteList.css({
                        display: "none"
                    })
                }

                that._fireEvent("clear-click", {
                    prev: curr,
                });
            });

            container.on(Metro.events.click, ".input-reveal-button", function(){
                if (element.attr('type') === 'password') {
                    element.attr('type', 'text');
                } else {
                    element.attr('type', 'password');
                }

                that._fireEvent("reveal-click", {
                    val: element.val()
                });

            });

            container.on(Metro.events.click, ".input-search-button", function(){
                if (o.searchButtonClick !== 'submit') {
                    that._fireEvent("search-button-click", {
                        val: element.val(),
                        button: this
                    });
                } else {
                    if (this.form) this.form.submit();
                }
            });

            element.on(Metro.events.keyup, function(e){
                var val = element.val().trim();

                if (o.history && e.keyCode === Metro.keyCode.ENTER && val !== "") {
                    element.val("");
                    that.history.push(val);
                    that.historyIndex = that.history.length - 1;

                    that._fireEvent("history-change", {
                        val: val,
                        history: that.history,
                        historyIndex: that.historyIndex
                    })

                    if (o.preventSubmit === true) {
                        e.preventDefault();
                    }
                }

                if (o.history && e.keyCode === Metro.keyCode.UP_ARROW) {
                    that.historyIndex--;
                    if (that.historyIndex >= 0) {
                        element.val("");
                        element.val(that.history[that.historyIndex]);

                        that._fireEvent("history-down", {
                            val: element.val(),
                            history: that.history,
                            historyIndex: that.historyIndex
                        })
                    } else {
                        that.historyIndex = 0;
                    }
                    e.preventDefault();
                }

                if (o.history && e.keyCode === Metro.keyCode.DOWN_ARROW) {
                    that.historyIndex++;
                    if (that.historyIndex < that.history.length) {
                        element.val("");
                        element.val(that.history[that.historyIndex]);

                        that._fireEvent("history-up", {
                            val: element.val(),
                            history: that.history,
                            historyIndex: that.historyIndex
                        })
                    } else {
                        that.historyIndex = that.history.length - 1;
                    }
                    e.preventDefault();
                }
            });

            element.on(Metro.events.keydown, function(e){
                if (e.keyCode === Metro.keyCode.ENTER) {
                    that._fireEvent("enter-click", {
                        val: element.val()
                    });
                }
            });

            element.on(Metro.events.blur, function(){
                container.removeClass("focused");
            });

            element.on(Metro.events.focus, function(){
                container.addClass("focused");
            });

            element.on(Metro.events.input, function(){
                var val = this.value.toLowerCase();
                that._drawAutocompleteList(val);
            });

            container.on(Metro.events.click, ".autocomplete-list .item", function(){
                var val = $(this).attr("data-autocomplete-value");
                element.val(val);
                autocompleteList.css({
                    display: "none"
                });
                element.trigger("change");
                that._fireEvent("autocomplete-select", {
                    value: val
                });
            });
        },

        _drawAutocompleteList: function(val){
            var that = this, element = this.element;
            var container = element.closest(".input");
            var autocompleteList = container.find(".autocomplete-list");
            var items;

            if (autocompleteList.length === 0) {
                return;
            }

            autocompleteList.html("");

            items = this.autocomplete.filter(function(item){
                return item.toLowerCase().indexOf(val) > -1;
            });

            autocompleteList.css({
                display: items.length > 0 ? "block" : "none"
            });

            $.each(items, function(){
                var v = this;
                var index = v.toLowerCase().indexOf(val), content;
                var item = $("<div>").addClass("item").attr("data-autocomplete-value", v);

                if (index === 0) {
                    content = "<strong>"+v.substr(0, val.length)+"</strong>"+v.substr(val.length);
                } else {
                    content = v.substr(0, index) + "<strong>"+v.substr(index, val.length)+"</strong>"+v.substr(index + val.length);
                }

                item.html(content).appendTo(autocompleteList);

                that._fireEvent("draw-autocomplete-item", {
                    item: item
                })
            });
        },

        getHistory: function(){
            return this.history;
        },

        getHistoryIndex: function(){
            return this.historyIndex;
        },

        setHistoryIndex: function(val){
            this.historyIndex = val >= this.history.length ? this.history.length - 1 : val;
        },

        setHistory: function(history, append) {
            var that = this, o = this.options;
            if (Utils.isNull(history)) return;
            if (!Array.isArray(history) && typeof history === 'string') {
                history = history.toArray(o.historyDivider);
            }
            if (append === true) {
                $.each(history, function () {
                    that.history.push(this);
                })
            } else{
                this.history = history;
            }
            this.historyIndex = this.history.length - 1;
        },

        clear: function(){
            this.element.val('');
        },

        toDefault: function(){
            this.element.val(Utils.isValue(this.options.defaultValue) ? this.options.defaultValue : "");
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        setAutocompleteList: function(l){
            var autocomplete_list = Utils.isObject(l);
            if (autocomplete_list !== false) {
                this.autocomplete = autocomplete_list;
            } else if (typeof l === "string") {
                this.autocomplete = l.toArray(this.options.autocompleteDivider);
            }
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var parent = element.parent();
            var clearBtn = parent.find(".input-clear-button");
            var revealBtn = parent.find(".input-reveal-button");
            var customBtn = parent.find(".input-custom-button");

            if (clearBtn.length > 0) {
                clearBtn.off(Metro.events.click);
            }
            if (revealBtn.length > 0) {
                revealBtn.off(Metro.events.start);
                revealBtn.off(Metro.events.stop);
            }
            if (customBtn.length > 0) {
                clearBtn.off(Metro.events.click);
            }

            element.off(Metro.events.blur);
            element.off(Metro.events.focus);

            return element;
        }
    });

    $(document).on(Metro.events.click, function(){
        $('.input .autocomplete-list').hide();
    });
}(Metro, m4q));