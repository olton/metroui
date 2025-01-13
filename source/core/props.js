const isTouch = "ontouchstart" in window;

export const Props = {
    controlsPosition: {
        INSIDE: "inside",
        OUTSIDE: "outside",
    },

    groupMode: {
        ONE: "one",
        MULTI: "multi",
    },

    aspectRatio: {
        HD: "hd",
        SD: "sd",
        CINEMA: "cinema",
    },

    fullScreenMode: {
        WINDOW: "window",
        DESKTOP: "desktop",
    },

    position: {
        TOP: "top",
        BOTTOM: "bottom",
        LEFT: "left",
        RIGHT: "right",
        TOP_RIGHT: "top-right",
        TOP_LEFT: "top-left",
        BOTTOM_LEFT: "bottom-left",
        BOTTOM_RIGHT: "bottom-right",
        LEFT_BOTTOM: "left-bottom",
        LEFT_TOP: "left-top",
        RIGHT_TOP: "right-top",
        RIGHT_BOTTOM: "right-bottom",
    },

    popoverEvents: {
        CLICK: "click",
        HOVER: "hover",
        FOCUS: "focus",
    },

    stepperView: {
        SQUARE: "square",
        CYCLE: "cycle",
        DIAMOND: "diamond",
    },

    listView: {
        LIST: "list",
        CONTENT: "content",
        ICONS: "icons",
        ICONS_MEDIUM: "icons-medium",
        ICONS_LARGE: "icons-large",
        TILES: "tiles",
        TABLE: "table",
    },

    events: {
        click: "click",
        start: isTouch ? "touchstart" : "mousedown",
        stop: isTouch ? "touchend" : "mouseup",
        move: isTouch ? "touchmove" : "mousemove",
        enter: isTouch ? "touchstart" : "mouseenter",

        startAll: "mousedown touchstart",
        stopAll: "mouseup touchend",
        moveAll: "mousemove touchmove",

        leave: "mouseleave",
        focus: "focus",
        blur: "blur",
        resize: "resize",
        keyup: "keyup",
        keydown: "keydown",
        keypress: "keypress",
        dblclick: "dblclick",
        input: "input",
        change: "change",
        cut: "cut",
        paste: "paste",
        scroll: "scroll",
        mousewheel: "mousewheel",
        inputchange: "change input propertychange cut paste copy drop",
        dragstart: "dragstart",
        dragend: "dragend",
        dragenter: "dragenter",
        dragover: "dragover",
        dragleave: "dragleave",
        drop: "drop",
        drag: "drag",
    },

    keyCode: {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        BREAK: 19,
        CAPS: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        COMMA: 188,
    },

    media_queries: {
        FS: "(min-width: 0px)",
        XS: "(min-width: 360px)",
        SM: "(min-width: 576px)",
        LD: "(min-width: 640px)",
        MD: "(min-width: 768px)",
        LG: "(min-width: 992px)",
        XL: "(min-width: 1200px)",
        XXL: "(min-width: 1452px)",
        XXXL: "(min-width: 2000px)",
    },

    media_sizes: {
        FS: 0,
        XS: 360,
        SM: 576,
        LD: 640,
        MD: 768,
        LG: 992,
        XL: 1200,
        XXL: 1452,
        XXXL: 2000,
    },

    media_mode: {
        FS: "fs",
        XS: "xs",
        SM: "sm",
        LD: "ld",
        MD: "md",
        LG: "lg",
        XL: "xl",
        XXL: "xxl",
        XXXL: "xxxl",
    },

    media_modes: ["fs", "xs", "sm", "ld", "md", "lg", "xl", "xxl", "xxxl"],

    actions: {
        NONE: 0,
        REMOVE: 1,
        HIDE: 2,
        MINIMIZE: 3,
        MAXIMIZE: 4,
        CLOSE: 5,
        RESTORE: 6,
        SHOW: 7,
    },

    theme: {
        LIGHT: "light",
        DARK: "dark",
    },
}