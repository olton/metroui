/** biome-ignore-all lint/suspicious/noRedundantUseStrict: Required for working with string  */
((Metro, $) => {
    "use strict";

    let RemoteTableDefaultConfig = {
        caption: "",
        url: "",
        urlSearch: "",
        method: "GET",
        limit: 10,
        offset: null,
        fields: "",
        sortableFields: "",
        colSize: "",
        sort: "",
        sortOrder: "asc",
        captions: null,

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

        showServiceBlock: true,
        quickSearch: true,
        selectOrder: true,
        selectCount: true,
        showPagination: true,

        params: null,

        searchControl: null,
        rowsCountControl: null,
        searchThreshold: 3,

        rowsLabel: "",
        searchLabel: "",

        pageMode: "offset", // offset or page

        clsTable: "",
        clsRow: "",
        clsCell: "",
        clsHead: "",
        clsPagination: "",

        onBeforeLoad: (f) => f,
        onLoad: (f) => f,
        onDrawRow: Metro.noop,
        onDrawCell: Metro.noop,
        onDrawHeadCell: Metro.noop,
        onTableCreate: Metro.noop,
    };

    Metro.remoteTableSetup = (options) => {
        RemoteTableDefaultConfig = $.extend({}, RemoteTableDefaultConfig, options);
    };

    if (typeof globalThis.metroRemoteTableSetup !== "undefined") {
        Metro.remoteTableSetup(globalThis.metroRemoteTableSetup);
    }

    Metro.Component("remote-table", {
        init: function (options, elem) {
            this._super(elem, options, RemoteTableDefaultConfig, {
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

            this.offset = +o.offset;
            this.fields = o.fields.toArray(",");
            this.captions = o.captions ? o.captions.toArray(",") : null;
            this.rowSteps = o.rowsSteps.toArray(",");
            this.colSize = o.colSize.toArray(",");
            this.limit = +o.rows;
            this.url = o.url;
            this.search = "";
            this.sortField = o.sort;
            this.sortOrder = o.sortOrder;

            const params = Metro.utils.isObject(o.params);
            if (params) {
                this.params = { ...params };
            }

            this._createStructure();
            this._createEvents();
            this._loadData().then(() => {});
            this._fireEvent("table-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
            const entries = $("<div>").addClass("table-entry");

            element.addClass("table-component remote-table");
            element.append(entries);

            entries.html(`
                <div class="service-block ${o.clsServiceBlock} ${o.showServiceBlock ? "" : "d-none"}">
                    <div class="search-block ${o.clsSearchBlock} ${o.quickSearch ? "" : "d-none"}"></div>                   
                    <div class="count-block ${o.clsRowsCountBlock} ${o.selectCount ? "" : "d-none"}"></div>
                </div>
                <table class="table ${o.clsTable}">
                    <caption>${o.caption}</caption>
                    <thead></thead>
                    <tbody></tbody>
                </table>
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

            let select_rows_count;
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

            this.header = entries.find("thead");
            this.body = entries.find("tbody");

            this.pagination = $("<div>").addClass("table-pagination");
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

            element.on("click", ".sortable-column", function () {
                const field = $(this).attr("data-field");
                if (that.sortField === field) {
                    that.sortOrder = that.sortOrder === "asc" ? "desc" : "asc";
                } else {
                    that.sortField = field;
                    that.sortOrder = "asc";
                }
                that._loadData().then(() => {});
            });
        },

        _createEntries: function () {
            const o = this.options;

            if (!this.data) {
                return;
            }

            const usePagination = Metro.utils.isValue(this.data[o.keyTotal]);

            this.entries = this.data[o.keyData];
            this.total = this.data[o.keyTotal];

            this.header.clear();
            this.body.clear();

            const headerRow = $("<tr>").addClass("table-header").appendTo(this.header);
            let hIndex = 0;
            for (const key of Object.keys(this.entries[0])) {
                if (this.fields.length && !this.fields.includes(key)) {
                    continue;
                }
                const cellData = this.captions ? this.captions[hIndex] : key;
                const cell = $("<th>").html(cellData).attr("data-field", key);
                if (o.sortableFields?.includes(key)) {
                    cell.addClass("sortable-column");
                    if (this.sortField === key) {
                        cell.addClass(`sort-${this.sortOrder}`);
                    }
                }
                cell.appendTo(headerRow).addClass(`head-cell-${key}`);
                if (this.colSize[hIndex]) {
                    cell.css("width", this.colSize[hIndex]);
                }
                Metro.utils.exec(
                    o.onDrawHeadCell,
                    [
                        cell[0],
                        cellData,
                        key,
                        hIndex,
                        o.sortableFields.includes(key),
                        this.sortField === key,
                        this.sortOrder,
                    ],
                    this,
                );
                hIndex++;
            }

            this.entries.forEach((entry, index) => {
                const row = $("<tr>").addClass("table-row");
                this.body.append(row);
                Metro.utils.exec(o.onDrawRow, [row, entry, index], this);
                let hIndex = 0;
                for (const key in entry) {
                    if (this.fields.length && !this.fields.includes(key)) {
                        continue;
                    }
                    const cell = $("<td>")
                        .attr("data-label", this.captions ? this.captions[hIndex] : key)
                        .addClass(`data-cell-${key}`)
                        .html(entry[key]);

                    row.append(cell);
                    Metro.utils.exec(o.onDrawCell, [cell[0], entry[key], key, entry, index], this);
                    hIndex++;
                }
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

        _loadData: async function () {
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
                if (this.params.hasOwnProperty(key)) {
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
            this._createEntries();
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
                if (params.hasOwnProperty(key)) {
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
