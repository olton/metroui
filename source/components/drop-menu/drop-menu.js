(function(Metro, $) {
    'use strict';

    const participants = `[data-role-dropmenu], [data-role-dropdown]`;
    const toggleImage = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"></path></svg>`
    
    let DropMenuDefaultConfig = {
        align: "left", // left, right
        onMenuCreate: Metro.noop
    };

    Metro.dropMenuSetup = function (options) {
        DropMenuDefaultConfig = $.extend({}, DropMenuDefaultConfig, options);
    };

    if (typeof window["metroDropMenuSetup"] !== undefined) {
        Metro.dropMenuSetup(window["metroDropMenuSetup"]);
    }

    Metro.Component('dropmenu', {
        init: function( options, elem ) {
            this._super(elem, options, DropMenuDefaultConfig, {
                toggle: null,
                displayOrigin: null,
                isOpen: false
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('menu-create');
        },

        _createStructure: function(){
            const element = this.element
            const toggle = element.siblings(".menu-toggle");
            if (toggle.length === 0) {
                throw new Error("Menu toggle not found");
            }
            toggle.append(toggleImage);
            this.toggle = toggle;
            this.displayOrigin = element.css("display");
            this.element.addClass("drop-menu").hide();
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;
            this.toggle.on("click", (e) => {
                $(participants).each((i, el) => {
                    if (el === element[0]) return;
                    Metro.getPlugin(el, "drop-menu").close();
                })

                if (this.isOpen === false) {
                    this.open()
                } else {
                    this.close();
                }

                e.preventDefault();
                e.stopPropagation();
            });
        },

        close: function(){
            if (this.isOpen === false) {
                return
            }
            this.toggle.removeClass("active-toggle");
            this.element.hide();
            this.isOpen = false;
        },
        
        open: function(){
            const element = this.element, o = this.options;
            const toggleRect = Metro.utils.rect(this.toggle[0]);
            
            element.show().visible(false);
            
            element.css({
                top: toggleRect.bottom,
                left: toggleRect.left
            })
            
            if (o.align === "right") {
                element.css({
                    left: toggleRect.right - element.width()
                })
            }
            
            element.visible(true);
            this.toggle.addClass("active-toggle");
            this.isOpen = true;
        },
        
        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
    
    $(document).on("click", function(e) {
        $(participants).each((i, el) => {
            const $el = $(el);
            
            if ($el.hasClass('keep-open') || $el.hasClass('stay-open') || $el.hasClass('ignore-document-click')) return;

            const dd = Metro.getPlugin(el, 'dropdown')
            const dm = Metro.getPlugin(el, 'dropmenu')

            if (dd) {
                dd.close();
            }
            if (dm) {
                dm.close();
            }
        })
    });
}(Metro, Dom));