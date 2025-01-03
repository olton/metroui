/* global Metro, METRO_TIMEOUT, METRO_ANIMATION_DURATION */
(function(Metro, $) {
    'use strict';

    let NotifyDefaultConfig = {
        container: null,
        width: 220,
        timeout: 3000,
        duration: METRO_ANIMATION_DURATION,
        distance: "max",
        animation: "linear",
        clsNotify: "",
        onClick: Metro.noop,
        onClose: Metro.noop,
        onShow: Metro.noop,
        onAppend: Metro.noop,
        onNotifyCreate: Metro.noop
    };

    Metro.notifySetup = function(options){
        NotifyDefaultConfig = $.extend({}, NotifyDefaultConfig, options);
    };

    if (typeof globalThis["metroNotifySetup"] !== undefined) {
        Metro.notifySetup(globalThis["metroNotifySetup"]);
    }

    const Notify = {
        container: null,
        options: {},
        notifies: [],

        setup: function(options){
            this.options = $.extend({}, NotifyDefaultConfig, options);
            return this;
        },

        reset: function(){
            const reset_options = {
                width: 220,
                timeout: METRO_TIMEOUT,
                duration: METRO_ANIMATION_DURATION,
                distance: "max",
                animation: "linear"
            };
            this.options = $.extend({}, NotifyDefaultConfig, reset_options);
        },

        _createContainer: function(){
            const container = $("<div>").addClass("notify-container");
            $("body").prepend(container);
            return container;
        },

        create: function(message, title, options = {}){
            const that = this, o = this.options
            let notify, m, t, id = Metro.utils.elementId("notify");

            if (!message) {
                return false;
            }

            notify = $("<div>").addClass("notify").addClass(o.clsNotify).attr("id", id);
            notify.css({
                width: o.width
            });

            if (title) {
                t = $("<div>").addClass("notify-title").html(title);
                notify.prepend(t);
            }
            m = $("<div>").addClass("notify-message").html(message);
            m.appendTo(notify);

            // Set options
            /*
            * keepOpen, cls, width, callback
            * */
            if (options !== undefined) {
                if (options.clsNotify !== undefined) {
                    notify.addClass(options.clsNotify);
                }
                if (options.width !== undefined) {
                    notify.css({
                        width: options.width
                    });
                }
            }

            notify.on(Metro.events.click, function(){
                Metro.utils.exec(Metro.utils.isValue(options.onClick) ? options.onClick : o.onClick, null, this);
                that.kill($(this).closest(".notify"), Metro.utils.isValue(options.onClose) ? options.onClose : o.onClose);
            });

            // Show
            if (Notify.container === null) {
                Notify.container = Notify._createContainer();
            }
            notify.appendTo(Notify.container);

            notify.hide(function(){

                Metro.utils.exec(Metro.utils.isValue(options.onAppend) ? options.onAppend : o.onAppend, null, notify[0]);

                const duration = Metro.utils.isValue(options.duration) ? options.duration : o.duration;
                const animation = Metro.utils.isValue(options.animation) ? options.animation : o.animation;
                let distance = Metro.utils.isValue(options.distance) ? options.distance : o.distance;

                if (distance === "max" || isNaN(distance)) {
                    distance = $(globalThis).height();
                }

                notify
                    .show()
                    .animate({
                        draw: {
                            marginTop: [distance, 4],
                            opacity: [0, 1]
                        },
                        dur: duration,
                        ease: animation,
                        onDone: function(){
                            Metro.utils.exec(o.onNotifyCreate, null, this);

                            if (options !== undefined && options.keepOpen === true) {
                                // do nothing;
                            } else {
                                setTimeout(function(){
                                    that.kill(notify, Metro.utils.isValue(options.onClose) ? options.onClose : o.onClose);
                                }, o.timeout);
                            }

                            Metro.utils.exec(Metro.utils.isValue(options.onShow) ? options.onShow : o.onShow, null, notify[0]);
                        }
                    });

            });
        },

        kill: function(notify, callback){
            const that = this, o = this.options;
            notify.off(Metro.events.click);
            notify.zoomOut(10000, 'linear', function(){
                Metro.utils.exec(callback ? callback : that.options.onClose, null, notify[0]);
                notify.remove();
            });
        },

        killAll: function(){
            const that = this;
            const notifies = $(".notify");
            $.each(notifies, function(){
                that.kill($(this));
            });
        }
    };

    Metro['notify'] = Notify.setup();
}(Metro, m4q));