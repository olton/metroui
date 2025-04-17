/* Deprecated */
(function(Metro, $) {
    'use strict';

    var Utils = Metro.utils;

    var Engine = function(html, options, conf) {
        var ReEx, re = '<%(.+?)%>',
            reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
            code = 'with(obj) { var r=[];\n',
            cursor = 0,
            result,
            match;
        var add = function(line, js) {
            /* jshint -W030 */
            js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
            return add;
        };

        if (Utils.isValue(conf)) {
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
        add(html.substr(cursor, html.length - cursor));
        code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
        /* jshint -W054 */
        try { result = new Function('obj', code).apply(options, [options]); }
        catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
        return result;
    };

    var TemplateDefaultConfig = {
        templateData: null,
        onTemplateCompile: Metro.noop,
        onTemplateCreate: Metro.noop
    };

    Metro.templateSetup = function (options) {
        TemplateDefaultConfig = $.extend({}, TemplateDefaultConfig, options);
    };

    if (typeof globalThis["metroTemplateSetup"] !== "undefined") {
        Metro.templateSetup(globalThis["metroTemplateSetup"]);
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
            var element = this.element;
            var template, compiled;

            template = this.template
                .replace(/(&lt;%)/gm, "<%")
                .replace(/(%&gt;)/gm, "%>")
                .replace(/(&lt;)/gm, "<")
                .replace(/(&gt;)/gm, ">");

            compiled = Engine(template, this.data);
            element.html(compiled);

            this._fireEvent('template-compile', {
                template: template,
                compiled: compiled,
                element: element
            });
        },

        _create: function(){
            var element = this.element, o = this.options;
            this.template = element.html();
            this.data = Utils.isObject(o.templateData) || {};
            this._compile();
            this._fireEvent('template-create', {
                element: element
            });
        },

        buildWith: function(obj){
            var data = Utils.isObject(obj);
            if (!data) {
                return;
            }
            this.data = data;
            this._compile();
        },

        changeAttribute: function(a, v){
            if (a === "data-template-data") {
                this.options.templateData = v;
                this.data = Utils.isObject(v) || {};
                this._compile();
            }
        },

        destroy: function(){
            return this.element;
        }
    });

    Metro.template = Engine;
}(Metro, Dom));