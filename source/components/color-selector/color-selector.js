(function (Metro, $) {
    "use strict";

    const supportedColorTypes = "hex, rgb, rgba, hsl, hsla, hsv, cmyk";
    let ColorSelectorDefaultConfig = {
        defaultSwatches: "#FFFFFF,#000000,#FFFB0D,#0532FF,#FF9300,#00F91A,#FF2700,#686868,#EE5464,#D27AEE,#5BA8C4,#E64AA9,#1ba1e2,#6a00ff,#bebebe,#f8f8f8",
        userColors: null,
        returnValueType: "hex",
        returnAsString: true,
        showValues: supportedColorTypes,
        showAsString: null,
        showUserColors: true,
        controller: null,
        addUserColorTitle: null,
        userColorsTitle: null,
        hslMode: "percent",
        showAlphaChannel: true,
        inputThreshold: 300,
        initColor: null,
        readonlyInput: false,
        clsSelector: "",
        clsSwatches: "",
        clsSwatch: "",
        clsValue: "",
        clsLabel: "",
        clsInput: "",
        clsUserColorButton: "",
        clsUserColors: "",
        clsUserColorsTitle: "",
        clsUserColor: "",
        onSelectColor: Metro.noop,
        onColorSelectorCreate: Metro.noop,
    };

    Metro.colorSelectorSetup = function (options) {
        ColorSelectorDefaultConfig = $.extend({}, ColorSelectorDefaultConfig, options);
    };

    if (typeof globalThis["metroColorSelectorSetup"] !== "undefined") {
        Metro.colorSelectorSetup(globalThis["metroColorSelectorSetup"]);
    }

    Metro.Component("color-selector", {
        init: function (options, elem) {
            this._super(elem, options, ColorSelectorDefaultConfig, {
                // define instance vars here
                id: Metro.utils.elementId("color-selector"),
                defaultSwatches: [],
                showValues: [],
                userColors: [],
                showAsString: [],
                hue: 0,
                saturation: 0,
                lightness: 1,
                alpha: 1,
                hsl: null,
                hsla: null,
                hsv: null,
                rgb: null,
                rgba: null,
                cmyk: null,
                hex: null,
                inputInterval: null,
                controller: null,
            });
            return this;
        },

        _create: function () {
            const o = this.options;

            if (Metro.utils.isValue(o.defaultSwatches))
                this.defaultSwatches = o.defaultSwatches.toArray(",").map(function (el) {
                    return el.toUpperCase();
                });
            if (Metro.utils.isValue(o.showValues)) this.showValues = o.showValues.toArray(",");
            if (Metro.utils.isValue(o.userColors))
                this.userColors = o.userColors.toArray(",").map(function (el) {
                    return el.toUpperCase();
                });
            if (Metro.utils.isValue(o.showAsString)) this.showAsString = o.showAsString.toArray(",");

            this._createStructure();
            this._createEvents();
            this._setColorValues();
            this._fireEvent("color-selector-create");
        },

        _createStructure: function () {
            const that = this,
                element = this.element,
                o = this.options,
                strings = this.strings;
            let colorBox,
                row,
                swatches,
                map,
                value,
                inputs,
                radios,
                userColorsActions,
                hueCanvas,
                shadeCanvas,
                hueCursor,
                shadeCursor,
                colorBlock,
                alphaCanvas,
                alphaCursor;

            element.addClass("color-selector").addClass(o.clsSelector);

            element.append((colorBox = $("<div>").addClass("color-box")));

            colorBox.append((row = $("<div>").addClass("row")));

            row.append((swatches = $("<div>").addClass("default-swatches").addClass(o.clsSwatches)));
            $.each(this.defaultSwatches, function () {
                swatches.append(
                    $("<button>").attr("data-color", this).attr("type", "button").addClass("swatch").addClass(o.clsSwatch).css("background-color", this),
                );
            });

            colorBox.append((row = $("<div>").addClass("row")));

            row.append((map = $("<div>").addClass("color-map")));
            map.append((shadeCursor = $("<button>").attr("type", "button").addClass("cursor color-cursor dragging")));
            map.append((shadeCanvas = $("<canvas>").addClass("color-canvas")));

            row.append((map = $("<div>").addClass("hue-map")));
            map.append((hueCursor = $("<button>").attr("type", "button").addClass("cursor hue-cursor dragging")));
            map.append((hueCanvas = $("<canvas>").addClass("hue-canvas")));

            row.append((map = $("<div>").addClass("alpha-map")));
            map.append((alphaCursor = $("<button>").attr("type", "button").addClass("cursor alpha-cursor dragging")));
            map.append((alphaCanvas = $("<canvas>").addClass("alpha-canvas")));

            colorBox.append((row = $("<div>").addClass("row color-values-block")));

            row.append((value = $("<div>").addClass("color-value-hex")));
            value.append($("<input type='radio' name='returnType' value='hex' checked>").addClass("check-color-value-hex"));
            value.append((colorBlock = $("<div>").addClass("color-block as-string color-hex")));
            colorBlock.append($("<input type='text' data-prepend='HEX:'>").addClass("input-small value-hex"));

            row.append((value = $("<div>").addClass("color-value-rgb")));
            value.append($("<input type='radio' name='returnType' value='rgb'>").addClass("check-color-value-rgb"));
            value.append((colorBlock = $("<div>").addClass("color-block color-rgb")));
            colorBlock.append($("<input type='text' data-prepend='R:'>").addClass("input-small value-r"));
            colorBlock.append($("<input type='text' data-prepend='G:'>").addClass("input-small value-g"));
            colorBlock.append($("<input type='text' data-prepend='B:'>").addClass("input-small value-b"));
            value.append((colorBlock = $("<div>").addClass("color-block as-string color-rgb")));
            colorBlock.append($("<input type='text' data-prepend='RGB:'>").addClass("input-small value-rgb"));

            if (this.showAsString.indexOf("rgb") > -1) {
                value.find(".value-r,.value-g,.value-b").parent().hide();
            } else {
                value.find(".value-rgb").parent().hide();
            }

            row.append((value = $("<div>").addClass("color-value-rgba")));
            value.append($("<input type='radio' name='returnType' value='rgba'>").addClass("check-color-value-rgba"));
            value.append((colorBlock = $("<div>").addClass("color-block color-rgba")));
            colorBlock.append($("<input type='text' data-prepend='R:'>").addClass("input-small value-r"));
            colorBlock.append($("<input type='text' data-prepend='G:'>").addClass("input-small value-g"));
            colorBlock.append($("<input type='text' data-prepend='B:'>").addClass("input-small value-b"));
            colorBlock.append($("<input type='text' data-prepend='A:'>").addClass("input-small value-a"));
            value.append((colorBlock = $("<div>").addClass("color-block as-string color-rgba")));
            colorBlock.append($("<input type='text' data-prepend='RGBA:'>").addClass("input-small value-rgba"));

            if (this.showAsString.indexOf("rgba") > -1) {
                value.find(".value-r,.value-g,.value-b,.value-a").parent().hide();
            } else {
                value.find(".value-rgba").parent().hide();
            }

            row.append((value = $("<div>").addClass("color-value-hsl")));
            value.append($("<input type='radio' name='returnType' value='hsl'>").addClass("check-color-value-hsl"));
            value.append((colorBlock = $("<div>").addClass("color-block color-hsl")));
            colorBlock.append($("<input type='text' data-prepend='H:'>").addClass("input-small value-h"));
            colorBlock.append($("<input type='text' data-prepend='S:'>").addClass("input-small value-s"));
            colorBlock.append($("<input type='text' data-prepend='L:'>").addClass("input-small value-l"));
            value.append((colorBlock = $("<div>").addClass("color-block as-string color-hsl")));
            colorBlock.append($("<input type='text' data-prepend='HSL:'>").addClass("input-small value-hsl"));

            if (this.showAsString.indexOf("hsl") > -1) {
                value.find(".value-h,.value-s,.value-l").parent().hide();
            } else {
                value.find(".value-hsl").parent().hide();
            }

            row.append((value = $("<div>").addClass("color-value-hsla")));
            value.append($("<input type='radio' name='returnType' value='hsla'>").addClass("check-color-value-hsla"));
            value.append((colorBlock = $("<div>").addClass("color-block color-hsla")));
            colorBlock.append($("<input type='text' data-prepend='H:'>").addClass("input-small value-h"));
            colorBlock.append($("<input type='text' data-prepend='S:'>").addClass("input-small value-s"));
            colorBlock.append($("<input type='text' data-prepend='L:'>").addClass("input-small value-l"));
            colorBlock.append($("<input type='text' data-prepend='A:'>").addClass("input-small value-a"));
            value.append((colorBlock = $("<div>").addClass("color-block as-string color-hsla")));
            colorBlock.append($("<input type='text' data-prepend='HSLA:'>").addClass("input-small value-hsla"));

            if (this.showAsString.indexOf("hsla") > -1) {
                value.find(".value-h,.value-s,.value-l,.value-a").parent().hide();
            } else {
                value.find(".value-hsla").parent().hide();
            }

            row.append((value = $("<div>").addClass("color-value-hsv")));
            value.append($("<input type='radio' name='returnType' value='hsv'>").addClass("check-color-value-hsl"));
            value.append((colorBlock = $("<div>").addClass("color-block color-hsv")));
            colorBlock.append($("<input type='text' data-prepend='H:'>").addClass("input-small value-h"));
            colorBlock.append($("<input type='text' data-prepend='S:'>").addClass("input-small value-s"));
            colorBlock.append($("<input type='text' data-prepend='V:'>").addClass("input-small value-v"));
            value.append((colorBlock = $("<div>").addClass("color-block as-string color-hsv")));
            colorBlock.append($("<input type='text' data-prepend='HSV:'>").addClass("input-small value-hsv"));

            if (this.showAsString.indexOf("hsv") > -1) {
                value.find(".value-h,.value-s,.value-v").parent().hide();
            } else {
                value.find(".value-hsv").parent().hide();
            }

            row.append((value = $("<div>").addClass("color-value-cmyk")));
            value.append($("<input type='radio' name='returnType' value='cmyk'>").addClass("check-color-value-cmyk"));
            value.append((colorBlock = $("<div>").addClass("color-block color-cmyk")));
            colorBlock.append($("<input type='text' data-prepend='C:'>").addClass("input-small value-c"));
            colorBlock.append($("<input type='text' data-prepend='M:'>").addClass("input-small value-m"));
            colorBlock.append($("<input type='text' data-prepend='Y:'>").addClass("input-small value-y"));
            colorBlock.append($("<input type='text' data-prepend='K:'>").addClass("input-small value-k"));
            value.append((colorBlock = $("<div>").addClass("color-block as-string color-cmyk")));
            colorBlock.append($("<input type='text' data-prepend='CMYK:'>").addClass("input-small value-cmyk"));

            if (this.showAsString.indexOf("cmyk") > -1) {
                value.find(".value-s,.value-m,.value-y,.value-k").parent().hide();
            } else {
                value.find(".value-cmyk").parent().hide();
            }

            colorBox.append((row = $("<div>").addClass("row user-colors-css-container")));
            row.append(
                $("<div>")
                    .addClass("user-colors-title")
                    .addClass(o.clsUserColorsTitle)
                    .html(o.userColorsTitle || strings["label_user_colors"]),
            );
            row.append($("<div>").addClass("user-colors").addClass(o.clsUserColors));
            row.append((userColorsActions = $("<div>").addClass("user-colors-actions")));
            userColorsActions.append(
                $("<button>")
                    .addClass("button add-button")
                    .addClass(o.clsUserColorButton)
                    .html("<span class='user-swatch'></span><span>" + (o.addUserColorTitle || strings["label_add_user_color"]) + "</span>"),
            );

            inputs = colorBox.find("input[type=text]");
            Metro.makePlugin(inputs, "input", {
                clearButton: false,
                clsPrepend: o.clsLabel,
                clsComponent: o.clsInput,
            });
            inputs.addClass(o.clsValue);

            if (o.readonlyInput) {
                inputs.attr("readonly", true);
            }

            radios = colorBox.find("input[type=radio]").each(function () {
                $(this).attr("name", that.id + "-returnType");
            });
            radios.each(function () {
                if ($(this).val() === o.returnValueType) {
                    this.checked = true;
                }
            });
            Metro.makePlugin(radios, "radio");

            $.each(supportedColorTypes.toArray(","), function () {
                if (that.showValues.indexOf(this) === -1) element.find(".color-value-" + this).hide();
            });

            if (!o.showUserColors) {
                element.find(".user-colors-css-container").hide();
            }

            if (!o.showAlphaChannel) {
                element.addClass("no-alpha-channel");
                $.each(["rgba", "hsla"], function () {
                    element.find(".color-value-" + this).hide();
                });
            }

            this._fillUserColors();

            this.hueCanvas = hueCanvas;
            this.hueCursor = hueCursor;
            this.shadeCanvas = shadeCanvas;
            this.shadeCursor = shadeCursor;
            this.alphaCanvas = alphaCanvas;
            this.alphaCursor = alphaCursor;

            this._createShadeCanvas();
            this._createHueCanvas();
            this._createAlphaCanvas();
            this._setColorValues();
            this._updateCursorsColor();

            if (o.initColor && Farbe.Routines.isColor(o.initColor)) {
                this._colorToPos(typeof o.initColor === "string" ? Farbe.Routines.parse(o.initColor) : o.initColor);
            }

            this.controller = o.controller ? $(o.controller) : null;
        },

        _createShadeCanvas: function (color) {
            const canvas = this.shadeCanvas[0];
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!color) color = "#f00";

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            whiteGradient.addColorStop(0, "#fff");
            whiteGradient.addColorStop(1, "transparent");
            ctx.fillStyle = whiteGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            blackGradient.addColorStop(0, "transparent");
            blackGradient.addColorStop(1, "#000");
            ctx.fillStyle = blackGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },

        _createHueCanvas: function () {
            const canvas = this.hueCanvas[0];
            const ctx = canvas.getContext("2d");
            const hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

            hueGradient.addColorStop(0.0, "hsl(0,100%,50%)");
            hueGradient.addColorStop(0.17, "hsl(298.8, 100%, 50%)");
            hueGradient.addColorStop(0.33, "hsl(241.2, 100%, 50%)");
            hueGradient.addColorStop(0.5, "hsl(180, 100%, 50%)");
            hueGradient.addColorStop(0.67, "hsl(118.8, 100%, 50%)");
            hueGradient.addColorStop(0.83, "hsl(61.2,100%,50%)");
            hueGradient.addColorStop(1.0, "hsl(360,100%,50%)");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = hueGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },

        _createAlphaCanvas: function () {
            const canvas = this.alphaCanvas[0];
            const ctx = canvas.getContext("2d");
            const alphaGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            const startColor = new Farbe.Primitives.HSLA(this.hue, 1, 0.5, 1).toString(),
                endColor = "rgba(0,0,0,0)";

            alphaGradient.addColorStop(0.0, startColor);
            alphaGradient.addColorStop(1.0, endColor);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = alphaGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },

        _updateHueCursor: function (y) {
            this.hueCursor.css({
                top: y,
            });
        },

        _updateAlphaCursor: function (y) {
            this.alphaCursor.css({
                top: y,
            });
        },

        _getHueColor: function (pageY) {
            const canvas = this.hueCanvas;
            const offset = canvas.offset();
            const height = canvas.height();
            let y, percent, color, hue;

            y = pageY - offset.top;

            if (y > height) y = height;
            if (y < 0) y = 0;

            percent = y / height;
            hue = 360 - 360 * percent;
            if (hue === 360) hue = 0;
            color = "hsl(" + hue + ", 100%, 50%)";
            this.hue = hue;

            this._createShadeCanvas(color);
            this._createAlphaCanvas();
            this._updateHueCursor(y);
            this._updateCursorsColor();
            this._setColorValues();
        },

        _getAlphaValue: function (pageY) {
            const canvas = this.alphaCanvas;
            const offset = canvas.offset();
            const height = canvas.height();
            let y, percent;

            y = pageY - offset.top;

            if (y > height) y = height;
            if (y < 0) y = 0;

            percent = 1 - y / height;

            this.alpha = percent.toFixed(2);

            this._updateAlphaCursor(y);
            this._updateCursorsColor();
            this._setColorValues();
        },

        _getShadeColor: function (pageX, pageY) {
            const canvas = this.shadeCanvas;
            const offset = canvas.offset();
            const width = canvas.width();
            const height = canvas.height();
            let x = pageX - offset.left;
            let y = pageY - offset.top;

            if (x > width) x = width;
            if (x < 0) x = 0;
            if (y > height) y = height;
            if (y < 0) y = 0.1;

            const xRatio = (x / width) * 100;
            const yRatio = (y / height) * 100;
            const hsvValue = 1 - yRatio / 100;
            const hsvSaturation = xRatio / 100;
            let lightness = (hsvValue / 2) * (2 - hsvSaturation);
            let saturation = (hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1));

            if (isNaN(lightness)) {
                lightness = 0;
            }

            if (isNaN(saturation)) {
                saturation = 0;
            }

            this.lightness = lightness;
            this.saturation = saturation;

            this._updateShadeCursor(x, y);
            this._updateCursorsColor();
            this._setColorValues();
        },

        _updateCursorsColor: function () {
            this.shadeCursor.css({
                backgroundColor: Farbe.Routines.toHEX(new Farbe.Primitives.HSL(this.hue, this.saturation, this.lightness)),
            });
            this.hueCursor.css({
                backgroundColor: Farbe.Routines.toHEX(new Farbe.Primitives.HSL(this.hue, 1, 0.5)),
            });
            this.alphaCursor.css({
                backgroundColor: Farbe.Routines.toRGBA(new Farbe.Primitives.HSL(this.hue, 1, 0.5), this.alpha).toString(),
            });
        },

        _updateShadeCursor: function (x, y) {
            this.shadeCursor.css({
                top: y,
                left: x,
            });
        },

        _colorToPos: function (color) {
            const shadeCanvasRect = this.shadeCanvas[0].getBoundingClientRect();
            const hueCanvasRect = this.hueCanvas[0].getBoundingClientRect();
            const alphaCanvasRect = this.alphaCanvas[0].getBoundingClientRect();
            const hsl = Farbe.Routines.toHSL(color);
            const hsla = Farbe.Routines.toHSLA(color);
            const hsv = Farbe.Routines.toHSV(color);
            const x = shadeCanvasRect.width * hsv.s;
            const y = shadeCanvasRect.height * (1 - hsv.v);
            const hueY = hueCanvasRect.height - (hsl.h / 360) * hueCanvasRect.height;
            const alphaY = (1 - hsla.a) * alphaCanvasRect.height;

            this.hue = hsl.h;
            this.saturation = hsl.s;
            this.lightness = hsl.l;
            this.alpha = hsla.a;
            this._updateHueCursor(hueY);
            this._updateShadeCursor(x, y);
            this._updateAlphaCursor(alphaY);
            this._updateCursorsColor();
            this._createShadeCanvas("hsl(" + this.hue + ", 100%, 50%)");
            this._createAlphaCanvas();
            this._setColorValues();
        },

        _setColorValues: function () {
            const element = this.element,
                o = this.options;
            const hsl = new Farbe.Primitives.HSL(this.hue, this.saturation, this.lightness);
            const hsla = new Farbe.Primitives.HSLA(this.hue, this.saturation, this.lightness, this.alpha);
            const rgb = Farbe.Routines.toRGB(hsl);
            const rgba = Farbe.Routines.toRGBA(rgb, this.alpha);
            const hsv = Farbe.Routines.toHSV(hsl);
            const cmyk = Farbe.Routines.toCMYK(hsl);
            const hex = Farbe.Routines.toHEX(hsl);
            const controller = this.controller;
            const percent = o.hslMode === "percent";

            this.hsl = hsl;
            this.hsla = hsla;
            this.hsv = hsv;
            this.rgb = rgb;
            this.rgba = rgba;
            this.hex = hex;
            this.cmyk = cmyk;

            element.find(".color-value-hex .value-hex input").val(hex);

            element.find(".color-value-rgb .value-r input").val(rgb.r);
            element.find(".color-value-rgb .value-g input").val(rgb.g);
            element.find(".color-value-rgb .value-b input").val(rgb.b);
            element.find(".color-value-rgb .value-rgb input").val(rgb.toString());

            element.find(".color-value-rgba .value-r input").val(rgba.r);
            element.find(".color-value-rgba .value-g input").val(rgba.g);
            element.find(".color-value-rgba .value-b input").val(rgba.b);
            element.find(".color-value-rgba .value-a input").val(rgba.a);
            element.find(".color-value-rgba .value-rgba input").val(rgba.toString());

            element.find(".color-value-hsl .value-h input").val(hsl.h.toFixed(0));
            element.find(".color-value-hsl .value-s input").val(percent ? Math.round(hsl.s * 100) + "%" : hsl.s.toFixed(4));
            element.find(".color-value-hsl .value-l input").val(percent ? Math.round(hsl.l * 100) + "%" : hsl.l.toFixed(4));
            element.find(".color-value-hsl .value-hsl input").val(hsl.toString());

            element.find(".color-value-hsla .value-h input").val(hsla.h.toFixed(0));
            element.find(".color-value-hsla .value-s input").val(percent ? Math.round(hsla.s * 100) + "%" : hsl.s.toFixed(4));
            element.find(".color-value-hsla .value-l input").val(percent ? Math.round(hsla.l * 100) + "%" : hsl.l.toFixed(4));
            element.find(".color-value-hsla .value-a input").val(hsla.a);
            element.find(".color-value-hsla .value-hsla input").val(hsla.toString());

            element.find(".color-value-hsv .value-h input").val(hsv.h.toFixed(0));
            element.find(".color-value-hsv .value-s input").val(percent ? Math.round(hsv.s * 100) + "%" : hsv.s.toFixed(4));
            element.find(".color-value-hsv .value-v input").val(percent ? Math.round(hsv.v * 100) + "%" : hsv.v.toFixed(4));
            element.find(".color-value-hsv .value-hsv input").val(hsv.toString());

            element.find(".color-value-cmyk .value-c input").val(cmyk.c.toFixed(0));
            element.find(".color-value-cmyk .value-m input").val(cmyk.m.toFixed(0));
            element.find(".color-value-cmyk .value-y input").val(cmyk.y.toFixed(0));
            element.find(".color-value-cmyk .value-k input").val(cmyk.k.toFixed(0));
            element.find(".color-value-cmyk .value-cmyk input").val(cmyk.toString());

            element.find(".user-colors-actions .user-swatch").css({
                backgroundColor: hex,
            });

            const value = this.getVal();

            if (controller && controller.length) {
                controller.val(value); //.trigger("change");
            }

            this._fireEvent("select-color", {
                color: value,
                primitive: {
                    hsl: this.hsl,
                    hsla: this.hsla,
                    rgb: this.rgb,
                    rgba: this.rgba,
                    hsv: this.hsv,
                    cmyk: this.cmyk,
                    hex: this.hex,
                },
            });
        },

        _clearInputInterval: function () {
            clearInterval(this.inputInterval);
            this.inputInterval = false;
        },

        _createEvents: function () {
            const that = this,
                element = this.element,
                o = this.options;
            const hueMap = element.find(".hue-map");
            const alphaMap = element.find(".alpha-map");
            const shadeMap = element.find(".color-map");
            const controller = this.controller;
            const colorValues = element.find(".color-values-block input[type=text]");

            let onColorValuesChange = (e) => {
                const input = $(e.target);
                const colorGroup = input.closest(".color-block");
                let colorType, color, parts;

                if (colorGroup.hasClass("color-hex")) {
                    colorType = "hex";
                } else if (colorGroup.hasClass("color-rgb")) {
                    colorType = "rgb";
                } else if (colorGroup.hasClass("color-rgba")) {
                    colorType = "rgba";
                } else if (colorGroup.hasClass("color-hsl")) {
                    colorType = "hsl";
                } else if (colorGroup.hasClass("color-hsla")) {
                    colorType = "hsla";
                } else if (colorGroup.hasClass("color-hsv")) {
                    colorType = "hsv";
                } else if (colorGroup.hasClass("color-cmyk")) {
                    colorType = "cmyk";
                }

                if (colorGroup.hasClass("as-string")) {
                    color = input.val();
                } else {
                    parts = [];
                    $.each(colorGroup.find("input"), function () {
                        parts.push(this.value);
                    });
                    color = colorType + "(" + parts.join(", ") + ")";
                }
                if (color && Farbe.Routines.isColor(color)) {
                    that.val(color);
                }
            };

            onColorValuesChange = Hooks.useDebounce(onColorValuesChange, o.inputThreshold);

            colorValues.on(Metro.events.inputchange, onColorValuesChange);

            if (controller && controller.length) {
                let onControllerChange = Hooks.useDebounce(() => {
                    const val = controller.val();
                    if (val && Farbe.Routines.isColor(val)) {
                        that.val(val);
                    }
                }, o.inputThreshold);
                controller.on(Metro.events.inputchange, onControllerChange);
            }

            alphaMap.on(
                Metro.events.startAll,
                function (e) {
                    if (["hsla", "rgba"].includes(o.returnValueType) === false) {
                        // return
                    }

                    that._getAlphaValue(Metro.utils.pageXY(e).y);

                    $(document).on(
                        Metro.events.moveAll,
                        function (e) {
                            e.preventDefault();
                            that._getAlphaValue(Metro.utils.pageXY(e).y);
                        },
                        { ns: that.id },
                    );

                    $(document).on(
                        Metro.events.stopAll,
                        function () {
                            $(document).off(Metro.events.moveAll, {
                                ns: that.id,
                            });
                            $(document).off(Metro.events.stopAll, {
                                ns: that.id,
                            });
                        },
                        { ns: that.id },
                    );
                },
                { passive: true },
            );

            hueMap.on(
                Metro.events.startAll,
                function (e) {
                    that._getHueColor(Metro.utils.pageXY(e).y);
                    // that.hueCursor.addClass("dragging");

                    $(document).on(
                        Metro.events.moveAll,
                        function (e) {
                            e.preventDefault();
                            that._getHueColor(Metro.utils.pageXY(e).y);
                        },
                        { ns: that.id, passive: false },
                    );

                    $(document).on(
                        Metro.events.stopAll,
                        function () {
                            // that.hueCursor.removeClass("dragging");
                            $(document).off(Metro.events.moveAll, {
                                ns: that.id,
                            });
                            $(document).off(Metro.events.stopAll, {
                                ns: that.id,
                            });
                        },
                        { ns: that.id },
                    );
                },
                { passive: true },
            );

            shadeMap.on(
                Metro.events.startAll,
                function (e) {
                    that._getShadeColor(Metro.utils.pageXY(e).x, Metro.utils.pageXY(e).y);
                    // that.shadeCursor.addClass("dragging");

                    $(document).on(
                        Metro.events.moveAll,
                        function (e) {
                            e.preventDefault();
                            that._getShadeColor(Metro.utils.pageXY(e).x, Metro.utils.pageXY(e).y);
                        },
                        { ns: that.id, passive: false },
                    );

                    $(document).on(
                        Metro.events.stopAll,
                        function () {
                            // that.shadeCursor.removeClass("dragging");
                            $(document).off(Metro.events.moveAll, {
                                ns: that.id,
                            });
                            $(document).off(Metro.events.stopAll, {
                                ns: that.id,
                            });
                        },
                        { ns: that.id },
                    );
                },
                { passive: true },
            );

            element.on("click", ".swatch", function () {
                that._colorToPos($(this).attr("data-color"));
            });

            element.on("click", ".add-button", function () {
                const color = Farbe.Routines.toHEX(new Farbe.Primitives.HSL(that.hue, that.saturation, that.lightness)).toUpperCase();
                if (that.userColors.includes(color)) {
                    return;
                }

                that.userColors.push(color);

                element.find(".user-colors").append(
                    $("<button>").attr("data-color", color).attr("type", "button").addClass("swatch user-swatch").css({
                        backgroundColor: color,
                    }),
                );
            });

            element.find("input[type=radio]").on("click", function () {
                o.returnValueType = $(this).val();
                that._setColorValues();
            });
        },

        getVal: function () {
            const o = this.options;
            let res;
            switch (o.returnValueType.toLowerCase()) {
                case "rgb":
                    res = this.rgb;
                    break;
                case "rgba":
                    res = this.rgba;
                    break;
                case "hsl":
                    res = this.hsl;
                    break;
                case "hsla":
                    res = this.hsla;
                    break;
                case "hsv":
                    res = this.hsv;
                    break;
                case "cmyk":
                    res = this.cmyk;
                    break;
                default:
                    res = this.hex;
            }
            return o.returnAsString ? res.toString() : res;
        },

        val: function (v) {
            if (typeof v === "undefined") {
                return this.getVal();
            }
            const color = Farbe.Routines.parse(v);
            this._colorToPos(color);
        },

        user: function (v) {
            if (!Metro.utils.isValue(v)) {
                return this.userColors;
            }

            if (!Array.isArray(v) && typeof v !== "string") {
                return;
            }

            if (typeof v === "string") {
                this.userColors = v.toArray(",").map(function (el) {
                    return el.toUpperCase();
                });
            } else {
                this.userColors = v.map(function (el) {
                    return el.toUpperCase();
                });
            }

            this._fillUserColors();
        },

        _fillUserColors: function () {
            const colors = this.element.find(".user-colors-css").clear();

            $.each(this.userColors, function () {
                const color = this;
                colors.append(
                    $("<button>").attr("data-color", color).attr("type", "button").addClass("swatch user-swatch").css({
                        backgroundColor: color,
                    }),
                );
            });
        },

        changeAttribute: function (attr, newValue) {
            const o = this.options;

            if (attr === "data-return-value-type") {
                o.returnValueType = newValue;
            }

            if (attr === "data-return-as-string") {
                o.returnValueType = Metro.utils.bool(newValue);
            }
        },

        destroy: function () {
            this.element.remove();
        },
    });

    Metro.defaults.ColorSelector = ColorSelectorDefaultConfig;
})(Metro, Dom);
