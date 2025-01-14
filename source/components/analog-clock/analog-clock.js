(function(Metro, $) {
    'use strict';

    var AnalogClockDefaultConfig = {
        icon: null,
        showNumbers: false,
        showMoon: true,
        showDay: true,
        showDigitalClock: true,
        timeFormat: 24,
        onAnalogClockCreate: Metro.noop
    };

    Metro.analogClockSetup = function (options) {
        AnalogClockDefaultConfig = $.extend({}, AnalogClockDefaultConfig, options);
    };

    if (typeof window["metroAnalogClockSetup"] !== undefined) {
        Metro.analogClockSetup(window["metroAnalogClockSetup"]);
    }

    Metro.Component('analog-clock', {
        init: function( options, elem ) {
            this._super(elem, options, AnalogClockDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('analog-clock-create');
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            const now = datetime()
            
            element.addClass("analog-clock");
            
            if (o.showNumbers) {
                element.addClass("show-numbers");
            }
            
            for (let i = 1; i <= 12; i++) {
                element.append(`<label class="dash" style="--i: ${i}"><span>${o.showNumbers ? i : '|'}</span></label>`);
            }
            
            for (let i = 1; i <= 90; i++) {
                if (i % 5 === 0) {
                    continue
                }
                element.append(`<label class="secondary-dash" style="--i2: ${i}"><span>|</span></label>`);
            }
            
            element.append(`
                <div class="hands">
                    <div class="hour"></div>                
                    <div class="minute"></div>                
                    <div class="second"></div>                
                </div>
                  
            `)
            
            element.append(`
                <div class="day-month">
                    <div class="day-month-inner">
                        <div class="day">${now.format("DD", this.locale)}</div>
                        <div class="month">${now.format("MMM", this.locale)}</div>                    
                    </div>
                    <div class="week-day">${now.format("dddd", this.locale)}</div>
                </div>
            `);
            
            if (o.showDay === false) {
                element.find(".day-month").hide();
            }
            
            element.append(`
                <div class="digital-clock">
                    <div class="dc-hour">${now.format(o.timeFormat === 24 ? "HH" : "hh", this.locale)}</div>
                    <div class="dc-minute">${now.format("mm", this.locale)}</div>
                    <div class="dc-second">${now.format("ss", this.locale)}</div>
                </div>
            `);
            
            if (o.showDigitalClock === false) {
                element.find(".digital-clock").hide();
            }
            
            if (o.icon) {
                element.append(`<div class="icon">${o.icon}</div>`)
            }
            
            if (o.showMoon === true) {
                element.append(`<div class="moon"></div>`)
            }
            
            this._updateTime()
            
            setInterval(() => {
                element.toggleClass("tick")
            }, 500)
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

        },

        _updateTime: function(){
            const element = this.element, o = this.options;
            
            const secondHand = element.find(".second")
            const minuteHand = element.find(".minute")
            const hourHand = element.find(".hour")
            const secondDig = element.find(".dc-second")
            const minuteDig = element.find(".dc-minute")
            const hourDig = element.find(".dc-hour")
            const dayEl = element.find(".day")
            const monthEl = element.find(".month")
            const moonEl = element.find(".moon")
                
            const updateTime = () => {
                let date = datetime(),
                    sec = (date.second() / 60) * 360,
                    min = (date.minute() / 60) * 360,
                    hr = (date.hour12() / 12) * 360,
                    day = date.format("DD", this.locale),
                    month = date.format("MMM", this.locale),
                    moon = date.moon();

                secondHand[0].style.transform = `rotate(${sec}deg)`;
                minuteHand[0].style.transform = `rotate(${min}deg)`;
                hourHand[0].style.transform = `rotate(${hr}deg)`;
                dayEl.html(day);
                monthEl.html(month);
                moonEl.removeClass("").addClass(`${moon.name}`);
                
                hourDig[0].innerHTML = date.format(o.timeFormat === 24 ? "HH" : "hh", this.locale);
                minuteDig[0].innerHTML = date.format("mm", this.locale);
                secondDig[0].innerHTML = date.format("ss", this.locale);
            };

            updateTime();
            
            setInterval(updateTime, 1000);
        },
        
        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));