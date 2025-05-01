((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let PopoverDefaultConfig = {
        popoverDeferred: 0,
        popoverText: "",
        popoverHide: 3000,
        popoverTimeout: 10,
        popoverOffset: 10,
        popoverTrigger: Metro.popoverEvents.HOVER,
        popoverPosition: Metro.position.TOP,
        hideOnLeave: false,
        closeButton: true,
        clsPopover: "",
        clsPopoverContent: "",
        onPopoverShow: Metro.noop,
        onPopoverHide: Metro.noop,
        onPopoverCreate: Metro.noop
    };

    Metro.popoverSetup = (options) => {
        PopoverDefaultConfig = $.extend({}, PopoverDefaultConfig, options);
    };

    if (typeof globalThis.metroPopoverSetup !== "undefined") {
        Metro.popoverSetup(globalThis.metroPopoverSetup);
    }

    Metro.Component('popover', {
        init: function( options, elem ) {
            this._super(elem, options, PopoverDefaultConfig, {
                popover: null,
                popovered: false,
                size: {
                    width: 0,
                    height: 0
                },
                id: Metro.utils.elementId("popover")
            });

            return this;
        },

        _create: function(){
            this._createEvents();
            this._fireEvent("popover-create", {
                element: this.element
            })
        },

        _createEvents: function(){
            const element = this.element;
            const o = this.options;
            let event;

            switch (o.popoverTrigger) {
                case Metro.popoverEvents.CLICK: event = Metro.events.click; break;
                case Metro.popoverEvents.FOCUS: event = Metro.events.focus; break;
                default: event = Metro.events.enter;
            }

            element.on(event, ()=> {
                if (this.popover !== null || this.popovered === true) {
                    return ;
                }
                setTimeout(()=> {
                    this.createPopover();

                    this._fireEvent("popover-show", {
                        popover: this.popover
                    });

                    if (o.popoverHide > 0) {
                        setTimeout(()=> {
                            this.removePopover();
                        }, o.popoverHide);
                    }
                }, o.popoverTimeout);
            });

            if (o.hideOnLeave === true) {
                element.on(Metro.events.leave, ()=> {
                    this.removePopover();
                });
            }

            $(globalThis).on(Metro.events.scroll, ()=> {
                if (this.popover !== null) this.setPosition();
            }, {ns: this.id});
        },

        setPosition: function(){
            const popover = this.popover;
            const size = this.size;
            const o = this.options;
            const element = this.element;

            if (o.popoverPosition === Metro.position.BOTTOM) {
                popover.addClass('bottom');
                popover.css({
                    top: element.offset().top - $(globalThis).scrollTop() + element.outerHeight() + o.popoverOffset,
                    left: element.offset().left + element.outerWidth()/2 - size.width/2  - $(globalThis).scrollLeft()
                });
            } else if (o.popoverPosition === Metro.position.RIGHT) {
                popover.addClass('right');
                popover.css({
                    top: element.offset().top + element.outerHeight()/2 - size.height/2 - $(globalThis).scrollTop(),
                    left: element.offset().left + element.outerWidth() - $(globalThis).scrollLeft() + o.popoverOffset
                });
            } else if (o.popoverPosition === Metro.position.LEFT) {
                popover.addClass('left');
                popover.css({
                    top: element.offset().top + element.outerHeight()/2 - size.height/2 - $(globalThis).scrollTop(),
                    left: element.offset().left - size.width - $(globalThis).scrollLeft() - o.popoverOffset
                });
            } else {
                popover.addClass('top');
                popover.css({
                    top: element.offset().top - $(globalThis).scrollTop() - size.height - o.popoverOffset,
                    left: element.offset().left + element.outerWidth()/2 - size.width/2  - $(globalThis).scrollLeft()
                });
            }
        },

        createPopover: function(){
            const elem = this.elem;
            let element = this.element;
            const o = this.options;
            let popover;
            let neb_pos;
            const id = Metro.utils.elementId("popover");
            let closeButton;

            if (this.popovered) {
                return ;
            }

            popover = $("<div>").addClass("popover neb").addClass(o.clsPopover);
            popover.attr("id", id);

            $("<div>").addClass("popover-content").addClass(o.clsPopoverContent).html(o.popoverText).appendTo(popover);

            if (o.popoverHide === 0 && o.closeButton === true) {
                closeButton = $("<button>").addClass("square small popover-close-button").html("&times;").appendTo(popover);
                closeButton.on(Metro.events.click, ()=> {
                    this.removePopover();
                });
            }

            switch (o.popoverPosition) {
                case Metro.position.TOP: neb_pos = "neb-s"; break;
                case Metro.position.BOTTOM: neb_pos = "neb-n"; break;
                case Metro.position.RIGHT: neb_pos = "neb-w"; break;
                case Metro.position.LEFT: neb_pos = "neb-e"; break;
            }

            popover.addClass(neb_pos);

            if (o.closeButton !== true) {
                popover.on(Metro.events.click, ()=> {
                    this.removePopover();
                });
            }

            this.popover = popover;
            this.size = Metro.utils.hiddenElementSize(popover);

            if (elem.tagName === 'TD' || elem.tagName === 'TH') {
                const wrp = $("<div/>").css("display", "inline-block").html(element.html());
                element.html(wrp);
                element = wrp;
            }

            this.setPosition();

            popover.appendTo($('body'));

            this.popovered = true;

            this._fireEvent("popover-create", {
                popover: popover
            });
        },

        removePopover: function(){
            const timeout = this.options.onPopoverHide === Metro.noop ? 0 : 300;
            const popover = this.popover;

            if (!this.popovered) {
                return ;
            }

            this._fireEvent("popover-hide", {
                popover: popover
            });

            setTimeout(()=> {
                popover.hide(0, ()=> {
                    popover.remove();
                    this.popover = null;
                    this.popovered = false;
                });
            }, timeout);
        },

        show: function(){
            const o = this.options;

            if (this.popovered === true) {
                return ;
            }

            setTimeout(()=> {
                this.createPopover();

                this._fireEvent("popover-show", {
                    popover: this.popover
                });

                if (o.popoverHide > 0) {
                    setTimeout(()=> {
                        this.removePopover();
                    }, o.popoverHide);
                }
            }, o.popoverTimeout);
        },

        hide: function(){
            this.removePopover();
        },

        changeAttribute: function(attributeName){
            const element = this.element;
            const o = this.options;

            const changeText = ()=> {
                o.popoverText = element.attr("data-popover-text");
                if (this.popover) {
                    this.popover.find(".popover-content").html(o.popoverText);
                    this.setPosition();
                }
            };

            const changePosition = ()=> {
                o.popoverPosition = element.attr("data-popover-position");
                this.setPosition();
            };

            switch (attributeName) {
                case "data-popover-text": changeText(); break;
                case "data-popover-position": changePosition(); break;
            }
        },

        destroy: function(){
            const element = this.element;
            const o = this.options;
            let event;

            switch (o.popoverTrigger) {
                case Metro.popoverEvents.CLICK: event = Metro.events.click; break;
                case Metro.popoverEvents.FOCUS: event = Metro.events.focus; break;
                default: event = Metro.events.enter;
            }

            element.off(event);

            if (o.hideOnLeave === true) {
                element.off(Metro.events.leave);
            }

            $(globalThis).off(Metro.events.scroll,{ns: this.id});

            return element;
        }
    });
})(Metro, Dom);