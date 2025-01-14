/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var SorterDefaultConfig = {
        sorterDeferred: 0,
        thousandSeparator: ",",
        decimalSeparator: ",",
        sortTarget: null,
        sortSource: null,
        sortDir: "asc",
        sortStart: true,
        saveInitial: true,
        onSortStart: Metro.noop,
        onSortStop: Metro.noop,
        onSortItemSwitch: Metro.noop,
        onSorterCreate: Metro.noop
    };

    Metro.sorterSetup = function (options) {
        SorterDefaultConfig = $.extend({}, SorterDefaultConfig, options);
    };

    if (typeof globalThis["metroSorterSetup"] !== undefined) {
        Metro.sorterSetup(globalThis["metroSorterSetup"]);
    }

    Metro.Component('sorter', {
        init: function( options, elem ) {
            this._super(elem, options, SorterDefaultConfig, {
                initial: []
            });

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createStructure();

            this._fireEvent("sorter-create", {
                element: element
            });
        },

        _createStructure: function(){
            var element = this.element, o = this.options;

            if (o.sortTarget === null) {
                o.sortTarget = element.children()[0].tagName;
            }

            this.initial = element.find(o.sortTarget).get();

            if (o.sortStart === true) {
                this.sort(o.sortDir);
            }
        },

        _getItemContent: function(item){
            var o = this.options;
            var data, inset, i, format;

            if (Utils.isValue(o.sortSource)) {
                data = "";
                inset = item.getElementsByClassName(o.sortSource);

                if (inset.length > 0) for (i = 0; i < inset.length; i++) {
                    data += inset[i].textContent;
                }
                format = inset[0].dataset.format;
            } else {
                data = item.textContent;
                format = item.dataset.format;
            }

            data = (""+data).toLowerCase().replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();

            if (Utils.isValue(format)) {

                if (['number', 'int', 'float', 'money'].indexOf(format) !== -1 && (o.thousandSeparator !== "," || o.decimalSeparator !== "." )) {
                    data = Utils.parseNumber(data, o.thousandSeparator, o.decimalSeparator);
                }

                switch (format) {
                    case "date": data = Utils.isDate(data) ? new Date(data) : ""; break;
                    case "number": data = Number(data); break;
                    case "int": data = parseInt(data); break;
                    case "float": data = parseFloat(data); break;
                    case "money": data = Utils.parseMoney(data); break;
                    case "card": data = Utils.parseCard(data); break;
                    case "phone": data = Utils.parsePhone(data); break;
                }
            }

            return data;
        },

        sort: function(dir){
            var that = this, element = this.element, o = this.options;
            var items;
            var id = Utils.elementId("temp");
            var prev;

            if (dir !== undefined) {
                o.sortDir = dir;
            }

            items = element.find(o.sortTarget).get();

            if (items.length === 0) {
                return ;
            }

            prev = $("<div>").attr("id", id).insertBefore($(element.find(o.sortTarget)[0]));

            this._fireEvent("sort-start", {
                items: items
            });

            items.sort(function(a, b){
                var c1 = that._getItemContent(a);
                var c2 = that._getItemContent(b);
                var result = 0;

                if (c1 < c2 ) {
                    result = -1;
                }

                if (c1 > c2 ) {
                    result = 1;
                }

                if (result !== 0) {
                    that._fireEvent("sort-item-switch", {
                        a: a,
                        b: b,
                        result: result
                    });
                }

                return result;
            });

            if (o.sortDir === "desc") {
                items.reverse();
            }

            element.find(o.sortTarget).remove();

            $.each(items, function(){
                var $this = $(this);
                $this.insertAfter(prev);
                prev = $this;
            });

            $("#"+id).remove();

            this._fireEvent("sort-stop", {
                items: items
            });
        },

        reset: function(){
            var element = this.element, o = this.options;
            var items;
            var id = Utils.elementId('sorter');
            var prev;

            items = this.initial;

            if (items.length === 0) {
                return ;
            }

            prev = $("<div>").attr("id", id).insertBefore($(element.find(o.sortTarget)[0]));

            element.find(o.sortTarget).remove();

            $.each(items, function(){
                var $this = $(this);
                $this.insertAfter(prev);
                prev = $this;
            });

            $("#"+id).remove();
        },

        changeAttribute: function(attributeName){
            var that = this, element = this.element, o = this.options;

            var changeSortDir = function() {
                var dir = element.attr("data-sort-dir").trim();
                if (dir === "") return;
                o.sortDir = dir;
                that.sort();
            };

            var changeSortContent = function(){
                var content = element.attr("data-sort-content").trim();
                if (content === "") return ;
                o.sortContent = content;
                that.sort();
            };

            switch (attributeName) {
                case "data-sort-dir": changeSortDir(); break;
                case "data-sort-content": changeSortContent(); break;
            }
        },

        destroy: function(){
            return this.element;
        }
    });

    Metro['sorter'] = {
        create: function(el, op){
            return Utils.$()(el).sorter(op);
        },

        isSorter: function(el){
            return Utils.isMetroObject(el, "sorter");
        },

        sort: function(el, dir){
            if (!this.isSorter(el)) {
                return false;
            }
            if (dir === undefined) {
                dir = "asc";
            }
            Metro.getPlugin(el, "sorter").sort(dir);
        },

        reset: function(el){
            if (!this.isSorter(el)) {
                return false;
            }
            Metro.getPlugin(el, "sorter").reset();
        }
    };
}(Metro, Dom));