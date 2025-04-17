(function(Metro, $) {
    'use strict';

    var RemoteDatasetDefaultConfig = {
        caption: "",
        url: "",
        searchUrl: "",
        method: "GET",
        limit: 10,
        offset: 0,
        sort: "",
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
        sortRules: "",
        
        showSearch: true,
        showOrder: true,
        showRowsCount: true,

        template: "",

        clsBody: "",
        clsItem: "",
        clsPagination: "",
        clsSearchBlock: "",
        clsOrderBlock: "",
        clsRowsCountBlock: "",
        
        onLoad: f => f,
        onDrawRow: Metro.noop,
        onDrawCell: Metro.noop,
        onDatasetCreate: Metro.noop
    };

    Metro.remoteDatasetSetup = function (options) {
        RemoteDatasetDefaultConfig = $.extend({}, RemoteDatasetDefaultConfig, options);
    };

    if (typeof globalThis["metroRemoteDatasetSetup"] !== "undefined") {
        Metro.remoteDatasetSetup(globalThis["metroRemoteDatasetSetup"]);
    }

    Metro.Component('remote-dataset', {
        init: function( options, elem ) {
            this._super(elem, options, RemoteDatasetDefaultConfig, {
                // define instance vars here
                data: null,
                total: 0,
            });
            return this;
        },

        _create: function(){
            const o = this.options;

            this.offset = o.offset
            this.rowSteps = o.rowsSteps.toArray(",")
            this.limit = +o.rows
            this.url = o.url
            this.search = ""
            const [field, order] = o.sort.toArray(":")
            this.sortField = field
            this.sortOrder = order
            this.template = Metro.utils.exec(o.template)
            this.sortRules = o.sortRules.toArray(",").filter(f => f).map(rule => rule.toArray(":"))
            this._createStructure();
            this._createEvents();

            this._loadData().then(() => {});

            this._fireEvent('dataset-create');
        },

        _loadData: async function (append = false){
            const o = this.options
            if (!this.url) { return }
            let url = this.url + "?" + o.limitKey + "=" + this.limit + "&" + o.offsetKey + "=" + this.offset
            if (this.sortField) { url += "&" + o.sortKey + "=" + this.sortField + "&" + o.orderKey + "=" + this.sortOrder; }
            if (this.search) { url += "&" + o.searchKey + "=" + this.search; }
            const response = await fetch(url, { method: o.method })
            if (response.ok === false) { return ; }
            this.data = Metro.utils.exec(o.onLoad, [await response.json()], this);
            this._createEntries(append)
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            let entries

            element.addClass("remote-dataset")
            element.append(entries = $("<div>").addClass("dataset-entry"))

            entries.html(`
                <div class="service-block">
                    <div class="search-block ${o.clsSearchBlock} ${o.showSearch ? '' : 'hide-block'}">
                        <input name="search" type="text" data-role="input" 
                            data-prepend="${this.strings.label_search}" 
                            data-search-button="true" 
                            />
                    </div>
                   
                    <div class="order-block ${o.clsOrderBlock} ${this.sortRules.length === 0 || o.showOrder === false ? 'hide-block' : ''}">
                        <select name="sort-order" data-role="select" data-filter="false">
                            ${this.sortRules.map(rule => (`
                                <option value="${rule[0]}:${rule[1]}" 
                                        ${rule[0] === this.sortField && rule[1] === this.sortOrder ? 'selected' : ''}
                                        data-icon="${rule[3] ? rule[3] : ''}"
                                >
                                    ${rule[2]}
                                </option>
                            `)).join("")}
                        </select>
                    </div>
                   
                    <div class="count-block ${o.clsRowsCountBlock} ${o.showRowsCount ? '' : 'hide-block'}">
                        <select name="rows-count" data-role="select" data-prepend="${this.strings.label_rows_count}" data-filter="false">
                            ${this.rowSteps.map(step => (`
                                <option value="${step}" ${+step === this.rowsCount ? 'selected' : ''}>
                                    ${step}
                                </option>
                            `)).join("")}
                        </select>
                    </div>
                </div>
                <div class="dataset-body"></div>
            `)
            this.body = entries.find(".dataset-body").addClass(o.clsBody)

            this.loadMore = $("<div>").addClass("dataset-load-more")
            this.loadMore.html(`
                <button class="button large cycle link load-more-button">
                    <span class="icon">⟳</span>
                    ${this.strings.label_load_more}
                </button>
            `).appendTo(element)
            
            element.append(
                this.pagination = $("<div>").addClass("dataset-pagination")
            )
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;

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
            
            element.on("change", "select[name=sort-order]", function(){
                const [field, order] = $(this).val().split(":")
                that.url = o.url
                that.sortField = field
                that.sortOrder = order
                that.offset = 0
                that._loadData().then(() => {})
            })
            
            element.on("click", ".load-more-button", function(){
                that.offset += that.limit
                that._loadData(true).then(() => {})
            })
        },

        _createEntries: function (append = false){
            var that = this, element = this.element, o = this.options;

            if (!this.data) {
                return ;
            }

            const usePagination = Metro.utils.isValue(this.data[o.totalKey])

            this.entries = this.data[o.dataKey];
            this.total = this.data[o.totalKey];

            if (append === false) this.body.clear()
            
            this.entries.forEach((entry, index) => {
                const item = $("<div>").addClass("dataset-item").addClass(o.clsItem).addClass(index % 2 === 0 ? "even" : "odd")
                const html = Metro.utils.exec(o.template, [entry], entry)
                item.html(html).appendTo(that.body)
            });

            if (usePagination && !o.shortPagination) {
                Metro.pagination({
                    length: this.total,
                    rows: this.limit,
                    current: this.offset === 0 ? 1 : Math.round(this.offset / this.limit) + 1,
                    target: this.pagination,
                    clsPagination: o.clsPagination
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

        /*
        * options = {
        *   caption: "",
        *   url: "",
        *   searchUrl: "",
        *   method: "GET",
        *   limit: 10,
        *   offset: 0,
        *   sort: "",
        *   sortOrder: "asc",
        *   limitKey: "limit",
        * }
        * */
        setup: function (options){
            
        },
        
        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));