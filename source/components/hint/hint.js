((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let HintDefaultConfig = {
        hintDeferred: 0,
        hintHide: 5000,
        clsHint: "",
        hintText: "",
        hintPosition: Metro.position.TOP,
        hintOffset: 4,
        onHintShow: Metro.noop,
        onHintHide: Metro.noop,
        onHintCreate: Metro.noop
    };

    Metro.hintSetup = (options) => {
        HintDefaultConfig = $.extend({}, HintDefaultConfig, options);
    };

    if (typeof globalThis.metroHintSetup !== "undefined") {
        Metro.hintSetup(globalThis.metroHintSetup);
    }

    Metro.Component('hint', {
        init: function( options, elem ) {
            this._super(elem, options, HintDefaultConfig, {
                hint: null,
                hint_size: {
                    width: 0,
                    height: 0
                },
                id: Metro.utils.elementId("hint")
            });

            return this;
        },

        _create: function(){
            this._createEvents();
            this._fireEvent("hint-create", {
                element: this.element
            });
        },

        _createEvents: function(){
            const element = this.element;
            const o = this.options;
            let over = false;

            element.on(Metro.events.enter, ()=> {
                over = true;
                setTimeout(()=> {
                    if (!over) return;

                    this.createHint();
                    if (+o.hintHide > 0) {
                        setTimeout(()=> {
                            this.removeHint();
                        }, o.hintHide);
                    }
                }, o.hintDeferred);
            });

            element.on(Metro.events.leave, ()=> {
                over = false;
                this.removeHint();
            });

            $(globalThis).on(`${Metro.events.scroll} ${Metro.events.resize}`, ()=> {
                if (this.hint !== null) this.setPosition();
            }, {ns: this.id});
        },

        createHint: function(){
            const elem = this.elem;
            const element = this.element;
            const o = this.options;
            const hint = $("<div>").addClass("hint").addClass(o.clsHint).html(o.hintText);

            this.hint = hint;
            this.hint_size = Metro.utils.hiddenElementSize(hint);

            $(".hint:not(.permanent-hint)").remove();

            if (elem.tagName === 'TD' || elem.tagName === 'TH') {
                const wrp = $("<div/>").css("display", "inline-block").html(element.html());
                element.html(wrp);
                this.element = wrp;
            }

            this.setPosition();

            hint.appendTo($('body'));

            this._fireEvent("hint-show", {
                hint: hint[0]
            })
        },

        setPosition: function(){
            const hint = this.hint;
            const hint_size = this.hint_size;
            const o = this.options;
            const element = this.element;

            if (o.hintPosition === Metro.position.BOTTOM) {
                hint.addClass('bottom');
                hint.css({
                    top: element.offset().top - $(globalThis).scrollTop() + element.outerHeight() + o.hintOffset,
                    left: element.offset().left + element.outerWidth()/2 - hint_size.width/2  - $(globalThis).scrollLeft()
                });
            } else if (o.hintPosition === Metro.position.RIGHT) {
                hint.addClass('right');
                hint.css({
                    top: element.offset().top + element.outerHeight()/2 - hint_size.height/2 - $(globalThis).scrollTop(),
                    left: element.offset().left + element.outerWidth() - $(globalThis).scrollLeft() + o.hintOffset
                });
            } else if (o.hintPosition === Metro.position.LEFT) {
                hint.addClass('left');
                hint.css({
                    top: element.offset().top + element.outerHeight()/2 - hint_size.height/2 - $(globalThis).scrollTop(),
                    left: element.offset().left - hint_size.width - $(globalThis).scrollLeft() - o.hintOffset
                });
            } else {
                hint.addClass('top');
                hint.css({
                    top: element.offset().top - $(globalThis).scrollTop() - hint_size.height - o.hintOffset,
                    left: element.offset().left - $(globalThis).scrollLeft() + element.outerWidth()/2 - hint_size.width/2
                });
            }
        },

        removeHint: function(){
            const hint = this.hint;
            const options = this.options;
            const timeout = options.onHintHide === Metro.noop ? 0 : 300;

            if (hint !== null) {

                this._fireEvent("hint-hide", {
                    hint: hint[0]
                });

                setTimeout(()=> {
                    hint.hide(0, ()=> {
                        hint.remove();
                        this.hint = null;
                    });
                }, timeout);
            }
        },

        changeText: function(){
            this.options.hintText = this.element.attr("data-hint-text");
        },

        changeAttribute: function(attributeName){
            if (attributeName === "data-hint-text") {
                this.changeText();
            }
        },

        destroy: function(){
            const element = this.element;
            this.removeHint();
            element.off(`${Metro.events.enter}-hint`);
            element.off(`${Metro.events.leave}-hint`);
            $(globalThis).off(`${Metro.events.scroll}-hint`);
        }
    });
})(Metro, Dom);