/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var InfoBoxDefaultConfig = {
        infoboxDeferred: 0,
        type: "",
        width: 480,
        height: "auto",
        overlay: true,
        overlayColor: '#000000',
        overlayAlpha: .5,
        overlayClickClose: false,
        autoHide: 0,
        removeOnClose: false,
        closeButton: true,
        clsBox: "",
        clsBoxContent: "",
        clsOverlay: "",
        onOpen: Metro.noop,
        onClose: Metro.noop,
        onInfoBoxCreate: Metro.noop
    };

    Metro.infoBoxSetup = function (options) {
        InfoBoxDefaultConfig = $.extend({}, InfoBoxDefaultConfig, options);
    };

    if (typeof globalThis["metroInfoBoxSetup"] !== "undefined") {
        Metro.infoBoxSetup(globalThis["metroInfoBoxSetup"]);
    }

    Metro.Component('info-box', {
        init: function( options, elem ) {
            this._super(elem, options, InfoBoxDefaultConfig, {
                overlay: null,
                id: Utils.elementId("info-box")
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("info-box-create", {
                element: element
            });
        },

        _overlay: function(){
            var o = this.options;

            var overlay = $("<div>");
            overlay.addClass("overlay").addClass(o.clsOverlay);

            if (o.overlayColor === 'transparent') {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Farbe.Routines.toRGBA(Farbe.Routines.parse(o.overlayColor), o.overlayAlpha)
                });
            }

            return overlay;
        },

        _createStructure: function(){
            var element = this.element, o = this.options;
            var closer, content;

            if (o.overlay === true) {
                this.overlay = this._overlay();
            }

            element.addClass("info-box").addClass(o.type).addClass(o.clsBox);

            closer = element.find("closer");
            if (closer.length === 0) {
                closer = $("<span>").addClass("button square closer");
                closer.appendTo(element);
            }

            if (o.closeButton !== true) {
                closer.hide();
            }

            content = element.find(".info-box-content");
            if (content.length > 0) {
                content.addClass(o.clsBoxContent);
            }

            element.css({
                width: o.width,
                height: o.height,
                visibility: "hidden",
                top: '100%',
                left: ( $(globalThis).width() - element.outerWidth() ) / 2
            });

            element.appendTo($('body'));
        },

        _createEvents: function(){
            var that = this, element = this.element;

            element.on(Metro.events.click, ".closer", function(){
                that.close();
            });

            element.on(Metro.events.click, ".js-dialog-close", function(){
                that.close();
            });

            $(globalThis).on(Metro.events.resize, function(){
                that.reposition();
            }, {ns: this.id});
        },

        _setPosition: function(){
            var element = this.element;
            element.css({
                top: ( $(globalThis).height() - element.outerHeight() ) / 2,
                left: ( $(globalThis).width() - element.outerWidth() ) / 2
            });
        },

        reposition: function(){
            this._setPosition();
        },

        setContent: function(c){
            var element = this.element;
            var content = element.find(".info-box-content");
            if (content.length === 0) {
                return ;
            }
            content.html(c);
            this.reposition();
        },

        setType: function(t){
            var element = this.element;
            element.removeClass("success info alert warning").addClass(t);
        },

        open: function(){
            var that = this, element = this.element, o = this.options;

            // if (o.overlay === true) {
            //     this.overlay.appendTo($("body"));
            // }
            if (o.overlay === true && $(".overlay").length === 0) {
                this.overlay.appendTo($("body"));
                if (o.overlayClickClose === true) {
                    this.overlay.on(Metro.events.click, function(){
                        that.close();
                    });
                }
            }

            this._setPosition();

            element.css({
                visibility: "visible"
            });

            this._fireEvent("open");

            element.data("open", true);

            if (parseInt(o.autoHide) > 0) {
                setTimeout(function(){
                    that.close();
                }, parseInt(o.autoHide));
            }
        },

        close: function(){
            var element = this.element, o = this.options;

            if (o.overlay === true) {
                $('body').find('.overlay').remove();
            }

            element.css({
                visibility: "hidden",
                top: "100%"
            });

            this._fireEvent("close");

            element.data("open", false);

            if (o.removeOnClose === true) {
                this.destroy();
                element.remove();
            }
        },

        isOpen: function(){
            return this.element.data("open") === true;
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            var element = this.element;

            element.off("all");
            $(globalThis).off(Metro.events.resize, {ns: this.id});

            return element;
        }
    });

    Metro['infobox'] = {
        isInfoBox: function(el){
            return Utils.isMetroObject(el, "infobox");
        },

        open: function(el, c, t){
            if (!this.isInfoBox(el)) {
                return false;
            }
            var ib = Metro.getPlugin(el, "infobox");
            if (c !== undefined) {
                ib.setContent(c);
            }
            if (t !== undefined) {
                ib.setType(t);
            }
            ib.open();
        },

        close: function(el){
            if (!this.isInfoBox(el)) {
                return false;
            }
            var ib = Metro.getPlugin(el, "infobox");
            ib.close();
        },

        setContent: function(el, c){
            if (!this.isInfoBox(el)) {
                return false;
            }

            if (c === undefined) {
                c = "";
            }

            var ib = Metro.getPlugin(el, "infobox");
            ib.setContent(c);
            ib.reposition();
        },

        setType: function(el, t){
            if (!this.isInfoBox(el)) {
                return false;
            }

            var ib = Metro.getPlugin(el, "infobox");
            ib.setType(t);
            ib.reposition();
        },

        isOpen: function(el){
            if (!this.isInfoBox(el)) {
                return false;
            }
            var ib = Metro.getPlugin(el, "infobox");
            return ib.isOpen();
        },

        create: function(c, t, o, open){
            var $$ = Utils.$();
            var el, ib, box_type;

            box_type = t !== undefined ? t : "";

            el = $$("<div>").appendTo($$("body"));
            $$("<div>").addClass("info-box-content").appendTo(el);

            var ib_options = $$.extend({}, {
                removeOnClose: true,
                type: box_type
            }, (o !== undefined ? o : {}));

            ib_options._runtime = true;

            el.infobox(ib_options);

            ib = Metro.getPlugin(el, 'infobox');
            ib.setContent(c);
            if (open !== false) {
                ib.open();
            }

            return el;
        }
    };
}(Metro, Dom));