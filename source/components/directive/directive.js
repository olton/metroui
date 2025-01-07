(function(Metro, $) {
    'use strict';

    var DirectiveDefaultConfig = {
        directive: "note",
        showIcon: false,
        title: "",
        onDirectiveCreate: Metro.noop
    };

    Metro.directiveSetup = function (options) {
        DirectiveDefaultConfig = $.extend({}, DirectiveDefaultConfig, options);
    };

    if (typeof window["metroDirectiveSetup"] !== undefined) {
        Metro.directiveSetup(window["metroDirectiveSetup"]);
    }

    Metro.Component('directive', {
        init: function( options, elem ) {
            this._super(elem, options, DirectiveDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('directive-create');
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            const directive = element.wrap("<div>").addClass("directive").addClass(`directive-${o.directive}`);
            const title = $("<div>").addClass("directive-title").html(o.title ? o.title : this.strings[`label_${o.directive.toLowerCase()}`].toUpperCase());
            if (o.showIcon) {
                title.prepend($("<span>").addClass("icon").html("&nbsp;"));                
            }
            directive.prepend(title);
            this.component = directive
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

        },

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, m4q));