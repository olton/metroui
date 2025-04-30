((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    let AccordionDefaultConfig = {
        accordionDeferred: 0,
        showMarker: true,
        material: false,
        duration: METRO_ANIMATION_DURATION,
        oneFrame: true,
        showActive: true,

        clsFrame: "",
        clsHeading: "",
        clsContent: "",
        clsAccordion: "",
        clsActiveFrame: "",
        clsActiveFrameHeading: "",
        clsActiveFrameContent: "",

        onFrameOpen: Metro.noop,
        onFrameBeforeOpen: Metro.noop_true,
        onFrameClose: Metro.noop,
        onFrameBeforeClose: Metro.noop_true,
        onAccordionCreate: Metro.noop,
    };

    Metro.accordionSetup = (options) => {
        AccordionDefaultConfig = $.extend({}, AccordionDefaultConfig, options);
    };

    if (typeof globalThis.metroAccordionSetup !== "undefined") {
        Metro.accordionSetup(globalThis.metroAccordionSetup);
    }

    Metro.Component("accordion", {
        init: function (options, elem) {
            this._super(elem, options, AccordionDefaultConfig);
            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("accordionCreate", {
                element: element,
            });
        },

        _createStructure: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const frames = element.children(".frame");
            const active = element.children(".frame.active");
            let frame_to_open;

            if (!element.id()) {
                element.id(Hooks.useId("accordion")); 
            }
            
            element.addClass("accordion").addClass(o.clsAccordion);

            frames.addClass(o.clsFrame).each(function () {
                const el = $(this);
                const heading = el.children(".heading");
                const content = el.children(".content");
                const headingId = Hooks.useId("accordion-heading") 
                const contentId = Hooks.useId("accordion-content") 

                // Добавляем ARIA-атрибуты
                heading.attr({
                    'id': headingId,
                    'role': 'button',
                    'aria-expanded': el.hasClass('active') ? 'true' : 'false',
                    'aria-controls': contentId,
                    'tabindex': '0'
                });

                content.attr({
                    'id': contentId,
                    'role': 'region',
                    'aria-labelledby': headingId
                });

                heading.addClass(o.clsHeading);
                content.addClass(o.clsContent);
            });

            if (o.showMarker === true) {
                element.addClass("marker-on");
            }

            if (o.material === true) {
                element.addClass("material");
            }

            if (active.length === 0) {
                frame_to_open = frames[0];
            } else {
                frame_to_open = active[0];
            }

            this._hideAll();

            if (o.showActive === true) {
                if (o.oneFrame === true) {
                    this._openFrame(frame_to_open);
                } else {
                    $.each(active, function () {
                        that._openFrame(this);
                    });
                }
            }
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const active = element.children(".frame.active");

            element.on("keydown", ".heading", function(e) {
                const heading = $(this);
                const frame = heading.parent();

                if (heading.closest(".accordion")[0] !== element[0]) {
                    return false;
                }

                // Enter или Space для активации
                if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    if (frame.hasClass("active")) {
                        if (!(active.length === 1 && o.oneFrame)) {
                            that._closeFrame(frame);
                        }
                    } else {
                        that._openFrame(frame);
                    }
                }

                // Стрелки для навигации
                if (e.keyCode === 38 || e.keyCode === 40) {
                    e.preventDefault();
                    const frames = element.children(".frame");
                    const currentIndex = frames.index(frame);
                    let nextIndex;

                    if (e.keyCode === 38) { // Up
                        nextIndex = (currentIndex - 1 + frames.length) % frames.length;
                    } else { // Down
                        nextIndex = (currentIndex + 1) % frames.length;
                    }

                    frames.eq(nextIndex).children(".heading").focus();
                }
            });
            
            element.on(Metro.events.click, ".heading", function () {
                const heading = $(this);
                const frame = heading.parent();

                if (heading.closest(".accordion")[0] !== element[0]) {
                    return false;
                }

                if (frame.hasClass("active")) {
                    if (active.length === 1 && o.oneFrame) {
                        /* eslint-disable-next-line */
                    } else {
                        that._closeFrame(frame);
                    }
                } else {
                    that._openFrame(frame);
                }
            });
        },

        _openFrame: function (f) {
            const element = this.element;
            const o = this.options;
            const frame = $(f);

            if ( Metro.utils.exec(o.onFrameBeforeOpen, [frame[0]], element[0]) === false ) {
                return false;
            }

            if (o.oneFrame === true) {
                this._closeAll(frame[0]);
            }

            frame
                .addClass("active")
                .addClass(o.clsActiveFrame);
            frame
                .children(".heading")
                .addClass(o.clsActiveFrameHeading);
            frame
                .children(".content")
                .addClass(o.clsActiveFrameContent)
                .slideDown(o.duration);

            this._fireEvent("frameOpen", {
                frame: frame[0],
            });
        },

        _closeFrame: function (f) {
            const element = this.element;
            const o = this.options;
            const frame = $(f);

            if (!frame.hasClass("active")) {
                return;
            }

            if ( Metro.utils.exec(o.onFrameBeforeClose, [frame[0]], element[0]) === false ) {
                return;
            }

            frame
                .removeClass("active")
                .removeClass(o.clsActiveFrame);
            frame
                .children(".heading")
                .removeClass(o.clsActiveFrameHeading);
            frame
                .children(".content")
                .removeClass(o.clsActiveFrameContent)
                .slideUp(o.duration);

            this._fireEvent("frameClose", {
                frame: frame[0],
            });
        },

        _closeAll: function (skip) {
            const that = this;
            const element = this.element;
            const frames = element.children(".frame");

            $.each(frames, function () {
                if (skip === this) return;
                that._closeFrame(this);
            });
        },

        _hideAll: function () {
            const element = this.element;
            const frames = element.children(".frame");

            $.each(frames, function () {
                $(this).children(".content").hide();
            });
        },

        _openAll: function () {
            const that = this;
            const element = this.element;
            const frames = element.children(".frame");

            $.each(frames, function () {
                that._openFrame(this);
            });
        },
       
        open: function (i) {
            const frame = this.element.children(".frame").eq(i);
            this._openFrame(frame);
        },

        close: function (i) {
            const frame = this.element.children(".frame").eq(i);
            this._closeFrame(frame);
        },

        toggle: function (i) {
            const frame = this.element.children(".frame").eq(i);
            if (frame.hasClass("active")) {
                this._closeFrame(frame);
            } else {
                this._openFrame(frame);
            }
        },

        getActive: function () {
            const element = this.element;
            const frames = element.children(".frame");
            const active = [];

            frames.each(function(index) {
                if ($(this).hasClass("active")) {
                    active.push(index);
                }
            });

            return active;
        },

        changeAttribute: (attr, newVal) => {},

        destroy: function () {
            const element = this.element;
            element.off(Metro.events.click, ".heading");
            return element;
        },
    });
})(Metro, Dom);
