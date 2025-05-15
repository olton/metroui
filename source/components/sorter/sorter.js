((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let SorterDefaultConfig = {
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
        onSorterCreate: Metro.noop,
    };

    Metro.sorterSetup = (options) => {
        SorterDefaultConfig = $.extend({}, SorterDefaultConfig, options);
    };

    if (typeof globalThis.metroSorterSetup !== "undefined") {
        Metro.sorterSetup(globalThis.metroSorterSetup);
    }

    Metro.Component("sorter", {
        init: function (options, elem) {
            this._super(elem, options, SorterDefaultConfig, {
                initial: [],
            });

            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();

            this._fireEvent("sorter-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            if (o.sortTarget === null) {
                o.sortTarget = element.children()[0].tagName;
            }

            this.initial = element.find(o.sortTarget).get();

            if (o.sortStart === true) {
                this.sort(o.sortDir);
            }
        },

        _getItemContent: function (item) {
            const o = this.options;
            let data;
            let inset;
            let i;
            let format;

            if (Metro.utils.isValue(o.sortSource)) {
                data = "";
                inset = item.getElementsByClassName(o.sortSource);

                if (inset.length > 0)
                    for (i = 0; i < inset.length; i++) {
                        data += inset[i].textContent;
                    }
                format = inset[0].dataset.format;
            } else {
                data = item.textContent;
                format = item.dataset.format;
            }

            data = `${data}`
                .toLowerCase()
                .replace(/[\n\r]+|[\s]{2,}/g, " ")
                .trim();

            if (Metro.utils.isValue(format)) {
                if (
                    ["number", "int", "float", "money"].indexOf(format) !== -1 &&
                    (o.thousandSeparator !== "," || o.decimalSeparator !== ".")
                ) {
                    data = Metro.utils.parseNumber(data, o.thousandSeparator, o.decimalSeparator);
                }

                switch (format) {
                    case "date":
                        data = Metro.utils.isDate(data) ? new Date(data) : "";
                        break;
                    case "number":
                        data = Number(data);
                        break;
                    case "int":
                        data = Number.parseInt(data);
                        break;
                    case "float":
                        data = Number.parseFloat(data);
                        break;
                    case "money":
                        data = Metro.utils.parseMoney(data);
                        break;
                    case "card":
                        data = Metro.utils.parseCard(data);
                        break;
                    case "phone":
                        data = Metro.utils.parsePhone(data);
                        break;
                }
            }

            return data;
        },

        sort: function (dir) {
            const element = this.element;
            const o = this.options;
            let items;
            const id = Metro.utils.elementId("temp");
            let prev;

            if (dir) {
                o.sortDir = dir;
            }

            items = element.find(o.sortTarget).get();

            if (items.length === 0) {
                return;
            }

            prev = $("<div>")
                .attr("id", id)
                .insertBefore($(element.find(o.sortTarget)[0]));

            this._fireEvent("sort-start", {
                items: items,
            });

            items.sort((a, b) => {
                const c1 = this._getItemContent(a);
                const c2 = this._getItemContent(b);
                let result = 0;

                if (c1 < c2) {
                    result = -1;
                }

                if (c1 > c2) {
                    result = 1;
                }

                if (result !== 0) {
                    this._fireEvent("sort-item-switch", {
                        a: a,
                        b: b,
                        result: result,
                    });
                }

                return result;
            });

            if (o.sortDir === "desc") {
                items.reverse();
            }

            element.find(o.sortTarget).remove();

            $.each(items, function () {
                const $this = $(this);
                $this.insertAfter(prev);
                prev = $this;
            });

            $(`#${id}`).remove();

            this._fireEvent("sort-stop", {
                items: items,
            });
        },

        reset: function () {
            const element = this.element;
            const o = this.options;
            const id = Metro.utils.elementId("sorter");
            let prev;

            const items = this.initial;
            if (items.length === 0) {
                return;
            }

            prev = $("<div>")
                .attr("id", id)
                .insertBefore($(element.find(o.sortTarget)[0]));

            element.find(o.sortTarget).remove();

            $.each(items, function () {
                const $this = $(this);
                $this.insertAfter(prev);
                prev = $this;
            });

            $(`#${id}`).remove();
        },

        changeAttribute: function (attributeName) {
            const element = this.element;
            const o = this.options;

            const changeSortDir = () => {
                const dir = element.attr("data-sort-dir").trim();
                if (dir === "") return;
                o.sortDir = dir;
                this.sort();
            };

            const changeSortContent = () => {
                const content = element.attr("data-sort-content").trim();
                if (content === "") return;
                o.sortContent = content;
                this.sort();
            };

            switch (attributeName) {
                case "data-sort-dir":
                    changeSortDir();
                    break;
                case "data-sort-content":
                    changeSortContent();
                    break;
            }
        },

        destroy: function () {
            return this.element;
        },
    });

    Metro.sorter = {
        create: (el, op) => Metro.utils.$()(el).sorter(op),
        isSorter: (el) => Metro.utils.isMetroObject(el, "sorter"),
        sort: function (el, dir = "asc") {
            if (!this.isSorter(el)) {
                return false;
            }
            Metro.getPlugin(el, "sorter").sort(dir);
        },

        reset: function (el) {
            if (!this.isSorter(el)) {
                return false;
            }
            Metro.getPlugin(el, "sorter").reset();
        },
    };
})(Metro, Dom);
