((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';
    
    let RemoteTableDefaultConfig = {
        caption: "",
        url: "",
        searchUrl: "",
        method: "GET",
        limit: 10,
        offset: 0,
        fields: "",
        sortableFields: "",
        colSize: "",
        sort: "",
        sortOrder: "asc",
        captions: null,
        limitKey: "limit",
        offsetKey: "offset",
        searchKey: "query",
        totalKey: "total",
        dataKey: "data",
        sortKey: "sortBy",
        orderKey: "order",
        shortPagination: false,
        rows: 10,
        rowsSteps: "10,25,50,100",
        
        clsTable: "",
        clsPagination: "",
        
        onLoad: f => f,
        onDrawRow: Metro.noop,
        onDrawCell: Metro.noop,
        onDrawHeadCell: Metro.noop,
        onTableCreate: Metro.noop
    };

    Metro.remoteTableSetup = (options) => {
        RemoteTableDefaultConfig = $.extend({}, RemoteTableDefaultConfig, options);
    };

    if (typeof globalThis.metroRemoteTableSetup !== "undefined") {
        Metro.remoteTableSetup(globalThis.metroRemoteTableSetup);
    }

    Metro.Component('remote-table', {
        init: function( options, elem ) {
            this._super(elem, options, RemoteTableDefaultConfig, {
                // define instance vars here
                data: null,
                total: 0,
            });
            return this;
        },

        _create: function(){
            const o = this.options;

            this.offset = o.offset
            this.fields = o.fields.toArray(",")
            this.captions = o.captions ? o.captions.toArray(",") : null
            this.rowSteps = o.rowsSteps.toArray(",")
            this.colSize = o.colSize.toArray(",")
            this.limit = +o.rows
            this.url = o.url
            this.search = ""
            this.sortField = o.sort
            this.sortOrder = o.sortOrder
            
            this._createStructure();
            this._createEvents();
            
            this._loadData().then(() => {});

            this._fireEvent('table-create');
        },

        _loadData: async function (){
            const o = this.options
            if (!this.url) { return }
            let url = `${this.url}?${o.limitKey}=${this.limit}&${o.offsetKey}=${this.offset}`
            if (this.sortField) { url += `&${o.sortKey}=${this.sortField}&${o.orderKey}=${this.sortOrder}`; }
            if (this.search) { url += `&${o.searchKey}=${this.search}`; }
            const response = await fetch(url, { method: o.method })
            if (response.ok === false) { return ; }
            this.data = Metro.utils.exec(o.onLoad, [await response.json()], this);
            this._createEntries()
        },
        
        _createStructure: function(){
            const element = this.element;
            const o = this.options;
            const entries = $("<div>").addClass("table-entry")
            
            element.addClass("table-component remote-table")
            element.append(entries)
            
            entries.html(`
                <div class="search-block row">
                    <div class="cell-sm-10">
                        <input name="search" type="text" data-role="input" 
                            data-prepend="${this.strings.label_search}" 
                            data-search-button="true" 
                            />
                    </div>
                    <div class="cell-sm-2">
                        <select name="rows-count" data-role="select" data-prepend="${this.strings.label_rows_count}" data-filter="false">
                            ${this.rowSteps.map(step => `<option value="${step}" ${+step === this.rowsCount ? 'selected' : ''}>${step}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <table class="table ${o.clsTable}">
                    <caption>${o.caption}</caption>
                    <thead></thead>
                    <tbody></tbody>
                </table>
            `)
            this.header = entries.find("thead")
            this.body = entries.find("tbody")

            this.pagination = $("<div>").addClass("table-pagination")
            element.append( this.pagination )
        },

        _createEvents: function(){
            const that = this;
            const element = this.element;
            const o = this.options;
            
            element.on("click", ".page-link", function(){
                const parent = $(this).parent()
                if (parent.hasClass("service")) {
                    if (parent.hasClass("prev-page")) {
                        that.offset -= that.limit;
                        if (that.offset < 0) {
                            that.offset = 0;
                        } 
                    } else {
                        that.offset += that.limit;
                    }
                    that._loadData().then(() => {})
                    return
                }
                that.offset = $(this).data("page") * that.limit - that.limit;
                that._loadData().then(() => {})
            })
            
            const searchFn = Hooks.useDebounce(() => {
                const val = element.find("input[name=search]").val().trim()
                if (val === "") {
                    this.search = ""
                    this.url = o.url
                    this._loadData().then(() => {})
                    return
                }
                if (val.length < 3) {
                    return
                }
                this.search = val
                this.url = o.searchUrl
                this._loadData().then(() => {})
            }, 300)
            
            element.on(Metro.events.inputchange, "input[name=search]", searchFn)
            
            element.on("change", "select[name=rows-count]", function(){
                that.limit = +$(this).val()
                that.offset = 0
                that._loadData().then(() => {})
            })
            
            element.on("click", ".sortable-column", function(){
                const field = $(this).attr("data-field")
                if (that.sortField === field) {
                    that.sortOrder = that.sortOrder === "asc" ? "desc" : "asc"
                } else {
                    that.sortField = field
                    that.sortOrder = "asc"
                }
                that._loadData().then(() => {})
            })
        },

        _createEntries: function (){
            const o = this.options;
            
            if (!this.data) {
                return ;
            }

            const usePagination = Metro.utils.isValue(this.data[o.totalKey])
            
            this.entries = this.data[o.dataKey];
            this.total = this.data[o.totalKey];

            this.header.clear()
            this.body.clear()
            
            const headerRow = $("<tr>").addClass("table-header").appendTo(this.header);
            let hIndex = 0;
            for (const key of Object.keys(this.entries[0])) {
                if (this.fields.length && !this.fields.includes(key)) {
                    continue;
                }
                const cellData = this.captions ? this.captions[hIndex] : key
                const cell = $("<th>").html(cellData).attr("data-field", key);
                if (o.sortableFields?.includes(key)) {
                    cell.addClass("sortable-column")
                    if (this.sortField === key) {
                        cell.addClass(`sort-${this.sortOrder}`)
                    }
                }
                cell.appendTo(headerRow).addClass(`head-cell-${key}`);
                if (this.colSize[hIndex]) {
                    cell.css("width", this.colSize[hIndex])
                }
                Metro.utils.exec(o.onDrawHeadCell, [cell[0], cellData, key, hIndex, o.sortableFields.includes(key), this.sortField === key, this.sortOrder], this);
                hIndex++
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
                    const cell = $("<td>").attr("data-label", this.captions ? this.captions[hIndex] : key)
                        .addClass(`data-cell-${key}`)
                        .html(entry[key]);
                    
                    row.append(cell);
                    Metro.utils.exec(o.onDrawCell, [cell[0], entry[key], key, entry, index], this);
                    hIndex++
                }
            });
            
            if (usePagination && !o.shortPagination) {
                Metro.pagination({
                    length: this.total,
                    rows: this.limit,
                    current: this.offset === 0 ? 1 : Math.round(this.offset / this.limit) + 1,
                    target: this.pagination,
                    clsPagination: o.clsPagination,
                })
            } else {
                this.pagination.html(`
                    <div class="short-pagination">
                        <div class="button service prev-page"><a href="javascript:void(0)" class="page-link">${this.strings.label_prev}</a></div>
                        <div class="button service next-page"><a href="javascript:void(0)" class="page-link">${this.strings.label_next}</a></div>
                    </div>
                `)
            }
            
        },
        
        changeAttribute: (attr, newValue)=> {
        },

        destroy: function(){
            this.element.remove();
        }
    });
})(Metro, Dom);