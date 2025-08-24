((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let CubeDefaultConfig = {
        cubeDeferred: 0,
        rules: null,
        color: null,
        flashColor: null,
        flashInterval: 1000,
        numbers: false,
        cells: 4,
        showAxis: false,
        axisStyle: "arrow", //line
        cellClick: false,
        autoRestart: 5000,

        clsCube: "",
        clsCell: "",
        clsSide: "",
        clsSideLeft: "",
        clsSideRight: "",
        clsSideTop: "",
        clsSideLeftCell: "",
        clsSideRightCell: "",
        clsSideTopCell: "",
        clsAxis: "",
        clsAxisX: "",
        clsAxisY: "",
        clsAxisZ: "",

        onTick: Metro.noop,
        onCubeCreate: Metro.noop,
    };

    Metro.cubeSetup = (options) => {
        CubeDefaultConfig = $.extend({}, CubeDefaultConfig, options);
    };

    if (typeof globalThis.metroCubeSetup !== "undefined") {
        Metro.cubeSetup(globalThis.metroCubeSetup);
    }

    Metro.cubeDefaultRules = [
        {
            on: { top: [16], left: [4], right: [1] },
        },
        {
            on: { top: [12, 15], left: [3, 8], right: [2, 5] },
        },
        {
            on: { top: [11], left: [7], right: [6] },
        },
        {
            on: { top: [8, 14], left: [2, 12], right: [9, 3] },
        },
        {
            on: { top: [10, 7], left: [6, 11], right: [10, 7] },
        },
        {
            on: { top: [13, 4], left: [1, 16], right: [13, 4] },
        },
        {
            on: { top: [9, 6, 3], left: [5, 10, 15], right: [14, 11, 8] },
        },
        {
            on: { top: [1, 2, 5], left: [9, 13, 14], right: [15, 12, 16] },
        },
    ];

    Metro.Component("cube", {
        init: function (options, elem) {
            this._super(elem, options, CubeDefaultConfig, {
                id: null,
                rules: null,
                interval: false,
                ruleInterval: false,
                running: false,
                intervals: [],
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            if (o.rules === null) {
                this.rules = Metro.cubeDefaultRules;
            } else {
                this._parseRules(o.rules);
            }

            this._createCube();
            this._createEvents();

            this._fireEvent("cube-create", {
                element: element,
            });
        },

        _parseRules: function (rules) {
            if (rules === undefined || rules === null) {
                return false;
            }

            if (Metro.utils.isObject(rules)) {
                this.rules = Metro.utils.isObject(rules);
                return true;
            }
            try {
                this.rules = JSON.parse(rules);
                return true;
            } catch (err) {
                console.warn(`Unknown or empty rules for cell flashing!\n${err.message}`);
                return false;
            }
        },

        _createCube: function () {
            const element = this.element;
            const o = this.options;
            const sides = ["left", "right", "top"];
            const cells_count = o.cells ** 2;

            element.addClass("cube").addClass(o.clsCube);

            if (!element.attr("id")) {
                element.attr("id", Hooks.useId(this.elem));
            }

            this.id = element.attr("id");

            if (o.color && Farbe.Routines.isColor(o.color)) {
                element.cssVar("--cube-background", o.color);
            }
            if (o.flashColor && Farbe.Routines.isColor(o.flashColor)) {
                element.cssVar("cube-background-flash", o.flashColor);
            }

            $.each(sides, function () {
                let side;

                side = $("<div>").addClass(`side ${this}-side`).addClass(o.clsSide).appendTo(element);

                if (this === "left") {
                    side.addClass(o.clsSideLeft);
                }
                if (this === "right") {
                    side.addClass(o.clsSideRight);
                }
                if (this === "top") {
                    side.addClass(o.clsSideTop);
                }

                for (let i = 0; i < cells_count; i++) {
                    const cell = $("<div>")
                        .addClass("cube-cell")
                        .addClass(`cell-id-${i + 1}`)
                        .addClass(o.clsCell);
                    cell.data("id", i + 1).data("side", this);
                    cell.appendTo(side);
                    if (o.numbers === true) {
                        cell.html(i + 1);
                    }
                }
            });

            this._createCssForCellSize();

            const axis = ["x", "y", "z"];
            $.each(axis, function () {
                const ax = $("<div>").addClass(`axis ${o.axisStyle}`).addClass(`axis-${this}`).addClass(o.clsAxis);
                if (this === "x") ax.addClass(o.clsAxisX);
                if (this === "y") ax.addClass(o.clsAxisY);
                if (this === "z") ax.addClass(o.clsAxisZ);
                ax.appendTo(element);
            });

            if (o.showAxis === false) {
                element.find(".axis").hide();
            }

            this._run();
        },

        _run: function () {
            const element = this.element;
            const o = this.options;
            let interval = 0;

            clearInterval(this.interval);
            element.find(".cube-cell").removeClass("light");

            element.find(".cube-cell").removeClass("light");

            this._start();

            interval = Metro.utils.isObject(this.rules) ? Metro.utils.objectLength(this.rules) : 0;

            this.interval = setInterval(() => {
                this._start();
            }, interval * o.flashInterval);
        },

        _createCssForCellSize: function () {
            const element = this.element;
            const o = this.options;
            const side = element.find(".right-side");

            const width = Number.parseInt(Metro.utils.getStyleOne(side, "width"));
            const gap = Number.parseInt(Metro.utils.getStyleOne(side, "gap"));
            const cells = +o.cells;

            const cell_size = Math.floor((width - (cells - 1) * gap - gap * 2) / cells);
            element.cssVar("cube-size", `${cell_size}px`);
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.click, ".cube-cell", function () {
                if (o.cellClick === true) {
                    $(this).toggleClass("light");
                }
            });
        },

        _start: function () {
            const element = this.element;

            element.find(".cube-cell").removeClass("light");

            this.running = true;

            $.each(this.rules, (index, rule) => {
                this._execRule(index, rule);
            });
        },

        _stop: function () {
            this.running = false;
            clearInterval(this.interval);
            $.each(this.intervals, function () {
                clearInterval(this);
            });
        },

        _tick: function (index, speed) {
            const o = this.options;
            const _speed = speed || o.flashInterval * index;

            const interval = setTimeout(() => {
                Metro.utils.exec(o.onTick, [index]);
                this._fireEvent("tick", {
                    index: index,
                });

                clearInterval(interval);
                Metro.utils.arrayDelete(this.intervals, interval);
            }, _speed);
            this.intervals.push(interval);
        },

        _toggle: function (cell, func, time, speed) {
            const _speed = speed || this.options.flashInterval * time;
            const interval = setTimeout(() => {
                cell[func === "on" ? "addClass" : "removeClass"]("light");
                clearInterval(interval);
                Metro.utils.arrayDelete(this.intervals, interval);
            }, _speed);
            this.intervals.push(interval);
        },

        start: function () {
            this._start();
        },

        stop: function () {
            this._stop();
        },

        toRule: function (index, speed) {
            const element = this.element;
            const o = this.options;
            const rules = this.rules;

            if (rules === null || rules === undefined || rules[index] === undefined) {
                return;
            }
            clearInterval(this.ruleInterval);
            this.ruleInterval = false;
            this.stop();
            element.find(".cube-cell").removeClass("light");
            for (let i = 0; i <= index; i++) {
                this._execRule(i, rules[i], speed);
            }
            if (Metro.utils.isInt(o.autoRestart) && o.autoRestart > 0) {
                this.ruleInterval = setTimeout(() => {
                    this._run();
                }, o.autoRestart);
            }
        },

        _execRule: function (index, rule, speed) {
            const that = this;
            const element = this.element;
            const sides = ["left", "right", "top"];

            this._tick(index, speed);

            $.each(sides, function () {
                const side_class = `.${this}-side`;
                const cells_on = rule.on?.[this] ? rule.on[this] : false;
                const cells_off = rule.off?.[this] ? rule.off[this] : false;

                if (cells_on !== false)
                    $.each(cells_on, function () {
                        const cell = element.find(`${side_class} .cell-id-${this}`);

                        that._toggle(cell, "on", index, speed);
                    });

                if (cells_off !== false)
                    $.each(cells_off, function () {
                        const cell = element.find(`${side_class} .cell-id-${this}`);

                        that._toggle(cell, "off", index, speed);
                    });
            });
        },

        rule: function (r) {
            if (r === undefined) {
                return this.rules;
            }

            if (this._parseRules(r) !== true) {
                return;
            }
            this.options.rules = r;
            this.stop();
            this.element.find(".cube-cell").removeClass("light");
            this._run();
        },

        axis: function (show) {
            const func = show ? "show" : "hide";
            this.element.find(".axis")[func]();
        },

        changeRules: function () {
            const element = this.element;
            const o = this.options;
            const rules = element.attr("data-rules");
            if (this._parseRules(rules) !== true) {
                return;
            }
            this.stop();
            element.find(".cube-cell").removeClass("light");
            o.rules = rules;
            this._run();
        },

        changeAxisVisibility: function () {
            const element = this.element;
            const visibility = JSON.parse(element.attr("data-show-axis")) === true;
            const func = visibility ? "show" : "hide";
            element.find(".axis")[func]();
        },

        changeAxisStyle: function () {
            const element = this.element;
            const style = element.attr("data-axis-style");

            element.find(".axis").removeClass("arrow line no-style").addClass(style);
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "data-rules":
                    this.changeRules();
                    break;
                case "data-show-axis":
                    this.changeAxisVisibility();
                    break;
                case "data-axis-style":
                    this.changeAxisStyle();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;

            clearInterval(this.interval);
            this.interval = null;

            element.off(Metro.events.click, ".cube-cell");

            return element;
        },
    });
})(Metro, Dom);
