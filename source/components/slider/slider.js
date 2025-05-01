((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let SliderDefaultConfig = {
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

    Metro.sliderSetup = (options) => {
        SliderDefaultConfig = $.extend({}, SliderDefaultConfig, options);
    };

    if (typeof globalThis.metroSliderSetup !== "undefined") {
        Metro.sliderSetup(globalThis.metroSliderSetup);
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
                id: Metro.utils.elementId('slider')
            });

            return this;
        },

        _create: function(){
            const element = this.element;
            const o = this.options;

            this._createSlider();
            this._createEvents();
            this.buff(o.buffer);
            this.val(o.value);

            this._fireEvent("slider-create", {
                element: element
            });
        },

        _createSlider: function(){
            const element = this.element;
            const o = this.options;

            const backside = $("<div>").addClass("backside").addClass(o.clsBackside);
            const complete = $("<div>").addClass("complete").addClass(o.clsComplete);
            const buffer = $("<div>").addClass("buffer").addClass(o.clsBuffer);
            const marker = $("<button>").attr("type", "button").addClass("marker").addClass(o.clsMarker);
            const hint = $("<div>").addClass("hint").addClass(`${o.hintPosition}-side`).addClass(o.clsHint);
            let i;

            const slider = element.wrap("<div>").addClass("slider").addClass(element[0].className).addClass(o.clsSlider);
            
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
                const min_max_wrapper = $("<div>").addClass("slider-min-max").addClass(o.clsMinMax);
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
            const slider = this.slider;
            const o = this.options;
            const marker = slider.find(".marker");
            const hint = slider.find(".hint");

            marker.on(Metro.events.startAll, ()=> {
                if (o.hint === true && o.hintAlways !== true) {
                    hint.fadeIn(300);
                }

                $(document).on(Metro.events.moveAll, (e)=> {
                    if (e.cancelable) e.preventDefault();
                    this._move(e);

                    this._fireEvent("move", {
                        val: this.value,
                        percent: this.percent
                    });

                }, {ns: this.id, passive: false});

                $(document).on(Metro.events.stopAll, ()=> {
                    $(document).off(Metro.events.moveAll, {ns: this.id});
                    $(document).off(Metro.events.stopAll, {ns: this.id});

                    if (o.hintAlways !== true) {
                        hint.fadeOut(300);
                    }

                    this._fireEvent("stop", {
                        val: this.value,
                        percent: this.percent
                    });
                }, {ns: this.id});

                this._fireEvent("start", {
                    val: this.value,
                    percent: this.percent
                });
            });

            marker.on(Metro.events.focus, ()=> {
                this._fireEvent("focus", {
                    val: this.value,
                    percent: this.percent
                });
            });

            marker.on(Metro.events.blur, ()=> {
                this._fireEvent("blur", {
                    val: this.value,
                    percent: this.percent
                });
            });

            marker.on(Metro.events.keydown, (e)=> {
                const key = e.keyCode ? e.keyCode : e.which;

                if ([37,38,39,40].indexOf(key) === -1) {
                    return;
                }

                const step = o.accuracy === 0 ? 1 : o.accuracy;

                if (this.keyInterval) {
                    return ;
                }
                this.keyInterval = setInterval(()=> {
                    let val = this.value;

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

                    this.value = this._correct(val);
                    this.percent = this._convert(this.value, 'val2prc');
                    this.pixel = this._convert(this.percent, 'prc2pix');

                    this._redraw();
                }, 100);

                e.preventDefault();
            });

            marker.on(Metro.events.keyup, ()=> {
                clearInterval(this.keyInterval);
                this.keyInterval = false;
            });

            slider.on(Metro.events.click, (e)=> {
                this._move(e);

                this._fireEvent("slider-click", {
                    val: this.value,
                    percent: this.percent
                });

                this._fireEvent("stop", {
                    val: this.value,
                    percent: this.percent
                });
            });

            $(globalThis).on(Metro.events.resize,()=> {
                this.val(this.value);
                this.buff(this.buffer);
            }, {ns: this.id});
        },

        _convert: function(v, how){
            const slider = this.slider;
            const o = this.options;
            const length = (o.vertical === true ? slider.outerHeight() : slider.outerWidth()) - slider.find(".marker").outerWidth();
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
            let res = value;
            const accuracy  = this.options.accuracy;
            const min = this.options.min;
            const max = this.options.max;

            if (accuracy === 0 || Number.isNaN(accuracy)) {
                return res;
            }

            res = Math.round(value/accuracy)*accuracy;

            if (res < min) {
                res = min;
            }

            if (res > max) {
                res = max;
            }

            return res.toFixed(Metro.utils.decCount(accuracy));
        },

        _move: function(e){
            const slider = this.slider;
            const o = this.options;
            const offset = slider.offset();
            const marker_size = slider.find(".marker").outerWidth();
            const length = o.vertical === true ? slider.outerHeight() : slider.outerWidth();
            const cStart = 0;
            const cStop = length - marker_size;

            const cPos = o.vertical === true ? Metro.utils.pageXY(e).y - offset.top : Metro.utils.pageXY(e).x - offset.left
            const cPix = o.vertical === true ? length - cPos - marker_size / 2 : cPos - marker_size / 2
            if (cPix < cStart || cPix > cStop) {
                return ;
            }

            this.value = this._correct(this._convert(cPix, 'pix2val'));
            this.percent = this._convert(this.value, 'val2prc');
            this.pixel = this._convert(this.percent, 'prc2pix');

            this._redraw();
        },

        _hint: function(){
            const o = this.options;
            const slider = this.slider;
            const hint = slider.find(".hint");
            let value = +this.value || 0;
            let percent = +this.percent || 0;

            if (o.roundValue) {
                value = (Metro.utils.isValue(value) ? +value : 0).toFixed(Metro.utils.decCount(o.accuracy));
                percent = (Metro.utils.isValue(percent) ? +percent : 0).toFixed(Metro.utils.decCount(o.accuracy));
            }

            hint.text(o.hintMask.replace("$1", value).replace("$2", percent));
        },

        _value: function(){
            const element = this.element;
            const o = this.options;
            let value = o.returnType === 'value' ? this.value : this.percent;
            let percent = this.percent;
            let buffer = this.buffer;

            if (o.roundValue) {
                value = (Metro.utils.isValue(value) ? +value : 0).toFixed(Metro.utils.decCount(o.accuracy));
                percent = (Metro.utils.isValue(percent) ? +percent : 0).toFixed(Metro.utils.decCount(o.accuracy));
                buffer = (Metro.utils.isValue(buffer) ? +buffer : 0).toFixed(Metro.utils.decCount(o.accuracy));
            }

            if (element[0].tagName === "INPUT") {
                element.val(value);
            }

            if (o.target !== null) {
                const target = $(o.target);
                if (target.length !== 0) {

                    $.each(target, function(){
                        const t = $(this);
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
            const slider = this.slider;
            const o = this.options;
            const marker = slider.find(".marker");
            const complete = slider.find(".complete");
            const length = o.vertical === true ? slider.outerHeight() : slider.outerWidth();
            const marker_size = Number.parseInt(Metro.utils.getStyleOne(marker, "width"));
            const slider_visible = Metro.utils.isVisible(slider);

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
                    marker.css('top', `${100 - this.percent}%`);
                    marker.css('margin-top', marker_size / 2);
                }
                complete.css('height', `${this.percent}%`);
            } else {
                if (slider_visible) {
                    marker.css('left', this.pixel);
                } else {
                    marker.css('left', `${this.percent}%`);
                    marker.css('margin-left', this.percent === 0 ? 0 : -1 * marker_size / 2);
                }
                complete.css('width', `${this.percent}%`);
            }
        },

        _redraw: function(){
            this._marker();
            this._value();
            this._hint();
        },

        _buffer: function(){
            const element = this.element;
            const o = this.options;
            const buffer = this.slider.find(".buffer");

            if (o.vertical === true) {
                buffer.css("height", `${this.buffer}%`);
            } else {
                buffer.css("width", `${this.buffer}%`);
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
            const o = this.options;

            if (v === undefined || Number.isNaN(v)) {
                return this.value;
            }

            let value = Number.parseFloat(v);
            
            if (value < o.min) {
                value = o.min;
            }

            if (value > o.max) {
                value = o.max;
            }

            this.value = this._correct(value);
            this.percent = this._convert(this.value, 'val2prc');
            this.pixel = this._convert(this.percent, 'prc2pix');

            this._redraw();
        },

        buff: function(v){
            const slider = this.slider;
            const buffer = slider.find(".buffer");

            if (v === undefined || Number.isNaN(v)) {
                return this.buffer;
            }

            if (buffer.length === 0) {
                return false;
            }

            let value = Number.parseFloat(v);

            if (value > 100) {
                value = 100;
            }

            if (value < 0) {
                value = 0;
            }

            this.buffer = value;
            this._buffer();
        },

        changeValue: function(){
            const element = this.element;
            const o = this.options;
            let val = element.attr("data-value");
            if (val < o.min) {
                val = o.min
            }
            if (val > o.max) {
                val = o.max
            }
            this.val(val);
        },

        changeBuffer: function(){
            const element = this.element;
            let val = Number.parseInt(element.attr("data-buffer"));
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
            const o = this.options;
            const slider = this.slider;
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
})(Metro, Dom);