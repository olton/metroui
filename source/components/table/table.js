const TABLE_COL_OPTIONS = {
    title: undefined,
    format: undefined,
    formatMask: undefined,
    name: undefined, 
    colspan: null,
    size: undefined,
    sortable: false,
    sortDir: undefined,
    clsColumn: undefined,
    cls: undefined,
    show: true,
    required: true, 
    field: undefined,
    fieldType: undefined,
    validator: undefined,
    template: undefined,
    type: "data",
}

;((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    
    let TableDefaultConfig = {
        caption: "",
        cardMode: "", 
        useCurrentSlice: false,
        showInspectorButton: false,
        inspectorButtonIcon: "🔧",
        tableDeferred: 0,
        templateBeginToken: "<%",
        templateEndToken: "%>",
        paginationDistance: 5,
        paginationIslandSize: 3,
        paginationShortTrack: 10,

        horizontalScroll: false,
        horizontalScrollStop: null,
        check: false,
        checkType: "checkbox",
        checkColIndex: 0,
        checkName: null,
        checkStoreKey: "TABLE:$1:KEYS",
        rownum: false,
        rownumTitle: "#",

        filters: null,
        filtersOperator: "and",

        head: null,
        body: null,
        source: null,

        static: false,

        searchMinLength: 1,
        searchThreshold: 500,
        searchFields: null,

        showRowsSteps: true,
        showSearch: true,
        showTableInfo: true,
        showPagination: true,
        paginationShortMode: true,
        showActivity: true,
        muteTable: true,
        showSkip: false,

        rows: 10,
        rowsSteps: "10,25,50,100",

        staticView: false,
        viewSaveMode: "client",
        viewSavePath: "TABLE:$1:OPTIONS",

        sortDir: "asc",
        decimalSeparator: ".",
        thousandSeparator: ",",

        tableRowsCountTitle: null,
        tableSearchTitle: null,
        tableSearchPlaceholder: "",
        tableInfoTitle: null,
        paginationPrevTitle: null,
        paginationNextTitle: null,
        allRecordsTitle: null,
        inspectorTitle: null,
        tableSkipTitle: null,
        emptyTableTitle: null,

        activityType: "atom",
        activityStyle: "color",
        activityTimeout: 100,

        searchWrapper: null,
        rowsWrapper: null,
        infoWrapper: null,
        paginationWrapper: null,
        skipWrapper: null,

        cellWrapper: true,

        clsComponent: "",
        clsTableContainer: "",
        clsTable: "",

        clsHead: "",
        clsHeadRow: "",
        clsHeadCell: "",

        clsBody: "",
        clsBodyRow: "",
        clsBodyCell: "",
        clsCellWrapper: "",

        clsFooter: "",
        clsFooterRow: "",
        clsFooterCell: "",

        clsTableTop: "",
        clsRowsCount: "",
        clsSearch: "",

        clsTableBottom: "",
        clsTableInfo: "",
        clsTablePagination: "",

        clsPagination: "",
        clsTableSkip: "",
        clsTableSkipInput: "",
        clsTableSkipButton: "",

        clsEvenRow: "",
        clsOddRow: "",
        clsRow: "",

        clsEmptyTableTitle: "",

        onDraw: Metro.noop,
        onDrawRow: Metro.noop,
        onDrawCell: Metro.noop,
        onAppendRow: Metro.noop,
        onAppendCell: Metro.noop,
        onSortStart: Metro.noop,
        onSortStop: Metro.noop,
        onSortItemSwitch: Metro.noop,
        onSearch: Metro.noop,
        onRowsCountChange: Metro.noop,
        onDataLoad: Metro.noop,
        onDataLoadError: Metro.noop,
        onDataLoaded: Metro.noop,
        onDataLoadEnd: Metro.noop,
        onDataSaveError: Metro.noop,
        onFilterRowAccepted: Metro.noop,
        onFilterRowDeclined: Metro.noop,
        onCheckClick: Metro.noop,
        onCheckClickAll: Metro.noop,
        onCheckDraw: Metro.noop,
        onViewSave: Metro.noop,
        onViewGet: Metro.noop,
        onViewCreated: Metro.noop,
        onTableCreate: Metro.noop,
        onSkip: Metro.noop,
    };

    Metro.tableSetup = (options) => {
        TableDefaultConfig = $.extend({}, TableDefaultConfig, options);
    };

    if (typeof globalThis.metroTableSetup !== "undefined") {
        Metro.tableSetup(globalThis.metroTableSetup);
    }

    Metro.Component("table", {
        init: function (options, elem) {
            this._super(elem, options, TableDefaultConfig, {
                currentPage: 1,
                pagesCount: 1,
                searchString: "",
                data: null,
                activity: null,
                loadActivity: null,
                busy: false,
                filters: [],
                wrapperInfo: null,
                wrapperSearch: null,
                wrapperRows: null,
                wrapperPagination: null,
                wrapperSkip: null,
                filterIndex: null,
                filtersIndexes: [],
                component: null,
                inspector: null,
                view: {},
                viewDefault: {},
                input_interval: null,
                searchFields: [],
                id: Metro.utils.elementId("table"),
                sort: {
                    dir: "asc",
                    colIndex: 0,
                },
                service: [],
                heads: [],
                items: [],
                foots: [],
                filteredItems: [],
                currentSlice: [],
                index: {},
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;
            const id = Metro.utils.elementId("table");
            let table_container;

            if (!element.id()) {
                console.warn("To use all table component features, please set an ID for the table element!");
                element.id(id);
            }

            if (Metro.utils.isValue(o.searchFields)) {
                this.searchFields = o.searchFields.toArray();
            }

            if (Metro.utils.isValue(o.head)) {
                const _head = o.head;
                o.head = Metro.utils.isObject(o.head);
                if (!o.head) {
                    console.warn(`Head ${_head} defined but not exists!`);
                    o.head = null;
                }
            }

            if (Metro.utils.isValue(o.body)) {
                const _body = o.body;
                o.body = Metro.utils.isObject(o.body);
                if (!o.body) {
                    console.warn(`Body ${_body} defined but not exists!`);
                    o.body = null;
                }
            }

            if (o.static === true) {
                o.showPagination = false;
                o.showRowsSteps = false;
                o.showSearch = false;
                o.showTableInfo = false;
                o.showSkip = false;
                o.rows = -1;
            }

            const table_component = $("<div>").addClass("table-component")
            table_component.insertBefore(element);

            table_container = $("<div>").addClass("table-container").addClass(o.clsTableContainer).appendTo(table_component);
            element.appendTo(table_container);

            if (o.horizontalScroll === true) {
                table_container.addClass("horizontal-scroll");
            }
            if (!Metro.utils.isNull(o.horizontalScrollStop) && Metro.utils.mediaExist(o.horizontalScrollStop)) {
                table_container.removeClass("horizontal-scroll");
            }

            table_component.addClass(o.clsComponent);

            this.activity = $("<div>").addClass("table-progress").appendTo(table_component);

            const activity = $("<div>").appendTo(this.activity)
            Metro.makePlugin(activity, "activity", {
                type: o.activityType,
                style: o.activityStyle,
            });

            if (o.showActivity !== true) {
                this.activity.css({
                    visibility: "hidden",
                });
            }

            this.component = table_component[0];

            if (o.source !== null) {
                this._fireEvent("data-load", {
                    source: o.source,
                });

                const objSource = Metro.utils.isObject(o.source);

                if (objSource !== false && $.isPlainObject(objSource)) {
                    this._build(objSource);
                } else {
                    this.activity.show(() => {
                        fetch(o.source)
                            .then(Metro.fetch.status)
                            .then(Metro.fetch.json)
                            .then((data) => {
                                this.activity.hide();
                                if (typeof data !== "object") {
                                    throw new Error("Data for table is not a object");
                                }

                                this._fireEvent("data-loaded", {
                                    source: o.source,
                                    data: data,
                                });

                                this._build(data);
                            })
                            .catch((error) => {
                                this.activity.hide();

                                this._fireEvent("data-load-error", {
                                    source: o.source,
                                    error: error,
                                });
                            });
                    });
                }
            } else {
                this._build();
            }
        },

        _createIndex: function () {
            const colIndex = this.options.checkColIndex;
            setImmediate(() => {
                this.items.forEach((v, i) => {
                    this.index[v[colIndex]] = i;
                });
            });
        },

        _build: function (data) {
            const element = this.element;
            const o = this.options;
            let view;
            const id = element.attr("id");
            let viewPath;

            o.rows = +o.rows;

            this.items = [];
            this.heads = [];
            this.foots = [];

            if (Array.isArray(o.head)) {
                this.heads = o.head;
            }

            if (Array.isArray(o.body)) {
                this.items = o.body;
            }

            if (Metro.utils.isValue(data)) {
                this._createItemsFromJSON(data);
            } else {
                this._createItemsFromHTML();
            }

            // Create index
            this._createIndex();

            this.view = this._createView();
            this.viewDefault = Metro.utils.objectClone(this.view);

            viewPath = o.viewSavePath.replace("$1", id);

            if (o.viewSaveMode.toLowerCase() === "client") {
                view = Metro.storage.getItem(viewPath);
                if (Metro.utils.isValue(view) && Metro.utils.objectLength(view) === Metro.utils.objectLength(this.view)) {
                    this.view = view;

                    this._fireEvent("view-get", {
                        source: "client",
                        view: view,
                    });
                }
                this._final();
            } else {
                fetch(viewPath)
                    .then(Metro.fetch.status)
                    .then(Metro.fetch.json)
                    .then((view) => {
                        if (Metro.utils.isValue(view) && Metro.utils.objectLength(view) === Metro.utils.objectLength(this.view)) {
                            this.view = view;
                            this._fireEvent("view-get", {
                                source: "server",
                                view: view,
                            });
                        }
                        this._final();
                    })
                    .catch((error) => {
                        this._final();
                        console.warn(`Warning! Error loading view for table ${element.attr("id")}: ${error}`);
                    });
            }
        },

        _final: function () {
            const element = this.element;
            const o = this.options;
            const id = element.attr("id");

            Metro.storage.delItem(o.checkStoreKey.replace("$1", id));

            this._service();
            this._createStructure();
            this._createInspector();
            this._createEvents();

            this._fireEvent("table-create", {
                element: element,
            });
        },

        _service: function () {
            const o = this.options;

            this.service = [
                {
                    // Rownum
                    ...TABLE_COL_OPTIONS,
                    title: o.rownumTitle,
                    clsColumn: `rownum-cell ${o.rownum !== true ? "d-none" : ""}`,
                    cls: `rownum-cell ${o.rownum !== true ? "d-none" : ""}`,
                    type: "rownum",
                },
                {
                    // Checkbox
                    ...TABLE_COL_OPTIONS,
                    title:
                        o.checkType === "checkbox"
                            ? `<input type='checkbox' data-role='checkbox' class='table-service-check-all' data-style='${o.checkStyle}'>`
                            : "",
                    clsColumn: `check-cell ${o.check !== true ? "d-none" : ""}`,
                    cls: `check-cell ${o.check !== true ? "d-none" : ""}`,
                    type: "rowcheck",
                },
            ];
        },

        _createView: function () {
            const view = {};

            $.each(this.heads, function (i) {
                if (Metro.utils.isValue(this.cls)) {
                    this.cls = this.cls.replace("hidden", "");
                }
                if (Metro.utils.isValue(this.clsColumn)) {
                    this.clsColumn = this.clsColumn.replace("hidden", "");
                }

                view[i] = {
                    index: i,
                    "index-view": i,
                    show: !Metro.utils.isValue(this.show) ? true : this.show,
                    size: Metro.utils.isValue(this.size) ? this.size : "",
                };
            });

            this._fireEvent("view-created", {
                view: view,
            });

            return view;
        },

        _createInspectorItems: function (table) {
            const that = this;
            const o = this.options;
            let j;
            const tds = [];
            let row;
            const cells = this.heads;

            table.html("");

            for (j = 0; j < cells.length; j++) {
                tds[j] = null;
            }

            $.each(cells, function (i) {
                row = $("<tr>");
                row.data("index", i);
                row.data("index-view", i);
                $("<td>")
                    .html(
                        `<input type='checkbox' data-style='${o.checkStyle}' data-role='checkbox' name='column_show_check[]' value='${i}' ${Metro.utils.bool(that.view[i].show) ? "checked" : ""}>`,
                    )
                    .appendTo(row);
                $("<td>").html(`<div>${this.title}</div>`).appendTo(row);
                $("<td>")
                    .html(`<input type='number' data-role='spinner' name='column_size' value='${that.view[i].size}' data-index='${i}'>`)
                    .appendTo(row);
                $("<td>")
                    .html(
                        "" +
                            "<button class='button square js-table-inspector-field-up' type='button'>↑</button>" +
                            "<button class='button square js-table-inspector-field-down' type='button'>↓</button>" +
                            "",
                    )
                    .appendTo(row);
                tds[that.view[i]["index-view"]] = row;
            });

            //
            for (j = 0; j < cells.length; j++) {
                tds[j].appendTo(table);
            }
        },

        _createInspector: function () {
            const o = this.options;
            const strings = this.strings;

            const inspector = $("<div data-role='draggable' data-drag-element='.table-inspector-header' data-drag-area='body'>").addClass("table-inspector")
            inspector.attr("for", this.element.attr("id"));

            $(`<div class='table-inspector-header'>${o.inspectorTitle || strings.label_inspector}</div>`).appendTo(inspector);

            const table_wrap = $("<div>").addClass("table-wrap").appendTo(inspector)
            const table = $("<table>").addClass("table subcompact")
            const tbody = $("<tbody>").appendTo(table)
            table.appendTo(table_wrap);

            this._createInspectorItems(tbody);

            const actions = $("<div class='table-inspector-actions'>").appendTo(inspector)
            $("<button class='button primary js-table-inspector-save' type='button'>").html(strings.label_save).appendTo(actions);
            $("<button class='button secondary js-table-inspector-reset ml-2 mr-2' type='button'>").html(strings.label_reset).appendTo(actions);
            $("<button class='button link js-table-inspector-cancel place-right' type='button'>").html(strings.label_cancel).appendTo(actions);

            inspector.data("open", false);
            this.inspector = inspector;

            $("body").append(inspector);

            this._createInspectorEvents();
        },

        _resetInspector: function () {
            const inspector = this.inspector;
            const table = inspector.find("table tbody");
            this._createInspectorItems(table);
            this._createInspectorEvents();
        },

        _createHeadsFromHTML: function () {
            const that = this;
            const element = this.element;
            const head = element.find("thead");

            if (head.length > 0) {
                $.each(head.find("tr > *"), function () {
                    const item = $(this);
                    let dir;
                    let item_class;

                    if (item.hasClass("rownum-cell") || item.hasClass("check-cell")) return;

                    if (Metro.utils.isValue(item.data("sort-dir"))) {
                        dir = item.data("sort-dir");
                    } else {
                        if (item.hasClass("sort-asc")) {
                            dir = "asc";
                        } else if (item.hasClass("sort-desc")) {
                            dir = "desc";
                        } else {
                            dir = undefined;
                        }
                    }

                    item_class = item[0].className.replace("sortable-column", "");
                    item_class = item_class.replace("sort-asc", "");
                    item_class = item_class.replace("sort-desc", "");
                    item_class = item_class.replace("hidden", "");

                    const head_item = {
                        type: "data",
                        title: item.html(),
                        name: Metro.utils.isValue(item.data("name")) ? item.data("name") : item.text().replace(" ", "_"),
                        sortable: item.hasClass("sortable-column") || (Metro.utils.isValue(item.data("sortable")) && JSON.parse(item.data("sortable")) === true),
                        sortDir: dir,
                        format: Metro.utils.isValue(item.data("format")) ? item.data("format") : "string",
                        formatMask: Metro.utils.isValue(item.data("format-mask")) ? item.data("format-mask") : null,
                        clsColumn: Metro.utils.isValue(item.data("cls-column")) ? item.data("cls-column") : "",
                        cls: item_class,
                        colspan: item.attr("colspan"),
                        size: Metro.utils.isValue(item.data("size")) ? item.data("size") : "",
                        show: !(item.hasClass("hidden") || (Metro.utils.isValue(item.data("show")) && JSON.parse(item.data("show")) === false)),

                        required: Metro.utils.isValue(item.data("required")) ? JSON.parse(item.data("required")) === true : false,
                        field: Metro.utils.isValue(item.data("field")) ? item.data("field") : "input",
                        fieldType: Metro.utils.isValue(item.data("field-type")) ? item.data("field-type") : "text",
                        validator: Metro.utils.isValue(item.data("validator")) ? item.data("validator") : null,

                        template: Metro.utils.isValue(item.data("template")) ? item.data("template") : null,
                    }
                    that.heads.push(head_item);
                });
                // head.clear();
            }
        },

        _createFootsFromHTML: function () {
            const that = this;
            const element = this.element;
            const foot = element.find("tfoot");

            if (foot.length > 0)
                $.each(foot.find("tr > *"), function () {
                    const item = $(this);

                    const foot_item = {
                        title: item.html(),
                        name: Metro.utils.isValue(item.data("name")) ? item.data("name") : false,
                        cls: item[0].className,
                        colspan: item.attr("colspan"),
                    }
                    that.foots.push(foot_item);
                });
        },

        _createItemsFromHTML: function () {
            const that = this;
            const element = this.element;
            const body = element.find("tbody");

            if (body.length > 0)
                $.each(body.find("tr"), function () {
                    const row = $(this);
                    const tr = [];
                    $.each(row.children("td"), function () {
                        const td = $(this);
                        tr.push(td.html());
                    });
                    that.items.push(tr);
                });

            this._createHeadsFromHTML();
            this._createFootsFromHTML();
        },

        _createItemsFromJSON: function (src) {
            const that = this;
            const source = typeof src === "string" ? JSON.parse(src) : src;

            if (source.header !== undefined) {
                that.heads = source.header;
            } else {
                this._createHeadsFromHTML();
            }

            if (source.data !== undefined) {
                $.each(source.data, function () {
                    const tr = [];
                    $.each(this, function () {
                        tr.push(this);
                    });
                    that.items.push(tr);
                });
            }

            if (source.footer !== undefined) {
                this.foots = source.footer;
            } else {
                this._createFootsFromHTML();
            }
        },

        _createTableHeader: function () {
            const element = this.element;
            const o = this.options;
            let head = element.find("thead");
            let tr;
            let th;
            const tds = [];
            let j;
            let cells;
            const view = o.staticView ? this._createView() : this.view;

            if (head.length === 0) {
                head = $("<thead>");
                element.prepend(head);
            }

            head.clear().addClass(o.clsHead);

            if (o.caption) {
                $("<caption>").html(o.caption).insertBefore(head);
            }
            
            if (this.heads.length === 0) {
                return head;
            }

            tr = $("<tr>").addClass(o.clsHeadRow).appendTo(head);

            $.each(this.service, function () {
                const classes = [];
                const th = $("<th>");
                if (Metro.utils.isValue(this.title)) {
                    th.html(this.title);
                }
                if (Metro.utils.isValue(this.size)) {
                    th.css({ width: this.size });
                }
                if (Metro.utils.isValue(this.cls)) {
                    classes.push(this.cls);
                }
                classes.push(o.clsHeadCell);
                th.addClass(classes.join(" "));
                tr.append(th);
            });

            cells = this.heads;

            for (j = 0; j < cells.length; j++) {
                tds[j] = null;
            }

            $.each(cells, function (cell_index) {
                const classes = [];

                const th = $("<th>");
                th.data("index", cell_index);

                if (Metro.utils.isValue(this.title)) {
                    th.html(this.title);
                }
                if (Metro.utils.isValue(this.format)) {
                    th.attr("data-format", this.format);
                }
                if (Metro.utils.isValue(this.formatMask)) {
                    th.attr("data-format-mask", this.formatMask);
                }
                if (Metro.utils.isValue(this.name)) {
                    th.attr("data-name", this.name);
                }
                if (Metro.utils.isValue(this.colspan)) {
                    th.attr("colspan", this.colspan);
                }
                if (Metro.utils.isValue(this.size)) {
                    th.attr("data-size", this.size);
                }
                if (Metro.utils.isValue(this.sortable)) {
                    th.attr("data-sortable", this.sortable);
                }
                if (Metro.utils.isValue(this.sortDir)) {
                    th.attr("data-sort-dir", this.sortDir);
                }
                if (Metro.utils.isValue(this.clsColumn)) {
                    th.attr("data-cls-column", this.clsColumn);
                }
                if (Metro.utils.isValue(this.cls)) {
                    th.attr("data-cls", this.cls);
                }
                if (Metro.utils.isValue(this.show)) {
                    th.attr("data-show", this.show);
                }
                if (Metro.utils.isValue(this.required)) {
                    th.attr("data-required", this.required);
                }
                if (Metro.utils.isValue(this.field)) {
                    th.attr("data-field", this.field);
                }
                if (Metro.utils.isValue(this.fieldType)) {
                    th.attr("data-field-type", this.fieldType);
                }
                if (Metro.utils.isValue(this.validator)) {
                    th.attr("data-validator", this.validator);
                }
                if (Metro.utils.isValue(this.template)) {
                    th.attr("data-template", this.template);
                }
                if (Metro.utils.isValue(view[cell_index].size)) {
                    th.css({ width: view[cell_index].size });
                }
                if (this.sortable === true) {
                    classes.push("sortable-column");

                    if (Metro.utils.isValue(this.sortDir)) {
                        classes.push(`sort-${this.sortDir}`);
                    }
                }
                if (Metro.utils.isValue(this.cls)) {
                    $.each(this.cls.toArray(), function () {
                        classes.push(this);
                    });
                }
                if (Metro.utils.bool(view[cell_index].show) === false) {
                    if (classes.indexOf("hidden") === -1) classes.push("hidden");
                }

                classes.push(o.clsHeadCell);

                if (Metro.utils.bool(view[cell_index].show)) {
                    Metro.utils.arrayDelete(classes, "hidden");
                }

                th.addClass(classes.join(" "));

                tds[view[cell_index]["index-view"]] = th;
            });

            for (j = 0; j < cells.length; j++) {
                tds[j].appendTo(tr);
            }
        },

        _createTableBody: function () {
            let body;
            let head;
            const element = this.element;

            head = element.find("thead");
            body = element.find("tbody");

            if (body.length === 0) {
                body = $("<tbody>").addClass(this.options.clsBody);
                if (head.length !== 0) {
                    body.insertAfter(head);
                } else {
                    element.append(body);
                }
            }

            body.clear();
        },

        _createTableFooter: function () {
            const element = this.element;
            const o = this.options;
            let foot = element.find("tfoot");
            let th;

            if (foot.length === 0) {
                foot = $("<tfoot>").appendTo(element);
            }

            foot.clear().addClass(o.clsFooter);

            if (this.foots.length === 0) {
                return;
            }

            const tr = $("<tr>").addClass(o.clsHeadRow).appendTo(foot)
            $.each(this.foots, function () {
                th = $("<th>").appendTo(tr);

                if (this.title) {
                    th.html(this.title);
                }

                if (this.name) {
                    th.addClass(`foot-column-name-${this.name}`);
                }

                if (this.cls) {
                    th.addClass(this.cls);
                }

                if (Metro.utils.isValue(this.colspan)) {
                    th.attr("colspan", this.colspan);
                }

                th.appendTo(tr);
            });
        },

        _createTopBlock: function () {
            const element = this.element;
            const o = this.options;
            const strings = this.strings;
            const top_block = $("<div>").addClass("table-top").addClass(o.clsTableTop).insertBefore(element.parent());
            let search_block;
            let rows_block;

            search_block = Metro.utils.isValue(this.wrapperSearch)
                ? this.wrapperSearch
                : $("<div>").addClass("table-search-block").addClass(o.clsSearch).appendTo(top_block);
            search_block.addClass(o.clsSearch);

            const search_input = $("<input>").attr("type", "text").attr("placeholder", o.tableSearchPlaceholder).appendTo(search_block)
            Metro.makePlugin(search_input, "input", {
                prepend: o.tableSearchTitle || strings.label_search,
            });

            if (o.showSearch !== true) {
                search_block.hide();
            }

            rows_block = Metro.utils.isValue(this.wrapperRows) ? this.wrapperRows : $("<div>").addClass("table-rows-block").appendTo(top_block);
            rows_block.addClass(o.clsRowsCount);

            const rows_select = $("<select>").appendTo(rows_block)
            $.each(o.rowsSteps.toArray(), function () {
                const val = Number.parseInt(this);
                const option = $("<option>")
                    .attr("value", val)
                    .text(val === -1 ? o.allRecordsTitle || strings.label_all : val)
                    .appendTo(rows_select);
                if (val === Number.parseInt(o.rows)) {
                    option.attr("selected", "selected");
                }
            });
            Metro.makePlugin(rows_select, "select", {
                filter: false,
                prepend: o.tableRowsCountTitle || strings.label_rows_count,
                onChange: (val) => {
                    const _val = Number.parseInt(val);
                    if (_val === o.rows) {
                        return;
                    }
                    o.rows = val;
                    this.currentPage = 1;
                    this._draw();

                    this._fireEvent("rows-count-change", {
                        val: val,
                    });
                },
            });

            if (o.showInspectorButton) {
                $("<button>").addClass("button inspector-button").attr("type", "button").html(o.inspectorButtonIcon).insertAfter(rows_block);
            }

            if (o.showRowsSteps !== true) {
                rows_block.hide();
            }

            return top_block;
        },

        _createBottomBlock: function () {
            const element = this.element;
            const o = this.options;
            const strings = this.strings;
            const bottom_block = $("<div>").addClass("table-bottom").addClass(o.clsTableBottom).insertAfter(element.parent());
            let info;
            let pagination;
            let skip;

            info = Metro.utils.isValue(this.wrapperInfo) ? this.wrapperInfo : $("<div>").addClass("table-info").appendTo(bottom_block);
            info.addClass(o.clsTableInfo);
            if (o.showTableInfo !== true) {
                info.hide();
            }

            pagination = Metro.utils.isValue(this.wrapperPagination) ? this.wrapperPagination : $("<div>").addClass("table-pagination").appendTo(bottom_block);
            pagination.addClass(o.clsTablePagination);
            if (o.showPagination !== true) {
                pagination.hide();
            }

            skip = Metro.utils.isValue(this.wrapperSkip) ? this.wrapperSkip : $("<div>").appendTo(bottom_block);
            skip.addClass("table-skip").addClass(o.clsTableSkip);

            $(`<input type='text' data-role='input' placeholder="${strings.label_enter_page}">`).addClass("table-skip-input").addClass(o.clsTableSkipInput).appendTo(skip);
            $("<button>")
                .addClass("button table-skip-button")
                .addClass(o.clsTableSkipButton)
                .html(o.tableSkipTitle || strings.label_goto_page)
                .appendTo(skip);

            if (o.showSkip !== true) {
                skip.hide();
            }

            return bottom_block;
        },

        _createStructure: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            let columns;
            const w_search = $(o.searchWrapper);
            const w_info = $(o.infoWrapper);
            const w_rows = $(o.rowsWrapper);
            const w_paging = $(o.paginationWrapper);
            const w_skip = $(o.skipWrapper);

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
            if (w_skip.length > 0) {
                this.wrapperSkip = w_skip;
            }

            element.addClass(o.clsTable);

            this._createTableHeader();
            this._createTableBody();
            this._createTableFooter();

            this._createTopBlock();
            this._createBottomBlock();

            let need_sort = false;
            if (this.heads.length > 0)
                $.each(this.heads, function (i) {
                    if (!need_sort && ["asc", "desc"].indexOf(this.sortDir) > -1) {
                        need_sort = true;
                        that.sort.colIndex = i;
                        that.sort.dir = this.sortDir;
                    }
                });

            if (need_sort) {
                columns = element.find("thead th");
                this._resetSortClass(columns);
                $(columns.get(this.sort.colIndex + that.service.length)).addClass(`sort-${this.sort.dir}`);
                this.sorting();
            }

            let filter_func;

            if (Metro.utils.isValue(o.filters) && typeof o.filters === "string") {
                $.each(o.filters.toArray(), function () {
                    filter_func = Metro.utils.isFunc(this);
                    if (filter_func !== false) {
                        that.filtersIndexes.push(that.addFilter(filter_func));
                    }
                });
            }

            this.currentPage = 1;

            this._draw();
        },

        _resetSortClass: (el) => {
            $(el).removeClass("sort-asc sort-desc");
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const component = element.closest(".table-component");
            const table_container = component.find(".table-container");
            const search = component.find(".table-search-block input");
            const skip_button = o.skipWrapper ? $(o.skipWrapper).find(".table-skip-button") : component.find(".table-skip-button");
            const skip_input = o.skipWrapper ? $(o.skipWrapper).find(".table-skip-input") : component.find(".table-skip-input");
            let customSearch;
            const id = element.attr("id");
            const inspectorButton = component.find(".inspector-button");

            inspectorButton.on(Metro.events.click, () => {
                that.toggleInspector();
            });

            skip_button.on(Metro.events.click, () => {
                const skipTo = Number.parseInt(skip_input.val().trim());

                if (Number.isNaN(skipTo) || skipTo <= 0 || skipTo > that.pagesCount) {
                    skip_input.val("");
                    return false;
                }

                skip_input.val("");

                that._fireEvent("skip", {
                    skipTo: skipTo,
                    skipFrom: that.currentPage,
                });

                that.page(skipTo);
            });

            $(globalThis).on(
                Metro.events.resize,
                () => {
                    if (o.horizontalScroll === true) {
                        if (!Metro.utils.isNull(o.horizontalScrollStop) && Metro.utils.mediaExist(o.horizontalScrollStop)) {
                            table_container.removeClass("horizontal-scroll");
                        } else {
                            table_container.addClass("horizontal-scroll");
                        }
                    }
                },
                { ns: this.id },
            );

            element.on(Metro.events.click, ".sortable-column", function () {
                if (o.muteTable === true) element.addClass("disabled");

                if (that.busy) {
                    return false;
                }
                that.busy = true;

                const col = $(this);

                that.activity.show(() => {
                    setImmediate(() => {
                        that.currentPage = 1;
                        that.sort.colIndex = col.data("index");
                        if (!col.hasClass("sort-asc") && !col.hasClass("sort-desc")) {
                            that.sort.dir = o.sortDir;
                        } else {
                            if (col.hasClass("sort-asc")) {
                                that.sort.dir = "desc";
                            } else {
                                that.sort.dir = "asc";
                            }
                        }
                        that._resetSortClass(element.find(".sortable-column"));
                        col.addClass(`sort-${that.sort.dir}`);
                        that.sorting();
                        that._draw(() => {
                            that.busy = false;
                            if (o.muteTable === true) element.removeClass("disabled");
                        });
                    });
                });
            });

            element.on(Metro.events.click, ".table-service-check input", function () {
                const check = $(this);
                const status = check.is(":checked");
                const val = `${check.val()}`;
                const store_key = o.checkStoreKey.replace("$1", id);
                const storage = Metro.storage;
                let data = storage.getItem(store_key);
                const is_radio = check.attr("type") === "radio";

                if (is_radio) {
                    data = [];
                }

                if (status) {
                    if (!Metro.utils.isValue(data)) {
                        data = [val];
                    } else {
                        if (Array(data).indexOf(val) === -1) {
                            data.push(val);
                        }
                    }
                } else {
                    if (Metro.utils.isValue(data)) {
                        Metro.utils.arrayDelete(data, val);
                    } else {
                        data = [];
                    }
                }

                storage.setItem(store_key, data);

                that._fireEvent("check-click", {
                    check: this,
                    status: status,
                    data: data,
                });
            });

            element.on(Metro.events.click, ".table-service-check-all input", function () {
                const checked = $(this).is(":checked");
                const store_key = o.checkStoreKey.replace("$1", id);
                const storage = Metro.storage;
                let data = [];
                let stored_keys;

                if (o.useCurrentSlice === true) {
                    stored_keys = storage.getItem(store_key, []);

                    if (checked) {
                        $.each(that.currentSlice, function () {
                            if (stored_keys.indexOf(`${this[o.checkColIndex]}`) === -1) {
                                stored_keys.push(`${this[o.checkColIndex]}`);
                            }
                        });
                    } else {
                        $.each(that.currentSlice, function () {
                            const key = `${this[o.checkColIndex]}`;
                            if (stored_keys.indexOf(key) !== -1) {
                                Metro.utils.arrayDelete(stored_keys, key);
                            }
                        });
                    }
                    data = stored_keys;
                } else {
                    if (checked) {
                        $.each(that.filteredItems, function () {
                            if (data.indexOf(this[o.checkColIndex]) !== -1) return;
                            data.push(`${this[o.checkColIndex]}`);
                        });
                    } else {
                        data = [];
                    }
                }

                storage.setItem(store_key, data);

                that._draw();

                that._fireEvent("check-click-all", {
                    check: this,
                    status: checked,
                    data: data,
                });
            });

            let _search = function () {
                that.searchString = this.value.trim().toLowerCase();
                that.currentPage = 1;
                that._draw();
            };

            _search = Hooks.useDebounce(_search, o.searchThreshold);

            search.on(Metro.events.inputchange, _search);

            if (Metro.utils.isValue(this.wrapperSearch)) {
                customSearch = this.wrapperSearch.find("input");
                if (customSearch.length > 0) {
                    customSearch.on(Metro.events.inputchange, _search);
                }
            }

            function pageLinkClick(l) {
                const link = $(l);
                const item = link.parent();
                if (that.filteredItems.length === 0) {
                    return;
                }

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

            this._createInspectorEvents();

            element.on(Metro.events.click, ".js-table-crud-button", () => {});
        },

        _createInspectorEvents: function () {
            const that = this;
            const inspector = this.inspector;
            // Inspector event

            this._removeInspectorEvents();

            inspector.on(Metro.events.click, ".js-table-inspector-field-up", function () {
                const button = $(this);
                const tr = button.closest("tr");
                const tr_prev = tr.prev("tr");
                const index = tr.data("index");
                let index_view;
                if (tr_prev.length === 0) {
                    return;
                }
                tr.insertBefore(tr_prev);
                tr.addClass("flash");
                setTimeout(() => {
                    tr.removeClass("flash");
                }, 1000);
                index_view = tr.index();

                tr.data("index-view", index_view);
                that.view[index]["index-view"] = index_view;

                $.each(tr.nextAll(), function () {
                    const t = $(this);
                    index_view++;
                    t.data("index-view", index_view);
                    that.view[t.data("index")]["index-view"] = index_view;
                });

                that._createTableHeader();
                that._draw();
            });

            inspector.on(Metro.events.click, ".js-table-inspector-field-down", function () {
                const button = $(this);
                const tr = button.closest("tr");
                const tr_next = tr.next("tr");
                const index = tr.data("index");
                let index_view;
                if (tr_next.length === 0) {
                    return;
                }
                tr.insertAfter(tr_next);
                tr.addClass("flash");
                setTimeout(() => {
                    tr.removeClass("flash");
                }, 1000);
                index_view = tr.index();

                tr.data("index-view", index_view);
                that.view[index]["index-view"] = index_view;

                $.each(tr.prevAll(), function () {
                    const t = $(this);
                    index_view--;
                    t.data("index-view", index_view);
                    that.view[t.data("index")]["index-view"] = index_view;
                });

                that._createTableHeader();
                that._draw();
            });

            inspector.on(Metro.events.click, "input[type=checkbox]", function () {
                const check = $(this);
                const status = check.is(":checked");
                const index = check.val();
                const op = ["cls", "clsColumn"];

                if (status) {
                    $.each(op, function () {
                        const a = Metro.utils.isValue(that.heads[index][this]) ? that.heads[index][this].toArray(" ") : []
                        Metro.utils.arrayDelete(a, "hidden");
                        that.heads[index][this] = a.join(" ");
                        that.view[index].show = true;
                    });
                } else {
                    $.each(op, function () {
                        const a = Metro.utils.isValue(that.heads[index][this]) ? that.heads[index][this].toArray(" ") : [];
                        if (a.indexOf("hidden") === -1) {
                            a.push("hidden");
                        }
                        that.heads[index][this] = a.join(" ");
                        that.view[index].show = false;
                    });
                }

                that._createTableHeader();
                that._draw();
            });

            inspector.find("input[type=number]").on(Metro.events.inputchange, function () {
                const input = $(this);
                const index = input.attr("data-index");
                const val = Number.parseInt(input.val());

                that.view[index].size = val === 0 ? "" : val;

                that._createTableHeader();
            });

            inspector.on(Metro.events.click, ".js-table-inspector-save", () => {
                that._saveTableView();
                that.openInspector(false);
            });

            inspector.on(Metro.events.click, ".js-table-inspector-cancel", () => {
                that.openInspector(false);
            });

            inspector.on(Metro.events.click, ".js-table-inspector-reset", () => {
                that.resetView();
            });
        },

        _removeInspectorEvents: function () {
            const inspector = this.inspector;
            inspector.off(Metro.events.click, ".js-table-inspector-field-up");
            inspector.off(Metro.events.click, ".js-table-inspector-field-down");
            inspector.off(Metro.events.click, "input[type=checkbox]");
            inspector.off(Metro.events.click, ".js-table-inspector-save");
            inspector.off(Metro.events.click, ".js-table-inspector-cancel");
            inspector.off(Metro.events.click, ".js-table-inspector-reset");
            inspector.off(Metro.events.inputchange, "input[type=number]");
        },

        _saveTableView: function () {
            const element = this.element;
            const o = this.options;
            const view = this.view;
            const id = element.attr("id");
            const viewPath = o.viewSavePath.replace("$1", id);
            const storage = Metro.storage;

            if (o.viewSaveMode.toLowerCase() === "client") {
                storage.setItem(viewPath, view);

                this._fireEvent("view-save", {
                    target: "client",
                    path: o.viewSavePath,
                    view: view,
                });
            } else {
                const post_data = {
                    id: element.attr("id"),
                    view: view,
                };

                fetch(viewPath, {
                    method: "POST",
                    body: JSON.stringify(post_data),
                    header: {
                        "Content-type": "application/json;charset=utf-8",
                    },
                })
                    .then(Metro.fetch.status)
                    .then(Metro.fetch.text)
                    .then((data) => {
                        this._fireEvent("view-save", {
                            target: "server",
                            path: o.viewSavePath,
                            view: view,
                            post_data: post_data,
                            response: data,
                        });
                    })
                    .catch((error) => {
                        this._fireEvent("data-save-error", {
                            source: o.viewSavePath,
                            error: error,
                            post_data: post_data,
                        });
                    });
            }
        },

        _info: function (start, stop, length) {
            const element = this.element;
            const o = this.options;
            const strings = this.strings;
            const component = element.closest(".table-component");
            const info = Metro.utils.isValue(this.wrapperInfo) ? this.wrapperInfo : component.find(".table-info");
            let text;
            let _start = start;
            let _stop = stop; 
            let _length = length;

            if (info.length === 0) {
                return;
            }

            if (_stop > _length) {
                _stop = _length;
            }

            if (this.items.length === 0) {
                _start = _stop = _length = 0;
            }

            text = o.tableInfoTitle || strings.label_table_info;
            text = text.replace("$1", _start);
            text = text.replace("$2", _stop);
            text = text.replace("$3", _length);
            info.html(text);
        },

        _paging: function (length) {
            const element = this.element;
            const o = this.options;
            const strings = this.strings;
            const component = element.closest(".table-component");
            this.pagesCount = Math.ceil(length / o.rows); // Костыль
            Metro.pagination({
                length: length,
                rows: o.rows,
                current: this.currentPage,
                target: Metro.utils.isValue(this.wrapperPagination) ? this.wrapperPagination : component.find(".table-pagination"),
                claPagination: o.clsPagination,
                prevTitle: o.paginationPrevTitle || strings.label_prev,
                nextTitle: o.paginationNextTitle || strings.label_next,
                distance: o.paginationDistance,
                islandSize: o.paginationIslandSize,
                shortTrack: o.paginationShortTrack,
            });
        },

        _filter: function () {
            const o = this.options;
            let items;
            if ((Metro.utils.isValue(this.searchString) && this.searchString.length >= o.searchMinLength) || this.filters.length > 0) {
                items = this.items.filter((row) => {
                    let row_data = "";
                    let result;
                    let i;
                    let j = 0;

                    if (this.filters.length > 0) {
                        result = o.filtersOperator.toLowerCase() === "and";
                        for (i = 0; i < this.filters.length; i++) {
                            if (Metro.utils.isNull(this.filters[i])) continue;
                            j++;
                            result =
                                o.filtersOperator.toLowerCase() === "and"
                                    ? result && Metro.utils.exec(this.filters[i], [row, this.heads])
                                    : result || Metro.utils.exec(this.filters[i], [row, this.heads]);
                        }

                        if (j === 0) result = true;
                    } else {
                        result = true;
                    }

                    if (this.searchFields.length > 0) {
                        $.each(this.heads, (i, v) => {
                            if (this.searchFields.indexOf(v.name) > -1) {
                                row_data += `•${row[i]}`;
                            }
                        });
                    } else {
                        row_data = row.join("•");
                    }

                    row_data = row_data
                        .replace(/[\n\r]+|[\s]{2,}/g, " ")
                        .trim()
                        .toLowerCase();
                    const search_result = Metro.utils.isValue(this.searchString) && this.searchString.length >= o.searchMinLength ? ~row_data.indexOf(this.searchString) : true
                    result = result && search_result;

                    if (result) {
                        this._fireEvent("filter-row-accepted", {
                            row: row,
                        });
                    } else {
                        this._fireEvent("filter-row-declined", {
                            row: row,
                        });
                    }

                    return result;
                });
            } else {
                items = this.items;
            }

            this._fireEvent("search", {
                search: this.searchString,
                items: items,
            });

            this.filteredItems = items;

            return items;
        },

        _draw: function (cb) {
            const that = this;
            const element = this.element;
            const o = this.options;
            const strings = this.strings;
            const body = element.find("tbody");
            let i;
            let j;
            let tr;
            let td;
            let check;
            let cells;
            let tds;
            let is_even_row;
            const start = Number.parseInt(o.rows) === -1 ? 0 : o.rows * (this.currentPage - 1);
            const stop = Number.parseInt(o.rows) === -1 ? this.items.length - 1 : start + o.rows - 1;
            let items;
            let checkedItems = [];
            const stored_keys = Metro.storage.getItem(o.checkStoreKey.replace("$1", element.attr("id")));
            const view = o.staticView ? this.viewDefault : this.view;

            body.html("");

            if (!this.heads.length) {
                console.warn(`Heads is not defined for table ID ${element.attr("id")}`);
                return;
            }

            items = this._filter();

            this.currentSlice = items.slice(start, stop + 1);
            checkedItems = [];

            if (items.length > 0) {
                for (i = start; i <= stop; i++) {
                    cells = items[i];
                    tds = [];
                    if (!Metro.utils.isValue(cells)) {
                        continue;
                    }
                    tr = $("<tr>").addClass(o.clsBodyRow);
                    tr.data("original", cells);

                    // Rownum

                    is_even_row = i % 2 === 0;

                    td = $("<td>")
                        .attr("data-label", "#")
                        .attr("aria-label", "#")
                        .html(i + 1);
                    if (that.service[0].clsColumn !== undefined) {
                        td.addClass(that.service[0].clsColumn);
                    }
                    td.appendTo(tr);

                    // Checkbox
                    td = $("<td>")
                        .attr("data-label", "CHK")
                        .attr("aria-label", "CHK")
                    
                    if (o.checkType === "checkbox") {
                        check = $(
                            `<input type='checkbox' data-style='${o.checkStyle}' data-role='checkbox' name='${Metro.utils.isValue(o.checkName) ? o.checkName : "table_row_check"}[]' value='${items[i][o.checkColIndex]}'>`,
                        );
                    } else {
                        check = $(
                            `<input type='radio' data-style='${o.checkStyle}' data-role='radio' name='${Metro.utils.isValue(o.checkName) ? o.checkName : "table_row_check"}' value='${items[i][o.checkColIndex]}'>`,
                        );
                    }

                    if (Metro.utils.isValue(stored_keys) && Array.isArray(stored_keys) && stored_keys.indexOf(`${items[i][o.checkColIndex]}`) > -1) {
                        check.prop("checked", true);
                        checkedItems.push(cells);
                    }

                    check.addClass("table-service-check");

                    this._fireEvent("check-draw", {
                        check: check,
                    });

                    check.appendTo(td);
                    if (that.service[1].clsColumn !== undefined) {
                        td.addClass(that.service[1].clsColumn);
                    }
                    td.appendTo(tr);
                    // End of check

                    for (j = 0; j < cells.length; j++) {
                        tds[j] = null;
                    }

                    $.each(cells, function (cell_index) {
                        let val = this;
                        const td = $("<td>")
                            .attr("data-label", that.heads[cell_index].title)
                            .attr("aria-label", that.heads[cell_index].title);

                        if (Metro.utils.isValue(that.heads[cell_index].template)) {
                            val = that.heads[cell_index].template.replace(/%VAL%/g, val);
                        }

                        td.html(val);

                        td.addClass(o.clsBodyCell);
                        if (Metro.utils.isValue(that.heads[cell_index].clsColumn)) {
                            td.addClass(that.heads[cell_index].clsColumn);
                        }

                        if (Metro.utils.bool(view[cell_index].show) === false) {
                            td.addClass("hidden");
                        }

                        if (Metro.utils.bool(view[cell_index].show)) {
                            td.removeClass("hidden");
                        }

                        td.data("original", this);

                        tds[view[cell_index]["index-view"]] = td;

                        that._fireEvent("draw-cell", {
                            td: td,
                            val: val,
                            cellIndex: cell_index,
                            head: that.heads[cell_index],
                            items: cells,
                        });

                        if (o.cellWrapper === true) {
                            val = $("<div>").addClass("data-wrapper").addClass(o.clsCellWrapper).html(td.html());
                            td.html("").append(val);
                        }
                    });

                    for (j = 0; j < cells.length; j++) {
                        tds[j].appendTo(tr);

                        that._fireEvent("append-cell", {
                            td: tds[j],
                            tr: tr,
                            index: j,
                        });
                    }

                    that._fireEvent("draw-row", {
                        tr: tr,
                        view: that.view,
                        heads: that.heads,
                        items: cells,
                    });

                    tr.addClass(o.clsRow)
                        .addClass(is_even_row ? o.clsEvenRow : o.clsOddRow)
                        .appendTo(body);

                    that._fireEvent("append-row", {
                        tr: tr,
                    });
                }

                $(this.component).find(".table-service-check-all input").prop("checked", checkedItems.length);
            } else {
                j = 0;
                $.each(view, function () {
                    if (this.show) j++;
                });
                if (o.check === true) {
                    j++;
                }
                if (o.rownum === true) {
                    j++;
                }
                tr = $("<tr>").addClass(o.clsBodyRow).appendTo(body);
                td = $("<td>")
                    .attr("colspan", j)
                    .addClass("text-center")
                    .html(
                        $("<span>")
                            .addClass(o.clsEmptyTableTitle)
                            .html(o.emptyTableTitle || strings.label_empty),
                    );
                td.appendTo(tr);
            }

            this._info(start + 1, stop + 1, items.length);
            this._paging(items.length);

            if (this.activity) this.activity.hide();

            this._fireEvent("draw");

            if (cb !== undefined) {
                Metro.utils.exec(cb, null, element[0]);
            }
        },

        _getItemContent: function (row) {
            const o = this.options;
            const locale = this.locale;
            let result;
            const col = row[this.sort.colIndex];
            const format = this.heads[this.sort.colIndex].format;
            const formatMask =
                !Metro.utils.isNull(this.heads) && !Metro.utils.isNull(this.heads[this.sort.colIndex]) && Metro.utils.isValue(this.heads[this.sort.colIndex].formatMask)
                    ? this.heads[this.sort.colIndex].formatMask
                    : "%Y-%m-%d";
            const thousandSeparator =
                this.heads?.[this.sort.colIndex] && this.heads[this.sort.colIndex].thousandSeparator
                    ? this.heads[this.sort.colIndex].thousandSeparator
                    : o.thousandSeparator;
            const decimalSeparator =
                this.heads?.[this.sort.colIndex] && this.heads[this.sort.colIndex].decimalSeparator
                    ? this.heads[this.sort.colIndex].decimalSeparator
                    : o.decimalSeparator;

            result = (`${col}`)
                .toLowerCase()
                .replace(/[\n\r]+|[\s]{2,}/g, " ")
                .trim();

            if (Metro.utils.isValue(result) && Metro.utils.isValue(format)) {
                if (["number", "int", "float", "money"].indexOf(format) !== -1) {
                    result = Metro.utils.parseNumber(result, thousandSeparator, decimalSeparator);
                }

                switch (format) {
                    case "date":
                        result = formatMask ? Datetime.from(result, formatMask, locale) : datetime(result);
                        break;
                    case "number":
                        result = +result;
                        break;
                    case "int":
                        result = Number.parseInt(result);
                        break;
                    case "float":
                        result = Number.parseFloat(result);
                        break;
                    case "money":
                        result = Metro.utils.parseMoney(result);
                        break;
                    case "card":
                        result = Metro.utils.parseCard(result);
                        break;
                    case "phone":
                        result = Metro.utils.parsePhone(result);
                        break;
                }
            }

            return result;
        },

        addItem: function (item, redraw) {
            if (!Array.isArray(item)) {
                console.warn("Item is not an array and can't be added");
                return this;
            }
            this.items.push(item);
            if (redraw !== false) this.draw();
        },

        addItems: function (items, redraw) {
            if (!Array.isArray(items)) {
                console.warn("Items is not an array and can't be added");
                return this;
            }
            for (const item of items) {
                if (Array.isArray(item)) this.items.push(item, false);
            }
            this.draw();
            if (redraw !== false) this.draw();
        },

        updateItem: function (key, field, value) {
            const item = this.items[this.index[key]];
            let fieldIndex = null;
            if (Metro.utils.isNull(item)) {
                console.warn("Item is undefined for update");
                return this;
            }
            if (Number.isNaN(field)) {
                this.heads.forEach((v, i) => {
                    if (v.name === field) {
                        fieldIndex = i;
                    }
                });
            }
            if (Metro.utils.isNull(fieldIndex)) {
                console.warn(`Item is undefined for update. Field ${field} not found in data structure`);
                return this;
            }

            item[fieldIndex] = value;
            this.items[this.index[key]] = item;
            return this;
        },

        getItem: function (key) {
            return this.items[this.index[key]];
        },

        deleteItem: function (fieldIndex, value) {
            let i;
            const deleteIndexes = [];
            const is_func = Metro.utils.isFunc(value);
            for (i = 0; i < this.items.length; i++) {
                if (is_func) {
                    if (Metro.utils.exec(value, [this.items[i][fieldIndex]])) {
                        deleteIndexes.push(i);
                    }
                } else {
                    if (this.items[i][fieldIndex] === value) {
                        deleteIndexes.push(i);
                    }
                }
            }

            this.items = Metro.utils.arrayDeleteByMultipleKeys(this.items, deleteIndexes);

            return this;
        },

        deleteItemByName: function (fieldName, value) {
            let i;
            let fieldIndex;
            const deleteIndexes = [];
            const is_func = Metro.utils.isFunc(value);

            for (i = 0; i < this.heads.length; i++) {
                if (this.heads[i].name === fieldName) {
                    fieldIndex = i;
                    break;
                }
            }

            for (i = 0; i < this.items.length; i++) {
                if (is_func) {
                    if (Metro.utils.exec(value, [this.items[i][fieldIndex]])) {
                        deleteIndexes.push(i);
                    }
                } else {
                    if (this.items[i][fieldIndex] === value) {
                        deleteIndexes.push(i);
                    }
                }
            }

            this.items = Metro.utils.arrayDeleteByMultipleKeys(this.items, deleteIndexes);

            return this;
        },

        draw: function () {
            this._draw();
            return this;
        },

        sorting: function (dir) {
            if (Metro.utils.isValue(dir)) {
                this.sort.dir = dir;
            }

            this._fireEvent("sort-start", {
                items: this.items,
            });

            this.items.sort((a, b) => {
                const c1 = this._getItemContent(a);
                const c2 = this._getItemContent(b);
                let result = 0;

                if (c1 < c2) {
                    result = this.sort.dir === "asc" ? -1 : 1;
                }
                if (c1 > c2) {
                    result = this.sort.dir === "asc" ? 1 : -1;
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

            return this;
        },

        search: function (val) {
            this.searchString = val.trim().toLowerCase();
            this.currentPage = 1;
            this._draw();
            return this;
        },

        _rebuild: function (review) {
            const that = this;
            const element = this.element;
            let need_sort = false;
            let sortable_columns;

            this._createIndex();

            if (review === true) {
                this.view = this._createView();
            }

            this._createTableHeader();
            this._createTableBody();
            this._createTableFooter();

            if (this.heads.length > 0)
                $.each(this.heads, function (i) {
                    if (!need_sort && ["asc", "desc"].indexOf(this.sortDir) > -1) {
                        need_sort = true;
                        that.sort.colIndex = i;
                        that.sort.dir = this.sortDir;
                    }
                });

            if (need_sort) {
                sortable_columns = element.find(".sortable-column");
                this._resetSortClass(sortable_columns);
                $(sortable_columns.get(that.sort.colIndex)).addClass(`sort-${that.sort.dir}`);
                this.sorting();
            }

            that.currentPage = 1;

            that._draw();
        },

        setHeads: function (data) {
            this.heads = data;
            return this;
        },

        setHeadItem: function (name, data) {
            let i;
            let index;
            for (i = 0; i < this.heads.length; i++) {
                if (this.heads[i].name === name) {
                    index = i;
                    break;
                }
            }
            this.heads[index] = data;
            return this;
        },

        setItems: function (data) {
            this.items = data;
            return this;
        },

        setData: function (/*obj*/ data) {
            const o = this.options;

            this.activity.show(() => {
                this.items = [];
                this.heads = [];
                this.foots = [];

                if (Array.isArray(o.head)) {
                    this.heads = o.head;
                }

                if (Array.isArray(o.body)) {
                    this.items = o.body;
                }

                this._createItemsFromJSON(data);

                this._rebuild(true);

                this.activity.hide();
            });

            return this;
        },

        loadData: function (source, review = true) {
            const element = this.element;
            const o = this.options;

            element.html("");

            if (!Metro.utils.isValue(source)) {
                this._rebuild(review);
            } else {
                o.source = source;

                this._fireEvent("data-load", {
                    source: o.source,
                });

                this.activity.show(() => {
                    fetch(o.source)
                        .then(Metro.fetch.status)
                        .then(Metro.fetch.json)
                        .then((data) => {
                            this.activity.hide();
                            this.items = [];
                            this.heads = [];
                            this.foots = [];

                            this._fireEvent("data-loaded", {
                                source: o.source,
                                data: data,
                            });

                            if (Array.isArray(o.head)) {
                                this.heads = o.head;
                            }

                            if (Array.isArray(o.body)) {
                                this.items = o.body;
                            }

                            this._createItemsFromJSON(data);
                            this._rebuild(review);
                            this._resetInspector();

                            this._fireEvent("data-load-end", {
                                source: o.source,
                                data: data,
                            });
                        })
                        .catch((error) => {
                            this.activity.hide();
                            this._fireEvent("data-load-error", {
                                source: o.source,
                                error: error,
                            });
                        });
                });
            }
        },

        reload: function (review) {
            this.loadData(this.options.source, review);
        },

        clear: function () {
            this.items = [];
            return this.draw();
        },

        next: function () {
            if (this.items.length === 0) return;
            this.currentPage++;
            if (this.currentPage > this.pagesCount) {
                this.currentPage = this.pagesCount;
                return;
            }
            this._draw();
            return this;
        },

        prev: function () {
            if (this.items.length === 0) return;
            this.currentPage--;
            if (this.currentPage === 0) {
                this.currentPage = 1;
                return;
            }
            this._draw();
            return this;
        },

        first: function () {
            if (this.items.length === 0) return;
            this.currentPage = 1;
            this._draw();
            return this;
        },

        last: function () {
            if (this.items.length === 0) return;
            this.currentPage = this.pagesCount;
            this._draw();
            return this;
        },

        page: function (num) {
            let _num = num
            
            if (_num <= 0) {
                _num = 1;
            }

            if (_num > this.pagesCount) {
                _num = this.pagesCount;
            }

            this.currentPage = _num;
            this._draw();
            return this;
        },

        addFilter: function (f, redraw) {
            let filterIndex = null;
            let i;
            const func = Metro.utils.isFunc(f);
            if (func === false) {
                return;
            }

            for (i = 0; i < this.filters.length; i++) {
                if (Metro.utils.isNull(this.filters[i])) {
                    filterIndex = i;
                    this.filters[i] = func;
                    break;
                }
            }

            if (Metro.utils.isNull(filterIndex)) {
                this.filters.push(func);
                filterIndex = this.filters.length - 1;
            }

            if (redraw === true) {
                this.currentPage = 1;
                this.draw();
            }

            return filterIndex;
        },

        removeFilter: function (key, redraw) {
            this.filters[key] = null;
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
            return this;
        },

        getItems: function () {
            return this.items;
        },

        getHeads: function () {
            return this.heads;
        },

        getView: function () {
            return this.view;
        },

        getFilteredItems: function () {
            return this.filteredItems.length > 0 ? this.filteredItems : this.items;
        },

        getSelectedItems: function () {
            const element = this.element;
            const o = this.options;
            const stored_keys = Metro.storage.getItem(o.checkStoreKey.replace("$1", element.attr("id")));
            const selected = [];

            if (!Metro.utils.isValue(stored_keys)) {
                return [];
            }

            $.each(this.items, function () {
                if (stored_keys.indexOf(`${this[o.checkColIndex]}`) !== -1) {
                    selected.push(this);
                }
            });
            return selected;
        },

        getStoredKeys: function () {
            const element = this.element;
            const o = this.options;
            return Metro.storage.getItem(o.checkStoreKey.replace("$1", element.attr("id")), []);
        },

        clearSelected: function (redraw) {
            const element = this.element;
            const o = this.options;
            Metro.storage.setItem(o.checkStoreKey.replace("$1", element.attr("id")), []);
            element.find("table-service-check-all input").prop("checked", false);
            if (redraw === true) this._draw();
        },

        getFilters: function () {
            return this.filters;
        },

        getFiltersIndexes: function () {
            return this.filtersIndexes;
        },

        openInspector: function (mode) {
            const ins = this.inspector;
            if (mode) {
                ins.show(0, () => {
                    ins.css({
                        top: ($(globalThis).height() - ins.outerHeight(true)) / 2 + pageYOffset,
                        left: ($(globalThis).width() - ins.outerWidth(true)) / 2 + pageXOffset,
                    }).data("open", true);
                });
            } else {
                ins.hide().data("open", false);
            }
        },

        closeInspector: function () {
            this.openInspector(false);
        },

        toggleInspector: function () {
            this.openInspector(!this.inspector.data("open"));
        },

        resetView: function () {
            this.view = this._createView();

            this._createTableHeader();
            this._createTableFooter();
            this._draw();

            this._resetInspector();
            this._saveTableView();
        },

        rebuildIndex: function () {
            this._createIndex();
        },

        getIndex: function () {
            return this.index;
        },

        export: function (to, mode, filename, options) {
            const Export = Metro.export;
            const that = this;
            const o = this.options;
            const table = document.createElement("table");
            const head = $("<thead>").appendTo(table);
            const body = $("<tbody>").appendTo(table);
            let i;
            let j;
            let cells;
            const tds = [];
            let items;
            let tr;
            let td;
            let start;
            let stop;

            if (typeof Export.tableToCSV !== "function") {
                return;
            }

            const _mode = Metro.utils.isValue(mode) ? mode.toLowerCase() : "all-filtered";
            const _filename = Metro.utils.isValue(filename) ? filename : `${element.id() || Hooks.useId()}-export.csv`;

            // Create table header
            tr = $("<tr>");
            cells = this.heads;

            for (j = 0; j < cells.length; j++) {
                tds[j] = null;
            }

            $.each(cells, function (cell_index) {
                if (Metro.utils.bool(that.view[cell_index].show) === false) {
                    return;
                }
                td = $("<th>");
                if (Metro.utils.isValue(this.title)) {
                    td.html(this.title);
                }
                tds[that.view[cell_index]["index-view"]] = td;
            });

            for (j = 0; j < cells.length; j++) {
                if (Metro.utils.isValue(tds[j])) tds[j].appendTo(tr);
            }
            tr.appendTo(head);

            switch (_mode) {
                case "checked": {
                    items = this.getSelectedItems();
                    start = 0;
                    stop = items.length - 1;
                    break;                    
                }
                case "view": {
                    items = this._filter();
                    start = Number.parseInt(o.rows) === -1 ? 0 : o.rows * (this.currentPage - 1);
                    stop = Number.parseInt(o.rows) === -1 ? items.length - 1 : start + o.rows - 1;
                    break;
                }
                case "all": {
                    items = this.items;
                    start = 0;
                    stop = items.length - 1;
                    break;
                }
                default: {
                    items = this._filter();
                    start = 0;
                    stop = items.length - 1;
                }
            }

            for (i = start; i <= stop; i++) {
                if (Metro.utils.isValue(items[i])) {
                    tr = $("<tr>");

                    cells = items[i];

                    for (j = 0; j < cells.length; j++) {
                        tds[j] = null;
                    }

                    $.each(cells, function (cell_index) {
                        if (Metro.utils.bool(that.view[cell_index].show) === false) {
                            return;
                        }
                        td = $("<td>").html(this);
                        tds[that.view[cell_index]["index-view"]] = td;
                    });

                    for (j = 0; j < cells.length; j++) {
                        if (Metro.utils.isValue(tds[j])) tds[j].appendTo(tr);
                    }

                    tr.appendTo(body);
                }
            }

            // switch (to) {
            //     default: Export.tableToCSV(table, filename, options);
            // }
            Export.tableToCSV(table, _filename, options);
            table.remove();
        },

        changeAttribute: function (attributeName) {
            const that = this;
            const element = this.element;
            const o = this.options;

            function dataCheck() {
                o.check = Metro.utils.bool(element.attr("data-check"));
                that._service();
                that._createTableHeader();
                that._draw();
            }

            function dataRownum() {
                o.rownum = Metro.utils.bool(element.attr("data-rownum"));
                that._service();
                that._createTableHeader();
                that._draw();
            }

            switch (attributeName) {
                case "data-check":
                    dataCheck();
                    break;
                case "data-rownum":
                    dataRownum();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;
            const component = element.closest(".table-component");
            const search_input = component.find("input");
            const rows_select = component.find("select");

            search_input.data("input").destroy();
            rows_select.data("select").destroy();

            $(globalThis).off(Metro.events.resize, { ns: this.id });

            element.off(Metro.events.click, ".sortable-column");

            element.off(Metro.events.click, ".table-service-check input");

            element.off(Metro.events.click, ".table-service-check-all input");

            search_input.off(Metro.events.inputchange);

            if (Metro.utils.isValue(this.wrapperSearch)) {
                const customSearch = this.wrapperSearch.find("input");
                if (customSearch.length > 0) {
                    customSearch.off(Metro.events.inputchange);
                }
            }

            component.off(Metro.events.click, ".pagination .page-link");
            if (Metro.utils.isValue(this.wrapperPagination)) {
                this.wrapperPagination.off(Metro.events.click, ".pagination .page-link");
            }
            element.off(Metro.events.click, ".js-table-crud-button");

            this._removeInspectorEvents();

            return element;
        },
    });
})(Metro, Dom);
