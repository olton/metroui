(function(Metro, $) {
    'use strict';

    const participants = `[data-role-dropmenu], [data-role-dropdown]`;
    const toggleImage = `<svg class="dropdown-caret" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"></path></svg>`

    let DropdownDefaultConfig = {
        dropdownDeferred: 0,
        dropFilter: null,
        toggleElement: null,
        align: "left",
        noClose: false,
        duration: 50,
        openMode: "auto",
        openFunc: "show",
        closeFunc: "hide",
        height: "auto",
        onDrop: Metro.noop,
        onUp: Metro.noop,
        onDropdownCreate: Metro.noop
    };

    Metro.dropdownSetup = function (options) {
        DropdownDefaultConfig = $.extend({}, DropdownDefaultConfig, options);
    };

    if (typeof globalThis["metroDropdownSetup"] !== undefined) {
        Metro.dropdownSetup(globalThis["metroDropdownSetup"]);
    }

    Metro.Component('dropdown', {
        init: function( options, elem ) {
            this._super(elem, options, DropdownDefaultConfig, {
                toggle: null,
                displayOrigin: null,
                isOpen: false,
                level: 0,
            });

            return this;
        },

        _create: function(){
            const that = this, element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("dropdown-create", {
                element: element
            });

            if (element.hasClass("open")) {
                element.removeClass("open");
                setTimeout(function(){
                    that.open(true);
                },0);
            }
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
            const element = this.element, o = this.options;
            const level = element.parents("[data-role-dropdown]").length;
            let toggle;

            if (o.openMode === "up") {
                element.addClass("drop-up");
            }

            toggle = o.toggleElement ? $(o.toggleElement) : $(this._toggle());

            if (toggle.length) {
                toggle.append(toggleImage);
            }
            
            this.displayOrigin = Metro.utils.getStyleOne(element, "display");

            if (o.height !== "auto") {
                element.css({
                    "height": o.height,
                    "overflow-y": "auto",
                });
            }
            element.css("display", "none");

            this.toggle = toggle;
            this.level = level;
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;
            const toggle = this.toggle, parent = element.parent();

            toggle.on(Metro.events.click, function(e){
                $(".active-container").removeClass("active-container");

                // parent.siblings(parent[0].tagName).removeClass("active-container");

                if (element.css('display') !== 'none' && !element.hasClass('keep-open')) {
                    that.close(true, element);
                } else {
                    $(participants).each(function(i, el){
                        if (!element.parents('[data-role-dropdown]').is(el) && !$(el).hasClass('keep-open') && $(el).css('display') !== 'none') {
                            if (!Metro.utils.isValue(o.dropFilter)) {
                                that.close(true, el);
                            } else {
                                if ($(el).closest(o.dropFilter).length > 0) {
                                    that.close(true, el);
                                }
                            }
                        }
                    });
                    if (element.hasClass('horizontal')) {
                        element.css({
                            'visibility': 'hidden',
                            'display': 'block'
                        });
                        let children_width = 0;
                        $.each(element.children('li'), function(){
                            children_width += $(this).outerWidth(true);
                        });

                        element.css({
                            'visibility': 'visible',
                            'display': 'none'
                        });
                        element.css('width', children_width + 2);
                    }
                    that.open(false, element);
                    parent.addClass("active-container");
                }
                e.preventDefault();
                e.stopPropagation();
            });

            if (o.noClose === true) {
                element.addClass("keep-open").on(Metro.events.click, function (e) {
                    //e.preventDefault();
                    e.stopPropagation();
                });
            }

            $(element).find('li.disabled a').on(Metro.events.click, function(e){
                e.preventDefault();
            });
        },

        _close: function(el, immediate){
            el = $(el);

            const dropdown = Metro.getPlugin(el, "dropdown");
            const toggle = dropdown.toggle;
            const options = dropdown.options;
            let func = options.closeFunc;

            toggle.removeClass('active-toggle').removeClass("active-control");
            dropdown.element.parent().removeClass("active-container");

            if (immediate) {
                func = 'hide'
            }

            el[func](immediate ? 0 : options.duration, function(){
                dropdown._fireEvent("close");
                dropdown._fireEvent("up");

                if (options.openMode === "auto") {
                    dropdown.element.removeClass("drop-up drop-as-dialog");
                } 
            });

            this.isOpen = false;
        },

        _open: function(el, immediate){
            const dropdown = Metro.getPlugin(el, "dropdown");
            const options = dropdown.options;
            const func = options.openFunc;

            dropdown.toggle.addClass('active-toggle').addClass("active-control");
            dropdown.element.parent().addClass("active-container");

            dropdown.element[func](immediate ? 0 : options.duration, function(){
                const _el = this, $el = $(this);
                let wOut = Metro.utils.viewportOutByWidth(_el)
                let hOut = Metro.utils.viewportOutByHeight(_el)
                
                if (options.openMode === "auto") {
                    if (hOut) { $el.addClass("drop-up"); }
                    if (wOut) { $el.addClass("place-right"); }

                    if (Metro.utils.viewportOut(_el)) {
                        $el.removeClass("drop-up place-right").addClass("drop-as-dialog");
                    }
                }

                dropdown._fireEvent("open");
                dropdown._fireEvent("drop");
            });

            this.isOpen = true;
        },

        close: function(immediate, el){
            this._close(el || this.element, immediate);
        },

        open: function(immediate, el){
            this._open(el || this.element, immediate);
        },

        toggle: function(){
            if (this.isOpen)
                this.close();
            else
                this.open();
        },

        changeAttribute: function(){
        },

        destroy: function(){
            this.toggle.off(Metro.events.click);
        }
    });

    $(document).on(Metro.events.click, function(){
        $(participants).each(function(){
            const el = $(this);

            if (
                el.hasClass('keep-open') || 
                el.hasClass('stay-open') || 
                el.hasClass('ignore-document-click')
            ) return;

            const dd = Metro.getPlugin(el, 'dropdown')
            const dm = Metro.getPlugin(el, 'dropmenu')

            if (dd) { dd.close(); }
            if (dm) { dm.close(); }
        });
    });
}(Metro, Dom));

