(function(Metro, $) {
    'use strict';

    let EvalDefaultConfig = {
    };

    Metro.evalSetup = function (options) {
        EvalDefaultConfig = $.extend({}, EvalDefaultConfig, options);
    };

    if (typeof window["metroEvalSetup"] !== undefined) {
        Metro.evalSetup(window["metroEvalSetup"]);
    }

    Metro.Component('eval', {
        init: function( options, elem ) {
            this._super(elem, options, EvalDefaultConfig, {
            });
            return this;
        },

        _create: function(){
            const element = this.element;
            element.text(this.eval(element.text()));
        },

        eval: (str) => {
            return str.replace(/{{(.*?)}}/gs, (match, code) => {
                try {
                    const fn_code = code.includes('return') ? code : 'return ' + code;
                    const fn = new Function(fn_code);
                    return fn();
                } catch (error) {
                    return match;
                }
            });
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));