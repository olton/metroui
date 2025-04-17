/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var MaterialInputDefaultConfig = {
        materialinputDeferred: 0,
        
        label: "",
        informer: "",
        icon: "",

        permanentLabel: false,

        searchButton: false,
        clearButton: true,
        revealButton: true,
        clearButtonIcon: "❌",
        revealButtonIcon: "👀",
        searchButtonIcon: "🔍",
        customButtons: [],
        searchButtonClick: 'submit',

        clsComponent: "",
        clsInput: "",
        clsLabel: "",
        clsInformer: "",
        clsIcon: "",
        clsLine: "",

        onInputCreate: Metro.noop
    };

    Metro.materialInputSetup = function (options) {
        MaterialInputDefaultConfig = $.extend({}, MaterialInputDefaultConfig, options);
    };

    if (typeof globalThis["metroMaterialInputSetup"] !== "undefined") {
        Metro.materialInputSetup(globalThis["metroMaterialInputSetup"]);
    }

    Metro.Component('material-input', {
        init: function( options, elem ) {
            this._super(elem, options, MaterialInputDefaultConfig, {
                history: [],
                historyIndex: -1
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
            var element = this.element, o = this.options;
            var container;
            var buttons;

            element[0].className = "";
            element.attr("autocomplete", "nope");

            if (element.attr("type") === undefined) {
                element.attr("type", "text");
            }

            container = element.wrap("<div>").addClass("input-material " + element[0].className);
            buttons = $("<div>").addClass("buttons").appendTo(container);

            if (o.label) {
                $("<span>").html(o.label).addClass("label").addClass(o.clsLabel).insertAfter(element);
            }
            if (Utils.isValue(o.informer)) {
                $("<span>").html(o.informer).addClass("informer").addClass(o.clsInformer).insertAfter(element);
            }
            if (Utils.isValue(o.icon)) {
                container.addClass("with-icon");
                $("<span>").html(o.icon).addClass("icon").addClass(o.clsIcon).insertAfter(element);
            }

            if (o.clearButton === true && !element[0].readOnly) {
                const clearButton = $("<button>").addClass("button input-clear-button").addClass(o.clsClearButton).attr("tabindex", -1).attr("type", "button").html(o.clearButtonIcon);
                clearButton.appendTo(buttons);
            }
            if (element.attr('type') === 'password' && o.revealButton === true) {
                const revealButton = $("<button>").addClass("button input-reveal-button").addClass(o.clsRevealButton).attr("tabindex", -1).attr("type", "button").html(o.revealButtonIcon);
                revealButton.appendTo(buttons);
            }
            if (o.searchButton === true) {
                const searchButton = $("<button>").addClass("button input-search-button").addClass(o.clsSearchButton).attr("tabindex", -1).attr("type", o.searchButtonClick === 'submit' ? "submit" : "button").html(o.searchButtonIcon);
                searchButton.appendTo(buttons);
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
            
            container.append($("<hr>").addClass(o.clsLine));

            if (o.permanentLabel === true) {
                container.addClass("permanent-label");
            }

            container.addClass(o.clsComponent);
            element.addClass(o.clsInput);

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }
            
            this.component = container
        },

        _createEvents: function(){
            const that = this, o = this.options
            const element = this.element;
            
            this.component.on(Metro.events.click, ".input-clear-button", function(){
                const curr = element.val();
                element.val("").fire('clear').fire('change').fire('keyup').focus();

                that._fireEvent("clear-click", {
                    prev: curr,
                });
            });

            this.component.on(Metro.events.click, ".input-reveal-button", function(){
                if (element.attr('type') === 'password') {
                    element.attr('type', 'text');
                } else {
                    element.attr('type', 'password');
                }

                that._fireEvent("reveal-click", {
                    val: element.val()
                });
            });

            this.component.on(Metro.events.click, ".input-search-button", function(){
                if (o.searchButtonClick !== 'submit') {
                    that._fireEvent("search-button-click", {
                        val: element.val(),
                        button: this
                    });
                } else {
                    if (this.form) this.form.submit();
                }
            });

            element.on(Metro.events.keydown, function(e){
                if (e.keyCode === Metro.keyCode.ENTER) {
                    that._fireEvent("enter-click", {
                        val: element.val()
                    });
                }
            });
        },

        clear: function(){
            this.element.val('');
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

        changeAttribute: function(attributeName){
            if (attributeName === 'disabled') {
                this.toggleState();
            }
        },

        destroy: function(){
            return this.element;
        }
    });
}(Metro, Dom));