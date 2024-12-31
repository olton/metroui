/* global Metro */
(function(Metro, $) {
    'use strict';

    var Utils = Metro.utils;
    var InputMaskDefaultConfig = {
        maskPattern: ".",
        mask: null,
        maskPlaceholder: "_",
        maskEditableStart: 0,
        thresholdInterval: 300,
        onChar: Metro.noop,
        onInputMaskCreate: Metro.noop
    };

    Metro.inputMaskSetup = function (options) {
        InputMaskDefaultConfig = $.extend({}, InputMaskDefaultConfig, options);
    };

    if (typeof globalThis["metroInputMaskSetup"] !== undefined) {
        Metro.inputMaskSetup(globalThis["metroInputMaskSetup"]);
    }

    Metro.Component('input-mask', {
        init: function( options, elem ) {
            this._super(elem, options, InputMaskDefaultConfig, {
                // define instance vars here
                pattern: null,
                mask: "",
                maskArray: [],
                placeholder: "",
                length: 0,
                thresholdTimer: null,
                id: Utils.elementId("input-mask")
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('input-mask-create');
        },

        _createStructure: function(){
            var o = this.options;

            if (!o.mask) {
                throw new Error('You must provide a pattern for masked input.')
            }

            if (typeof o.maskPlaceholder !== 'string' || o.maskPlaceholder.length > 1) {
                throw new Error('Mask placeholder should be a single character or an empty string.')
            }

            this.placeholder = o.maskPlaceholder;
            this.mask = (""+o.mask);
            this.maskArray = this.mask.split("");
            this.pattern = new RegExp("^"+o.maskPattern+"+$");
            this.length = this.mask.length;

            this._showValue();
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var editableStart = o.maskEditableStart;
            var id = this.id;

            var checkEditablePosition = function(pos){
                if (pos < editableStart) {
                    setPosition(editableStart);
                    return false;
                }
                return true;
            }

            var checkEditableChar = function(pos){
                return pos < that.mask.length && that.mask.charAt(pos) === that.placeholder;
            }

            var findNextEditablePosition = function (pos){
                var i, a = that.maskArray;

                for (i = pos; i <= a.length; i++) {
                    if (a[i] === that.placeholder) {
                        return i;
                    }
                }
                return pos;
            }

            var setPosition = function(pos){
                that.elem.setSelectionRange(pos, pos);
            }

            var clearThresholdInterval = function(){
                clearInterval(that.thresholdTimer);
                that.thresholdTimer = null;
            }

            element.on("change", function(){
                if (this.value === "") {
                    this.value = that.mask;
                    setPosition(editableStart);
                }
            }, {ns: id});

            element.on("focus click", function(){
                checkEditablePosition(this.selectionStart);
                setPosition(findNextEditablePosition(this.selectionStart));
            }, {ns: id});

            element.on("keydown", function(e){
                var pos = this.selectionStart;
                var val = this.value;
                var code = e.code, key = e.key;

                if (code === "ArrowRight" || code === "End") {
                    return true;
                } else {
                    if (pos >= that.length && (["Backspace", "Home", "ArrowLeft", "ArrowUp"].indexOf(code) === -1)) {
                        // Don't move over mask length
                        e.preventDefault();
                    } else if (code === "Home" || code === "ArrowUp") {
                        // Goto editable start position
                        e.preventDefault();
                        setPosition(editableStart);
                    } else if (code === "ArrowLeft") {
                        if (pos - 1 < editableStart) {
                            // Don't move behind a editable start position
                            e.preventDefault();
                        }
                    } else if (code === "Backspace") {
                        e.preventDefault();
                        if (pos - 1 >= editableStart) {
                            if (checkEditableChar(pos - 1)) {
                                if (this.value.charAt(pos - 1) !== that.placeholder) {
                                    // Replace char if it is not a mask placeholder
                                    this.value = val.substr(0, pos - 1) + that.placeholder + val.substr(pos);
                                }
                            }
                            // Move to prev char position
                            setPosition(pos - 1);
                        }
                    } else if (code === "Space") {
                        e.preventDefault();
                        setPosition(pos + 1);
                    } else if (!that.pattern.test(key)) {
                        e.preventDefault();
                    } else {
                        e.preventDefault();
                        if (checkEditableChar(pos)) {
                            this.value = val.substr(0, pos) + (o.onChar === Metro.noop ? key : Utils.exec(o.onChar, [key], this)) + val.substr(pos + 1);
                            setPosition(findNextEditablePosition(pos + 1));
                        }
                    }
                }
            }, {ns: id});

            element.on("keyup", function(){
                var el = this;

                clearThresholdInterval();

                that.thresholdTimer = setInterval(function(){
                    clearThresholdInterval();
                    setPosition(findNextEditablePosition(el.selectionStart));
                }, o.thresholdInterval)
            }, {ns: id});
        },

        _showValue: function(){
            var that = this, elem = this.elem;
            var a = new Array(this.length);
            var val;
            if (!elem.value) {
                elem.value = this.mask;
            } else {
                val = elem.value;
                $.each(this.maskArray, function(i, v){
                    if (val[i] !== v && !that.pattern.test(val[i])) {
                        a[i] = that.placeholder;
                    } else {
                        a[i] = val[i];
                    }
                });
                this.elem.value = a.join("");
            }
        },

        destroy: function(){
            var element = this.element, id = this.id;

            element.off("change", {ns: id});
            element.off("focus", {ns: id});
            element.off("click", {ns: id});
            element.off("keydown", {ns: id});
            element.off("keyup", {ns: id});

            return element;
        }
    });
}(Metro, m4q));
