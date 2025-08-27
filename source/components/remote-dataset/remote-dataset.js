((Metro, $) => {
    "use strict";

    let RemoteDatasetDefaultConfig = {
        caption: "",
        url: "",
        urlSearch: "",
        method: "GET",
        limit: 10,
        offset: null,
        sort: "",

        keyLimit: "",
        keyOffset: "",
        keyTotal: "",
        keyData: "",
        keySort: "",
        keyOrder: "",
        keySearch: "q",

        shortPagination: false,
        rows: 10,
        rowsSteps: "10,25,50,100",
        sortRules: "",

        showServiceBlock: true,
        quickSearch: true,
        selectOrder: true,
        selectCount: true,
        showMore: true,
        showPagination: true,

        params: null,

        searchControl: null,
        sortingControl: null,
        rowsCountControl: null,
        searchThreshold: 3,

        sortLabel: "",
        rowsLabel: "",
        searchLabel: "",

        pageMode: "offset", // offset or page

        clsBody: "",
        clsPagination: "",
        clsSearchBlock: "",
        clsOrderBlock: "",
        clsRowsCountBlock: "",
        clsServiceBlock: "",

        onBeforeLoad: (f) => f,
        onLoad: (f) => f,
        onDrawEntry: Metro.noop,
        onDatasetCreate: Metro.noop,
    };

    Metro.remoteDatasetSetup = (options) => {
        RemoteDatasetDefaultConfig = $.extend({}, RemoteDatasetDefaultConfig, options);
    };

    if (typeof globalThis.metroRemoteDatasetSetup !== "undefined") {
        Metro.remoteDatasetSetup(globalThis.metroRemoteDatasetSetup);
    }

    Metro.Component("remote-dataset", {
        init: function (options, elem) {
            this._super(elem, options, RemoteDatasetDefaultConfig, {
                // define instance vars here
                data: null,
                total: 0,
                params: {},
            });
            return this;
        },

        _create: function () {
            const o = this.options;

            if (o.offset === null) {
                o.offset = o.pageMode === "offset" ? 0 : 1;
            }

            this.offset = o.offset;
            this.rowSteps = o.rowsSteps.toArray(",", "int");
            this.limit = +o.rows;
            this.url = o.url;
            this.search = "";
            const [field, order] = o.sort.toArray(":");
            this.sortField = field;
            this.sortOrder = order;
            this.sortRules = o.sortRules
                .toArray(",")
                .filter((f) => f)
                .map((rule) => rule.toArray(":"));

            const params = Metro.utils.isObject(o.params);
            if (params) {
                this.params = { ...params };
            }

            this._createStructure();
            this._createEvents();
            this._loadData().then(() => {});
            this._fireEvent("dataset-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const entries = $("<div>").addClass("dataset-entry");

            element.addClass("remote-dataset");
            element.append(entries);

            entries.html(`
                <div class="service-block ${o.clsServiceBlock} ${o.showServiceBlock ? "" : "d-none"}">
                    <div class="search-block ${o.clsSearchBlock} ${o.quickSearch ? "" : "d-none"}"></div>                   
                    <div class="order-block ${o.clsOrderBlock} ${this.sortRules.length === 0 || o.selectOrder === false ? "d-none" : ""}"></div>                   
                    <div class="count-block ${o.clsRowsCountBlock} ${o.selectCount ? "" : "d-none"}"></div>
                </div>
                ${o.caption ? `<div class="dataset-caption">${o.caption}</div>` : ""}
                <div class="dataset-body"></div>
            `);

            let search_input;
            if (o.searchControl) {
                search_input = $(o.searchControl);
            } else {
                search_input = $("<input>")
                    .attr("type", "text")
                    .addClass("medium")
                    .appendTo(entries.find(".search-block"));
            }
            if (search_input.length) {
                search_input.attr("name", "search-control");
                Metro.makePlugin(search_input, "input", {
                    searchButton: true,
                });

                const searchFn = Hooks.useDebounce(() => {
                    const val = search_input.val().trim();
                    if (!val) {
                        this.search = "";
                        this.url = o.url;
                        this._loadData().then(() => {});
                        return;
                    }
                    if (val.length < o.searchThreshold) {
                        return;
                    }
                    this.addParam(o.keySearch, val);
                    if (o.urlSearch) {
                        this.url = o.urlSearch;
                    }
                    this.offset = o.pageMode === "offset" ? 0 : 1;
                    this._loadData().then(() => {});
                }, 300);

                search_input.on(Metro.events.inputchange, searchFn);
            }

            let select_order;
            let select_rows_count;

            if (o.sortingControl) {
                select_order = $(o.sortingControl);
            } else {
                select_order = $("<select>")
                    .addClass("medium")
                    .attr("name", "sort-order")
                    .appendTo(entries.find(".order-block"));
            }
            if (select_order.length) {
                select_order.html(
                    this.sortRules
                        .map(
                            (rule) => `
                                    <option value="${rule[0]}:${rule[1]}" 
                                            ${rule[0] === this.sortField && rule[1] === this.sortOrder ? "selected" : ""}
                                            data-icon="${rule[3] ? rule[3] : ""}"
                                    >
                                        ${rule[2]}
                                    </option>
                                `,
                        )
                        .join(""),
                );
                Metro.makePlugin(select_order, "select", {
                    prepend: o.sortLabel || this.strings.label_sorting,
                    filter: false,
                    onChange: (value) => {
                        const [field, order] = ("" + value).split(":");
                        this.url = o.url;
                        this.sortField = field;
                        this.sortOrder = order;
                        this.offset = o.pageMode === "offset" ? 0 : 1;
                        this._loadData().then(() => {});
                    },
                });
            }

            if (o.rowsCountControl) {
                select_rows_count = $(o.rowsCountControl);
            } else {
                select_rows_count = $("<select>")
                    .addClass("medium")
                    .attr("name", "rows-count")
                    .appendTo(entries.find(".count-block"));
            }
            if (select_rows_count.length) {
                select_rows_count.html(
                    this.rowSteps
                        .map(
                            (step) => `
                                    <option value="${step}" ${+step === +o.rows ? "selected" : ""}>
                                        ${step}
                                    </option>
                                `,
                        )
                        .join(""),
                );
                Metro.makePlugin(select_rows_count, "select", {
                    prepend: o.rowsLabel || this.strings.label_rows_count,
                    filter: false,
                    onChange: (value) => {
                        this.limit = +value;
                        this.offset = o.pageMode === "offset" ? 0 : 1;
                        this._loadData().then(() => {});
                    },
                });
            }

            this.body = entries.find(".dataset-body").addClass(o.clsBody);

            this.loadMore = $("<div>").addClass("dataset-load-more");
            this.loadMore
                .html(`
                <button class="button large cycle link load-more-button">
                    <span class="icon">⟳</span>
                    ${this.strings.label_load_more}
                </button>
            `)
                .appendTo(element);

            if (o.showMore === false) {
                this.loadMore.addClass("d-none");
            }

            this.pagination = $("<div>").addClass("dataset-pagination");
            if (o.showPagination === false) {
                this.pagination.addClass("d-none");
            }
            element.append(this.pagination);
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on("click", ".page-link", function () {
                const parent = $(this).parent();
                if (parent.hasClass("service")) {
                    if (parent.hasClass("prev-page")) {
                        if (o.pageMode === "offset") {
                            that.offset -= that.limit;
                            if (that.offset < 0) {
                                that.offset = 0;
                            }
                        } else {
                            that.offset -= 1;
                            if (that.offset < 1) {
                                that.offset = 1;
                            }
                        }
                    } else {
                        if (o.pageMode === "offset") {
                            that.offset += that.limit;
                        } else {
                            that.offset += 1;
                        }
                    }
                    that._loadData().then(() => {});
                    return;
                }
                that.offset =
                    o.pageMode === "offset" ? $(this).data("page") * that.limit - that.limit : $(this).data("page");
                that._loadData().then(() => {});
            });

            element.on("click", ".load-more-button", () => {
                that.offset += o.pageMode === "offset" ? that.limit : 1;
                that._loadData(true).then(() => {});
            });
        },

        _createEntries: function (append = false) {
            const o = this.options;

            if (!this.data) {
                return;
            }

            const usePagination = Metro.utils.isValue(this.data[o.keyTotal]);

            this.entries = this.data[o.keyData];
            this.total = o.keyTotal ? this.data[o.keyTotal] : this.entries.length;

            if (append === false) this.body.clear();

            this.entries.forEach((entry, index) => {
                this.body.append(Metro.utils.exec(o.onDrawEntry, [entry, index], this));
            });

            if (usePagination && !o.shortPagination) {
                const current =
                    o.pageMode === "offset"
                        ? this.offset === 0
                            ? 1
                            : Math.round(this.offset / this.limit) + 1
                        : this.offset;
                Metro.pagination({
                    length: this.total,
                    rows: this.limit,
                    current,
                    target: this.pagination,
                    clsPagination: o.clsPagination,
                });
            } else {
                this.pagination.html(`
                    <div class="short-pagination">
                        <div class="button service prev-page"><a href="javascript:void(0)" class="page-link">${this.strings.label_prev}</a></div>
                        <div class="button service next-page"><a href="javascript:void(0)" class="page-link">${this.strings.label_next}</a></div>
                    </div>
                `);
            }
        },

        _loadData: async function (append = false) {
            const o = this.options;

            if (!this.url) {
                return;
            }

            let url = `${this.url}?`;

            if (o.keyLimit) {
                url += `${o.keyLimit}=${this.limit}&`;
            }
            if (o.keyOffset) {
                url += `${o.keyOffset}=${this.offset}`;
            }

            if (this.sortField) {
                if (o.keySort) {
                    url += `&${o.keySort}=${this.sortField}`;
                }
                if (o.keyOrder) {
                    url += `&${o.keyOrder}=${this.sortOrder}`;
                }
            }

            for (const key in this.params) {
                if (Object.hasOwn(this.params, key)) {
                    url += `&${key}=${encodeURIComponent(this.params[key])}`;
                }
            }

            url = o.onBeforeLoad(url, this);

            const response = await fetch(url, { method: o.method });
            if (response.ok === false) {
                return;
            }
            const responseData = await response.json();
            this.data = Metro.utils.exec(o.onLoad, [responseData], this);
            this._createEntries(append);
        },

        addParam: function (key, value) {
            if (this.params === null) {
                this.params = {};
            }
            this.params[key] = value;
            return this;
        },

        addParams: function (params = {}) {
            if (this.params === null) {
                this.params = {};
            }
            for (const key in params) {
                if (Object.hasOwn(params, key)) {
                    this.params[key] = params[key];
                }
            }
            return this;
        },

        clearParams: function () {
            this.params = {};
            return this;
        },

        load: function (append = false) {
            if (this.url === "") {
                return;
            }

            this._loadData(append).then(() => {});
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
