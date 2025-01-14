/*
* TODO:
*  1. Add keyboard support to autocomplete list
* */

(function(Metro, $) {
    'use strict';

    let InputDefaultConfig = {
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
        searchButton: false,
        clearButton: true,
        revealButton: true,
        randomButton: false,
        clearButtonIcon: "❌",
        revealButtonIcon: "👀",
        searchButtonIcon: "🔍",
        randomButtonIcon: "🎲",
        customButtons: [],
        searchButtonClick: 'submit',
        randomSymbols: "0123456789;abcdefghijklmnopqrstuvwxyz;ABCDEFGHIJKLMNOPQRSTUVWXYZ;<>!?@#$%^&*()_+",
        randomLength: 12,
        prependOptions: "",
        prependOptionsSep: ",",
        appendOptions: "",
        appendOptionsSep: ",",

        badge: null,

        clsComponent: "",
        clsInput: "",
        clsPrepend: "",
        clsAppend: "",
        clsClearButton: "",
        clsRevealButton: "",
        clsCustomButton: "",
        clsSearchButton: "",
        clsRandomButton: "",
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
                autocomplete: [],
                prependOptionsList: null,
                appendOptionsList: null
            });

            return this;
        },

        _create: function(){
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("input-create", {
                element: element
            });
        },

        _createStructure: function(){
            const that = this, element = this.element, o = this.options;
            const container = $("<div>").addClass("input " + element[0].className);
            const buttons = $("<div>").addClass("button-group");
            let clearButton, revealButton, searchButton, randomButton;

            if (Metro.utils.isValue(o.historyPreset)) {
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

            if (!Metro.utils.isValue(element.val().trim())) {
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
            if (o.randomButton === true) {
                randomButton = $("<button>").addClass("button input-random-button").addClass(o.clsRandomButton).attr("tabindex", -1).attr("type", "button").html(o.randomButtonIcon).attr("title", this.strings.label_generate_random);
                randomButton.appendTo(buttons);
            }

            let opt, ul
            
            if (o.prepend) {
                $("<div>").html(o.prepend).addClass("prepend").addClass(o.clsPrepend).appendTo(container);
            }
            if (o.prependOptions) {
                opt = $("<div>").addClass("prepend-options").appendTo(container);
                opt.append(ul = $("<select data-role='select'>").addClass("options-list"))
                o.prependOptions.toArray(o.prependOptionsSep).forEach(function(item){
                    $("<option>").attr("value", item).html(item).appendTo(ul)
                })
                this.prependOptionsList = ul;
            }

            if (o.append) {
                $("<div>").html(o.append).addClass("append").addClass(o.clsAppend).appendTo(container);
            }
            if (o.appendOptions) {
                opt = $("<div>").addClass("append-options").appendTo(container);
                opt.append(ul = $("<select data-role='select'>").addClass("options-list"))
                o.appendOptions.toArray(o.appendOptionsSep).forEach(function(item){
                    $("<option>").attr("value", item).html(item).appendTo(ul)
                })
                this.appendOptionsList = ul;
            }

            const customButtons = Metro.utils.isObject(o.customButtons);
            if (Array.isArray(customButtons)) {
                $.each(customButtons, function(){
                    const item = this;
                    const btn = $("<button>");

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

            if (Metro.utils.isValue(element.attr('data-exclaim'))) {
                container.attr('data-exclaim', element.attr('data-exclaim'));
            }

            if (element.attr('dir') === 'rtl' ) {
                container.addClass("rtl").attr("dir", "rtl");
            }

            element[0].className = '';

            container.addClass(o.clsComponent);
            element.addClass(o.clsInput);

            if (o.size !== "default") {
                container.css({
                    width: o.size
                });
            }

            if (!Metro.utils.isNull(o.autocomplete) || !Metro.utils.isNull(o.autocompleteUrl)) {
                $("<div>").addClass("autocomplete-list").css({
                    maxHeight: o.autocompleteListHeight,
                    display: "none"
                }).appendTo(container);
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
                    method: o.autocompleteUrlMethod
                }).then(function(response){
                    return response.text()
                }).then(function(data){
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

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(container);
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
            const that = this, element = this.element, o = this.options;
            const container = element.closest(".input");
            const autocompleteList = container.find(".autocomplete-list");

            container.on(Metro.events.click, ".input-clear-button", function(){
                const curr = element.val();
                element.val(Metro.utils.isValue(o.defaultValue) ? o.defaultValue : "").fire('clear').fire('change').fire('keyup').focus();
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
                    console.log("Search button clicked");
                    that._fireEvent("search-button-click", {
                        val: that.val(),
                        button: this
                    });
                } else {
                    if (this.form) this.form.submit();
                }
            });

            container.on(Metro.events.click, ".input-random-button", function(){
                const val = that._generateRandomValue();
                element.val(val).fire('change').fire('keyup').focus();
                that._fireEvent("random-click", {
                    val,
                });
            });

            element.on(Metro.events.keyup, function(e){
                const val = element.val().trim();

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
                const val = this.value.toLowerCase();
                that._drawAutocompleteList(val);
            });

            container.on(Metro.events.click, ".autocomplete-list .item", function(){
                const val = $(this).attr("data-autocomplete-value");
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

        _generateRandomValue: function(){
            const o = this.options;
            const groups = o.randomSymbols.split(";");
            const symbolsPerGroup = Math.round(o.randomLength / groups.length)
            let val = [];
            
            for (const g of groups) {
                const symbols = g.split("");
                const len = symbols.length;
                for(let i = 0; i < symbolsPerGroup; i++) {
                    val.push( symbols[Math.floor(Math.random() * len)] );
                }                
            }

            return val.shuffle().join("");
        },
        
        _drawAutocompleteList: function(val){
            const that = this, element = this.element;
            const container = element.closest(".input");
            const autocompleteList = container.find(".autocomplete-list");
            let items;

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
                const v = this;
                let index = v.toLowerCase().indexOf(val), content;
                const item = $("<div>").addClass("item").attr("data-autocomplete-value", v);

                if (index === 0) {
                    content = "<strong>"+v.substring(0, val.length)+"</strong>"+v.substring(val.length);
                } else {
                    content = v.substring(0, index) + "<strong>"+v.substring(index, val.length)+"</strong>"+v.substring(index + val.length);
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
            const that = this, o = this.options;
            if (Metro.utils.isNull(history)) return;
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
            this.element.val(Metro.utils.isValue(this.options.defaultValue) ? this.options.defaultValue : "");
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
            const autocomplete_list = Metro.utils.isObject(l);
            if (autocomplete_list !== false) {
                this.autocomplete = autocomplete_list;
            } else if (typeof l === "string") {
                this.autocomplete = l.toArray(this.options.autocompleteDivider);
            }
        },

        val: function(v, splitter = ";"){
            const element = this.element, o = this.options;
            if (!Metro.utils.isValue(v)) {
                let val = element.val();
                if (o.prependOptions) {
                    val = this.prependOptionsList.val() + val;
                }
                if (o.appendOptions) {
                    val = val + this.appendOptionsList.val();
                }
                return val
            }
            
            const groups = v.split(splitter)
            let prepend = "", append = "", val;
            if (o.prependOptions) {
                prepend = groups.shift();
                Metro.getPlugin(this.prependOptionsList, "select").val(prepend);
                console.log(prepend)
            }
            if (o.appendOptions) {
                append = groups.pop();
                Metro.getPlugin(this.appendOptionsList, "select").val(append);
            }
            val = groups.join("");
            element.val(val);
        },
        
        prependOptionsVal: function(v){
            if (!this.options.prependOptions) { return; }
            if (!Metro.utils.isValue(v)) {
                this.prependOptionsList.val();
            }
            this.prependOptionsList.val(v);
        },
        
        appendOptionsVal: function(v){
            if (!this.options.appendOptions) { return; }
            if (!Metro.utils.isValue(v)) {
                return this.appendOptionsList.val();
            }
            this.appendOptionsList.val(v);
        },
        
        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'disabled': this.toggleState(); break;
            }
        },

        destroy: function(){
            const element = this.element;
            const parent = element.parent();
            const clearBtn = parent.find(".input-clear-button");
            const revealBtn = parent.find(".input-reveal-button");
            const customBtn = parent.find(".input-custom-button");

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
}(Metro, Dom));