/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var CubeDefaultConfig = {
        cubeDeferred: 0,
        rules: null,
        color: null,
        flashColor: null,
        flashInterval: 1000,
        numbers: false,
        offBefore: true,
        attenuation: .3,
        stopOnBlur: false,
        cells: 4,
        margin: 8,
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

        custom: Metro.noop,
        onTick: Metro.noop,
        onCubeCreate: Metro.noop
    };

    Metro.cubeSetup = function (options) {
        CubeDefaultConfig = $.extend({}, CubeDefaultConfig, options);
    };

    if (typeof globalThis["metroCubeSetup"] !== undefined) {
        Metro.cubeSetup(globalThis["metroCubeSetup"]);
    }

    Metro.cubeDefaultRules = [
        {
            on: {'top': [16],      'left': [4],         'right': [1]},
            off: {'top': [13, 4],   'left': [1, 16],     'right': [13, 4]}
        },
        {
            on: {'top': [12, 15],  'left': [3, 8],      'right': [2, 5]},
            off: {'top': [9, 6, 3], 'left': [5, 10, 15], 'right': [14, 11, 8]}
        },
        {
            on: {'top': [11],      'left': [7],         'right': [6]},
            off: {'top': [1, 2, 5], 'left': [9, 13, 14], 'right': [15, 12, 16]}
        },
        {
            on: {'top': [8, 14],   'left': [2, 12],     'right': [9, 3]},
            off: {'top': [16],      'left': [4],         'right': [1]}
        },
        {
            on: {'top': [10, 7],   'left': [6, 11],     'right': [10, 7]},
            off: {'top': [12, 15],  'left': [3, 8],      'right': [2, 5]}
        },
        {
            on: {'top': [13, 4],   'left': [1, 16],     'right': [13, 4]},
            off: {'top': [11],      'left': [7],         'right': [6]}
        },
        {
            on: {'top': [9, 6, 3], 'left': [5, 10, 15], 'right': [14, 11, 8]},
            off: {'top': [8, 14],   'left': [2, 12],     'right': [9, 3]}
        },
        {
            on: {'top': [1, 2, 5], 'left': [9, 13, 14], 'right': [15, 12, 16]},
            off: {'top': [10, 7],   'left': [6, 11],     'right': [10, 7]}
        }
    ];

    Metro.Component('cube', {
        init: function( options, elem ) {
            this._super(elem, options, CubeDefaultConfig, {
                id: Utils.elementId("cube"),
                rules: null,
                interval: false,
                ruleInterval: false,
                running: false,
                intervals: []
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            if (o.rules === null) {
                this.rules = Metro.cubeDefaultRules;
            } else {
                this._parseRules(o.rules);
            }

            this._createCube();
            this._createEvents();

            this._fireEvent("cube-create", {
                element: element
            });
        },

        _parseRules: function(rules){

            if (rules === undefined || rules === null) {
                return false;
            }

            if (Utils.isObject(rules)) {
                this.rules = Utils.isObject(rules);
                return true;
            } else {
                try {
                    this.rules = JSON.parse(rules);
                    return true;
                } catch (err) {
                    console.warn("Unknown or empty rules for cell flashing!");
                    return false;
                }
            }
        },

        _createCube: function(){
            var element = this.element, o = this.options;
            var sides = ['left', 'right', 'top'];
            var id = Utils.elementId("cube");
            var cells_count = Math.pow(o.cells, 2);

            element.addClass("cube").addClass(o.clsCube);

            if (!element.attr('id')) {
                element.attr('id', id);
            }

            this.id = element.attr('id');

            this._createCssForFlashColor();
            this._createCssForCellSize();

            $.each(sides, function(){
                var side, cell, i;

                side = $("<div>").addClass("side " + this+"-side").addClass(o.clsSide).appendTo(element);

                if (this === 'left') {side.addClass(o.clsSideLeft);}
                if (this === 'right') {side.addClass(o.clsSideRight);}
                if (this === 'top') {side.addClass(o.clsSideTop);}

                for(i = 0; i < cells_count; i++) {
                    cell = $("<div>").addClass("cube-cell").addClass("cell-id-"+(i+1)).addClass(o.clsCell);
                    cell.data("id", i + 1).data("side", this);
                    cell.appendTo(side);
                    if (o.numbers === true) {
                        cell.html(i + 1);
                    }
                }
            });

            var cells  = element.find(".cube-cell");
            if (o.color !== null) {
                if (Farbe.Routines.isColor(o.color)) {
                    cells.css({
                        backgroundColor: o.color,
                        borderColor: o.color
                    })
                } else {
                    cells.addClass(o.color);
                }
            }

            var axis = ['x', 'y', 'z'];
            $.each(axis, function(){
                var axis_name = this;
                var ax = $("<div>").addClass("axis " + o.axisStyle).addClass("axis-"+axis_name).addClass(o.clsAxis);
                if (axis_name === "x") ax.addClass(o.clsAxisX);
                if (axis_name === "y") ax.addClass(o.clsAxisY);
                if (axis_name === "z") ax.addClass(o.clsAxisZ);
                ax.appendTo(element);
            });

            if (o.showAxis === false) {
                element.find(".axis").hide();
            }

            this._run();
        },

        _run: function(){
            var that = this, element = this.element, o = this.options;
            var interval = 0;

            clearInterval(this.interval);
            element.find(".cube-cell").removeClass("light");

            if (o.custom !== Metro.noop) {
                Utils.exec(o.custom, [element]);
            } else {

                element.find(".cube-cell").removeClass("light");

                that._start();

                interval = Utils.isObject(this.rules) ? Utils.objectLength(this.rules) : 0;

                this.interval = setInterval(function(){
                    that._start();
                }, interval * o.flashInterval);
            }
        },

        _createCssForCellSize: function(){
            var element = this.element, o = this.options;
            var sheet = Metro.sheet;
            var width;
            var cell_size;

            if (o.margin === 8 && o.cells === 4) {
                return ;
            }

            width = parseInt(Utils.getStyleOne(element, 'width'));
            cell_size = Math.ceil((width / 2 - o.margin * o.cells * 2) / o.cells);
            Utils.addCssRule(sheet, "#"+element.attr('id')+" .side .cube-cell", "width: "+cell_size+"px!important; height: "+cell_size+"px!important; margin: " + o.margin + "px!important;");
        },

        _createCssForFlashColor: function(){
            var element = this.element, o = this.options;
            var sheet = Metro.sheet;
            var rule1;
            var rule2;
            var rules1 = [];
            var rules2 = [];
            var i;

            if (o.flashColor === null) {
                return ;
            }

            rule1 = "0 0 10px " + Farbe.Routines.toRGBA(Farbe.Routines.parse(o.flashColor), 1);
            rule2 = "0 0 10px " + Farbe.Routines.toRGBA(Farbe.Routines.parse(o.flashColor), o.attenuation);

            for(i = 0; i < 3; i++) {
                rules1.push(rule1);
                rules2.push(rule2);
            }

            Utils.addCssRule(sheet, "@keyframes pulsar-cell-"+element.attr('id'), "0%, 100% { " + "box-shadow: " + rules1.join(",") + "} 50% { " + "box-shadow: " + rules2.join(",") + " }");
            Utils.addCssRule(sheet, "#"+element.attr('id')+" .side .cube-cell.light", "animation: pulsar-cell-" + element.attr('id') + " 2.5s 0s ease-out infinite; " + "background-color: " + o.flashColor + "!important; border-color: " + o.flashColor+"!important;");
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            $(globalThis).on(Metro.events.blur, function(){
                if (o.stopOnBlur === true && that.running === true) {
                    that._stop();
                }
            }, {ns: element.attr("id")});

            $(globalThis).on(Metro.events.focus, function(){
                if (o.stopOnBlur === true && that.running === false) {
                    that._start();
                }
            }, {ns: element.attr("id")});

            element.on(Metro.events.click, ".cube-cell", function(){
                if (o.cellClick === true) {
                    var cell = $(this);
                    cell.toggleClass("light");
                }
            });
        },

        _start: function(){
            var that = this, element = this.element;

            element.find(".cube-cell").removeClass("light");

            this.running = true;

            $.each(this.rules, function(index, rule){
                that._execRule(index, rule);
            });
        },

        _stop: function(){
            this.running = false;
            clearInterval(this.interval);
            $.each(this.intervals, function(){
                clearInterval(this);
            })
        },

        _tick: function(index, speed){
            var that = this, o = this.options;
            if (speed === undefined) {
                speed = o.flashInterval * index;
            }

            var interval = setTimeout(function(){

                that._fireEvent("tick", {
                    index: index
                });

                clearInterval(interval);
                Utils.arrayDelete(that.intervals, interval);
            }, speed);
            this.intervals.push(interval);
        },

        _toggle: function(cell, func, time, speed){
            var that = this;
            if (speed === undefined) {
                speed = this.options.flashInterval * time;
            }
            var interval = setTimeout(function(){
                cell[func === 'on' ? 'addClass' : 'removeClass']("light");
                clearInterval(interval);
                Utils.arrayDelete(that.intervals, interval);
            }, speed);
            this.intervals.push(interval);
        },

        start: function(){
            this._start();
        },

        stop: function(){
            this._stop();
        },

        toRule: function(index, speed){
            var that = this, element = this.element, o = this.options;
            var rules = this.rules;

            if (rules === null || rules === undefined || rules[index] === undefined) {
                return ;
            }
            clearInterval(this.ruleInterval);
            this.ruleInterval = false;
            this.stop();
            element.find(".cube-cell").removeClass("light");
            for (var i = 0; i <= index; i++) {
                this._execRule(i, rules[i], speed);
            }
            if (Utils.isInt(o.autoRestart) && o.autoRestart > 0) {
                this.ruleInterval = setTimeout(function(){
                    that._run();
                }, o.autoRestart);
            }
        },

        _execRule: function(index, rule, speed){
            var that = this, element = this.element;
            var sides = ['left', 'right', 'top'];

            this._tick(index, speed);

            $.each(sides, function(){
                var side_class = "."+this+"-side";
                var side_name = this;
                var cells_on = rule["on"] !== undefined && rule["on"][side_name] !== undefined ? rule["on"][side_name] : false;
                var cells_off = rule["off"] !== undefined && rule["off"][side_name] !== undefined ? rule["off"][side_name] : false;

                if (cells_on !== false) $.each(cells_on, function(){
                    var cell_index = this;
                    var cell = element.find(side_class + " .cell-id-"+cell_index);

                    that._toggle(cell, 'on', index, speed);
                });

                if (cells_off !== false) $.each(cells_off, function(){
                    var cell_index = this;
                    var cell = element.find(side_class + " .cell-id-"+cell_index);

                    that._toggle(cell, 'off', index, speed);
                });
            });
        },

        rule: function(r){
            if (r === undefined) {
                return this.rules;
            }

            if (this._parseRules(r) !== true) {
                return ;
            }
            this.options.rules = r;
            this.stop();
            this.element.find(".cube-cell").removeClass("light");
            this._run();
        },

        axis: function(show){
            var func = show === true ? "show" : "hide";
            this.element.find(".axis")[func]();
        },

        changeRules: function(){
            var element = this.element, o = this.options;
            var rules = element.attr("data-rules");
            if (this._parseRules(rules) !== true) {
                return ;
            }
            this.stop();
            element.find(".cube-cell").removeClass("light");
            o.rules = rules;
            this._run();
        },

        changeAxisVisibility: function(){
            var element = this.element;
            var visibility = JSON.parse(element.attr("data-show-axis")) === true;
            var func = visibility ? "show" : "hide";
            element.find(".axis")[func]();
        },

        changeAxisStyle: function(){
            var element = this.element;
            var style = element.attr("data-axis-style");

            element.find(".axis").removeClass("arrow line no-style").addClass(style);
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case "data-rules": this.changeRules(); break;
                case "data-show-axis": this.changeAxisVisibility(); break;
                case "data-axis-style": this.changeAxisStyle(); break;
            }
        },

        destroy: function(){
            var element = this.element;

            clearInterval(this.interval);
            this.interval = null;

            $(globalThis).off(Metro.events.blur, {ns: element.attr("id")});
            $(globalThis).off(Metro.events.focus,{ns: element.attr("id")});

            element.off(Metro.events.click, ".cube-cell");

            return element;
        }
    });
}(Metro, Dom));