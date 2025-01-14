/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var HintDefaultConfig = {
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

    Metro.hintSetup = function (options) {
        HintDefaultConfig = $.extend({}, HintDefaultConfig, options);
    };

    if (typeof globalThis["metroHintSetup"] !== undefined) {
        Metro.hintSetup(globalThis["metroHintSetup"]);
    }

    Metro.Component('hint', {
        init: function( options, elem ) {
            this._super(elem, options, HintDefaultConfig, {
                hint: null,
                hint_size: {
                    width: 0,
                    height: 0
                },
                id: Utils.elementId("hint")
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
            var that = this, element = this.element, o = this.options;
            var over = false;

            element.on(Metro.events.enter, function(){
                over = true;
                setTimeout(function(){
                    if (!over) return;

                    that.createHint();
                    if (+o.hintHide > 0) {
                        setTimeout(function(){
                            that.removeHint();
                        }, o.hintHide);
                    }
                }, o.hintDeferred);
            });

            element.on(Metro.events.leave, function(){
                over = false;
                that.removeHint();
            });

            $(globalThis).on(Metro.events.scroll+" "+Metro.events.resize, function(){
                if (that.hint !== null) that.setPosition();
            }, {ns: this.id});
        },

        createHint: function(){
            var elem = this.elem, element = this.element, o = this.options;
            var hint = $("<div>").addClass("hint").addClass(o.clsHint).html(o.hintText);

            this.hint = hint;
            this.hint_size = Utils.hiddenElementSize(hint);

            $(".hint:not(.permanent-hint)").remove();

            if (elem.tagName === 'TD' || elem.tagName === 'TH') {
                var wrp = $("<div/>").css("display", "inline-block").html(element.html());
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
            var hint = this.hint, hint_size = this.hint_size, o = this.options, element = this.element;

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
            var that = this;
            var hint = this.hint;
            var options = this.options;
            var timeout = options.onHintHide === Metro.noop ? 0 : 300;

            if (hint !== null) {

                this._fireEvent("hint-hide", {
                    hint: hint[0]
                });

                setTimeout(function(){
                    hint.hide(0, function(){
                        hint.remove();
                        that.hint = null;
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
            var element = this.element;
            this.removeHint();
            element.off(Metro.events.enter + "-hint");
            element.off(Metro.events.leave + "-hint");
            $(globalThis).off(Metro.events.scroll + "-hint");
        }
    });
}(Metro, Dom));