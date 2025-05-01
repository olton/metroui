((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let MasterDefaultConfig = {
        masterDeferred: 0,
        effect: "slide", // slide, fade, switch, slowdown, custom
        effectFunc: "linear",
        duration: METRO_ANIMATION_DURATION,

        controlPrev: "🡐",
        controlNext: "🡒",
        controlTitle: "Master, page $1 of $2",
        backgroundImage: "",

        clsMaster: "",
        clsControls: "",
        clsControlPrev: "",
        clsControlNext: "",
        clsControlTitle: "",
        clsPages: "",
        clsPage: "",

        onBeforePage: Metro.noop_true,
        onBeforeNext: Metro.noop_true,
        onBeforePrev: Metro.noop_true,
        onNextPage: Metro.noop,
        onPrevPage: Metro.noop,
        onMasterCreate: Metro.noop,
    };

    Metro.masterSetup = (options) => {
        MasterDefaultConfig = $.extend({}, MasterDefaultConfig, options);
    };

    if (typeof globalThis.metroMasterSetup !== "undefined") {
        Metro.masterSetup(globalThis.metroMasterSetup);
    }

    Metro.Component("master", {
        init: function (options, elem) {
            this._super(elem, options, MasterDefaultConfig, {
                pages: [],
                currentIndex: 0,
                isAnimate: false,
                id: Metro.utils.elementId("master"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("master").addClass(o.clsMaster);
            element.css({
                backgroundImage: `url(${o.backgroundImage})`,
            });

            this._createControls();
            this._createPages();
            this._createEvents();

            this._fireEvent("master-create", {
                element: element,
            });
        },

        _createControls: function () {
            const element = this.element;
            const o = this.options;
            const controls_position = ["top", "bottom"];
            let controls;
            let title;
            const pages = element.find(".page");

            title = String(o.controlTitle).replace("$1", "1");
            title = String(title).replace("$2", pages.length);

            $.each(controls_position, function () {
                controls = $("<div>").addClass(`controls controls-${this}`).addClass(o.clsControls).appendTo(element);
                $("<span>").addClass("prev").addClass(o.clsControlPrev).html(o.controlPrev).appendTo(controls);
                $("<span>").addClass("next").addClass(o.clsControlNext).html(o.controlNext).appendTo(controls);
                $("<span>").addClass("title").addClass(o.clsControlTitle).html(title).appendTo(controls);
            });

            this._enableControl("prev", false);
        },

        _enableControl: function (type, state) {
            const control = this.element.find(`.controls .${type}`);
            if (state === true) {
                control.removeClass("disabled");
            } else {
                control.addClass("disabled");
            }
        },

        _setTitle: function () {
            const title = this.element.find(".controls .title");
            let title_str = this.options.controlTitle.replace("$1", this.currentIndex + 1);
            title_str = title_str.replace("$2", String(this.pages.length));
            title.html(title_str);
        },

        _createPages: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            let pages = element.find(".pages");
            const page = element.find(".page");

            if (pages.length === 0) {
                pages = $("<div>").addClass("pages").appendTo(element);
            }

            pages.addClass(o.clsPages);

            $.each(page, function () {
                const p = $(this);
                if (p.data("cover")) {
                    element.css({
                        backgroundImage: `url(${p.data("cover")})`,
                    });
                } else {
                    element.css({
                        backgroundImage: `url(${o.backgroundImage})`,
                    });
                }

                p.css({
                    left: "100%",
                });

                p.addClass(o.clsPage).hide(0);

                that.pages.push(p);
            });

            page.appendTo(pages);

            this.currentIndex = 0;
            if (this.pages[this.currentIndex] !== undefined) {
                if (this.pages[this.currentIndex].data("cover") !== undefined) {
                    element.css({
                        backgroundImage: `url(${this.pages[this.currentIndex].data("cover")})`,
                    });
                }
                this.pages[this.currentIndex].css("left", "0").show(0);
                setTimeout(() => {
                    pages.css({
                        height: that.pages[0].outerHeight(true) + 2,
                    });
                }, 0);
            }
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.click, ".controls .prev", () => {
                if (this.isAnimate === true) {
                    return;
                }
                if (
                    Metro.utils.exec(o.onBeforePrev, [this.currentIndex, this.pages[this.currentIndex], element]) ===
                        true &&
                    Metro.utils.exec(o.onBeforePage, [
                        "prev",
                        this.currentIndex,
                        this.pages[this.currentIndex],
                        element,
                    ]) === true
                ) {
                    this.prev();
                }
            });

            element.on(Metro.events.click, ".controls .next", () => {
                if (this.isAnimate === true) {
                    return;
                }
                if (
                    Metro.utils.exec(o.onBeforeNext, [this.currentIndex, this.pages[this.currentIndex], element]) ===
                        true &&
                    Metro.utils.exec(o.onBeforePage, [
                        "next",
                        this.currentIndex,
                        this.pages[this.currentIndex],
                        element,
                    ]) === true
                ) {
                    this.next();
                }
            });

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    element.find(".pages").height(this.pages[this.currentIndex].outerHeight(true) + 2);
                },
                { ns: this.id },
            );
        },

        _slideToPage: function (index) {
            if (this.pages[index] === undefined) {
                return;
            }

            if (this.currentIndex === index) {
                return;
            }

            const to = index > this.currentIndex ? "next" : "prev";
            const current = this.pages[this.currentIndex];
            const next = this.pages[index];
            this.currentIndex = index;

            this._effect(current, next, to);
        },

        _slideTo: function (to) {
            const forward = to.toLowerCase() === "next";

            const current = this.pages[this.currentIndex];
            if (forward) {
                if (this.currentIndex + 1 >= this.pages.length) {
                    return;
                }
                this.currentIndex++;
            } else {
                if (this.currentIndex - 1 < 0) {
                    return;
                }
                this.currentIndex--;
            }

            const next = this.pages[this.currentIndex];
            this._fireEvent(forward ? "next-page" : "prev-page", {
                current: current,
                next: next,
                forward: forward,
            });

            this._effect(current, next, to);
        },

        _effect: function (current, next, to) {
            const that = this;
            const element = this.element;
            const o = this.options;
            const out = element.width();
            const pages = element.find(".pages");

            this._setTitle();

            if (this.currentIndex === this.pages.length - 1) {
                this._enableControl("next", false);
            } else {
                this._enableControl("next", true);
            }

            if (this.currentIndex === 0) {
                this._enableControl("prev", false);
            } else {
                this._enableControl("prev", true);
            }

            setTimeout(() => {
                that.isAnimate = true;
                pages.animate({
                    draw: {
                        height: next.outerHeight(true) + 2,
                    },
                    onDone: () => {
                        finish();
                    },
                });
            }, 0);

            pages.css("overflow", "hidden");

            function finish() {
                if (next.data("cover") !== undefined) {
                    element.css({
                        backgroundImage: `url(${next.data("cover")})`,
                    });
                } else {
                    element.css({
                        backgroundImage: `url(${o.backgroundImage})`,
                    });
                }
                pages.css("overflow", "initial");
                that.isAnimate = false;
            }

            function _slide() {
                current.stop(true).animate({
                    draw: {
                        left: to === "next" ? -out : out,
                    },
                    dur: o.duration,
                    ease: o.effectFunc,
                    onDone: () => {
                        current.hide(0);
                    },
                });

                next.stop(true)
                    .css({
                        left: to === "next" ? out : -out,
                    })
                    .show(0)
                    .animate({
                        draw: {
                            left: 0,
                        },
                        dur: o.duration,
                        ease: o.effectFunc,
                        onDone: () => {
                            finish();
                        },
                    });
            }

            function _switch() {
                current.hide();

                next.css({
                    top: 0,
                    left: 0,
                    opacity: 0,
                }).show(() => {
                    finish();
                });
            }

            function _fade() {
                current.fadeOut(o.duration);

                next.css({
                    top: 0,
                    left: 0,
                    opacity: 0,
                }).fadeIn(o.duration, "linear", () => {
                    finish();
                });
            }

            switch (o.effect) {
                case "fade":
                    _fade();
                    break;
                case "switch":
                    _switch();
                    break;
                default:
                    _slide();
            }
        },

        toPage: function (index) {
            this._slideToPage(index);
        },

        next: function () {
            this._slideTo("next");
        },

        prev: function () {
            this._slideTo("prev");
        },

        changeEffect: function () {
            this.options.effect = this.element.attr("data-effect");
        },

        changeEffectFunc: function () {
            this.options.effectFunc = this.element.attr("data-effect-func");
        },

        changeEffectDuration: function () {
            this.options.duration = this.element.attr("data-duration");
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "data-effect":
                    this.changeEffect();
                    break;
                case "data-effect-func":
                    this.changeEffectFunc();
                    break;
                case "data-duration":
                    this.changeEffectDuration();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;

            element.off(Metro.events.click, ".controls .prev");
            element.off(Metro.events.click, ".controls .next");
            $(globalThis).off(Metro.events.resize, { ns: this.id });

            element.remove();
        },
    });
})(Metro, Dom);
