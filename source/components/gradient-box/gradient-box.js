((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let GradientBoxDefaultConfig = {
        gradientType: "linear", // linear, radial
        gradientShape: "",
        gradientPosition: "",
        gradientSize: "",
        gradientColors: "#000, #fff",
        gradientRepeat: false,
        onGradientBoxCreate: Metro.noop,
    };

    Metro.gradientBoxSetup = (options) => {
        GradientBoxDefaultConfig = $.extend(
            {},
            GradientBoxDefaultConfig,
            options,
        );
    };

    if (typeof globalThis.metroGradientBoxSetup !== "undefined") {
        Metro.gradientBoxSetup(globalThis.metroGradientBoxSetup);
    }

    Metro.Component("gradient-box", {
        init: function (options, elem) {
            this._super(elem, options, GradientBoxDefaultConfig, {
                // define instance vars here
                colors: [],
                shape: "",
                size: "",
                position: "",
                type: "linear",
                func: "linear-gradient",
                repeat: false,
            });
            return this;
        },

        _create: function () {
            const o = this.options;

            this.colors = o.gradientColors.toArray(",");
            this.type = o.gradientType.toLowerCase();
            this.shape = o.gradientShape.toLowerCase();
            this.size = o.gradientSize.toLowerCase();
            this.repeat = o.gradientRepeat;
            this.func = `${(this.repeat ? "repeating-" : "") + this.type}-gradient`;

            if (this.type === "linear") {
                if (!o.gradientPosition) {
                    this.position = "to bottom";
                } else {
                    this.position =
                        Number.
                        isNaN(o.gradientPosition) === false
                            ? `${o.gradientPosition}deg`
                            : o.gradientPosition;

                    if (
                        this.position.indexOf("deg") === -1 &&
                        this.position.indexOf("to ") === -1
                    ) {
                        this.position = `to ${this.position}`;
                    }
                }
            } else {
                this.position = o.gradientPosition.toLowerCase();
                if (this.position && this.position.indexOf("at ") === -1) {
                    this.position = `at ${this.position}`;
                }
            }

            this._createStructure();
            this._setGradient();
            this._fireEvent("gradient-box-create");
        },

        _createStructure: function () {
            this.element.addClass("gradient-box");
        },

        _setGradient: function () {
            const element = this.element;
            const gradientOptions = [];

            if (this.type === "radial" && this.shape) {
                gradientOptions.push(this.shape);
            }

            if (this.type === "radial" && this.size) {
                gradientOptions.push(this.size);
            }

            if (this.position) {
                //gradientOptions.push((this.position.indexOf("at") === -1 ? "at " : "") + this.position);
            }

            const gradientRule = `${this.func}(${gradientOptions.length
                ? `${gradientOptions.join(" ")}, `
                : ""}${this.colors.join(", ")})`
            element.css({
                background: gradientRule,
            });
        },

        changeAttribute: function (attr, newValue) {
            if (attr.indexOf("data-gradient-") === -1) {
                return;
            }

            switch (attr) {
                case "data-gradient-type":
                    this.type = newValue;
                    this.func = `${newValue.toLowerCase()}-gradient`;
                    break;
                case "data-gradient-colors-css":
                    this.colors = newValue
                        ? newValue.toArray(",")
                        : ["#fff", "#000"];
                    break;
                case "data-gradient-shape":
                    this.shape = newValue.toLowerCase();
                    break;
                case "data-gradient-size":
                    this.size = newValue.toLowerCase();
                    break;
                case "data-gradient-position":
                    this.position = newValue.toLowerCase();
                    break;
                case "data-gradient-repeat":
                    this.repeat = Metro.utils.bool(newValue);
                    break;
            }

            this._setGradient();
        },

        destroy: function () {
            return this.element;
        },
    });
})(Metro, Dom);
