/* Deprecated */
((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    const Engine = (html, options, conf) => {
        let ReEx;
        let re = '<%(.+?)%>';
        const reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g;
        let code = 'with(obj) { var r=[];\n';
        let cursor = 0;
        let result;
        let match;
        const add = (line, js) => {
            js
                // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                ? (code += line.match(reExp) ? `${line}\n` : `r.push(${line});\n`) 
                // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                : (code += line !== '' ? `r.push("${line.replace(/"/g, '\\"')}");\n` : '');
            return add;
        };

        if (Metro.utils.isValue(conf)) {
            if (($.hasProp(conf, 'beginToken'))) {
                re = re.replace('<%', conf.beginToken);
            }
            if (($.hasProp(conf,'endToken'))) {
                re = re.replace('%>', conf.endToken);
            }
        }

        ReEx = new RegExp(re, 'g');
        match = ReEx.exec(html);

        while(match) {
            add(html.slice(cursor, match.index))(match[1], true);
            cursor = match.index + match[0].length;
            match = ReEx.exec(html);
        }
        add(html.substring(cursor, html.length - cursor));
        code = (`${code}return r.join(""); }`).replace(/[\r\t\n]/g, ' ');
        try { result = new Function('obj', code).apply(options, [options]); }
        catch(err) { console.error(`'${err.message}'`, " in \n\nCode:\n", code, "\n"); }
        return result;
    };

    let TemplateDefaultConfig = {
        templateData: null,
        onTemplateCompile: Metro.noop,
        onTemplateCreate: Metro.noop
    };

    Metro.templateSetup = (options) => {
        TemplateDefaultConfig = $.extend({}, TemplateDefaultConfig, options);
    };

    if (typeof globalThis.metroTemplateSetup !== "undefined") {
        Metro.templateSetup(globalThis.metroTemplateSetup);
    }

    Metro.Component('template', {
        init: function( options, elem ) {
            this._super(elem, options, TemplateDefaultConfig, {
                template: null,
                data: {}
            });
            return this;
        },

        _compile: function(){
            const element = this.element;

            const template = this.template
                .replace(/(&lt;%)/gm, "<%")
                .replace(/(%&gt;)/gm, "%>")
                .replace(/(&lt;)/gm, "<")
                .replace(/(&gt;)/gm, ">")
            const compiled = Engine(template, this.data)
            element.html(compiled);

            this._fireEvent('template-compile', {
                template: template,
                compiled: compiled,
                element: element
            });
        },

        _create: function(){
            const element = this.element;
            const o = this.options;
            this.template = element.html();
            this.data = Metro.utils.isObject(o.templateData) || {};
            this._compile();
            this._fireEvent('template-create', {
                element: element
            });
        },

        buildWith: function(obj){
            const data = Metro.utils.isObject(obj);
            if (!data) {
                return;
            }
            this.data = data;
            this._compile();
        },

        changeAttribute: function(a, v){
            if (a === "data-template-data") {
                this.options.templateData = v;
                this.data = Metro.utils.isObject(v) || {};
                this._compile();
            }
        },

        destroy: function(){
            return this.element;
        }
    });

    Metro.template = Engine;
})(Metro, Dom);