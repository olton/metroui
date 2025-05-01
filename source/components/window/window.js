((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let WindowDefaultConfig = {
        _runtime: false,

        windowDeferred: 0,
        hidden: false,
        width: "auto",
        height: "auto",
        btnClose: true,
        btnMin: true,
        btnMax: true,
        draggable: true,
        dragElement: ".window-caption .title",
        dragArea: "parent",
        shadow: false,
        icon: "",
        title: "Window",
        content: null,
        resizable: true,
        overlay: false,
        overlayColor: 'transparent',
        overlayAlpha: .5,
        modal: false,
        position: "absolute",
        checkEmbed: true,
        top: "auto",
        left: "auto",
        place: "auto",
        closeAction: Metro.actions.HIDE,
        customButtons: null,
        status: "",

        canClose: true,
        canMaximize: true,
        canMinimize: true,
        
        clsCustomButton: "",
        clsCaption: "",
        clsContent: "",
        clsWindow: "",

        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        
        onDragStart: Metro.noop,
        onDragStop: Metro.noop,
        onDragMove: Metro.noop,
        onWindowClick: Metro.noop,
        onCaptionClick: Metro.noop,
        onCaptionDblClick: Metro.noop,
        onCloseClick: Metro.noop,
        onMaxClick: Metro.noop,
        onMinClick: Metro.noop,
        onResizeStart: Metro.noop,
        onResizeStop: Metro.noop,
        onResize: Metro.noop,
        onWindowCreate: Metro.noop,
        onShow: Metro.noop,
        onWindowDestroy: Metro.noop,
        onCanClose: Metro.noop_true,
        onMinimize: Metro.noop,
        onMaximize: Metro.noop,
        onClose: Metro.noop
    };

    Metro.windowSetup = (options) => {
        WindowDefaultConfig = $.extend({}, WindowDefaultConfig, options);
    };

    if (typeof globalThis.metroWindowSetup !== "undefined") {
        Metro.windowSetup(globalThis.metroWindowSetup);
    }

    Metro.Component('window', {
        init: function( options, elem ) {
            this._super(elem, options, WindowDefaultConfig, {
                win: null,
                overlay: null,
                position: {
                    top: 0,
                    left: 0
                },
                hidden: false,
                content: null
            });

            return this;
        },

        _create: function(){
            const element = this.element;
            const o = this.options;
            let win;
            let overlay;
            const parent = o.dragArea === "parent" ? element.parent() : $(o.dragArea);
            let _content;

            if (o.modal === true) {
                o.btnMax = false;
                o.btnMin = false;
                o.resizable = false;
            }

            if (Metro.utils.isNull(o.content)) {
                o.content = element;
            } else {
                if (Metro.utils.isUrl(o.content) && Metro.utils.isVideoUrl(o.content)) {
                    o.content = Metro.utils.embedUrl(o.content);
                    element.css({
                        height: "100%"
                    });
                } else

                if (!Metro.utils.isQ(o.content) && Metro.utils.isFunc(o.content)) {
                    o.content = Metro.utils.exec(o.content);
                }

                _content = $(o.content);
                if (_content.length === 0) {
                    element.appendText(o.content);
                } else {
                    element.append(_content);
                }
                o.content = element;
            }

            if (o._runtime === true) {
                this._runtime(element, "window");
            }

            win = this._window(o);
            win.addClass("no-visible");

            parent.append(win);

            if (o.overlay === true) {
                overlay = this._overlay();
                overlay.appendTo(win.parent());
                this.overlay = overlay;
            }

            this.win = win;

            this._fireEvent("window-create", {
                win: this.win[0],
                element: element
            });

            setTimeout(()=> {
                this._setPosition();

                if (o.hidden !== true) {
                    this.win.removeClass("no-visible");
                }

                this._fireEvent("show", {
                    win: this.win[0],
                    element: element
                });
            }, 100);
        },

        _setPosition: function(){
            const o = this.options;
            const win = this.win;
            const parent = o.dragArea === "parent" ? win.parent() : $(o.dragArea);
            const top_center = parent.height() / 2 - win[0].offsetHeight / 2;
            const left_center = parent.width() / 2 - win[0].offsetWidth / 2;
            let top;
            let left;
            let right;
            let bottom;

            if (o.place !== 'auto') {

                switch (o.place.toLowerCase()) {
                    case "top-left": top = 0; left = 0; right = "auto"; bottom = "auto"; break;
                    case "top-center": top = 0; left = left_center; right = "auto"; bottom = "auto"; break;
                    case "top-right": top = 0; right = 0; left = "auto"; bottom = "auto"; break;
                    case "right-center": top = top_center; right = 0; left = "auto"; bottom = "auto"; break;
                    case "bottom-right": bottom = 0; right = 0; left = "auto"; top = "auto"; break;
                    case "bottom-center": bottom = 0; left = left_center; right = "auto"; top = "auto"; break;
                    case "bottom-left": bottom = 0; left = 0; right = "auto"; top = "auto"; break;
                    case "left-center": top = top_center; left = 0; right = "auto"; bottom = "auto"; break;
                    default: top = top_center; left = left_center; bottom = "auto"; right = "auto";
                }

                win.css({
                    top: top,
                    left: left,
                    bottom: bottom,
                    right: right
                });
            }
        },

        _window: function(o){
            let win;
            let caption;
            let content;
            let icon;
            let buttons;
            let btnClose;
            let btnMin;
            let btnMax;
            let resizer;
            let status;
            let width = o.width;
            let height = o.height;

            win = $("<div>").addClass("window");

            if (o.modal === true) {
                win.addClass("modal");
            }

            caption = $("<div>").addClass("window-caption");
            content = $("<div>").addClass("window-content");

            win.append(caption);
            win.append(content);

            if (o.status || o.resizable) {
                status = $("<div>").addClass("window-status").html(o.status);
                win.append(status);
            }

            if (o.shadow === true) {
                win.addClass("shadowed");
            }

            if (Metro.utils.isValue(o.icon)) {
                icon = $("<span>").addClass("icon").html(o.icon);
                icon.appendTo(caption);
            }

            const title = $("<span>").addClass("title").html(Metro.utils.isValue(o.title) ? o.title : "&nbsp;")
            title.appendTo(caption);

            if (!Metro.utils.isNull(o.content)) {
                if (Metro.utils.isQ(o.content)) {
                    o.content.appendTo(content);
                } else {
                    content.html(o.content);
                }
            }

            buttons = $("<div>").addClass("buttons");
            buttons.appendTo(caption);

            if (o.btnMax === true) {
                btnMax = $("<span>").addClass("button small square btn-max sys-button");
                btnMax.appendTo(buttons);
            }

            if (o.btnMin === true) {
                btnMin = $("<span>").addClass("button small square btn-min sys-button");
                btnMin.appendTo(buttons);
            }

            if (o.btnClose === true) {
                btnClose = $("<span>").addClass("button small square btn-close sys-button");
                btnClose.appendTo(buttons);
            }

            if (o.customButtons) {
                const customButtons = Metro.utils.isObject(o.customButtons);
                if (customButtons) {
                    $.each(customButtons, function () {
                        const customButton = $("<span>");

                        customButton
                            .addClass("button btn-custom")
                            .addClass(o.clsCustomButton)
                            .addClass(this.cls)
                            .attr("tabindex", -1)
                            .html(this.html);

                        if (this.attr && typeof this.attr === 'object') {
                            $.each(this.attr, (k, v) => {
                                customButton.attr(Str.dashedName(k), v);
                            });
                        }

                        customButton.data("action", this.onclick);

                        buttons.prepend(customButton);
                    });
                }
            }

            caption.on(Metro.events.click, ".btn-custom", function(e){
                if (Metro.utils.isRightMouse(e)) return;
                const button = $(this);
                const action = button.data("action");
                Metro.utils.exec(action, [button], this);
            });

            win.attr("id", o.id === undefined ? Metro.utils.elementId("window") : o.id);

            win.on(Metro.events.startAll, ".window-caption", (e)=> {
                this._fireEvent("caption-click", {
                    win: win[0],
                    e: e
                })
            });

            win.on(Metro.events.dblclick, ".window-caption", (e)=> {
                this.maximize(e);
            });

            caption.on(Metro.events.click, ".btn-max, .btn-min, .btn-close", (e)=> {
                if (Metro.utils.isRightMouse(e)) return;
                const target = $(e.target);
                if (target.hasClass("btn-max") && o.canMaximize) this.maximize(e);
                if (target.hasClass("btn-min") && o.canMinimize) this.minimize(e);
                if (target.hasClass("btn-close") && o.canClose) this.close(e);
            });

            win.on(Metro.events.click, (e)=> {
                this._fireEvent("window-click", {
                    win: win[0],
                    e: e
                })
            });

            if (o.draggable === true) {
                Metro.makePlugin(win, "draggable", {
                    dragContext: win[0],
                    dragElement: caption,
                    dragArea: o.dragArea,
                    onDragStart: o.onDragStart,
                    onDragStop: o.onDragStop,
                    onDragMove: o.onDragMove
                });
            }

            win.addClass(o.clsWindow);
            caption.addClass(o.clsCaption);
            content.addClass(o.clsContent);

            if (o.minWidth === 0) {
                o.minWidth = 34;
                $.each(buttons.children(".btn-custom"), function(){
                    o.minWidth += Metro.utils.hiddenElementSize(this).width;
                });
                if (o.btnMax) o.minWidth += 34;
                if (o.btnMin) o.minWidth += 34;
                if (o.btnClose) o.minWidth += 34;
            }

            if (o.minWidth > 0 && !Number.isNaN(o.width) && o.width < o.minWidth) {
                width = o.minWidth;
            }
            if (o.minHeight > 0 && !Number.isNaN(o.height) && o.height > o.minHeight) {
                height = o.minHeight;
            }

            if (o.resizable) {
                resizer = $("<span>").addClass("resize-element");
                resizer.appendTo(win);
                win.addClass("resizable");

                Metro.makePlugin(win, "resizable", {
                    minWidth: o.minWidth,
                    minHeight: o.minHeight,
                    maxWidth: o.maxWidth,
                    maxHeight: o.maxHeight,
                    resizeElement: ".resize-element",
                    onResizeStart: o.onResizeStart,
                    onResizeStop: o.onResizeStop,
                    onResize: o.onResize
                });
            }

            win.css({
                width: width,
                height: height,
                position: o.position,
                top: o.top,
                left: o.left
            });

            return win;
        },

        _overlay: function(){
            const o = this.options;

            const overlay = $("<div>");
            overlay.addClass("overlay");

            if (o.overlayColor === 'transparent') {
                overlay.addClass("transparent");
            } else {
                overlay.css({
                    background: Farbe.Routines.toRGBA(Farbe.Routines.parse(o.overlayColor), o.overlayAlpha)
                });
            }

            return overlay;
        },

        width: function(v){
            const win = this.win;

            if (!Metro.utils.isValue(v)) {
                return win.width();
            }

            win.css("width", Number.parseInt(v));

            return this;
        },

        height: function(v){
            const win = this.win;

            if (!Metro.utils.isValue(v)) {
                return win.height();
            }

            win.css("height", Number.parseInt(v));

            return this;
        },

        maximize: function(e){
            const win = this.win;
            const o = this.options;
            const target = $(e.target);

            if (o.btnMax) {
                win.removeClass("minimized");
                win.toggleClass("maximized");
            }

            if (target.hasClass?.("title")) {

                this._fireEvent("caption-dbl-click", {
                    win: win[0]
                });

            } else {

                this._fireEvent("max-click", {
                    win: win[0]
                });

            }

            this._fireEvent("maximize", {
                win: win[0]
            });
        },

        minimize: function(){
            const win = this.win;
            const o = this.options;

            if (o.btnMin) {
                win.removeClass("maximized");
                win.toggleClass("minimized");
            }

            this._fireEvent("min-click", {
                win: win[0]
            });

            this._fireEvent("minimize", {
                win: win[0]
            });
        },

        close: function(){
            const win = this.win;
            const o = this.options;

            if (Metro.utils.exec(o.onCanClose, [win]) === false) {
                return false;
            }

            let timeout = 0;

            if (o.onClose !== Metro.noop) {
                timeout = 500;
            }

            this._fireEvent("close", {
                win: win[0]
            });

            setTimeout(()=> {
                if (o.modal === true) {
                    win.siblings(".overlay").remove();
                }

                this._fireEvent("close-click", {
                    win: win[0]
                });

                if (o.closeAction === Metro.actions.REMOVE) {
                    this._fireEvent("window-destroy", {
                        win: win[0]
                    });
                    win.remove();
                } else {
                    this.hide();
                }

            }, timeout);
        },

        hide: function(){
            const win = this.win;

            win.css({
                display: "none"
            });

            this._fireEvent("hide", {
                win: win[0]
            });
        },

        show: function(){
            const win = this.win;

            win
                .removeClass("no-visible")
                .css({
                    display: "flex"
                });

            this._fireEvent("show", {
                win: win[0]
            });

        },

        toggle: function(){
            if (this.win.css("display") === "none" || this.win.hasClass("no-visible")) {
                this.show();
            } else {
                this.hide();
            }
        },

        isOpen: function(){
            return this.win.hasClass("no-visible");
        },

        min: function(a){
            a ? this.win.addClass("minimized") : this.win.removeClass("minimized");
        },

        max: function(a){
            a ? this.win.addClass("maximized") : this.win.removeClass("maximized");
        },

        changeClass: function(a){
            const element = this.element;
            const win = this.win;
            const o = this.options;

            if (a === "data-cls-window") {
                win[0].className = `window ${o.resizable ? " resizable " : " "}${element.attr("data-cls-window")}`;
            }
            if (a === "data-cls-caption") {
                win.find(".window-caption")[0].className = `window-caption ${element.attr("data-cls-caption")}`;
            }
            if (a === "data-cls-content") {
                win.find(".window-content")[0].className = `window-content ${element.attr("data-cls-content")}`;
            }
        },

        toggleShadow: function(){
            const element = this.element;
            const win = this.win;
            const flag = JSON.parse(element.attr("data-shadow"));
            if (flag === true) {
                win.addClass("win-shadow");
            } else {
                win.removeClass("win-shadow");
            }
        },

        setContent: function(c){
            const element = this.element;
            const win = this.win;
            const content = Metro.utils.isValue(c) ? c : element.attr("data-content");
            let result;

            if (!Metro.utils.isQ(content) && Metro.utils.isFunc(content)) {
                result = Metro.utils.exec(content);
            } else if (Metro.utils.isQ(content)) {
                result = content.html();
            } else {
                result = content;
            }

            win.find(".window-content").html(result);
        },

        setTitle: function(t){
            const element = this.element;
            const win = this.win;
            const title = Metro.utils.isValue(t) ? t : element.attr("data-title");
            win.find(".window-caption .title").html(title);
        },

        setIcon: function(i){
            const element = this.element;
            const win = this.win;
            const icon = Metro.utils.isValue(i) ? i : element.attr("data-icon");
            win.find(".window-caption .icon").html(icon);
        },

        getIcon: function(){
            return this.win.find(".window-caption .icon").html();
        },

        getTitle: function(){
            return this.win.find(".window-caption .title").html();
        },

        toggleDraggable: function(f){
            const win = this.win;
            const flag = Metro.utils.bool(f);
            const drag = Metro.getPlugin(win, "draggable");
            if (flag === true) {
                drag.on();
            } else {
                drag.off();
            }
        },

        toggleResizable: function(f){
            const win = this.win;
            const flag = Metro.utils.bool(f);
            const resize = Metro.getPlugin(win, "resizable");
            if (flag === true) {
                resize.on();
                win.find(".resize-element").removeClass("resize-element-disabled");
            } else {
                resize.off();
                win.find(".resize-element").addClass("resize-element-disabled");
            }
        },

        changePlace: function (p) {
            const element = this.element;
            const win = this.win;
            const place = Metro.utils.isValue(p) ? p : element.attr("data-place");
            win.addClass(place);
        },

        pos: function(top, left){
            const win = this.win;
            win.css({
                top: top,
                left: left
            });
            return this;
        },

        top: function(v){
            this.win.css({
                top: v
            });
            return this;
        },

        left: function(v){
            this.win.css({
                left: v
            });
            return this;
        },

        changeAttribute: function(attr, value){
            const changePos = function (a, v) {
                const win = this.win;
                let pos;
                if (a === "data-top") {
                    pos = Number.parseInt(v);
                    if (!Number.isNaN(pos)) {
                        return;
                    }
                    win.css("top", pos);
                }
                if (a === "data-left") {
                    pos = Number.parseInt(v);
                    if (!Number.isNaN(pos)) {
                        return;
                    }
                    win.css("left", pos);
                }
            };

            const toggleButtons = function (a, v) {
                const win = this.win;
                const btnClose = win.find(".btn-close");
                const btnMin = win.find(".btn-min");
                const btnMax = win.find(".btn-max");
                const _v = Metro.utils.bool(v);
                const func = _v ? "show" : "hide";

                switch (a) {
                    case "data-btn-close":
                        btnClose[func]();
                        break;
                    case "data-btn-min":
                        btnMin[func]();
                        break;
                    case "data-btn-max":
                        btnMax[func]();
                        break;
                }
            };

            const changeSize = function (a, v) {
                const win = this.win;
                if (a === "data-width") {
                    win.css("width", +v);
                }
                if (a === "data-height") {
                    win.css("height", +v);
                }
            };

            switch (attr) {
                case "data-btn-close":
                case "data-btn-min":
                case "data-btn-max": toggleButtons(attr, value); break;
                case "data-width":
                case "data-height": changeSize(attr, value); break;
                case "data-cls-window":
                case "data-cls-caption":
                case "data-cls-content": this.changeClass(attr); break;
                case "data-shadow": this.toggleShadow(); break;
                case "data-icon": this.setIcon(); break;
                case "data-title": this.setTitle(); break;
                case "data-content": this.setContent(); break;
                case "data-draggable": this.toggleDraggable(value); break;
                case "data-resizable": this.toggleResizable(value); break;
                case "data-top":
                case "data-left": changePos(attr, value); break;
                case "data-place": this.changePlace(); break;
            }
        },

        destroy: function(){
            return this.element;
        }
    });

    Metro.window = {
        isWindow: (el)=> Metro.utils.isMetroObject(el, "window"),

        min: function(el, a){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el,"window").min(a);
        },

        max: function(el, a){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").max(a);
        },

        show: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").show();
        },

        hide: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").hide();
        },

        toggle: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").toggle();
        },

        isOpen: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            const win = Metro.getPlugin(el, "window");
            return win.isOpen();
        },

        close: function(el){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").close();
        },

        pos: function(el, top, left){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").pos(top, left);
        },

        top: function(el, top){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").top(top);
        },

        left: function(el, left){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").left(left);
        },

        width: function(el, width){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").width(width);
        },

        height: function(el, height){
            if (!this.isWindow(el)) {
                return false;
            }
            Metro.getPlugin(el, "window").height(height);
        },

        create: (options, parent)=> {
            const w = $("<div>").appendTo(parent ? $(parent) : $("body"))
            const w_options = $.extend({
                _runtime: true
            }, (options ? options : {}));

            Metro.makePlugin(w, "window", w_options);
            return Metro.getPlugin(w, "window").win;
        }
    };
})(Metro, Dom);