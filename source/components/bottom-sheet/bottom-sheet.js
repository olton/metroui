/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var BottomSheetDefaultConfig = {
        bottomsheetDeferred: 0,
        mode: "list",
        toggle: null,
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onBottomSheetCreate: Metro.noop
    };

    Metro.bottomSheetSetup = function(options){
        BottomSheetDefaultConfig = $.extend({}, BottomSheetDefaultConfig, options);
    };

    if (typeof globalThis["metroBottomSheetSetup"] !== undefined) {
        Metro.bottomSheetSetup(globalThis["metroBottomSheetSetup"]);
    }

    Metro.Component('bottom-sheet', {
        init: function( options, elem ) {
            this._super(elem, options, BottomSheetDefaultConfig, {
                toggle: null
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("bottom-sheet-create", {
                element: element
            })
        },

        _createStructure: function(){
            var element = this.element, o = this.options;

            element
                .addClass("bottom-sheet")
                .addClass(o.mode+"-list");

            if (Utils.isValue(o.toggle) && $(o.toggle).length > 0) {
                this.toggle = $(o.toggle);
            }
        },

        _createEvents: function(){
            var that = this, element = this.element;

            if (Utils.isValue(this.toggle)) {
                this.toggle.on(Metro.events.click, function(){
                    that.toggle();
                });
            }

            element.on(Metro.events.click, "li", function(){
                that.close();
            });
        },

        isOpen: function(){
            return this.element.hasClass("opened");
        },

        open: function(mode){
            var element = this.element;

            if (Utils.isValue(mode)) {
                element.removeClass("list-style grid-style").addClass(mode+"-style");
            }

            this.element.addClass("opened");

            this._fireEvent("open", {
                element: element
            })
        },

        close: function(){
            var element = this.element;

            element.removeClass("opened");

            this._fireEvent("close", {
                element: element
            })
        },

        toggle: function(mode){
            if (this.isOpen()) {
                this.close();
            } else {
                this.open(mode);
            }
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            var element = this.element;

            if (Utils.isValue(this.toggle)) {
                this.toggle.off(Metro.events.click);
            }

            element.off(Metro.events.click, "li");
            return element;
        }
    });

    Metro['bottomsheet'] = {
        isBottomSheet: function(el){
            return Utils.isMetroObject(el, "bottom-sheet");
        },

        open: function(el, as){
            if (!this.isBottomSheet(el)) {
                return false;
            }
            Metro.getPlugin(el, "bottom-sheet").open(as);
        },

        close: function(el){
            if (!this.isBottomSheet(el)) {
                return false;
            }
            Metro.getPlugin(el, "bottom-sheet").close();
        },

        toggle: function(el, as){
            if (!this.isBottomSheet(el)) {
                return false;
            }
            if (this.isOpen(el)) {
                this.close(el);
            } else {
                this.open(el, as);
            }
        },

        isOpen: function(el){
            if (!this.isBottomSheet(el)) {
                return false;
            }
            return Metro.getPlugin(el, "bottom-sheet").isOpen();
        }
    };
}(Metro, Dom));