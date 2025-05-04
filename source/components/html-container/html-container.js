((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let HtmlContainerDefaultConfig = {
        htmlContainerDeferred: 0,
        method: "get",
        htmlSource: null,
        requestData: null,
        requestOptions: null,
        insertMode: "default", // replace, append, prepend
        onHtmlLoad: Metro.noop,
        onHtmlLoadFail: Metro.noop,
        onHtmlLoadDone: Metro.noop,
        onHtmlContainerCreate: Metro.noop,
    };

    Metro.htmlContainerSetup = (options) => {
        HtmlContainerDefaultConfig = $.extend({}, HtmlContainerDefaultConfig, options);
    };

    if (typeof globalThis.metroHtmlContainerSetup !== "undefined") {
        Metro.htmlContainerSetup(globalThis.metroHtmlContainerSetup);
    }

    Metro.Component("html-container", {
        init: function (options, elem) {
            this._super(elem, options, HtmlContainerDefaultConfig, {
                data: null,
                opt: {},
                htmlSource: "",
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            if (typeof o.requestData === "string") {
                o.requestData = JSON.parse(o.requestData);
            }

            if (Metro.utils.isObject(o.requestData)) {
                this.data = Metro.utils.isObject(o.requestData);
            }

            if (typeof o.requestOptions === "string") {
                o.requestOptions = JSON.parse(o.requestOptions);
            }

            if (Metro.utils.isObject(o.requestOptions)) {
                this.opt = Metro.utils.isObject(o.requestOptions);
            }

            o.method = o.method.toUpperCase();

            if (Metro.utils.isValue(o.htmlSource)) {
                this.htmlSource = o.htmlSource;
                this._load();
            }

            this._fireEvent("html-container-create", {
                element: element,
            });
        },

        _load: function () {
            const element = this.element;
            const o = this.options;
            const fetchData = {
                method: o.method,
            };

            if (this.data) fetchData.body = this.data;
            if (this.opt) fetchData.headers = this.opt;

            fetch(this.htmlSource, fetchData)
                .then(Metro.fetch.status)
                .then(Metro.fetch.text)
                .then((data) => {
                    let _data = $(data);

                    if (_data.length === 0) {
                        _data = $("<div>").html(data);
                    }

                    switch (o.insertMode.toLowerCase()) {
                        case "prepend":
                            element.prepend(_data);
                            break;
                        case "append":
                            element.append(_data);
                            break;
                        case "replace":
                            _data.insertBefore(element).script();
                            element.remove();
                            break;
                        default: {
                            element.html(_data);
                        }
                    }
                    this._fireEvent("html-load", {
                        data: data,
                        source: o.htmlSource,
                        requestData: this.data,
                        requestOptions: this.opt,
                    });
                })
                .catch((error) => {
                    this._fireEvent("html-load-fail", {
                        error: error,
                    });
                });
        },

        load: function (source, data, opt) {
            if (source) {
                this.htmlSource = source;
            }

            if (data) {
                this.data = Metro.utils.isObject(data);
            }

            if (opt) {
                this.opt = Metro.utils.isObject(opt);
            }

            this._load();
        },

        changeAttribute: function (attributeName) {
            const element = this.element;
            const o = this.options;

            const changeHTMLSource = () => {
                const html = element.attr("data-html-source");
                if (Metro.utils.isNull(html)) {
                    return;
                }
                if (html.trim() === "") {
                    element.html("");
                }
                o.htmlSource = html;
                this._load();
            };

            const changeInsertMode = () => {
                const attr = element.attr("data-insert-mode");
                if (Metro.utils.isValue(attr)) {
                    o.insertMode = attr;
                }
            };

            const changeRequestData = () => {
                const data = element.attr("data-request-data");
                this.load(o.htmlSource, data);
            };

            switch (attributeName) {
                case "data-html-source":
                    changeHTMLSource();
                    break;
                case "data-insert-mode":
                    changeInsertMode();
                    break;
                case "data-request-data":
                    changeRequestData();
                    break;
            }
        },

        destroy: () => {},
    });
})(Metro, Dom);
