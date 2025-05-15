((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const TOAST_TIMEOUT = 3000;
    const TOAST_DISTANCE = 20;
    const TOAST_DURATION = 200;

    Metro.TOAST_POSITION = {
        TOP: "top",
        BOTTOM: "bottom",
        CENTER: "center",
    };

    let ToastDefaultConfig = {
        callback: Metro.noop,
        timeout: TOAST_TIMEOUT,
        distance: TOAST_DISTANCE,
        position: Metro.TOAST_POSITION.BOTTOM, // top, bottom, center
        clsToast: "",
    };

    Metro.toastSetup = (options) => {
        ToastDefaultConfig = $.extend({}, ToastDefaultConfig, options);
    };

    if (typeof globalThis.metroToastSetup !== "undefined") {
        Metro.toastSetup(globalThis.metroToastSetup);
    }

    /**
     * @param {string} message
     * @param {object || function} options {callback, timeout, distance, position, clsToast}
     */
    const Toast = {
        create: (message, opt) => {
            let o;
            let toast;
            let options;

            if (typeof opt === "function") {
                options = Object.assign({}, ToastDefaultConfig, { callback: opt });
            }

            o = $.extend({}, ToastDefaultConfig, options);

            toast = $("<div>").addClass("toast").html(message).appendTo($("body"));
            const width = toast.outerWidth();
            if (o.position === "top") {
                toast.addClass("show-top").css({
                    top: o.distance,
                });
            } else if (o.position === "center") {
                toast.addClass("show-center");
            } else {
                toast.css({
                    bottom: o.distance,
                });
            }

            toast
                .css({
                    left: "50%",
                    "margin-left": -(width / 2),
                })
                .addClass(o.clsToast)
                .fadeIn(TOAST_DURATION, () => {
                    setTimeout(() => {
                        Toast.remove(toast, o.callback);
                    }, o.timeout);
                });
        },

        remove: (toast, cb) => {
            if (!toast.length) return;
            toast.fadeOut(TOAST_DURATION, () => {
                toast.remove();
                Metro.utils.exec(cb, null, toast[0]);
            });
        },
    };

    Metro.toast = Toast;
    Metro.createToast = Toast.create;
})(Metro, Dom);
