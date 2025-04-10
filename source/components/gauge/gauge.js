(function(Metro, $) {
    'use strict';

    let GaugeDefaultConfig = {
        min: 0,
        max: 100,
        value: 0,
        size: 0,
        labelMin: "",
        labelMax: "",
        label: "",
        suffix: "",
        values: 10,
        segments: 10,
        startAngle: 235,
        range: 250,
        theme: "",
        onGaugeCreate: Metro.noop
    };

    Metro.gaugeSetup = function (options) {
        GaugeDefaultConfig = $.extend({}, GaugeDefaultConfig, options);
    };

    if (typeof window["metroGaugeSetup"] !== undefined) {
        Metro.gaugeSetup(window["metroGaugeSetup"]);
    }

    Metro.Component('gauge', {
        init: function( options, elem ) {
            this._super(elem, options, GaugeDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            const that = this, element = this.element, o = this.options;

            element[0].style.setProperty('--analog-gauge-segments', `${o.segments}`);
            element[0].style.setProperty('--analog-gauge-start-angle', `${o.startAngle}deg`);
            element[0].style.setProperty('--analog-gauge-range', `${o.range}deg`);

            this.options.range = parseFloat(getComputedStyle(element[0]).getPropertyValue('--analog-gauge-range' || 250));
            this.options.start = parseFloat(getComputedStyle(element[0]).getPropertyValue('--analog-gauge-start-angle' || 235));
            this.options.defaultMark = 90
            this.options.defaultNeedle = 270
            this.options.minDegree = this.options.start - this.options.defaultNeedle;
            
            this._createStructure();
            this._createEvents();
            this.update();

            this._fireEvent('gauge-create');
        },

        _generateMarks: function(){
            const o = this.options;
            const values = (""+o.values).trim();
            
            if (values === "") return '';

            let t = values.toArray(",");
            let valueArray = [];
            let count

            if (t.length === 1) {
                valueArray = Array.from({ length: +values }, (_, i) =>
                  Math.round(o.min + (i * (o.max - o.min) / (+values - 1 || 1)))
                );
                count = parseInt(values);
            } else {
                valueArray = [...t]
                count = t.length;
            }            
            
            const degreeStep = o.range / (count - 1 || 1);

            return `
                <ul class="value-marks">
                  ${valueArray.map((value, i) => {
                            const degree = o.start - o.defaultMark + (i * degreeStep);
                            return `<li style="--_d:${degree}deg" class="mark">${value}</li>`;
                        }).join('')}
                </ul>
            `;
        },
        
        _createStructure: function(){
            const that = this, element = this.element, o = this.options;
            
            element.addClass("analog-gauge");
            
            if (o.size) {
                element.css({
                    width: o.size,
                    height: o.size
                });
            }
            
            element.html(`
                <div class="gauge"></div>
                ${this._generateMarks()} 
                <div class="needle"></div> 
                <div class="value">${o.value}</div> 
                <div class="label">${o.label}</div> 
                <div class="label-min">${o.labelMin}</div> 
                <div class="label-max">${o.labelMax}</div> 
            `)
            
            if (o.theme) {
                element.addClass(`theme-${o.theme}`);
            } 
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;
        },

        val: function(value){
            if (typeof value === "undefined") {
                return this.options.value;
            }

            this.options.value = value;
            this.update();
        },
        
        update: function (){
            const element = this.element, elem = this.elem, o = this.options;

            const normalizedValue = Math.max(o.min, Math.min(o.max, o.value));
            const valuePercentage = (normalizedValue - o.min) / (o.max - o.min);
            const degree = o.minDegree + (valuePercentage * o.range);
            elem.style.setProperty('--analog-gauge-value', `${valuePercentage * o.range}deg`);
            elem.style.setProperty('--_d', `${degree}deg`);
            
            element.find(".value").html(o.value + o.suffix);
        },
        
        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));