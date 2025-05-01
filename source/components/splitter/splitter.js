((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const SPLIT_MODE = {
        VERTICAL: "vertical",
        HORIZONTAL: "horizontal",
    };

    const Storage = Metro.storage;
    let SplitterDefaultConfig = {
        splitterDeferred: 0,
        split: SPLIT_MODE.VERTICAL, // horizontal or vertical
        splitSizes: null,
        gutterSize: 5,
        gutterStyle: "default", // ribbed, dashed, dotted, default
        minSizes: null,
        children: "*",
        gutterClick: "expand", // TODO expand or collapse
        saveState: false,
        noResize: false,
        onResizeStart: Metro.noop,
        onResizeStop: Metro.noop,
        onResizeSplit: Metro.noop,
        onResizeWindow: Metro.noop,
        onSplitterCreate: Metro.noop,
    };

    Metro.splitterSetup = (options) => {
        SplitterDefaultConfig = $.extend({}, SplitterDefaultConfig, options);
    };

    if (typeof globalThis.metroSplitterSetup !== "undefined") {
        Metro.splitterSetup(globalThis.metroSplitterSetup);
    }

    Metro.Component("splitter", {
        init: function (options, elem) {
            this._super(elem, options, SplitterDefaultConfig, {
                storage: Metro.utils.isValue(Storage) ? Storage : null,
                storageKey: "SPLITTER:",
                id: Metro.utils.elementId("splitter"),
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("splitter-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const children = element.children(o.children).addClass("split-block");
            let i;
            let children_sizes = [];
            const resizeProp = o.split === SPLIT_MODE.HORIZONTAL ? "height" : "width";

            element.addClass("splitter");
            element.addClass(o.split.toLowerCase() === SPLIT_MODE.VERTICAL ? "vertical" : "horizontal");

            if (o.gutterStyle !== "default") {
                element.addClass(`gutter-style-${o.gutterStyle}`);
            }

            if (o.noResize === true) {
                element.addClass("static-size");
            }

            for (i = 0; i < children.length - 1; i++) {
                $("<div>").addClass("gutter").css(resizeProp, o.gutterSize).insertAfter($(children[i]));
            }

            this._setSize();

            if (Metro.utils.isValue(o.minSizes)) {
                if (`${o.minSizes}`.includes(",")) {
                    children_sizes = o.minSizes.toArray();
                    for (i = 0; i < children_sizes.length; i++) {
                        $(children[i]).data("min-size", children_sizes[i]);
                        children[i].style.setProperty(
                            `min-${resizeProp}`,
                            `${children_sizes[i]}`.includes("%")
                                ? children_sizes[i]
                                : `${(`${children_sizes[i]}`).replace("px", "")}px`,
                            "important",
                        );
                    }
                } else {
                    $.each(children, function () {
                        this.style.setProperty(
                            `min-${resizeProp}`,
                            `${o.minSizes}`.includes("%") ? o.minSizes : `${(`${o.minSizes}`).replace("px", "")}px`,
                            "important",
                        );
                    });
                }
            }

            if (o.saveState && this.storage !== null) {
                this._getSize();
            }
        },

        _setSize: function () {
            const element = this.element;
            const o = this.options;
            let gutters;
            let children_sizes;
            const children = element.children(".split-block");
            const w = element.width();

            gutters = element.children(".gutter");

            if (!Metro.utils.isValue(o.splitSizes)) {
                children.css({
                    flexBasis: `calc(${100 / children.length}% - ${gutters.length * o.gutterSize}px)`,
                });
            } else {
                children_sizes = `${o.splitSizes}`.toArray();
                let remnant = 100;
                let i = 0;
                for (; i < children_sizes.length; i++) {
                    let s = children_sizes[i];
                    if (!s.includes("%")) {
                        s = (+s * 100) / w;
                    } else {
                        s = Number.parseInt(s);
                    }
                    remnant -= s;
                    $(children[i]).css({
                        flexBasis: `calc(${s}% - ${gutters.length * o.gutterSize}px)`,
                    });
                }
                for (; i < children.length; i++) {
                    $(children[i]).css({
                        flexBasis: `calc(${remnant / (children.length - i)}% - ${gutters.length * o.gutterSize}px)`,
                    });
                }
            }
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const gutters = element.children(".gutter");

            gutters.on(
                Metro.events.startAll,
                function (e) {
                    if (o.noResize === true) {
                        return false;
                    }

                    const w = o.split === SPLIT_MODE.VERTICAL ? element.width() : element.height();
                    const gutter = $(this);
                    const prev_block = gutter.prev(".split-block");
                    const next_block = gutter.next(".split-block");
                    const prev_block_size =
                        (100 *
                            (o.split === SPLIT_MODE.VERTICAL
                                ? prev_block.outerWidth(true)
                                : prev_block.outerHeight(true))) /
                        w;
                    const next_block_size =
                        (100 *
                            (o.split === SPLIT_MODE.VERTICAL
                                ? next_block.outerWidth(true)
                                : next_block.outerHeight(true))) /
                        w;
                    const start_pos = Metro.utils.getCursorPosition(element[0], e);

                    gutter.addClass("active");

                    prev_block.addClass("stop-pointer");
                    next_block.addClass("stop-pointer");

                    that._fireEvent("resize-start", {
                        pos: start_pos,
                        gutter: gutter[0],
                        prevBlock: prev_block[0],
                        nextBlock: next_block[0],
                    });

                    $(globalThis).on(
                        Metro.events.moveAll,
                        (e) => {
                            const pos = Metro.utils.getCursorPosition(element[0], e);
                            let new_pos;

                            if (o.split === SPLIT_MODE.VERTICAL) {
                                new_pos = (pos.x * 100) / w - (start_pos.x * 100) / w;
                            } else {
                                new_pos = (pos.y * 100) / w - (start_pos.y * 100) / w;
                            }

                            prev_block.css(
                                "flex-basis",
                                `calc(${prev_block_size + new_pos}% - ${gutters.length * o.gutterSize}px)`,
                            );
                            next_block.css(
                                "flex-basis",
                                `calc(${next_block_size - new_pos}% - ${gutters.length * o.gutterSize}px)`,
                            );

                            that._fireEvent("resize-split", {
                                pos: pos,
                                gutter: gutter[0],
                                prevBlock: prev_block[0],
                                nextBlock: next_block[0],
                            });
                        },
                        { ns: that.id },
                    );

                    $(globalThis).on(
                        Metro.events.stopAll,
                        (e) => {
                            prev_block.removeClass("stop-pointer");
                            next_block.removeClass("stop-pointer");

                            that._saveSize();

                            gutter.removeClass("active");

                            $(globalThis).off(Metro.events.moveAll, { ns: that.id });
                            $(globalThis).off(Metro.events.stopAll, { ns: that.id });

                            const cur_pos = Metro.utils.getCursorPosition(element[0], e);
                            that._fireEvent("resize-stop", {
                                pos: cur_pos,
                                gutter: gutter[0],
                                prevBlock: prev_block[0],
                                nextBlock: next_block[0],
                            });
                        },
                        { ns: that.id },
                    );
                },
                { passive: true },
            );

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    const gutter = element.children(".gutter");
                    const prev_block = gutter.prev(".split-block");
                    const next_block = gutter.next(".split-block");

                    that._fireEvent("resize-window", {
                        prevBlock: prev_block[0],
                        nextBlock: next_block[0],
                    });
                },
                { ns: that.id },
            );
        },

        _saveSize: function () {
            const element = this.element;
            const o = this.options;
            const storage = this.storage;
            const itemsSize = [];
            const id = element.attr("id") || this.id;

            if (o.saveState === true && storage !== null) {
                $.each(element.children(".split-block"), function () {
                    const item = $(this);
                    itemsSize.push(item.css("flex-basis"));
                });

                if (storage) storage.setItem(this.storageKey + id, itemsSize);
            }
        },

        _getSize: function () {
            const element = this.element;
            const o = this.options;
            const storage = this.storage;
            let itemsSize = [];
            const id = element.attr("id") || this.id;

            if (o.saveState === true && storage !== null) {
                itemsSize = storage.getItem(this.storageKey + id);

                $.each(element.children(".split-block"), (i, v) => {
                    const item = $(v);
                    if (Metro.utils.isValue(itemsSize) && Metro.utils.isValue(itemsSize[i]))
                        item.css("flex-basis", itemsSize[i]);
                });
            }
        },

        size: function (size) {
            const o = this.options;
            if (Metro.utils.isValue(size)) {
                o.splitSizes = size;
                this._setSize();
            }
            return this;
        },

        changeAttribute: function (attributeName) {
            const that = this;
            const element = this.element;

            function changeSize() {
                const size = element.attr("data-split-sizes");
                that.size(size);
            }

            if (attributeName === "data-split-sizes") {
                changeSize();
            }
        },

        destroy: function () {
            const element = this.element;
            const gutters = element.children(".gutter");
            gutters.off(Metro.events.start);
            return element.remove();
        },
    });
})(Metro, Dom);
