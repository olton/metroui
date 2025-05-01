(($) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    globalThis["__version__"] = "__VERSION__";
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    globalThis["__build_time__"] = "__BUILD_TIME__";

    const meta_init = $.meta("metro:init").attr("content");
    const meta_locale = $.meta("metro:locale").attr("content");
    const meta_week_start = $.meta("metro:week_start").attr("content");
    const meta_date_format = $.meta("metro:date_format").attr("content");
    const meta_date_format_input = $.meta("metro:date_format_input").attr("content");
    const meta_animation_duration = $.meta("metro:animation_duration").attr("content");
    const meta_callback_timeout = $.meta("metro:callback_timeout").attr("content");
    const meta_timeout = $.meta("metro:timeout").attr("content");
    const meta_scroll_multiple = $.meta("metro:scroll_multiple").attr("content");
    const meta_cloak = $.meta("metro:cloak").attr("content");
    const meta_cloak_duration = $.meta("metro:cloak_duration").attr("content");
    const meta_global_common = $.meta("metro:global_common").attr("content");
    const meta_blur_image = $.meta("metro:blur_image").attr("content");
    const meta_smooth_scroll = $.meta("metro:smooth_scroll").attr("content");
    const meta_theme = $.meta("metro:theme").attr("content");

    if (meta_theme !== undefined) {
        $("html").addClass(meta_theme === "auto" ? $.dark ? "dark-side" : "" : meta_theme === "dark" ? "dark-side" : "light-side");
    }
    
    if (globalThis.METRO_BLUR_IMAGE === undefined) {
        globalThis.METRO_BLUR_IMAGE = meta_blur_image !== undefined ? JSON.parse(meta_global_common) : false;
    }

    if (globalThis.METRO_GLOBAL_COMMON === undefined) {
        globalThis.METRO_GLOBAL_COMMON = meta_global_common !== undefined ? JSON.parse(meta_global_common) : false;
    }

    const meta_jquery = $.meta("metro:jquery").attr("content"); //undefined
    globalThis.jquery_present = typeof globalThis.jQuery !== "undefined";
    if (globalThis.METRO_JQUERY === undefined) {
        globalThis.METRO_JQUERY = meta_jquery !== undefined ? JSON.parse(meta_jquery) : true;
    }
    globalThis.useJQuery = globalThis.jquery_present && globalThis.METRO_JQUERY;

    /* Added by Ken Kitay https://github.com/kens-code*/
    const meta_info = $.meta("metro:info").attr("content");
    if (globalThis.METRO_SHOW_INFO === undefined) {
        globalThis.METRO_SHOW_INFO = meta_info !== undefined ? JSON.parse(meta_info) : true;
    }
    /* --- end ---*/

    const meta_compile = $.meta("metro:compile").attr("content");
    if (globalThis.METRO_SHOW_COMPILE_TIME === undefined) {
        globalThis.METRO_SHOW_COMPILE_TIME = meta_compile !== undefined ? JSON.parse(meta_compile) : true;
    }

    if (globalThis.METRO_INIT === undefined) {
        globalThis.METRO_INIT = meta_init !== undefined ? JSON.parse(meta_init) : true;
    }

    if (globalThis.METRO_DEBUG === undefined) {
        globalThis.METRO_DEBUG = true;
    }

    if (globalThis.METRO_WEEK_START === undefined) {
        globalThis.METRO_WEEK_START = meta_week_start !== undefined ? Number.parseInt(meta_week_start) : 0;
    }
    if (globalThis.METRO_DATE_FORMAT === undefined) {
        globalThis.METRO_DATE_FORMAT = meta_date_format !== undefined ? meta_date_format : "YYYY-MM-DD";
    }
    if (globalThis.METRO_DATE_FORMAT_INPUT === undefined) {
        globalThis.METRO_DATE_FORMAT_INPUT =
            meta_date_format_input !== undefined ? meta_date_format_input : "YYYY-MM-DD";
    }
    if (globalThis.METRO_LOCALE === undefined) {
        globalThis.METRO_LOCALE = meta_locale !== undefined ? meta_locale : "en-US";
    }
    if (globalThis.METRO_ANIMATION_DURATION === undefined) {
        globalThis.METRO_ANIMATION_DURATION =
            meta_animation_duration !== undefined ? Number.parseInt(meta_animation_duration) : 100;
    }
    if (globalThis.METRO_CALLBACK_TIMEOUT === undefined) {
        globalThis.METRO_CALLBACK_TIMEOUT = meta_callback_timeout !== undefined ? Number.parseInt(meta_callback_timeout) : 500;
    }
    if (globalThis.METRO_TIMEOUT === undefined) {
        globalThis.METRO_TIMEOUT = meta_timeout !== undefined ? Number.parseInt(meta_timeout) : 2000;
    }
    if (globalThis.METRO_SCROLL_MULTIPLE === undefined) {
        globalThis.METRO_SCROLL_MULTIPLE = meta_scroll_multiple !== undefined ? Number.parseInt(meta_scroll_multiple) : 20;
    }
    if (globalThis.METRO_CLOAK_REMOVE === undefined) {
        globalThis.METRO_CLOAK_REMOVE = meta_cloak !== undefined ? (`${meta_cloak}`).toLowerCase() : "fade";
    }
    if (globalThis.METRO_CLOAK_DURATION === undefined) {
        globalThis.METRO_CLOAK_DURATION = meta_cloak_duration !== undefined ? Number.parseInt(meta_cloak_duration) : 300;
    }

    if (globalThis.METRO_SMOOTH_SCROLL === undefined) {
        globalThis.METRO_SMOOTH_SCROLL = meta_smooth_scroll !== undefined ? JSON.parse(meta_smooth_scroll) : true;
    }

    if (globalThis.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE === undefined) {
        globalThis.METRO_HOTKEYS_FILTER_CONTENT_EDITABLE = true;
    }
    if (globalThis.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS === undefined) {
        globalThis.METRO_HOTKEYS_FILTER_INPUT_ACCEPTING_ELEMENTS = true;
    }
    if (globalThis.METRO_HOTKEYS_FILTER_TEXT_INPUTS === undefined) {
        globalThis.METRO_HOTKEYS_FILTER_TEXT_INPUTS = true;
    }
    if (globalThis.METRO_HOTKEYS_BUBBLE_UP === undefined) {
        globalThis.METRO_HOTKEYS_BUBBLE_UP = false;
    }
    if (globalThis.METRO_THROWS === undefined) {
        globalThis.METRO_THROWS = true;
    }

    globalThis.METRO_MEDIA = [];
})(Dom);
