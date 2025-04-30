((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    const participants = "[data-role-dropmenu], [data-role-dropdown]";
    const toggleImage = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"></path></svg>`
    
    let DropMenuDefaultConfig = {
        height: "auto",
        align: "left", // left, right
        onMenuCreate: Metro.noop
    };

    Metro.dropMenuSetup = (options) => {
        DropMenuDefaultConfig = $.extend({}, DropMenuDefaultConfig, options);
    };

    if (typeof globalThis.metroDropMenuSetup !== "undefined") {
        Metro.dropMenuSetup(globalThis.metroDropMenuSetup);
    }

    Metro.Component('dropmenu', {
        init: function( options, elem ) {
            this._super(elem, options, DropMenuDefaultConfig, {
                toggle: null,
                displayOrigin: null,
                isOpen: false,
                level: 0,
            });
            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent('menu-create');
        },

        _toggle: function(){
            const element = this.element
            let toggle = element.siblings(".menu-toggle, .dropdown-toggle, a");
            if (toggle.length === 0) {
                toggle = element.prev()
                if (toggle.length === 0) {
                    throw new Error("Menu toggle not found");
                }
            }
            return toggle[0];
        },
        
        _createStructure: function(){
            const element = this.element;
            const o = this.options;
            this.level = element.parents("[data-role-dropmenu]").length;
            this.toggle = $(this._toggle()).append(toggleImage)
            this.displayOrigin = element.css("display");
            this.element.addClass("drop-menu").css("z-index", `calc(var(--z-index-fixed) + ${this.level})!important`).hide();
            if (o.height !== "auto") {
                element.css("max-height", o.height);                
            }
        },

        _createEvents: function(){
            const element = this.element
            this.toggle.on("click", (e) => {
                $(participants).each((i, el) => {
                    const $el = $(el);
                    const isSubMenu = element.parents("[data-role-dropmenu]").is(el);
                    
                    if (
                        el === element[0] || isSubMenu ||
                        $el.hasClass('keep-open') || 
                        $el.hasClass('stay-open') || 
                        $el.hasClass('ignore-document-click')
                    ) return;

                    const dd = Metro.getPlugin(el, 'dropdown')
                    const dm = Metro.getPlugin(el, 'dropmenu')

                    if (dd) { dd.close(); }
                    if (dm) { dm.close(); }
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
            const element = this.element;
            const o = this.options;
            const toggleRect = Metro.utils.rect(this.toggle[0]);
            const level = element.parents("[data-role-dropmenu]").length;
            
            element.show().visible(false);

            if (level === 0) {
                element.css({
                    top: toggleRect.bottom,
                    left: toggleRect.left
                })

                const wOut = Metro.utils.viewportOutByWidth(element[0])
                const hOut = Metro.utils.viewportOutByHeight(element[0])

                if ( o.align === "right" || wOut ) {
                    element.css({
                        left: toggleRect.right - element.width()
                    })
                    if (o.align !== "right" && Metro.utils.viewportOutByWidth(element[0])) {
                        element.css({
                            left: toggleRect.left
                        })
                    }
                }
                
                if (hOut) {
                    element.css({
                        top: toggleRect.top - element.height()
                    })
                    if (Metro.utils.viewportOutByHeight(element[0])) {
                        element.css({
                            top: toggleRect.bottom
                        })
                    }
                }
            } else {
                element.css({
                    top: toggleRect.top,
                    left: toggleRect.right
                })

                const wOut = Metro.utils.viewportOutByWidth(element[0])

                if (o.align === "right" || wOut) {
                    element.css({
                        left: toggleRect.left - element.width()
                    })
                    if (o.align !== "right" && Metro.utils.viewportOutByWidth(element[0])) {
                        element.css({
                            left: toggleRect.right
                        })
                    }
                }
            }
            
            this.toggle.addClass("active-toggle");
            this.isOpen = true;

            element.visible(true);
        },
        
        changeAttribute: (attr, val)=> {
        },

        destroy: function(){
            this.element.remove();
        }
    });
    
    $(document).on("click", () => {
        $(participants).each((i, el) => {
            const $el = $(el);
            
            if (
                $el.hasClass('keep-open') || 
                $el.hasClass('stay-open') || 
                $el.hasClass('ignore-document-click')
            ) return;

            const dd = Metro.getPlugin(el, 'dropdown')
            const dm = Metro.getPlugin(el, 'dropmenu')

            if (dd) { dd.close(); }
            if (dm) { dm.close(); }
        })
    });
})(Metro, Dom);