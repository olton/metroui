((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let MaterialInputDefaultConfig = {
        materialInputDeferred: 0,

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
        searchButtonClick: "submit",

        clsComponent: "",
        clsInput: "",
        clsLabel: "",
        clsInformer: "",
        clsIcon: "",
        clsLine: "",

        onInputCreate: Metro.noop,
    };

    Metro.materialInputSetup = (options) => {
        MaterialInputDefaultConfig = $.extend({}, MaterialInputDefaultConfig, options);
    };

    if (typeof globalThis.metroMaterialInputSetup !== "undefined") {
        Metro.materialInputSetup(globalThis.metroMaterialInputSetup);
    }

    Metro.Component("material-input", {
        init: function (options, elem) {
            this._super(elem, options, MaterialInputDefaultConfig, {
                history: [],
                historyIndex: -1,
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("input-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            let container;
            let buttons;

            element[0].className = "";
            element.attr("autocomplete", "nope");

            if (element.attr("type") === undefined) {
                element.attr("type", "text");
            }

            container = element.wrap("<div>").addClass(`input-material ${element[0].className}`);
            buttons = $("<div>").addClass("buttons").appendTo(container);

            if (o.label) {
                $("<span>").html(o.label).addClass("label").addClass(o.clsLabel).insertAfter(element);
            }
            if (Metro.utils.isValue(o.informer)) {
                $("<span>").html(o.informer).addClass("informer").addClass(o.clsInformer).insertAfter(element);
            }
            if (Metro.utils.isValue(o.icon)) {
                container.addClass("with-icon");
                $("<span>").html(o.icon).addClass("icon").addClass(o.clsIcon).insertAfter(element);
            }

            if (o.clearButton === true && !element[0].readOnly) {
                const clearButton = $("<button>")
                    .addClass("button input-clear-button")
                    .addClass(o.clsClearButton)
                    .attr("tabindex", -1)
                    .attr("type", "button")
                    .html(o.clearButtonIcon);
                clearButton.appendTo(buttons);
            }
            if (element.attr("type") === "password" && o.revealButton === true) {
                const revealButton = $("<button>")
                    .addClass("button input-reveal-button")
                    .addClass(o.clsRevealButton)
                    .attr("tabindex", -1)
                    .attr("type", "button")
                    .html(o.revealButtonIcon);
                revealButton.appendTo(buttons);
            }
            if (o.searchButton === true) {
                const searchButton = $("<button>")
                    .addClass("button input-search-button")
                    .addClass(o.clsSearchButton)
                    .attr("tabindex", -1)
                    .attr("type", o.searchButtonClick === "submit" ? "submit" : "button")
                    .html(o.searchButtonIcon);
                searchButton.appendTo(buttons);
            }

            const customButtons = Metro.utils.isObject(o.customButtons);
            if (Array.isArray(customButtons)) {
                $.each(customButtons, function () {
                    const btn = $("<button>");

                    btn.addClass("button input-custom-button")
                        .addClass(o.clsCustomButton)
                        .addClass(this.cls)
                        .attr("tabindex", -1)
                        .attr("type", "button")
                        .html(this.text);

                    if (this.attr && typeof this.attr === "object") {
                        $.each(this.attr, (k, v) => {
                            btn.attr(Str.dashedName(k), v);
                        });
                    }

                    if (this.onclick)
                        btn.on("click", () => {
                            this.onclick.apply(btn, [element.valueOf(), element]);
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

            this.component = container;
        },

        _createEvents: function () {
            const that = this;
            const o = this.options;
            const element = this.element;

            this.component.on(Metro.events.click, ".input-clear-button", () => {
                const curr = element.val();
                element.val("").fire("clear").fire("change").fire("keyup").focus();

                that._fireEvent("clear-click", {
                    prev: curr,
                });
            });

            this.component.on(Metro.events.click, ".input-reveal-button", () => {
                if (element.attr("type") === "password") {
                    element.attr("type", "text");
                } else {
                    element.attr("type", "password");
                }

                that._fireEvent("reveal-click", {
                    val: element.val(),
                });
            });

            this.component.on(Metro.events.click, ".input-search-button", function () {
                if (o.searchButtonClick !== "submit") {
                    that._fireEvent("search-button-click", {
                        val: element.val(),
                        button: this,
                    });
                } else {
                    if (this.form) this.form.submit();
                }
            });

            element.on(Metro.events.keydown, (e) => {
                if (e.keyCode === Metro.keyCode.ENTER) {
                    that._fireEvent("enter-click", {
                        val: element.val(),
                    });
                }
            });
        },

        clear: function () {
            this.element.val("");
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

        changeAttribute: function (attributeName) {
            if (attributeName === "disabled") {
                this.toggleState();
            }
        },

        destroy: function () {
            return this.element;
        },
    });
})(Metro, Dom);
