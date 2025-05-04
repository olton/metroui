(($) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    globalThis["__version__"] = "__VERSION__";
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    globalThis["__build_time__"] = "__BUILD_TIME__";

    const meta_init = $.meta("metro:init").attr("content");
    const meta_cloak = $.meta("metro:cloak").attr("content");
    const meta_cloak_duration = $.meta("metro:cloak_duration").attr("content");
    const meta_blur_image = $.meta("metro:blur").attr("content");
    const meta_smooth_scroll = $.meta("metro:smooth").attr("content");
    const meta_theme = $.meta("metro:theme").attr("content");
    const meta_info = $.meta("metro:info").attr("content");
    const meta_jquery = $.meta("metro:jquery").attr("content");
    const meta_debug = $.meta("metro:debug").attr("content");

    globalThis.METRO_INIT = meta_init ? JSON.parse(meta_init) : true;

    if (meta_theme !== undefined) {
        $("html").addClass(
            meta_theme === "auto" ? ($.dark ? "dark-side" : "") : meta_theme === "dark" ? "dark-side" : "light-side",
        );
    }

    globalThis.METRO_BLUR_IMAGE = meta_blur_image ? JSON.parse(meta_blur_image) : false;

    globalThis.jquery_present = typeof globalThis.jQuery !== "undefined";
    globalThis.METRO_JQUERY = meta_jquery ? JSON.parse(meta_jquery) : true;
    globalThis.useJQuery = globalThis.jquery_present && globalThis.METRO_JQUERY;

    globalThis.METRO_SHOW_INFO = meta_info ? JSON.parse(meta_info) : true;
    globalThis.METRO_DEBUG = meta_debug ? JSON.parse(meta_debug) : false;

    globalThis.METRO_CLOAK_REMOVE = meta_cloak ? `${meta_cloak}`.toLowerCase() : "fade";
    globalThis.METRO_CLOAK_DURATION = meta_cloak_duration ? Number.parseInt(meta_cloak_duration) : 300;
    globalThis.METRO_SMOOTH_SCROLL = meta_smooth_scroll ? JSON.parse(meta_smooth_scroll) : true;
    globalThis.METRO_DATE_FORMAT = "DD.MM.YYYY";
    globalThis.METRO_TIME_FORMAT = "HH:mm:ss";
    globalThis.METRO_DATETIME_FORMAT = "DD.MM.YYYY HH:mm:ss";
    globalThis.METRO_TIMEOUT = 3000;

    globalThis.METRO_MEDIA = [];
})(Dom);
