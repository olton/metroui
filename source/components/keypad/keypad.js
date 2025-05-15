/*
 * TODO:
 *  1. Add custom buttons
 * */
((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let KeypadDefaultConfig = {
        keypadDeferred: 0,
        label: "",
        keySize: 36,
        keys: "1, 2, 3, 4, 5, 6, 7, 8, 9, 0",
        exceptKeys: "",
        keySeparator: "",
        trimSeparator: false,
        keyDelimiter: ",",
        copyInlineStyles: false,
        target: null,
        keyLength: 0,
        shuffle: false,
        shuffleCount: 3,
        //position: Metro.position.BOTTOM_LEFT, //top-left, top, top-right, right, bottom-right, bottom, bottom-left, left
        // dynamicPosition: false,
        serviceButtons: true,
        showValue: true,
        open: false,
        useElementSizeForKeys: false,
        // sizeAsKeys: false,
        openMode: "auto",

        clsKeypad: "",
        clsInput: "",
        clsKeys: "",
        clsKey: "",
        clsServiceKey: "",
        clsBackspace: "",
        clsClear: "",
        clsLabel: "",

        onChange: Metro.noop,
        onClear: Metro.noop,
        onBackspace: Metro.noop,
        onShuffle: Metro.noop,
        onKey: Metro.noop,
        onKeypadCreate: Metro.noop,
    };

    Metro.keypadSetup = (options) => {
        KeypadDefaultConfig = $.extend({}, KeypadDefaultConfig, options);
    };

    if (typeof globalThis.metroKeypadSetup !== "undefined") {
        Metro.keypadSetup(globalThis.metroKeypadSetup);
    }

    Metro.Component("keypad", {
        init: function (options, elem) {
            this._super(elem, options, KeypadDefaultConfig, {
                value: elem.tagName === "INPUT" ? elem.value : elem.innerText,
                positions: ["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"],
                keypad: null,
                keys: [],
                keys_to_work: [],
                exceptKeys: [],
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this.options.position = "bottom-left";
            this.keys = o.keys.toArray(o.keyDelimiter);
            this.keys_to_work = this.keys;
            this.exceptKeys = o.exceptKeys.toArray(o.keyDelimiter);

            this._createKeypad();
            if (o.shuffle === true) {
                this.shuffle();
            }
            this._createKeys();
            this._createEvents();

            this._fireEvent("keypad-create", {
                element: element,
            });
        },

        _createKeypad: function () {
            const element = this.element;
            const o = this.options;
            let keys;

            const keypad = element
                .wrap("<div>")
                .addClass("input keypad")
                .addClass(element[0].className)
                .addClass(o.clsKeypad);

            if (element.attr("type") === undefined) {
                element.attr("type", "text");
            }

            element.attr("readonly", true);

            keys = $("<div>").addClass("keys").addClass(o.clsKeys);
            keys.appendTo(keypad);
            this._setKeysPosition();

            if (o.open === true) {
                keys.addClass("open keep-open");
            }

            element[0].className = "";
            if (o.copyInlineStyles === true) {
                let i = 0;
                const l = element[0].style.length;
                for (; i < l; i++) {
                    keypad.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            element.addClass(o.clsInput);
            keypad.addClass(o.clsKeypad);

            element.on(Metro.events.blur, () => {
                keypad.removeClass("focused");
            });
            element.on(Metro.events.focus, () => {
                keypad.addClass("focused");
            });

            const buttons = $("<div>").addClass("button-group").appendTo(keypad);
            const kbdButton = $("<button>")
                .addClass("button input-kbd-button")
                .addClass(o.clsKbdButton)
                .attr("tabindex", -1)
                .attr("type", "button")
                .html("⌨");
            kbdButton.appendTo(buttons);

            if (o.label) {
                const label = $("<label>")
                    .addClass("label-for-input")
                    .addClass(o.clsLabel)
                    .html(o.label)
                    .insertBefore(keypad);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                } else {
                    const id = Hooks.useId(element[0]);
                    element.id(id);
                    label.attr("for", id);
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (o.disabled === true || element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }

            this.keypad = keypad;
        },

        _setKeysPosition: function () {
            const element = this.element;
            const o = this.options;
            const keypad = element.parent();
            const keys = keypad.find(".keys");
            keys.removeClass(this.positions.join(" ")).addClass(o.position);
        },

        _createKeys: function () {
            const element = this.element;
            const o = this.options;
            const keypad = element.parent();
            let key;
            const keys = keypad.find(".keys");
            const factor = Math.round(Math.sqrt(this.keys.length + 2));
            const key_size = o.keySize;
            let width;

            keys.html("");

            $.each(this.keys_to_work, function () {
                key = $("<span>").addClass("key").addClass(o.clsKey).html(this);
                key.data("key", this);
                key.css({
                    width: o.keySize,
                    height: o.keySize,
                    lineHeight: o.keySize - 4,
                }).appendTo(keys);
            });

            if (o.serviceButtons === true) {
                const service_keys = ["&larr;", "&times;"];

                $.each(service_keys, function () {
                    key = $("<span>")
                        .addClass("key service-key")
                        .addClass(o.clsKey)
                        .addClass(o.clsServiceKey)
                        .html(this);
                    if (this === "&larr;") {
                        key.addClass(o.clsBackspace);
                    }
                    if (this === "&times;") {
                        key.addClass(o.clsClear);
                    }
                    key.data("key", this);
                    key.css({
                        width: o.keySize,
                        height: o.keySize,
                        lineHeight: o.keySize - 4,
                    }).appendTo(keys);
                });
            }

            if (o.useElementSizeForKeys === true) {
                keys.outerWidth(element.outerWidth());
            } else {
                width = factor * (key_size + 2) - 6;
                keys.outerWidth(width);
            }
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const keypad = element.parent();
            const keys = keypad.find(".keys");

            keys.on(Metro.events.click, ".key", function (e) {
                const key = $(this);
                const keyValue = key.data("key");
                let crop;

                if (key.data("key") !== "&larr;" && key.data("key") !== "&times;") {
                    if (o.keyLength > 0 && `${that.value}`.length === o.keyLength) {
                        return false;
                    }

                    if (that.exceptKeys.indexOf(keyValue) === -1)
                        that.value = that.value + (that.value !== "" ? o.keySeparator : "") + keyValue;

                    if (o.shuffle === true) {
                        that.shuffle();
                        that._createKeys();
                    }

                    if (o.dynamicPosition === true) {
                        o.position = that.positions[$.random(0, that.positions.length - 1)];
                        that._setKeysPosition();
                    }

                    that._fireEvent("key", {
                        key: key.data("key"),
                        val: that.value,
                    });
                } else {
                    if (key.data("key") === "&times;") {
                        that.value = "";
                        that._fireEvent("clear");
                    }
                    if (key.data("key") === "&larr;") {
                        crop = o.keySeparator && that.value[that.value.length - 1] !== o.keySeparator ? 2 : 1;
                        that.value = that.value.substring(0, that.value.length - crop);
                        that._fireEvent("backspace", {
                            val: that.value,
                        });
                    }
                }

                if (o.showValue === true) {
                    if (element[0].tagName === "INPUT") {
                        element.val(that.value);
                    } else {
                        element.text(that.value);
                    }
                }

                that._fireEvent("change", {
                    val: that.val,
                });

                e.preventDefault();
                e.stopPropagation();
            });

            keypad.on(Metro.events.click, (e) => {
                if (o.open === true) {
                    return;
                }

                if (keys.hasClass("open") === true) {
                    keys.removeClass("open").removeClass("top-left");
                } else {
                    keys.addClass("open");
                    if (o.openMode === "auto") {
                        if (Metro.utils.inViewport(keys[0]) === false) {
                            keys.addClass("top-left");
                        }
                    } else {
                        if (o.openMode === "up") {
                            keys.addClass("top-left");
                        }
                    }
                }

                e.preventDefault();
                e.stopPropagation();
            });

            if (o.target !== null) {
                element.on(Metro.events.change, () => {
                    const t = $(o.target);
                    if (t.length === 0) {
                        return;
                    }
                    if (t[0].tagName === "INPUT") {
                        t.val(that.value);
                    } else {
                        t.text(that.value);
                    }
                });
            }
        },

        shuffle: function () {
            const o = this.options;
            for (let i = 0; i < o.shuffleCount; i++) {
                this.keys_to_work = this.keys_to_work.shuffle();
            }

            this._fireEvent("shuffle", {
                keysToWork: this.keys_to_work,
                keys: this.keys,
            });
        },

        shuffleKeys: function (count = 3) {
            for (let i = 0; i < count; i++) {
                this.keys_to_work = this.keys_to_work.shuffle();
            }
            this._createKeys();
        },

        val: function (v) {
            const element = this.element;
            const o = this.options;

            if (typeof v === "undefined") {
                return o.trimSeparator ? this.value.replace(new RegExp(o.keySeparator, "g")) : this.value;
            }

            this.value = `${v}`;

            if (element[0].tagName === "INPUT") {
                element.val(v);
                // set cursor to end position
            } else {
                element.text(v);
            }

            return this;
        },

        open: function () {
            const element = this.element;
            const o = this.options;
            const keypad = element.parent();
            const keys = keypad.find(".keys");

            keys.addClass("open");
            if (o.openMode === "auto") {
                if (Metro.utils.inViewport(keys[0]) === false) {
                    keys.addClass("top-left");
                }
            } else {
                if (o.openMode === "up") {
                    keys.addClass("top-left");
                }
            }
        },

        close: function () {
            const element = this.element;
            const keypad = element.parent();
            const keys = keypad.find(".keys");

            keys.removeClass("open").removeClass("top-left");
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

        setPosition: function (pos) {
            const new_position = pos !== undefined ? pos : this.element.attr("data-position");
            if (this.positions.indexOf(new_position) === -1) {
                return;
            }
            this.options.position = new_position;
            this._setKeysPosition();
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "disabled":
                    this.toggleState();
                    break;
                case "data-position":
                    this.setPosition();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const o = this.options;
            const keypad = this.keypad;
            const keys = keypad.find(".keys");

            keypad.off(Metro.events.click);
            keys.off(Metro.events.click, ".key");
            element.off(Metro.events.change);

            if (o.label) {
                keypad.prev("label").remove();
            }
            keypad.remove();
        },
    });

    $(document).on(Metro.events.click, () => {
        const keypads = $(".keypad .keys");
        $.each(keypads, function () {
            if (!$(this).hasClass("keep-open")) {
                $(this).removeClass("open");
            }
        });
    });
})(Metro, Dom);
