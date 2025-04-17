/**
 * global Metro
 *
 * @format
 */

(function (Metro, $) {
    "use strict";

    let ColorPickerDefaultConfig = {
        defaultSwatches: "#FFFFFF,#000000,#FFFB0D,#0532FF,#FF9300,#00F91A,#FF2700,#686868,#EE5464,#D27AEE,#5BA8C4,#E64AA9,#1ba1e2,#6a00ff,#bebebe,#f8f8f8",
        duration: 100,
        prepend: "",
        append: "",
        label: "",
        clearButton: false,
        clearButtonIcon: "❌",
        pickerButtonIcon: "🎨",
        defaultValue: "rgba(0, 0, 0, 0)",
        openMode: "auto",
        resultType: "hex",
        inputThreshold: 500,
        onColorSelected: Metro.noop,
        onColorPickerCreate: Metro.noop,
    };

    Metro.colorPickerSetup = function (options) {
        ColorPickerDefaultConfig = $.extend({}, ColorPickerDefaultConfig, options);
    };

    if (typeof globalThis["metroColorPickerSetup"] !== "undefined") {
        Metro.colorPickerSetup(globalThis["metroColorPickerSetup"]);
    }

    Metro.Component("color-picker", {
        init: function (options, elem) {
            this._super(
                elem,
                options,
                $.extend(
                    {},
                    Metro.defaults.ColorSelector,
                    {
                        showUserColors: false,
                        showValues: "",
                    },
                    ColorPickerDefaultConfig,
                ),
                {
                    value: null,
                    picker: null,
                    colorSelector: null,
                    colorSelectorBox: null,
                    colorExample: null,
                    inputInterval: null,
                    isOpen: false,
                },
            );
            return this;
        },

        _create: function () {
            const element = this.element,
                o = this.options;
            const current = element.val();

            if (!Metro.pluginExists("color-selector")) {
                throw new Error("Color selector component required!");
            }

            this.value = Farbe.Routines.isColor(current) ? current : Farbe.Routines.isColor(o.defaultValue) ? o.defaultValue : "rgba(0,0,0,0)";

            this._createStructure();
            this._createEvents();

            this._fireEvent("color-picker-create");
        },

        _createStructure: function () {
            const that = this,
                element = this.element,
                o = this.options;
            const picker = element.wrap($("<div>").addClass("color-picker").addClass(element[0].className));
            let buttons, colorExample, colorSelector, colorSelectorBox;

            colorExample = $("<div>").addClass("color-example-box").insertBefore(element);

            buttons = $("<div>").addClass("buttons").appendTo(picker);

            buttons.append(
                $("<button>")
                    .addClass("button color-picker-button")
                    .attr("tabindex", -1)
                    .attr("type", "button")
                    .html(o.pickerButtonIcon),
            );

            if (o.clearButton === true && !element[0].readOnly) {
                buttons.append(
                    $("<button>")
                        .addClass("button input-clear-button")
                        .addClass(o.clsClearButton)
                        .attr("tabindex", -1)
                        .attr("type", "button")
                        .html(o.clearButtonIcon),
                );
            }

            if (Metro.utils.isValue(o.prepend)) {
                picker.prepend($("<div>").addClass("prepend").addClass(o.clsPrepend).html(o.prepend));
            }

            if (Metro.utils.isValue(o.append)) {
                picker.append($("<div>").html(o.append).addClass("append").addClass(o.clsAppend));
            }

            colorSelectorBox = $("<div>").addClass("color-selector-box").appendTo(picker);
            colorSelector = $("<div>").appendTo(colorSelectorBox);

            this.picker = picker;
            this.colorExample = colorExample;
            this.colorSelector = colorSelector;
            this.colorSelectorBox = colorSelectorBox;

            Metro.makePlugin(colorSelector, "color-selector", {
                defaultSwatches: o.defaultSwatches,
                returnValueType: o.resultType,
                returnAsString: true,
                showUserColors: false,
                showValues: "",
                controller: element,
                showAlphaChannel: true,
                inputThreshold: o.inputThreshold,
                initColor: this.value,
                readonlyInput: o.readonlyInput,
                onSelectColor: (color) => {
                    this.colorExample.css({
                        backgroundColor: color,
                    });
                },
                onColorSelectorCreate: o.onColorSelectorCreate,
            });

            Metro.makePlugin(colorSelectorBox, "dropdown", {
                dropFilter: ".color-picker",
                duration: o.duration,
                toggleElement: [picker],
                checkDropUp: true,
                onDrop: function () {
                    Metro.getPlugin(colorSelector, "color-selector").val(that.value);
                },
            });

            element[0].className = "";

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(picker);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                } else {
                    const id = Hooks.useId(element[0])
                    label.attr("for", id);
                    element.attr("id", id);
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }
            
            this._setColor();
        },

        _clearInputInterval: function () {
            clearInterval(this.inputInterval);
            this.inputInterval = false;
        },

        _setColor: function () {
            const colorExample = this.colorExample;
            let color = this.value;

            if (this.value.indexOf("cmyk") !== -1 || this.value.indexOf("hsv") !== -1) {
                color = Farbe.Routines.toHEX(this.value);
            }

            console.log(color);
            
            colorExample.css({
                backgroundColor: color,
            });
        },

        _createEvents: function () {
            const that = this,
                element = this.element,
                o = this.options;
            const picker = this.picker,
                colorSelector = this.colorSelector,
                colorSelectorBox = this.colorSelector;

            picker.on(Metro.events.click, ".input-clear-button", function (e) {
                e.preventDefault();
                e.stopPropagation();
                element.val(o.defaultValue).trigger("change");
                Metro.getPlugin(colorSelector, "color-selector").val(o.defaultValue);
            });

            element.on(Metro.events.inputchange, function () {
                that.value = this.value;
                that._setColor();
            });

            colorSelectorBox.on(Metro.events.click, function (e) {
                e.stopPropagation();
            });
        },

        val: function (v) {
            if (arguments.length === 0 || !Metro.utils.isValue(v)) {
                return this.value;
            }

            if (!Farbe.Routines.isColor(v)) {
                return;
            }

            this.value = v;
            this.element.val(v).trigger("change");
            this._setColor();
        },

        // changeAttribute: function(attr, newValue){
        // },

        destroy: function () {
            const element = this.element, o = this.options;
            const parent = element.parent();
            if (o.label) {
                parent.prev("label").remove()
            }
            parent.remove()
        },
    });

    $(document).on(Metro.events.click, function () {
        $(".color-picker").removeClass("open");
    });
})(Metro, Dom);
