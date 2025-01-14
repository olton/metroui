/* global Metro */
(function(Metro, $) {
    'use strict';

    var TokenizerDefaultConfig = {
        textToTokenize: "",
        spaceSymbol: "",
        spaceClass: "space",
        tokenClass: "",
        splitter: "",
        tokenElement: "span",
        useTokenSymbol: true,
        useTokenIndex: true,
        clsTokenizer: "",
        clsToken: "",
        clsTokenOdd: "",
        clsTokenEven: "",
        onTokenCreate: Metro.noop,
        onTokenize: Metro.noop,
        onTokenizerCreate: Metro.noop
    };

    Metro.tokenizerSetup = function (options) {
        TokenizerDefaultConfig = $.extend({}, TokenizerDefaultConfig, options);
    };

    if (typeof globalThis["metroTokenizerSetup"] !== undefined) {
        Metro.tokenizerSetup(globalThis["metroTokenizerSetup"]);
    }

    Metro.Component('tokenizer', {
        init: function( options, elem ) {
            this._super(elem, options, TokenizerDefaultConfig, {
                // define instance vars here
                originalText: ""
            });
            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            this.originalText = o.textToTokenize ? o.textToTokenize.trim() : element.text().trim().replace(/[\r\n\t]/gi, '').replace(/\s\s+/g, " ");

            this._createStructure();
            this._fireEvent('tokenizer-create');
        },

        _tokenize: function(){
            var that = this, element = this.element, o = this.options;
            var index = 0, append, prepend;

            element.clear().attr("aria-label", this.originalText);

            $.each(this.originalText.split(o.splitter), function(i){
                var symbol = this;
                var isSpace = symbol === " ";
                var token;

                token = $("<"+o.tokenElement+">")
                    .html(isSpace ? o.spaceSymbol : symbol)
                    .attr("aria-hidden", true)
                    .addClass(isSpace ? o.spaceClass : "")
                    .addClass(isSpace && o.useTokenSymbol ? "" : "ts-"+symbol.replace(" ", "_"))
                    .addClass(isSpace && o.useTokenIndex ? "" : "ti-" + (i + 1))
                    .addClass(o.tokenClass ? o.tokenClass : "")
                    .addClass(!isSpace ? o.clsToken : "");

                if (!isSpace) {
                    index++;
                    token.addClass(index % 2 === 0 ? "te-even" : "te-odd");
                    token.addClass(index % 2 === 0 ? o.clsTokenEven : o.clsTokenOdd);
                }

                if (o.prepend) {
                    prepend = $.isSelector(o.prepend) ? $(o.prepend) : $("<span>").html(o.prepend);
                    token.prepend(prepend);
                }

                if (o.append) {
                    append = $.isSelector(o.append) ? $(o.append) : $("<span>").html(o.append);
                    token.append(append);
                }

                element.append(token);

                that._fireEvent("token-create", {
                    token: token[0]
                });
            });

            that._fireEvent("tokenize", {
                tokens: element.children().items(),
                originalText: this.originalText
            });
        },

        _createStructure: function(){
            var element = this.element,  o = this.options;
            element.addClass(o.clsTokenizer);
            this._tokenize();
        },

        tokenize: function(v){
            this.originalText = v;
            this._tokenize();
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));