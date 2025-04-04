(function(Metro, $) {
    'use strict';

    let EvalDefaultConfig = {
        enabled: true,
        logErrors: false,
        delimiterStart: '{{', 
        delimiterEnd: '}}',
        context: null, // контекст выполнения для передачи переменных
        processChild: true // обработка дочерних элементов
    };

    Metro.evalSetup = function (options) {
        EvalDefaultConfig = $.extend({}, EvalDefaultConfig, options);
    };

    if (window["metroEvalSetup"] !== undefined) {
        Metro.evalSetup(window["metroEvalSetup"]);
    }

    Metro.Component('eval', {
        init: function( options, elem ) {
            this._super(elem, options, EvalDefaultConfig, {
                origContent: null
            });
            return this;
        },

        _create: function(){
            const element = this.element;
            this.origContent = element.html();

            if (this.options.enabled) {
                if (this.options.processChild) {
                    this._processNodeAndChildren(element[0]);
                } else {
                    element.text(this.eval(element.text()));
                }
            }
        },

        _processNodeAndChildren: function(node) {
            // Обработка текстовых узлов
            if (node.nodeType === 3) { // Текстовый узел
                node.textContent = this.eval(node.textContent);
                return;
            }

            // Обработка дочерних узлов
            for (let i = 0; i < node.childNodes.length; i++) {
                this._processNodeAndChildren(node.childNodes[i]);
            }
        },

        eval: function(str) {
            const o = this.options;
            if (!o.enabled) return str;

            const regex = new RegExp(
                this._escapeRegExp(o.delimiterStart || '{{') +
                "(.*?)" +
                this._escapeRegExp(o.delimiterEnd || '}}'),
                "gs"
            );

            return str.replace(regex, (match, code) => {
                try {
                    const fn = new Function("return " + code);
                    return fn.call(o.context);
                } catch (error) {
                    if (o.logErrors) {
                        console.error("Metro UI Eval error:", error, "in code:", code);
                    }
                    return match;
                }
            });
        },

        _escapeRegExp: function(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        },

        reset: function() {
            if (this.origContent) {
                this.element.html(this.origContent);
            }
        },

        destroy: function(){
            this.reset();
            return this._super();
        }
    });

    // Добавление глобального метода для удобства
    Metro.evalText = function(text, options) {
        const tempConfig = $.extend({}, EvalDefaultConfig, options);
        const instance = {options: tempConfig};
        return Metro.Component('eval').prototype.eval.call(instance, text);
    };
}(Metro, Dom));