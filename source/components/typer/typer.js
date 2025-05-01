((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let TyperDefaultConfig = {
        splitter: ',',
        variance: 0,
        delay: 100,
        blinkDelay: 400,
        deleteDelay: 800,
        loop: true,
        cursor: "_",
        colors: "",
        onType: Metro.noop,
        onTyperCreate: Metro.noop
    };

    Metro.typerSetup = (options) => {
        TyperDefaultConfig = $.extend({}, TyperDefaultConfig, options);
    };

    if (typeof globalThis.metroTyperSetup !== "undefined") {
        Metro.typerSetup(globalThis.metroTyperSetup);
    }

    Metro.Component('typer', {
        init: function( options, elem ) {
            this._super(elem, options, TyperDefaultConfig, {
                // define instance vars here
                original: null,
                lines: null,
                text: null,
                cursor: null,
                on: true,
                interval: null,
                colors: null,
                colorIndex: 0,
            });
            return this;
        },

        _create: function(){
            const element = this.element;
            const o = this.options;

            element.addClass("typer");

            this.original = element.text()
            this.words = this.original.split(o.splitter).pack();
            this.colors = o.colors.split(",").pack();
            this.cursor = $("<span>").addClass("typer-cursor").html(o.cursor).insertAfter(element);
            this.interval = setInterval(() => this._blink(), +o.blinkDelay)
            this.progress = { word: 0, char: 0, building: true, looped: 0 };
            element.clear();
            this.start()
        },

        _blink: function(){
            if (this.on) {
                this.cursor[0].style.opacity = 0;
                this.on = false
            } else {
                this.cursor[0].style.opacity = 1;
                this.on = true
            }
        },

        doTyping: function(){
            const element = this.element;
            const elem = this.elem;
            const o = this.options;
            let atWordEnd
            const p = this.progress;
            const w = p.word
            const c = p.char
            const curr = [...this.words[w]].slice(0, c).join("")
            const timeout = ((2 * Math.random() - 1) * o.variance) + o.delay
            
            this.cursor[0].style.opacity = "1"
            this.on = true
            clearInterval(this.interval);
            this.interval = setInterval(() => this._blink(), +o.blinkDelay);

            element.html(curr)

            if (p.building) {
                atWordEnd = p.char === this.words[w].length;
                if (atWordEnd) {
                    p.building = false;
                } else {
                    p.char += 1;
                }
            } else {
                if (p.char === 0) {
                    p.building = true;
                    p.word = (p.word + 1) % this.words.length;
                    if (this.colors.length) {
                        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
                        elem.style.color = this.colors[this.colorIndex];
                    }
                } else {
                    p.char -= 1;
                }
            }

            if (p.word === this.words.length - 1) {
                p.looped += 1;
            }

            if (!p.building && this.loop <= p.looped){
                this.typing = false;
            }

            setTimeout(() => {
                if (this.typing) { this.doTyping() }
            }, atWordEnd ? o.deleteDelay : timeout);
        },

        start: function(){
            if (!this.typing) {
                this.typing = true;
                this.doTyping()
            }
        },

        stop: function(){
            this.typing = false
        },

        destroy: function(){
            this.element.remove();
        }
    });
})(Metro, Dom);