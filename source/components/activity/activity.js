/* global Metro */
(function(Metro, $) {
    'use strict';
    var ActivityDefaultConfig = {
        activityDeferred: 0,
        type: "ring",
        style: "",
        size: 64,
        radius: 20,
        onActivityCreate: Metro.noop
    };

    Metro.activitySetup = function(options){
        ActivityDefaultConfig = $.extend({}, ActivityDefaultConfig, options);
    };

    if (typeof globalThis["metroActivitySetup"] !== "undefined") {
        Metro.activitySetup(globalThis["metroActivitySetup"]);
    }

    Metro.Component('activity', {
        init: function( options, elem ) {
            this._super(elem, options, ActivityDefaultConfig);
            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            var i, wrap;

            element
                .html('')
                .addClass(o.style === "dark" ? "dark-side" : o.style === "color" ? "color-style" : "")
                .addClass("activity-" + o.type);

            function _metro(){
                for(i = 0; i < 5 ; i++) {
                    $("<div/>").addClass('circle').appendTo(element);
                }
            }

            function _square(){
                for(i = 0; i < 4 ; i++) {
                    $("<div/>").addClass('square').appendTo(element);
                }
            }

            function _cycle(){
                $("<div/>").addClass('cycle').appendTo(element);
            }

            function _ring(){
                for(i = 0; i < 5 ; i++) {
                    wrap = $("<div/>").addClass('wrap').appendTo(element);
                    $("<div/>").addClass('circle').appendTo(wrap);
                }
            }

            function _simple(){
                $('<svg class="circular"><circle class="path" cx="'+o.size/2+'" cy="'+o.size/2+'" r="'+o.radius+'" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>').appendTo(element);
            }

            function _atom(){
                for(i = 0; i < 3 ; i++) {
                    $("<span/>").addClass('electron').appendTo(element);
                }
            }

            function _bars(){
                for(i = 0; i < 6 ; i++) {
                    $("<span/>").addClass('bar').appendTo(element);
                }
            }

            switch (o.type) {
                case 'metro': _metro(); break;
                case 'square': _square(); break;
                case 'cycle': _cycle(); break;
                case 'simple': _simple(); break;
                case 'atom': _atom(); break;
                case 'bars': _bars(); break;
                default: _ring();
            }

            this._fireEvent("activity-create", {
                element: element
            })
        },

        /*eslint-disable-next-line*/
        changeAttribute: function(attributeName){
        },

        destroy: function(){
            return this.element;
        }
    });

    Metro.activity = {
        open: function(options){
            var o = options || {};
            var activity = '<div data-role="activity" data-type="'+( o.type ? o.type : 'cycle' )+'" data-style="'+( o.style ? o.style : 'color' )+'"></div>';
            var text = o.text ? '<div class="text-center">'+o.text+'</div>' : '';

            return Metro.dialog.create({
                content: activity + text,
                defaultActions: false,
                clsContent: "d-flex flex-column flex-center bg-transparent no-shadow w-auto",
                clsDialog: "no-border no-shadow bg-transparent global-dialog",
                autoHide: o.autoHide ? o.autoHide : 0,
                overlayClickClose: o.overlayClickClose === true,
                overlayColor: o.overlayColor ? o.overlayColor : '#000000',
                overlayAlpha: o.overlayAlpha ? o.overlayAlpha : 0.5,
                clsOverlay: "global-overlay"
            });
        },

        close: function(a){
            Metro.dialog.close(a);
        }
    };
}(Metro, Dom));