/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var SliderDefaultConfig = {
        sliderDeferred: 0,
        roundValue: true,
        min: 0,
        max: 100,
        accuracy: 0,
        showMinMax: false,
        minMaxPosition: Metro.position.TOP,
        value: 0,
        buffer: 0,
        hint: false,
        hintAlways: false,
        hintPosition: Metro.position.TOP,
        hintMask: "$1",
        vertical: false,
        target: null,
        returnType: "value", // value or percent
        size: 0,
        label: null, 

        clsSlider: "",
        clsBackside: "",
        clsComplete: "",
        clsBuffer: "",
        clsMarker: "",
        clsHint: "",
        clsMinMax: "",
        clsMin: "",
        clsMax: "",

        onStart: Metro.noop,
        onStop: Metro.noop,
        onMove: Metro.noop,
        onSliderClick: Metro.noop,
        onChange: Metro.noop,
        onChangeValue: Metro.noop,
        onChangeBuffer: Metro.noop,
        onFocus: Metro.noop,
        onBlur: Metro.noop,
        onSliderCreate: Metro.noop
    };

    Metro.sliderSetup = function (options) {
        SliderDefaultConfig = $.extend({}, SliderDefaultConfig, options);
    };

    if (typeof globalThis["metroSliderSetup"] !== undefined) {
        Metro.sliderSetup(globalThis["metroSliderSetup"]);
    }

    Metro.Component('slider', {
        init: function( options, elem ) {
            this._super(elem, options, SliderDefaultConfig, {
                slider: null,
                value: 0,
                percent: 0,
                pixel: 0,
                buffer: 0,
                keyInterval: false,
                id: Utils.elementId('slider')
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            this._createSlider();
            this._createEvents();
            this.buff(o.buffer);
            this.val(o.value);

            this._fireEvent("slider-create", {
                element: element
            });
        },

        _createSlider: function(){
            var element = this.element, o = this.options;

            var backside = $("<div>").addClass("backside").addClass(o.clsBackside);
            var complete = $("<div>").addClass("complete").addClass(o.clsComplete);
            var buffer = $("<div>").addClass("buffer").addClass(o.clsBuffer);
            var marker = $("<button>").attr("type", "button").addClass("marker").addClass(o.clsMarker);
            var hint = $("<div>").addClass("hint").addClass(o.hintPosition + "-side").addClass(o.clsHint);
            var i;

            var slider = element.wrap("<div>").addClass("slider").addClass(element[0].className).addClass(o.clsSlider);
            
            if (o.size > 0) {
                if (o.vertical === true) {
                    slider.outerHeight(o.size);
                } else {
                    slider.outerWidth(o.size);
                }
            }

            if (o.vertical === true) {
                slider.addClass("vertical-slider");
            }

            if (o.hintAlways === true) {
                hint.css({
                    display: "block"
                }).addClass("permanent-hint");
            }

            if (o.label) {
                const label = $("<label>")
                    .addClass("label-for-input")
                    .addClass(o.clsLabel)
                    .html(o.label)
                    .insertBefore(slider);
                if (element.id()) {
                    label.attr("for", element.id());
                } else {
                    const id = Hooks.useId(element[0]);
                    label.attr("for", id);
                    element.attr("id", id);
                }
            }
            
            backside.appendTo(slider);
            complete.appendTo(slider);
            buffer.appendTo(slider);
            marker.appendTo(slider);
            hint.appendTo(marker);

            if (o.showMinMax === true) {
                var min_max_wrapper = $("<div>").addClass("slider-min-max").addClass(o.clsMinMax);
                $("<span>").addClass("slider-text-min").addClass(o.clsMin).html(o.min).appendTo(min_max_wrapper);
                $("<span>").addClass("slider-text-max").addClass(o.clsMax).html(o.max).appendTo(min_max_wrapper);
                if (o.minMaxPosition === Metro.position.TOP) {
                    min_max_wrapper.insertBefore(slider);
                } else {
                    min_max_wrapper.insertAfter(slider);
                }
            }

            element[0].className = '';
            if (o.copyInlineStyles === true) {
                for (i = 0; i < element[0].style.length; i++) {
                    slider.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }

            this.slider = slider;
        },

        _createEvents: function(){
            var that = this, slider = this.slider, o = this.options;
            var marker = slider.find(".marker");
            var hint = slider.find(".hint");

            marker.on(Metro.events.startAll, function(){
                if (o.hint === true && o.hintAlways !== true) {
                    hint.fadeIn(300);
                }

                $(document).on(Metro.events.moveAll, function(e){
                    if (e.cancelable) e.preventDefault();
                    that._move(e);

                    that._fireEvent("move", {
                        val: that.value,
                        percent: that.percent
                    });

                }, {ns: that.id, passive: false});

                $(document).on(Metro.events.stopAll, function(){
                    $(document).off(Metro.events.moveAll, {ns: that.id});
                    $(document).off(Metro.events.stopAll, {ns: that.id});

                    if (o.hintAlways !== true) {
                        hint.fadeOut(300);
                    }

                    that._fireEvent("stop", {
                        val: that.value,
                        percent: that.percent
                    });
                }, {ns: that.id});

                that._fireEvent("start", {
                    val: that.value,
                    percent: that.percent
                });
            });

            marker.on(Metro.events.focus, function(){
                that._fireEvent("focus", {
                    val: that.value,
                    percent: that.percent
                });
            });

            marker.on(Metro.events.blur, function(){
                that._fireEvent("blur", {
                    val: that.value,
                    percent: that.percent
                });
            });

            marker.on(Metro.events.keydown, function(e){

                var key = e.keyCode ? e.keyCode : e.which;

                if ([37,38,39,40].indexOf(key) === -1) {
                    return;
                }

                var step = o.accuracy === 0 ? 1 : o.accuracy;

                if (that.keyInterval) {
                    return ;
                }
                that.keyInterval = setInterval(function(){

                    var val = that.value;

                    if (e.keyCode === 37 || e.keyCode === 40) { // left, down
                        if (val - step < o.min) {
                            val = o.min;
                        } else {
                            val -= step;
                        }
                    }

                    if (e.keyCode === 38 || e.keyCode === 39) { // right, up
                        if (val + step > o.max) {
                            val = o.max;
                        } else {
                            val += step;
                        }
                    }

                    that.value = that._correct(val);
                    that.percent = that._convert(that.value, 'val2prc');
                    that.pixel = that._convert(that.percent, 'prc2pix');

                    that._redraw();
                }, 100);

                e.preventDefault();
            });

            marker.on(Metro.events.keyup, function(){
                clearInterval(that.keyInterval);
                that.keyInterval = false;
            });

            slider.on(Metro.events.click, function(e){
                that._move(e);

                that._fireEvent("slider-click", {
                    val: that.value,
                    percent: that.percent
                });

                that._fireEvent("stop", {
                    val: that.value,
                    percent: that.percent
                });
            });

            $(globalThis).on(Metro.events.resize,function(){
                that.val(that.value);
                that.buff(that.buffer);
            }, {ns: that.id});
        },

        _convert: function(v, how){
            var slider = this.slider, o = this.options;
            var length = (o.vertical === true ? slider.outerHeight() : slider.outerWidth()) - slider.find(".marker").outerWidth();
            switch (how) {
                case "pix2prc": return ( v * 100 / length );
                case "pix2val": return ( this._convert(v, 'pix2prc') * ((o.max - o.min) / 100) + o.min );
                case "val2prc": return ( (v - o.min)/( (o.max - o.min) / 100 )  );
                case "prc2pix": return ( v / ( 100 / length ));
                case "val2pix": return ( this._convert(this._convert(v, 'val2prc'), 'prc2pix') );
            }

            return 0;
        },

        _correct: function(value){
            var res = value;
            var accuracy  = this.options.accuracy;
            var min = this.options.min, max = this.options.max;

            if (accuracy === 0 || isNaN(accuracy)) {
                return res;
            }

            res = Math.round(value/accuracy)*accuracy;

            if (res < min) {
                res = min;
            }

            if (res > max) {
                res = max;
            }

            return res.toFixed(Utils.decCount(accuracy));
        },

        _move: function(e){
            var slider = this.slider, o = this.options;
            var offset = slider.offset(),
                marker_size = slider.find(".marker").outerWidth(),
                length = o.vertical === true ? slider.outerHeight() : slider.outerWidth(),
                cPos, cPix, cStart = 0, cStop = length - marker_size;

            cPos = o.vertical === true ? Utils.pageXY(e).y - offset.top : Utils.pageXY(e).x - offset.left;
            cPix = o.vertical === true ? length - cPos - marker_size / 2 : cPos - marker_size / 2;

            if (cPix < cStart || cPix > cStop) {
                return ;
            }

            this.value = this._correct(this._convert(cPix, 'pix2val'));
            this.percent = this._convert(this.value, 'val2prc');
            this.pixel = this._convert(this.percent, 'prc2pix');

            this._redraw();
        },

        _hint: function(){
            var o = this.options, slider = this.slider, hint = slider.find(".hint");
            var value = +this.value || 0;
            var percent = +this.percent || 0;

            if (o.roundValue) {
                value = (Utils.isValue(value) ? +value : 0).toFixed(Utils.decCount(o.accuracy));
                percent = (Utils.isValue(percent) ? +percent : 0).toFixed(Utils.decCount(o.accuracy));
            }

            hint.text(o.hintMask.replace("$1", value).replace("$2", percent));
        },

        _value: function(){
            var element = this.element, o = this.options;
            var value = o.returnType === 'value' ? this.value : this.percent;
            var percent = this.percent;
            var buffer = this.buffer;

            if (o.roundValue) {
                value = (Utils.isValue(value) ? +value : 0).toFixed(Utils.decCount(o.accuracy));
                percent = (Utils.isValue(percent) ? +percent : 0).toFixed(Utils.decCount(o.accuracy));
                buffer = (Utils.isValue(buffer) ? +buffer : 0).toFixed(Utils.decCount(o.accuracy));
            }

            if (element[0].tagName === "INPUT") {
                element.val(value);
            }

            if (o.target !== null) {
                var target = $(o.target);
                if (target.length !== 0) {

                    $.each(target, function(){
                        var t = $(this);
                        if (this.tagName === "INPUT") {
                            t.val(value);
                        } else {
                            t.text(value);
                        }
                        t.trigger("change");
                    });
                }
            }

            this._fireEvent("change-value", {
                val: value
            });

            this._fireEvent("change", {
                val: value,
                percent: percent,
                buffer: buffer
            });
        },

        _marker: function(){
            var slider = this.slider, o = this.options;
            var marker = slider.find(".marker"), complete = slider.find(".complete");
            var length = o.vertical === true ? slider.outerHeight() : slider.outerWidth();
            var marker_size = parseInt(Utils.getStyleOne(marker, "width"));
            var slider_visible = Utils.isVisible(slider);

            if (slider_visible) {
                marker.css({
                    'margin-top': 0,
                    'margin-left': 0
                });
            }

            if (o.vertical === true) {
                if (slider_visible) {
                    marker.css('top', length - this.pixel);
                } else {
                    marker.css('top', (100 - this.percent) + "%");
                    marker.css('margin-top', marker_size / 2);
                }
                complete.css('height', this.percent+"%");
            } else {
                if (slider_visible) {
                    marker.css('left', this.pixel);
                } else {
                    marker.css('left', this.percent + "%");
                    marker.css('margin-left', this.percent === 0 ? 0 : -1 * marker_size / 2);
                }
                complete.css('width', this.percent+"%");
            }
        },

        _redraw: function(){
            this._marker();
            this._value();
            this._hint();
        },

        _buffer: function(){
            var element = this.element, o = this.options;
            var buffer = this.slider.find(".buffer");

            if (o.vertical === true) {
                buffer.css("height", this.buffer + "%");
            } else {
                buffer.css("width", this.buffer + "%");
            }

            this._fireEvent("change-buffer", {
                val: this.buffer
            });

            this._fireEvent("change", {
                val: element.val(),
                percent: this.percent,
                buffer: this.buffer
            });
        },

        val: function(v){
            var o = this.options;

            if (v === undefined || isNaN(v)) {
                return this.value;
            }

            if (v < o.min) {
                v = o.min;
            }

            if (v > o.max) {
                v = o.max;
            }

            this.value = this._correct(v);
            this.percent = this._convert(this.value, 'val2prc');
            this.pixel = this._convert(this.percent, 'prc2pix');

            this._redraw();
        },

        buff: function(v){
            var slider = this.slider;
            var buffer = slider.find(".buffer");

            if (v === undefined || isNaN(v)) {
                return this.buffer;
            }

            if (buffer.length === 0) {
                return false;
            }

            v = parseInt(v);

            if (v > 100) {
                v = 100;
            }

            if (v < 0) {
                v = 0;
            }

            this.buffer = v;
            this._buffer();
        },

        changeValue: function(){
            var element = this.element, o = this.options;
            var val = element.attr("data-value");
            if (val < o.min) {
                val = o.min
            }
            if (val > o.max) {
                val = o.max
            }
            this.val(val);
        },

        changeBuffer: function(){
            var element = this.element;
            var val = parseInt(element.attr("data-buffer"));
            if (val < 0) {
                val = 0
            }
            if (val > 100) {
                val = 100
            }
            this.buff(val);
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
            switch (attributeName) {
                case "data-value": this.changeValue(); break;
                case "data-buffer": this.changeBuffer(); break;
                case 'disabled': this.toggleState(); break;
            }
        },

        destroy: function(){
            const element = this.element, o = this.options, slider = this.slider;
            const marker = slider.find(".marker");

            marker.off(Metro.events.startAll);
            marker.off(Metro.events.focus);
            marker.off(Metro.events.blur);
            marker.off(Metro.events.keydown);
            marker.off(Metro.events.keyup);
            slider.off(Metro.events.click);
            $(globalThis).off(Metro.events.resize, {ns: this.id});

            if (o.label) {
                slider.prev("label").remove()
            }
            
            slider.remove();
        }
    });
}(Metro, Dom));