/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var HtmlContainerDefaultConfig = {
        htmlcontainerDeferred: 0,
        method: "get",
        htmlSource: null,
        requestData: null,
        requestOptions: null,
        insertMode: "default", // replace, append, prepend
        onHtmlLoad: Metro.noop,
        onHtmlLoadFail: Metro.noop,
        onHtmlLoadDone: Metro.noop,
        onHtmlContainerCreate: Metro.noop
    };

    Metro.htmlContainerSetup = function (options) {
        HtmlContainerDefaultConfig = $.extend({}, HtmlContainerDefaultConfig, options);
    };

    if (typeof globalThis["metroHtmlContainerSetup"] !== undefined) {
        Metro.htmlContainerSetup(globalThis["metroHtmlContainerSetup"]);
    }

    Metro.Component('html-container', {
        init: function( options, elem ) {
            this._super(elem, options, HtmlContainerDefaultConfig, {
                data: null,
                opt: {},
                htmlSource: ''
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            if (typeof o.requestData === 'string') {
                o.requestData = JSON.parse(o.requestData);
            }

            if (Utils.isObject(o.requestData)) {
                this.data = Utils.isObject(o.requestData);
            }

            if (typeof o.requestOptions === 'string') {
                o.requestOptions = JSON.parse(o.requestOptions);
            }

            if (Utils.isObject(o.requestOptions)) {
                this.opt = Utils.isObject(o.requestOptions);
            }

            o.method = o.method.toUpperCase();

            if (Utils.isValue(o.htmlSource)) {
                this.htmlSource = o.htmlSource;
                this._load();
            }

            this._fireEvent("html-container-create", {
                element: element
            });
        },

        _load: function(){
            var that = this, element = this.element, o = this.options;
            var fetchData = {
                method: o.method
            };

            if (this.data) fetchData['body'] = this.data;
            if (this.opt) fetchData['headers'] = this.opt;

            fetch(this.htmlSource, fetchData)
            .then(Metro.fetch.status)
            .then(Metro.fetch.text)
            .then(function(data){
                var _data = $(data);

                if (_data.length === 0) {
                    _data = $("<div>").html(data);
                }

                switch (o.insertMode.toLowerCase()) {
                    case "prepend": element.prepend(_data); break;
                    case "append": element.append(_data); break;
                    case "replace": _data.insertBefore(element).script(); element.remove(); break;
                    default: {
                        element.html(_data);
                    }
                }
                that._fireEvent("html-load", {
                    data: data,
                    source: o.htmlSource,
                    requestData: that.data,
                    requestOptions: that.opt
                });
            })
            .catch(function(error){
                that._fireEvent("html-load-fail", {
                    error: error
                });
            });
        },

        load: function(source, data, opt){
            if (source) {
                this.htmlSource = source;
            }

            if (data) {
                this.data = Utils.isObject(data);
            }

            if (opt) {
                this.opt = Utils.isObject(opt);
            }

            this._load();
        },

        changeAttribute: function(attributeName){
            var that = this, element = this.element, o = this.options;

            var changeHTMLSource = function(){
                var html = element.attr("data-html-source");
                if (Utils.isNull(html)) {
                    return ;
                }
                if (html.trim() === "") {
                    element.html("");
                }
                o.htmlSource = html;
                that._load();
            };

            var changeInsertMode = function(){
                var attr = element.attr("data-insert-mode");
                if (Utils.isValue(attr)) {
                    o.insertMode = attr;
                }
            };

            var changeRequestData = function(){
                var data = element.attr("data-request-data");
                that.load(o.htmlSource, data);
            };

            switch (attributeName) {
                case "data-html-source": changeHTMLSource(); break;
                case "data-insert-mode": changeInsertMode(); break;
                case "data-request-data": changeRequestData(); break;
            }
        },

        destroy: function(){}
    });
}(Metro, Dom));