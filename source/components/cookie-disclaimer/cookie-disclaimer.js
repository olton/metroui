/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var cookieDisclaimerDefaults = {
        name: 'cookies_accepted',
        templateUrl: null,
        title: "",
        message: "",
        duration: "30days",
        clsContainer: "",
        clsMessage: "",
        clsButtons: "",
        clsAcceptButton: "",
        clsCancelButton: "",
        onAccept: Metro.noop,
        onDecline: Metro.noop
    };

    Metro.cookieDisclaimer = {
        init: function(options){
            var that = this, cookie = Metro.cookie;

            this.options = $.extend({}, cookieDisclaimerDefaults, options);
            this.disclaimer = $("<div>");

            if (cookie.getCookie(this.options.name)) {
                return ;
            }

            this.locale = $("html").attr("lang") || "en";
            this.strings = $.extend({}, Metro.locales["en"], Metro.locales[this.locale]);
            
            if (this.options.templateUrl) {
                fetch(this.options.templateUrl)
                    .then(Metro.fetch.text)
                    .then(function(data){
                        that.create(data)
                    });
            } else {
                this.create();
            }
        },

        create: function(html){
            var cookie = Metro.cookie;
            var o = this.options, wrapper = this.disclaimer, buttons;

            wrapper
                .addClass("cookie-disclaimer")
                .addClass(o.clsContainer);

            if (!html) {
                wrapper
                    .html( 
                        $("<div class='disclaimer-message'>")
                            .addClass(o.clsMessage)
                            .html(`
                                <div class="disclaimer-title">${o.title || this.strings.label_cookies_title}</div>
                                <div class="disclaimer-text">${o.message || this.strings.label_cookies_text}</div>
                            `) 
                    );
            } else {
                wrapper.append(html);
            }

            buttons = $("<div>")
                .addClass("disclaimer-actions")
                .addClass(o.clsButtons)
                .append( $('<button>').addClass('button cookie-accept-button').addClass(o.clsAcceptButton).html(this.strings.label_accept) )
                .append( $('<button>').addClass('button cookie-cancel-button').addClass(o.clsCancelButton).html(this.strings.label_cancel) )
                
            buttons.appendTo(wrapper);
            if (o.customButtons) {
                $.each(o.customButtons, function(){
                    var btn = $('<button>')
                        .addClass('button cookie-custom-button')
                        .addClass(this.cls)
                        .html(this.text);
                    btn.on("click", () =>{
                        Utils.exec(this.onclick);
                    });
                    btn.appendTo(buttons);
                });
            }
            wrapper.appendTo($('body'));

            wrapper.on(Metro.events.click, ".cookie-accept-button", function(){
                var dur = 0;
                var durations = (""+o.duration).toArray(" ");

                $.each(durations, function(){
                    var d = ""+this;
                    if (d.includes("day")) {
                        dur += parseInt(d)*24*60*60*1000;
                    } else
                    if (d.includes("hour")) {
                        dur += parseInt(d)*60*60*1000;
                    } else
                    if (d.includes("min")) {
                        dur += parseInt(d)*60*1000;
                    } else
                    if (d.includes("sec")) {
                        dur += parseInt(d)*1000;
                    } else {
                        dur += parseInt(d);
                    }
                })

                cookie.setCookie(o.name, true, dur);
                Utils.exec(o.onAccept);
                wrapper.remove();
            });

            wrapper.on(Metro.events.click, ".cookie-cancel-button", function(){
                Utils.exec(o.onDecline);
                wrapper.remove();
            });
        }
    };
}(Metro, Dom));