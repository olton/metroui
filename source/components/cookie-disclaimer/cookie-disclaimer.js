((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    const cookieDisclaimerDefaults = {
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
            const cookie = Metro.cookie;

            this.options = $.extend({}, cookieDisclaimerDefaults, options);
            this.disclaimer = $("<div>");

            if (cookie.getCookie(this.options.name)) {
                return ;
            }

            this.locale = $("html").attr("lang") || "en";
            this.strings = $.extend({}, Metro.locales.en, Metro.locales[this.locale]);
            
            if (this.options.templateUrl) {
                fetch(this.options.templateUrl)
                    .then(Metro.fetch.text)
                    .then((data)=> {
                        this.create(data)
                    });
            } else {
                this.create();
            }
        },

        create: function(html){
            const cookie = Metro.cookie;
            const o = this.options;
            const wrapper = this.disclaimer;

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

            const buttons = $("<div>")
              .addClass("disclaimer-actions")
              .addClass(o.clsButtons)
              .append($('<button>').addClass('button cookie-accept-button').addClass(o.clsAcceptButton).html(this.strings.label_accept))
              .append($('<button>').addClass('button cookie-cancel-button').addClass(o.clsCancelButton).html(this.strings.label_cancel))
            buttons.appendTo(wrapper);
            if (o.customButtons) {
                $.each(o.customButtons, function(){
                    const btn = $('<button>')
                        .addClass('button cookie-custom-button')
                        .addClass(this.cls)
                        .html(this.text);
                    btn.on("click", () =>{
                        Metro.utils.exec(this.onclick);
                    });
                    btn.appendTo(buttons);
                });
            }
            wrapper.appendTo($('body'));

            wrapper.on(Metro.events.click, ".cookie-accept-button", ()=> {
                let dur = 0;
                const durations = (`${o.duration}`).toArray(" ");

                $.each(durations, function(){
                    const d = `${this}`;
                    if (d.includes("day")) {
                        dur += Number.parseInt(d)*24*60*60*1000;
                    } else
                    if (d.includes("hour")) {
                        dur += Number.parseInt(d)*60*60*1000;
                    } else
                    if (d.includes("min")) {
                        dur += Number.parseInt(d)*60*1000;
                    } else
                    if (d.includes("sec")) {
                        dur += Number.parseInt(d)*1000;
                    } else {
                        dur += Number.parseInt(d);
                    }
                })

                cookie.setCookie(o.name, true, dur);
                Metro.utils.exec(o.onAccept);
                wrapper.remove();
            });

            wrapper.on(Metro.events.click, ".cookie-cancel-button", ()=> {
                Metro.utils.exec(o.onDecline);
                wrapper.remove();
            });
        }
    };
})(Metro, Dom);