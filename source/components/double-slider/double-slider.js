((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let DoubleSliderDefaultConfig = {
        doubleSliderDeferred: 0,
        roundValue: true,
        min: 0,
        max: 100,
        accuracy: 0,
        showMinMax: false,
        minMaxPosition: Metro.position.BOTTOM,
        valueMin: null,
        valueMax: null,
        hint: false,
        hintAlways: false,
        hintPositionMin: Metro.position.TOP,
        hintPositionMax: Metro.position.TOP,
        hintMaskMin: "$1",
        hintMaskMax: "$1",
        target: null,
        size: 0,

        clsSlider: "",
        clsBackside: "",
        clsComplete: "",
        clsMarker: "",
        clsMarkerMin: "",
        clsMarkerMax: "",
        clsHint: "",
        clsHintMin: "",
        clsHintMax: "",
        clsMinMax: "",
        clsMin: "",
        clsMax: "",

        onStart: Metro.noop,
        onStop: Metro.noop,
        onMove: Metro.noop,
        onChange: Metro.noop,
        onChangeValue: Metro.noop,
        onFocus: Metro.noop,
        onBlur: Metro.noop,
        onDoubleSliderCreate: Metro.noop
    };

    Metro.doubleSliderSetup = (options) => {
        DoubleSliderDefaultConfig = $.extend({}, DoubleSliderDefaultConfig, options);
    };

    if (typeof globalThis.metroDoubleSliderSetup !== "undefined") {
        Metro.doubleSliderSetup(globalThis.metroDoubleSliderSetup);
    }

    Metro.Component('double-slider', {
        init: function( options, elem ) {
            this._super(elem, options, DoubleSliderDefaultConfig, {
                slider: null,
                valueMin: null,
                valueMax: null,
                keyInterval: false,
                id: Metro.utils.elementId("slider")
            });

            return this;
        },

        _create: function(){
            const element = this.element;
            const o = this.options;

            this.valueMin = Metro.utils.isValue(o.valueMin) ? +o.valueMin : +o.min;
            this.valueMax = Metro.utils.isValue(o.valueMax) ? +o.valueMax : +o.max;

            this._createSlider();
            this._createEvents();

            this.val(this.valueMin, this.valueMax);

            this._fireEvent("double-slider-create", {
                element: element
            })
        },

        _createSlider: function(){
            const element = this.element;
            const o = this.options;
            const slider_wrapper = $("<div>").addClass("slider-wrapper");
            const slider = $("<div>").addClass("slider").addClass(o.clsSlider).addClass(this.elem.className);
            const backside = $("<div>").addClass("backside").addClass(o.clsBackside);
            const complete = $("<div>").addClass("complete").addClass(o.clsComplete);
            const markerMin = $("<button>").attr("type", "button").addClass("marker marker-min").addClass(o.clsMarker).addClass(o.clsMarkerMin);
            const markerMax = $("<button>").attr("type", "button").addClass("marker marker-max").addClass(o.clsMarker).addClass(o.clsMarkerMax);
            const hintMin = $("<div>").addClass("hint hint-min").addClass(`${o.hintPositionMin}-side`).addClass(o.clsHint).addClass(o.clsHintMin);
            const hintMax = $("<div>").addClass("hint hint-max").addClass(`${o.hintPositionMax}-side`).addClass(o.clsHint).addClass(o.clsHintMax);
            let i;
            
            if (o.size > 0) {
                slider.outerWidth(o.size);
            }

            slider.insertBefore(element);
            element.appendTo(slider);
            slider_wrapper.insertBefore(slider);
            slider.appendTo(slider_wrapper);

            backside.appendTo(slider);
            complete.appendTo(slider);
            markerMin.appendTo(slider);
            markerMax.appendTo(slider);
            hintMin.appendTo(markerMin);
            hintMax.appendTo(markerMax);

            if (o.hintAlways === true) {
                $([hintMin, hintMax]).css({
                    display: "block"
                }).addClass("permanent-hint");
            }

            if (o.showMinMax === true) {
                const min_max_wrapper = $("<div>").addClass("slider-min-max").addClass(o.clsMinMax);
                $("<span>").addClass("slider-text-min").addClass(o.clsMin).html(`${o.min}`).appendTo(min_max_wrapper);
                $("<span>").addClass("slider-text-max").addClass(o.clsMax).html(`${o.max}`).appendTo(min_max_wrapper);
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
            const that = this;
            const slider = this.slider;
            const o = this.options;
            const marker = slider.find(".marker");

            marker.on(Metro.events.startAll, function(){
                const _marker = $(this);
                const hint = _marker.find(".hint");
                
                _marker.addClass("active");
                
                if (o.hint === true && o.hintAlways !== true) {
                    hint.fadeIn(300);
                }

                $(document).on(Metro.events.moveAll, (e)=> {
                    that._move(e);
                    that._fireEvent("move", {
                        min: that.valueMin,
                        max: that.valueMax
                    });

                }, {ns: that.id});

                $(document).on(Metro.events.stopAll, ()=> {
                    slider.find(".marker").removeClass("active");
                    
                    $(document).off(Metro.events.moveAll, {ns: that.id});
                    $(document).off(Metro.events.stopAll, {ns: that.id});

                    if (o.hintAlways !== true) {
                        hint.fadeOut(300);
                    }

                    that._fireEvent("stop", {
                        min: that.valueMin,
                        max: that.valueMax
                    });
                }, {ns: that.id});

                that._fireEvent("start", {
                    min: that.valueMin,
                    max: that.valueMax
                });
            });

            marker.on(Metro.events.focus, ()=> {
                that._fireEvent("focus", {
                    min: that.valueMin,
                    max: that.valueMax
                });
            });

            marker.on(Metro.events.blur, ()=> {
                that._fireEvent("blur", {
                    min: that.valueMin,
                    max: that.valueMax
                });
            });

            $(globalThis).on(Metro.events.resize,()=> {
                that.val(that.valueMin, that.valueMax);
            }, {ns: that.id});
        },

        _convert: function(v, how){
            const slider = this.slider;
            const o = this.options;
            const length = slider.outerWidth() - slider.find(".marker").outerWidth();
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
            const _dec = (v)=> v % 1 === 0 ? 0 : v.toString().split(".")[1].length;

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

            return res.toFixed(_dec(accuracy));
        },

        _move: function(e){
            const target = this.slider.find(".marker.active");
            const isMin = target.hasClass("marker-min");
            const slider = this.slider;
            const offset = slider.offset();
            const marker_size = slider.find(".marker").outerWidth();
            const markerMin = slider.find(".marker-min");
            const markerMax = slider.find(".marker-max");
            const length = slider.outerWidth();
            let cStart;
            let cStop;

            const cPix = Metro.utils.pageXY(e).x - offset.left - marker_size / 2
            if (isMin) {
                cStart = 0;
                cStop = Number.parseInt(markerMax.css("left")) - marker_size;
            } else {
                cStart = Number.parseInt(markerMin.css("left")) + marker_size;
                cStop = length - marker_size;
            }

            if (cPix < cStart || cPix > cStop) {
                return ;
            }

            this[isMin ? "valueMin" : "valueMax"] = this._correct(this._convert(cPix, 'pix2val'));

            this._redraw();
        },

        _hint: function(){
            const that = this;
            const o = this.options;
            const slider = this.slider;
            const hint = slider.find(".hint");

            hint.each(function(){
                const _hint = $(this);
                const isMin = _hint.hasClass("hint-min");
                const _mask = isMin ? o.hintMaskMin : o.hintMaskMax;
                const value = +(isMin ? that.valueMin : that.valueMax) || 0;
                _hint.text(_mask.replace("$1", value.toFixed(Metro.utils.decCount(o.accuracy))))
            });
        },

        _value: function(){
            const element = this.element;
            const o = this.options;
            let v1 = +this.valueMin || 0;
            let v2 = +this.valueMax || 0;
            let value;

            if (o.roundValue) {
                v1 = v1.toFixed(Metro.utils.decCount(o.accuracy));
                v2 = v2.toFixed(Metro.utils.decCount(o.accuracy));
            }

            value = [v1, v2].join(", ");

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
                val: value
            });
        },

        _marker: function(){
            const slider = this.slider;
            const markerMin = slider.find(".marker-min");
            const markerMax = slider.find(".marker-max");
            const complete = slider.find(".complete");
            const marker_size = Number.parseInt(Metro.utils.getStyleOne(markerMin, "width"));
            const slider_visible = Metro.utils.isVisible(slider);

            if (slider_visible) {
                $([markerMin, markerMax]).css({
                    'margin-top': 0,
                    'margin-left': 0
                });
            }

            if (slider_visible) {
                markerMin.css('left', this._convert(this.valueMin, 'val2pix'));
                markerMax.css('left', this._convert(this.valueMax, 'val2pix'));
            } else {
                markerMin.css({
                    'left': `${this._convert(this.valueMin, 'val2prc')}%`,
                    'margin-top': this._convert(this.valueMin, 'val2prc') === 0 ? 0 : -1 * marker_size / 2
                });
                markerMax.css({
                    'left': `${this._convert(this.valueMax, 'val2prc')}%`,
                    'margin-top': this._convert(this.valueMax, 'val2prc') === 0 ? 0 : -1 * marker_size / 2
                });
            }

            complete.css({
                "left": this._convert(this.valueMin, 'val2pix'),
                "width": this._convert(this.valueMax, 'val2pix') - this._convert(this.valueMin, 'val2pix')
            });
        },

        _redraw: function(){
            this._marker();
            this._value();
            this._hint();
        },

        val: function(vMin, vMax){
            const o = this.options;

            if (!Metro.utils.isValue(vMin) && !Metro.utils.isValue(vMax)) {
                return [this.valueMin, this.valueMax];
            }
                        
            let min = vMin
            let max = vMax
            
            if (typeof min !== "undefined" && min < o.min) min = o.min;
            if (typeof max !== "undefined" && max < o.min) max = o.min;

            if (typeof min !== "undefined" && min > o.max) min = o.max;
            if (typeof max !== "undefined" && max > o.max) max = o.max;

            if (typeof min !== "undefined") this.valueMin = this._correct(min);
            if (typeof max !== "undefined") this.valueMax = this._correct(max);

            this._redraw();
        },

        changeValue: function(){
            const element = this.element;
            const valMin = +element.attr("data-value-min");
            const valMax = +element.attr("data-value-max");
            this.val(valMin, valMax);
        },

        disable: function(){
            const element = this.element;
            element.data("disabled", true);
            element.parent().addClass("disabled");
        },

        enable: function(){
            const element = this.element;
            element.data("disabled", false);
            element.parent().removeClass("disabled");
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
                case "data-value-min": this.changeValue(); break;
                case "data-value-max": this.changeValue(); break;
                case 'disabled': this.toggleState(); break;
            }
        },

        destroy: function(){
            const element = this.element;
            const slider = this.slider;
            const marker = slider.find(".marker");

            marker.off(Metro.events.startAll);
            marker.off(Metro.events.focus);
            marker.off(Metro.events.blur);
            marker.off(Metro.events.keydown);
            marker.off(Metro.events.keyup);
            slider.off(Metro.events.click);
            $(globalThis).off(Metro.events.resize, {ns: this.id});

            element.remove();
        }
    });
})(Metro, Dom);