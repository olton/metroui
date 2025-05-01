((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let ListDefaultConfig = {
        listDeferred: 0,
        templateBeginToken: "<%",
        templateEndToken: "%>",
        paginationDistance: 5,
        paginationShortMode: true,
        thousandSeparator: ",",
        decimalSeparator: ",",
        itemTag: "li",
        defaultTemplateTag: "div",
        sortClass: null,
        sortDir: "asc",
        sortInitial: true,
        filterClass: null,
        filter: null,
        filterString: "",
        filters: null,
        source: null,
        showItemsSteps: false,
        showSearch: false,
        showListInfo: false,
        showPagination: false,
        showActivity: true,
        muteList: true,
        items: -1,
        itemsSteps: "all, 10,25,50,100",
        itemsAllTitle: "Show all",
        listItemsCountTitle: "Show entries:",
        listSearchTitle: "Search:",
        listInfoTitle: "Showing $1 to $2 of $3 entries",
        paginationPrevTitle: "Prev",
        paginationNextTitle: "Next",
        activityType: "cycle",
        activityStyle: "color",
        activityTimeout: 100,
        searchWrapper: null,
        rowsWrapper: null,
        infoWrapper: null,
        paginationWrapper: null,
        searchThreshold: 500,
        clsComponent: "",
        clsList: "",
        clsListItem: "",
        clsListTop: "",
        clsItemsCount: "",
        clsSearch: "",
        clsListBottom: "",
        clsListInfo: "",
        clsListPagination: "",
        clsPagination: "",
        clsTemplateTag: "",
        onDraw: Metro.noop,
        onDrawItem: Metro.noop,
        onSortStart: Metro.noop,
        onSortStop: Metro.noop,
        onSortItemSwitch: Metro.noop,
        onSearch: Metro.noop,
        onRowsCountChange: Metro.noop,
        onDataLoad: Metro.noop,
        onDataLoaded: Metro.noop,
        onDataLoadError: Metro.noop,
        onFilterItemAccepted: Metro.noop,
        onFilterItemDeclined: Metro.noop,
        onListCreate: Metro.noop,
    };

    Metro.listSetup = (options) => {
        ListDefaultConfig = $.extend({}, ListDefaultConfig, options);
    };

    if (typeof globalThis.metroListSetup !== "undefined") {
        Metro.listSetup(globalThis.metroListSetup);
    }

    Metro.Component("list", {
        init: function (options, elem) {
            this._super(elem, options, ListDefaultConfig, {
                currentPage: 1,
                pagesCount: 1,
                filterString: "",
                data: null,
                activity: null,
                busy: false,
                filters: [],
                wrapperInfo: null,
                wrapperSearch: null,
                wrapperRows: null,
                wrapperPagination: null,
                filterIndex: null,
                filtersIndexes: [],
                itemTemplate: null,

                sort: {
                    dir: "asc",
                    colIndex: 0,
                },

                header: null,
                items: [],
            });

            return this;
        },

        _create: function () {
            const o = this.options;

            if (o.source) {
                this._fireEvent("data-load", {
                    source: o.source,
                });

                fetch(o.source)
                    .then(Metro.fetch.status)
                    .then(Metro.fetch.json)
                    .then((data) => {
                        this._fireEvent("data-loaded", {
                            source: o.source,
                            data: data,
                        });
                        this._build(data);
                    })
                    .catch((error) => {
                        this._fireEvent("data-load-error", {
                            source: o.source,
                            error: error,
                        });
                    });
            } else {
                this._build();
            }
        },

        _build: function (data) {
            if (Metro.utils.isValue(data)) {
                this._createItemsFromJSON(data);
            } else {
                this._createItemsFromHTML();
            }

            this._createStructure();
            this._createEvents();

            this._fireEvent("list-create");
        },

        _createItemsFromHTML: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const clsTemplateTag = (`${o.clsTemplateTag}`).toArray(",");

            this.items = [];

            $.each(element.children(o.itemTag), function () {
                const tagChildren = $(this).children("*");

                if (clsTemplateTag.length) {
                    if (clsTemplateTag.length === 1) {
                        tagChildren.addClass(clsTemplateTag[0]);
                    } else {
                        tagChildren.each((i, child) => {
                            $(child).addClass(clsTemplateTag[i] ? clsTemplateTag[i] : clsTemplateTag[clsTemplateTag.length - 1]);
                        });
                    }
                }
                that.items.push(this);
            });
        },

        _createItemsFromJSON: function (source) {
            const that = this;
            const o = this.options;
            const clsTemplateTag = (`${o.clsTemplateTag}`).toArray(",");

            this.items = [];

            if (Metro.utils.isValue(source.template)) {
                this.itemTemplate = source.template;
            }

            if (Metro.utils.isValue(source.header)) {
                this.header = source.header;
            }

            if (Metro.utils.isValue(source.data)) {
                $.each(source.data, function () {
                    let item = "";
                    const li = document.createElement(o.itemTag);
                    const tpl = that.itemTemplate;
                    let tagChildren;

                    if (!Metro.utils.isValue(tpl)) {
                        for (const i in this) {
                            item += `<${o.defaultTemplateTag}>${this[i]}</${o.defaultTemplateTag}>`;
                        }
                    } else {
                        item = Metro.template(tpl, this, {
                            beginToken: o.templateBeginToken,
                            endToken: o.templateEndToken,
                        });
                    }

                    li.innerHTML = item;
                    tagChildren = $(li).children("*");

                    if (clsTemplateTag.length) {
                        if (clsTemplateTag.length === 1) {
                            tagChildren.addClass(clsTemplateTag[0]);
                        } else {
                            tagChildren.each((i, child) => {
                                $(child).addClass(clsTemplateTag[i] ? clsTemplateTag[i] : clsTemplateTag[clsTemplateTag.length - 1]);
                            });
                        }
                    }

                    that.items.push(li);
                });
            }
        },

        _createTopBlock: function () {
            const element = this.element;
            const o = this.options;
            const top_block = $("<div>").addClass("list-top").addClass(o.clsListTop).insertBefore(element);
            let search_block;
            let rows_block;

            search_block = Metro.utils.isValue(this.wrapperSearch)
                ? this.wrapperSearch
                : $("<div>").addClass("list-search-block").addClass(o.clsSearch).appendTo(top_block);

            const search_input = $("<input>").attr("type", "text").appendTo(search_block)
            Metro.makePlugin(search_input, "input", {
                prepend: o.listSearchTitle,
            });

            if (o.showSearch !== true) {
                search_block.hide();
            }

            rows_block = Metro.utils.isValue(this.wrapperRows)
                ? this.wrapperRows
                : $("<div>").addClass("list-rows-block").addClass(o.clsItemsCount).appendTo(top_block);

            const rows_select = $("<select>").appendTo(rows_block)
            $.each(o.itemsSteps.toArray(), function () {
                const option = $("<option>")
                    .attr("value", this === "all" ? -1 : this)
                    .text(this === "all" ? o.itemsAllTitle : this)
                    .appendTo(rows_select);
                if (+this === +o.items) option.attr("selected", "selected");
            });
            rows_select.select({
                filter: false,
                prepend: o.listItemsCountTitle,
                onChange: (val) => {
                    if (+val === +o.items) return;
                    o.items = Number.parseInt(val);
                    this.currentPage = 1;
                    this._draw();

                    this._fireEvent("rows-count-change", {
                        val: val,
                    });
                },
            });

            if (o.showItemsSteps !== true) {
                rows_block.hide();
            }

            return top_block;
        },

        _createBottomBlock: function () {
            const element = this.element;
            const o = this.options;
            const bottom_block = $("<div>").addClass("list-bottom").addClass(o.clsListBottom).insertAfter(element);
            let info;
            let pagination;

            info = $("<div>").addClass("list-info").addClass(o.clsListInfo).appendTo(bottom_block);
            if (o.showListInfo !== true) {
                info.hide();
            }

            pagination = $("<div>").addClass("list-pagination").addClass(o.clsListPagination).appendTo(bottom_block);
            if (o.showPagination !== true) {
                pagination.hide();
            }

            return bottom_block;
        },

        _createStructure: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            let list_component;
            const w_search = $(o.searchWrapper);
            const w_info = $(o.infoWrapper);
            const w_rows = $(o.rowsWrapper);
            const w_paging = $(o.paginationWrapper);

            if (w_search.length > 0) {
                this.wrapperSearch = w_search;
            }
            if (w_info.length > 0) {
                this.wrapperInfo = w_info;
            }
            if (w_rows.length > 0) {
                this.wrapperRows = w_rows;
            }
            if (w_paging.length > 0) {
                this.wrapperPagination = w_paging;
            }

            if (!element.parent().hasClass("list-component")) {
                list_component = $("<div>").addClass("list-component").insertBefore(element);
                element.appendTo(list_component);
            } else {
                list_component = element.parent();
            }

            list_component.addClass(o.clsComponent);

            this.activity = $("<div>").addClass("list-progress").appendTo(list_component);
            $("<div>")
                .activity({
                    type: o.activityType,
                    style: o.activityStyle,
                })
                .appendTo(this.activity);

            if (o.showActivity !== true) {
                this.activity.css({
                    visibility: "hidden",
                });
            }

            // element.html("").addClass(o.clsList);
            element.addClass(o.clsList);

            this._createTopBlock();
            this._createBottomBlock();

            if (Metro.utils.isValue(o.filterString)) {
                this.filterString = o.filterString;
            }

            let filter_func;

            if (Metro.utils.isValue(o.filter)) {
                filter_func = Metro.utils.isFunc(o.filter);
                if (filter_func === false) {
                    filter_func = Metro.utils.func(o.filter);
                }
                that.filterIndex = that.addFilter(filter_func);
            }

            if (Metro.utils.isValue(o.filters) && typeof o.filters === "string") {
                $.each(o.filters.toArray(), function () {
                    filter_func = Metro.utils.isFunc(this);
                    if (filter_func !== false) {
                        that.filtersIndexes.push(that.addFilter(filter_func));
                    }
                });
            }

            this.currentPage = 1;

            if (o.sortInitial !== false) this.sorting(o.sortClass, o.sortDir, true);
            else this.draw();
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const component = element.parent();
            const search = component.find(".list-search-block input");
            let customSearch;

            let searchItem = function () {
                that.filterString = this.value.trim().toLowerCase();
                if (that.filterString[that.filterString.length - 1] === ":") {
                    return;
                }
                that.currentPage = 1;
                that._draw();
            }

            searchItem = Hooks.useDebounce(searchItem, o.searchThreshold);

            search.on(Metro.events.inputchange, searchItem);

            if (Metro.utils.isValue(this.wrapperSearch)) {
                customSearch = this.wrapperSearch.find("input");
                if (customSearch.length > 0) {
                    customSearch.on(Metro.events.inputchange, searchItem);
                }
            }

            function pageLinkClick(l) {
                const link = $(l);
                const item = link.parent();

                if (item.hasClass("active")) {
                    return;
                }

                if (item.hasClass("service")) {
                    if (link.data("page") === "prev") {
                        that.currentPage--;
                        if (that.currentPage === 0) {
                            that.currentPage = 1;
                        }
                    } else {
                        that.currentPage++;
                        if (that.currentPage > that.pagesCount) {
                            that.currentPage = that.pagesCount;
                        }
                    }
                } else {
                    that.currentPage = link.data("page");
                }

                that._draw();
            }

            component.on(Metro.events.click, ".pagination .page-link", function () {
                pageLinkClick(this);
            });

            if (Metro.utils.isValue(this.wrapperPagination)) {
                this.wrapperPagination.on(Metro.events.click, ".pagination .page-link", function () {
                    pageLinkClick(this);
                });
            }
        },

        _info: function (start, stop, length) {
            const element = this.element;
            const o = this.options;
            const component = element.parent();
            const info = Metro.utils.isValue(this.wrapperInfo) ? this.wrapperInfo : component.find(".list-info");
            let text;
            let _stop = stop;
            let _start = start;
            let _length = length;

            if (info.length === 0) {
                return;
            }

            if (_stop > length) {
                _stop = length;
            }

            if (this.items.length === 0) {
                _start = _stop = _length = 0;
            }

            text = o.listInfoTitle;
            text = text.replace("$1", _start);
            text = text.replace("$2", _stop);
            text = text.replace("$3", _length);
            info.html(text);
        },

        _paging: function (length) {
            const element = this.element;
            const o = this.options;
            const component = element.parent();
            this.pagesCount = Math.ceil(length / o.items); // Костыль
            Metro.pagination({
                length: length,
                rows: o.items,
                current: this.currentPage,
                target: Metro.utils.isValue(this.wrapperPagination) ? this.wrapperPagination : component.find(".list-pagination"),
                claPagination: o.clsPagination,
                prevTitle: o.paginationPrevTitle,
                nextTitle: o.paginationNextTitle,
                distance: o.paginationShortMode === true ? o.paginationDistance : 0,
            });
        },

        _filter: function () {
            const o = this.options;
            let items;
            let i;
            let data;
            let inset;
            let c1;
            let result;

            if (Metro.utils.isValue(this.filterString) || this.filters.length > 0) {
                items = this.items.filter((item) => {
                    data = "";

                    if (Metro.utils.isValue(o.filterClass)) {
                        inset = item.getElementsByClassName(o.filterClass);

                        if (inset.length > 0)
                            for (i = 0; i < inset.length; i++) {
                                data += inset[i].textContent;
                            }
                    } else {
                        data = item.textContent;
                    }

                    c1 = data
                        .replace(/[\n\r]+|[\s]{2,}/g, " ")
                        .trim()
                        .toLowerCase();
                    result = Metro.utils.isValue(this.filterString) ? c1.indexOf(this.filterString) > -1 : true;

                    if (result === true && this.filters.length > 0) {
                        for (i = 0; i < this.filters.length; i++) {
                            if (Metro.utils.exec(this.filters[i], [item]) !== true) {
                                result = false;
                                break;
                            }
                        }
                    }

                    if (result) {
                        this._fireEvent("filter-item-accepted", {
                            item: item,
                        });
                    } else {
                        this._fireEvent("filter-item-declined", {
                            item: item,
                        });
                    }

                    return result;
                });

                this._fireEvent("search", {
                    search: this.filterString,
                    items: items,
                });
            } else {
                items = this.items;
            }

            return items;
        },

        _draw: function (cb) {
            const element = this.element;
            const o = this.options;
            let i;
            const start = o.items === -1 ? 0 : o.items * (this.currentPage - 1);
            const stop = o.items === -1 ? this.items.length - 1 : start + o.items - 1;
            let items;

            items = this._filter();

            element.children(o.itemTag).remove();

            for (i = start; i <= stop; i++) {
                if (Metro.utils.isValue(items[i])) {
                    $(items[i]).addClass(o.clsListItem).appendTo(element);
                }

                this._fireEvent("draw-item", {
                    item: items[i],
                });
            }

            this._info(start + 1, stop + 1, items.length);
            this._paging(items.length);

            this.activity.hide();

            this._fireEvent("draw");

            if (cb) {
                Metro.utils.exec(cb, [element], element[0]);
            }
        },

        _getItemContent: function (item) {
            const locale = this.locale;
            const o = this.options;
            const $item = $(item);
            let i;
            let inset;
            let data;
            let format;
            const formatMask = Metro.utils.isValue($item.data("formatMask")) ? $item.data("formatMask") : null;

            if (Metro.utils.isValue(o.sortClass)) {
                data = "";
                inset = $(item).find(`.${o.sortClass}`);

                if (inset.length > 0)
                    for (i = 0; i < inset.length; i++) {
                        data += inset[i].textContent;
                    }
                format = inset.length > 0 ? inset[0].getAttribute("data-format") : "";
            } else {
                data = item.textContent;
                format = item.getAttribute("data-format");
            }

            data = (`${data}`)
                .toLowerCase()
                .replace(/[\n\r]+|[\s]{2,}/g, " ")
                .trim();

            if (Metro.utils.isValue(format)) {
                if (["number", "int", "integer", "float", "money"].indexOf(format) !== -1 && (o.thousandSeparator !== "," || o.decimalSeparator !== ".")) {
                    data = Metro.utils.parseNumber(data, o.thousandSeparator, o.decimalSeparator);
                }

                switch (format) {
                    case "date":
                        data = formatMask ? Datetime.from(data, formatMask, locale) : datetime(data);
                        break;
                    case "number":
                        data = Number(data);
                        break;
                    case "int":
                    case "integer":
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

        deleteItem: function (value) {
            let i;
            const deleteIndexes = [];
            let item;
            const is_func = Metro.utils.isFunc(value);

            for (i = 0; i < this.items.length; i++) {
                item = this.items[i];

                if (is_func) {
                    if (Metro.utils.exec(value, [item])) {
                        deleteIndexes.push(i);
                    }
                } else {
                    if (item.textContent.includes(value)) {
                        deleteIndexes.push(i);
                    }
                }
            }

            this.items = Metro.utils.arrayDeleteByMultipleKeys(this.items, deleteIndexes);

            return this;
        },

        draw: function () {
            return this._draw();
        },

        sorting: function (source, dir, redraw) {
            const o = this.options;

            if (Metro.utils.isValue(source)) {
                o.sortClass = source;
            }
            if (Metro.utils.isValue(dir) && ["asc", "desc"].indexOf(dir) > -1) {
                o.sortDir = dir;
            }

            this._fireEvent("sort-start", {
                items: this.items,
            });

            this.items.sort((a, b) => {
                const c1 = this._getItemContent(a);
                const c2 = this._getItemContent(b);
                let result = 0;

                if (c1 < c2) {
                    result = o.sortDir === "asc" ? -1 : 1;
                }
                if (c1 > c2) {
                    result = o.sortDir === "asc" ? 1 : -1;
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

            this._fireEvent("sort-stop", {
                items: this.items,
            });

            if (redraw === true) {
                this._draw();
            }

            return this;
        },

        filter: function (val) {
            this.filterString = val.trim().toLowerCase();
            this.currentPage = 1;
            this._draw();
        },

        setData: function (data) {
            const that = this;
            const element = this.element;
            const o = this.options;

            if (Metro.utils.isValue(data) !== true) {
                return;
            }

            that._createItemsFromJSON(data);

            element.html("");

            if (Metro.utils.isValue(o.filterString)) {
                that.filterString = o.filterString;
            }

            let filter_func;

            if (Metro.utils.isValue(o.filter)) {
                filter_func = Metro.utils.isFunc(o.filter);
                if (filter_func === false) {
                    filter_func = Metro.utils.func(o.filter);
                }
                that.filterIndex = that.addFilter(filter_func);
            }

            if (Metro.utils.isValue(o.filters) && typeof o.filters === "string") {
                $.each(o.filters.toArray(), function () {
                    filter_func = Metro.utils.isFunc(this);
                    if (filter_func !== false) {
                        that.filtersIndexes.push(that.addFilter(filter_func));
                    }
                });
            }

            that.currentPage = 1;

            that.sorting(o.sortClass, o.sortDir, true);
        },

        loadData: function (source) {
            const o = this.options;

            if (Metro.utils.isValue(source) !== true) {
                return;
            }

            o.source = source;

            this._fireEvent("data-load", {
                source: o.source,
            });

            fetch(o.source)
                .then(Metro.fetch.status)
                .then(Metro.fetch.json)
                .then((data) => {
                    this._fireEvent("data-loaded", {
                        source: o.source,
                        data: data,
                    });
                    this.setData(data);
                })
                .catch((error) => {
                    this._fireEvent("data-load-error", {
                        source: o.source,
                        error: error,
                    });
                });
        },

        next: function () {
            if (this.items.length === 0) return;
            this.currentPage++;
            if (this.currentPage > this.pagesCount) {
                this.currentPage = this.pagesCount;
                return;
            }
            this._draw();
        },

        prev: function () {
            if (this.items.length === 0) return;
            this.currentPage--;
            if (this.currentPage === 0) {
                this.currentPage = 1;
                return;
            }
            this._draw();
        },

        first: function () {
            if (this.items.length === 0) return;
            this.currentPage = 1;
            this._draw();
        },

        last: function () {
            if (this.items.length === 0) return;
            this.currentPage = this.pagesCount;
            this._draw();
        },

        page: function (num) {
            let _num = Number.parseInt(num);
            
            if (_num <= 0) {
                _num = 1;
            }

            if (_num > this.pagesCount) {
                _num = this.pagesCount;
            }

            this.currentPage = _num;
            this._draw();
        },

        addFilter: function (f, redraw) {
            const func = Metro.utils.isFunc(f);
            if (func === false) {
                return;
            }
            this.filters.push(func);

            if (redraw === true) {
                this.currentPage = 1;
                this.draw();
            }

            return this.filters.length - 1;
        },

        removeFilter: function (key, redraw) {
            Metro.utils.arrayDeleteByKey(this.filters, key);
            if (redraw === true) {
                this.currentPage = 1;
                this.draw();
            }
            return this;
        },

        removeFilters: function (redraw) {
            this.filters = [];
            if (redraw === true) {
                this.currentPage = 1;
                this.draw();
            }
        },

        getFilters: function () {
            return this.filters;
        },

        getFilterIndex: function () {
            return this.filterIndex;
        },

        getFiltersIndexes: function () {
            return this.filtersIndexes;
        },

        changeAttribute: function (attributeName) {
            const element = this.element;
            const o = this.options;

            const changeSortDir = () => {
                const dir = element.attr("data-sort-dir");
                if (!Metro.utils.isValue(dir)) {
                    return;
                }
                o.sortDir = dir;
                this.sorting(o.sortClass, o.sortDir, true);
            };

            const changeSortClass = () => {
                const target = element.attr("data-sort-source");
                if (!Metro.utils.isValue(target)) {
                    return;
                }
                o.sortClass = target;
                this.sorting(o.sortClass, o.sortDir, true);
            };

            const changeFilterString = () => {
                const filter = element.attr("data-filter-string");
                if (!Metro.utils.isValue(filter)) {
                    return;
                }
                o.filterString = filter;
                this.filter(o.filterString);
            };

            switch (attributeName) {
                case "data-sort-dir":
                    changeSortDir();
                    break;
                case "data-sort-source":
                    changeSortClass();
                    break;
                case "data-filter-string":
                    changeFilterString();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const component = element.parent();
            const search = component.find(".list-search-block input");
            let customSearch;

            search.off(Metro.events.inputchange);
            if (Metro.utils.isValue(this.wrapperSearch)) {
                customSearch = this.wrapperSearch.find("input");
                if (customSearch.length > 0) {
                    customSearch.off(Metro.events.inputchange);
                }
            }

            component.off(Metro.events.click, ".pagination .page-link");

            if (Metro.utils.isValue(this.wrapperPagination)) {
                this.wrapperPagination.off(Metro.events.click, ".pagination .page-link");
            }

            return element;
        },
    });
})(Metro, Dom);
