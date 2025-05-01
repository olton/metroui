((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let MarqueeDefaultConfig = {
        items: null,
        loop: true,
        height: "auto",
        width: "100%",
        duration: 10000,
        direction: "left",
        ease: "linear",
        mode: "default", // default || accent
        accentPause: 2000,
        firstPause: 1000,
        stopOnHover: true,

        clsMarquee: "",
        clsMarqueeItem: "",

        onMarqueeItem: Metro.noop,
        onMarqueeItemComplete: Metro.noop,
        onMarqueeComplete: Metro.noop,
        onMarqueeCreate: Metro.noop
    };

    Metro.marqueeSetup = (options) => {
        MarqueeDefaultConfig = $.extend({}, MarqueeDefaultConfig, options);
    };

    if (typeof globalThis.metroMarqueeSetup !== "undefined") {
        Metro.marqueeSetup(globalThis.metroMarqueeSetup);
    }

    Metro.Component('marquee', {
        init: function( options, elem ) {
            this._super(elem, options, MarqueeDefaultConfig, {
                // define instance vars here
                origin: null,
                items: [],
                running: false,
                current: -1,
                chain: [],
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('marquee-create');
        },

        _createStructure: function(){
            const element = this.element;
            const o = this.options;

            element.addClass("marquee").addClass(o.clsMarquee);

            element.css({
                height: o.height,
                width: o.width,
            });

            const items = element.html().split("\n").map(a => a.trim()).filter(a => a.length)
            const itemsFromOptions = Metro.utils.isObject(o.items) || []

            this.origin = [...items,  ...itemsFromOptions]
            this.setItems(this.origin, true);
            
            if (this.items.length) {
                this.current = 0;
                this.createChain()
                console.log(this.chain)
                this.start();
            }
        },

        setItems: function(items, replace = true){
            const element = this.element;
            const o = this.options;
            const dir = o.direction.toLowerCase()

            if (replace) {
                this.items.length = 0    
            }

            element.clear();
            
            this.items = items.map((item) => {
                return $("<div>").html(item).addClass("marquee__item").addClass(o.clsMarqueeItem).appendTo(element)[0];
            })

            $(this.items).addClass((dir === "left" || dir === "right") ? "moveLeftRight" : "moveUpDown")
            
            if (o.height === "auto") {
                let h = 0;
                $(this.items).each(function(){
                    const el = $(this)
                    const eh = +el.outerHeight(true)
                    if ( eh > h) {
                        h = eh
                    }
                });
                element.height(h);
            }
            return this
        },


        setItem: function(index, value){
            const target = $(this.items[index]);
            let h;
            const o = this.options;
            const element = this.element;

            if (!target.length) {
                return;
            }

            target.html(value)

            h = target.outerHeight(true)
            
            if (o.height === "auto" && element.height() < h) {
                element.height(h);
            }
            
            return this
        },

        addItem: function(item, index = -1){
            const element = this.element;
            const o = this.options;
            let ins;
            const $item = $(item);
            let trg;
            let h;

            ins = $item.length ? $item : $("<div>").html(item);

            if (index < 0) {
                element.append(ins);
            } else {
                trg = this.items[index]
                if (trg) {
                    ins.insertBefore(trg);
                } else {
                    element.append(ins);
                }
            }

            h = ins.outerHeight(true)
            
            if (o.height === "auto" && element.height() < h) {
                element.height(h);
            }
            
            return this
        },

        createChain: function(){
            const element = this.element
            const o = this.options
            const magic = 20
            let dir = o.direction
            let ease = o.ease
            let dur = +o.duration
            let i = 0
            const rect = element[0].getBoundingClientRect()

            this.chain.length = 0
            
            if (o.mode === "default") {
                for (const item of this.items) {
                    const el = $(item);
                    const elRect = item.getBoundingClientRect()
                    const half = (rect.width - elRect.width) / 2
                    
                    let draw;

                    if (el.attr("data-direction")) {
                        dir = el.attr("data-direction");
                    }

                    if (el.attr("data-duration")) {
                        dur = +el.attr("data-duration");
                    }

                    if (el.attr("data-ease")) {
                        ease = el.attr("data-ease");
                    } else {
                        ease = o.ease;
                    }

                    if (["left", "right"].indexOf(dir) > -1) {
                        draw = {
                            left: dir === "left" 
                                ? [rect.width, -elRect.width - magic] 
                                : [-elRect.width - magic, rect.width]
                        }
                    } else {
                        draw = {
                            top: dir === "up" 
                                ? [rect.height, -elRect.height - magic] 
                                : [-elRect.height - magic, rect.height]
                        }
                    }

                    this.chain.push({
                        el: el[0],
                        draw: draw,
                        dur: dur,
                        ease,
                        defer: i === 0 ? +o.firstPause : 0
                    });

                    i++
                }
            } else {
                for (const item of this.items) {
                    const el = $(item);
                    const elRect = item.getBoundingClientRect()
                    const halfW = (rect.width - elRect.width) / 2
                    const halfH = (rect.height - elRect.height) / 2
                    
                    let draw1;
                    let draw2;
                    
                    dur = o.duration / 2;

                    if (el.attr("data-direction")) {
                        dir = el.attr("data-direction").toLowerCase();
                    }

                    if (el.attr("data-duration")) {
                        dur = +el.attr("data-duration") / 2;
                    }
                    
                    let _ease = ease ? ease.split(" ") : ["linear"]
                    if (el.attr("data-ease")) {
                        _ease = el.attr("data-ease").split(" ");
                    }
                    
                    if (["left", "right"].includes(dir)) {
                        draw1 = {
                            left: dir === "left" 
                                ? [rect.width, halfW] 
                                : [-elRect.width - magic, halfW]
                        }
                        draw2 = {
                            left: dir === "left" 
                                ? [halfW, -elRect.width - magic] 
                                : [halfW, rect.width + magic]
                        }
                    } else {
                        draw1 = {
                            top: dir === "up" 
                                ? [rect.height, halfH] 
                                : [-elRect.height - magic, halfH]
                        }
                        draw2 = {
                            top: dir === "up" 
                                ? [halfH, -elRect.height - magic] 
                                : [halfH, rect.height + magic]
                        }
                    }
                    
                    this.chain.push({
                        el: el[0],
                        draw: draw1,
                        dur: dur,
                        ease: _ease[0] || "linear",
                        defer: i === 0 ? +o.firstPause : 0
                    });
                    this.chain.push({
                        el: el[0],
                        draw: draw2,
                        dur: dur,
                        ease: _ease[1] ? _ease[1] : _ease[0] ? _ease[0] : "linear",
                        defer: +o.accentPause
                    });

                    i++
                }
            }
        },
        
        _createEvents: function(){
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.enter, ()=> {
                if (o.stopOnHover)
                    $.pauseAll(this.items);
            })

            element.on(Metro.events.leave, ()=> {
                if (o.stopOnHover)
                    $.resumeAll(this.items);
            })
            
            const resize = Hooks.useDebounce((e) => {
                this.stop()
                this.setItems(this.items, true)
                this.createChain();
                this.start();
            }, 1000)
            
            $(window).on(Metro.events.resize, resize)
        },

        start: function(){
            const o = this.options
            
            this.running = true;

            $.chain(this.chain, {
                loop: o.loop,
                onChainItem: Metro.utils.isFunc(o.onMarqueeItem),
                onChainItemComplete: Metro.utils.isFunc(o.onMarqueeItemComplete),
                onChainComplete: Metro.utils.isFunc(o.onMarqueeComplete)
            });
            
            return this
        },

        stop: function(){
            this.running = false;
            $.stopAll(false);
            return this
        },

        changeAttribute: (attr, val)=> {
        },

        destroy: function(){
            this.element.remove();
        }
    });
})(Metro, Dom);
