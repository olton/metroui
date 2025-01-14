/** @format */

/*
    * type - rownum, rowcheck, data
    * */
var TABLE_COL_OPTIONS = {
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

;(function (Metro, $) {
    "use strict";
    
    var Utils = Metro.utils;
    var TableDefaultConfig = {
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

    Metro.tableSetup = function (options) {
        TableDefaultConfig = $.extend({}, TableDefaultConfig, options);
    };

    if (typeof globalThis["metroTableSetup"] !== undefined) {
        Metro.tableSetup(globalThis["metroTableSetup"]);
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
                id: Utils.elementId("table"),
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
            var that = this,
                element = this.element,
                o = this.options;
            var id = Utils.elementId("table");
            var table_component, table_container, activity;
            
            if (!element.id()) {
                console.warn(`To use all table component features, please set an ID for the table element!`);
                element.id(id);
            }

            if (Utils.isValue(o.searchFields)) {
                this.searchFields = o.searchFields.toArray();
            }

            if (Utils.isValue(o.head)) {
                var _head = o.head;
                o.head = Utils.isObject(o.head);
                if (!o.head) {
                    console.warn("Head " + _head + " defined but not exists!");
                    o.head = null;
                }
            }

            if (Utils.isValue(o.body)) {
                var _body = o.body;
                o.body = Utils.isObject(o.body);
                if (!o.body) {
                    console.warn("Body " + _body + " defined but not exists!");
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

            table_component = $("<div>").addClass("table-component");
            table_component.insertBefore(element);

            table_container = $("<div>").addClass("table-container").addClass(o.clsTableContainer).appendTo(table_component);
            element.appendTo(table_container);

            if (o.horizontalScroll === true) {
                table_container.addClass("horizontal-scroll");
            }
            if (!Utils.isNull(o.horizontalScrollStop) && Utils.mediaExist(o.horizontalScrollStop)) {
                table_container.removeClass("horizontal-scroll");
            }

            table_component.addClass(o.clsComponent);

            this.activity = $("<div>").addClass("table-progress").appendTo(table_component);

            activity = $("<div>").appendTo(this.activity);
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

                var objSource = Utils.isObject(o.source);

                if (objSource !== false && $.isPlainObject(objSource)) {
                    that._build(objSource);
                } else {
                    this.activity.show(function () {
                        fetch(o.source)
                            .then(Metro.fetch.status)
                            .then(Metro.fetch.json)
                            .then(function (data) {
                                that.activity.hide();
                                if (typeof data !== "object") {
                                    throw new Error("Data for table is not a object");
                                }

                                that._fireEvent("data-loaded", {
                                    source: o.source,
                                    data: data,
                                });

                                that._build(data);
                            })
                            .catch(function (error) {
                                that.activity.hide();

                                that._fireEvent("data-load-error", {
                                    source: o.source,
                                    error: error,
                                });
                            });
                    });
                }
            } else {
                that._build();
            }
        },

        _createIndex: function () {
            var that = this,
                colIndex = this.options.checkColIndex;
            setImmediate(function () {
                that.items.forEach(function (v, i) {
                    that.index[v[colIndex]] = i;
                });
            });
        },

        _build: function (data) {
            var that = this,
                element = this.element,
                o = this.options;
            var view,
                id = element.attr("id"),
                viewPath;

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

            if (Utils.isValue(data)) {
                this._createItemsFromJSON(data);
            } else {
                this._createItemsFromHTML();
            }

            // Create index
            this._createIndex();

            this.view = this._createView();
            this.viewDefault = Utils.objectClone(this.view);

            viewPath = o.viewSavePath.replace("$1", id);

            if (o.viewSaveMode.toLowerCase() === "client") {
                view = Metro.storage.getItem(viewPath);
                if (Utils.isValue(view) && Utils.objectLength(view) === Utils.objectLength(this.view)) {
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
                    .then(function (view) {
                        if (Utils.isValue(view) && Utils.objectLength(view) === Utils.objectLength(that.view)) {
                            that.view = view;
                            that._fireEvent("view-get", {
                                source: "server",
                                view: view,
                            });
                        }
                        that._final();
                    })
                    .catch(function (error) {
                        that._final();
                        console.warn("Warning! Error loading view for table " + element.attr("id") + ": " + error);
                    });
            }
        },

        _final: function () {
            var element = this.element,
                o = this.options;
            var id = element.attr("id");

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
            var o = this.options;

            this.service = [
                {
                    // Rownum
                    ...TABLE_COL_OPTIONS,
                    title: o.rownumTitle,
                    clsColumn: "rownum-cell " + (o.rownum !== true ? "d-none" : ""),
                    cls: "rownum-cell " + (o.rownum !== true ? "d-none" : ""),
                    type: "rownum",
                },
                {
                    // Checkbox
                    ...TABLE_COL_OPTIONS,
                    title:
                        o.checkType === "checkbox"
                            ? "<input type='checkbox' data-role='checkbox' class='table-service-check-all' data-style='" + o.checkStyle + "'>"
                            : "",
                    clsColumn: "check-cell " + (o.check !== true ? "d-none" : ""),
                    cls: "check-cell " + (o.check !== true ? "d-none" : ""),
                    type: "rowcheck",
                },
            ];
        },

        _createView: function () {
            var view;

            view = {};

            $.each(this.heads, function (i) {
                if (Utils.isValue(this.cls)) {
                    this.cls = this.cls.replace("hidden", "");
                }
                if (Utils.isValue(this.clsColumn)) {
                    this.clsColumn = this.clsColumn.replace("hidden", "");
                }

                view[i] = {
                    index: i,
                    "index-view": i,
                    show: !Utils.isValue(this.show) ? true : this.show,
                    size: Utils.isValue(this.size) ? this.size : "",
                };
            });

            this._fireEvent("view-created", {
                view: view,
            });

            return view;
        },

        _createInspectorItems: function (table) {
            var that = this,
                o = this.options;
            var j,
                tds = [],
                row;
            var cells = this.heads;

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
                        "<input type='checkbox' data-style='" +
                            o.checkStyle +
                            "' data-role='checkbox' name='column_show_check[]' value='" +
                            i +
                            "' " +
                            (Utils.bool(that.view[i]["show"]) ? "checked" : "") +
                            ">",
                    )
                    .appendTo(row);
                $("<td>").html(`<div>${this.title}</div>`).appendTo(row);
                $("<td>")
                    .html("<input type='number' data-role='spinner' name='column_size' value='" + that.view[i]["size"] + "' data-index='" + i + "'>")
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
            var o = this.options,
                strings = this.strings;
            var inspector, table_wrap, table, tbody, actions;

            inspector = $("<div data-role='draggable' data-drag-element='.table-inspector-header' data-drag-area='body'>").addClass("table-inspector");
            inspector.attr("for", this.element.attr("id"));

            $("<div class='table-inspector-header'>" + (o.inspectorTitle || strings.label_inspector) + "</div>").appendTo(inspector);

            table_wrap = $("<div>").addClass("table-wrap").appendTo(inspector);

            table = $("<table>").addClass("table subcompact");
            tbody = $("<tbody>").appendTo(table);

            table.appendTo(table_wrap);

            this._createInspectorItems(tbody);

            actions = $("<div class='table-inspector-actions'>").appendTo(inspector);
            $("<button class='button primary js-table-inspector-save' type='button'>").html(strings.label_save).appendTo(actions);
            $("<button class='button secondary js-table-inspector-reset ml-2 mr-2' type='button'>").html(strings.label_reset).appendTo(actions);
            $("<button class='button link js-table-inspector-cancel place-right' type='button'>").html(strings.label_cancel).appendTo(actions);

            inspector.data("open", false);
            this.inspector = inspector;

            $("body").append(inspector);

            this._createInspectorEvents();
        },

        _resetInspector: function () {
            var inspector = this.inspector;
            var table = inspector.find("table tbody");
            this._createInspectorItems(table);
            this._createInspectorEvents();
        },

        _createHeadsFromHTML: function () {
            var that = this,
                element = this.element;
            var head = element.find("thead");

            if (head.length > 0) {
                $.each(head.find("tr > *"), function () {
                    var item = $(this);
                    var dir, head_item, item_class;

                    if (item.hasClass("rownum-cell") || item.hasClass("check-cell")) return;

                    if (Utils.isValue(item.data("sort-dir"))) {
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

                    head_item = {
                        type: "data",
                        title: item.html(),
                        name: Utils.isValue(item.data("name")) ? item.data("name") : item.text().replace(" ", "_"),
                        sortable: item.hasClass("sortable-column") || (Utils.isValue(item.data("sortable")) && JSON.parse(item.data("sortable")) === true),
                        sortDir: dir,
                        format: Utils.isValue(item.data("format")) ? item.data("format") : "string",
                        formatMask: Utils.isValue(item.data("format-mask")) ? item.data("format-mask") : null,
                        clsColumn: Utils.isValue(item.data("cls-column")) ? item.data("cls-column") : "",
                        cls: item_class,
                        colspan: item.attr("colspan"),
                        size: Utils.isValue(item.data("size")) ? item.data("size") : "",
                        show: !(item.hasClass("hidden") || (Utils.isValue(item.data("show")) && JSON.parse(item.data("show")) === false)),

                        required: Utils.isValue(item.data("required")) ? JSON.parse(item.data("required")) === true : false,
                        field: Utils.isValue(item.data("field")) ? item.data("field") : "input",
                        fieldType: Utils.isValue(item.data("field-type")) ? item.data("field-type") : "text",
                        validator: Utils.isValue(item.data("validator")) ? item.data("validator") : null,

                        template: Utils.isValue(item.data("template")) ? item.data("template") : null,
                    };
                    that.heads.push(head_item);
                });
                // head.clear();
            }
        },

        _createFootsFromHTML: function () {
            var that = this,
                element = this.element;
            var foot = element.find("tfoot");

            if (foot.length > 0)
                $.each(foot.find("tr > *"), function () {
                    var item = $(this);
                    var foot_item;

                    foot_item = {
                        title: item.html(),
                        name: Utils.isValue(item.data("name")) ? item.data("name") : false,
                        cls: item[0].className,
                        colspan: item.attr("colspan"),
                    };

                    that.foots.push(foot_item);
                });
        },

        _createItemsFromHTML: function () {
            var that = this,
                element = this.element;
            var body = element.find("tbody");

            if (body.length > 0)
                $.each(body.find("tr"), function () {
                    var row = $(this);
                    var tr = [];
                    $.each(row.children("td"), function () {
                        var td = $(this);
                        tr.push(td.html());
                    });
                    that.items.push(tr);
                });

            this._createHeadsFromHTML();
            this._createFootsFromHTML();
        },

        _createItemsFromJSON: function (source) {
            var that = this;

            if (typeof source === "string") {
                source = JSON.parse(source);
            }

            if (source.header !== undefined) {
                that.heads = source.header;
            } else {
                this._createHeadsFromHTML();
            }

            if (source.data !== undefined) {
                $.each(source.data, function () {
                    var row = this;
                    var tr = [];
                    $.each(row, function () {
                        var td = this;
                        tr.push(td);
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
            var element = this.element,
                o = this.options;
            var head = element.find("thead");
            var tr,
                th,
                tds = [],
                j,
                cells;
            var view = o.staticView ? this._createView() : this.view;

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
                var item = this,
                    classes = [];
                var th = $("<th>");
                if (Utils.isValue(item.title)) {
                    th.html(item.title);
                }
                if (Utils.isValue(item.size)) {
                    th.css({ width: item.size });
                }
                if (Utils.isValue(item.cls)) {
                    classes.push(item.cls);
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
                var item = this;
                var classes = [];

                var th = $("<th>");
                th.data("index", cell_index);

                if (Utils.isValue(item.title)) {
                    th.html(item.title);
                }
                if (Utils.isValue(item.format)) {
                    th.attr("data-format", item.format);
                }
                if (Utils.isValue(item.formatMask)) {
                    th.attr("data-format-mask", item.formatMask);
                }
                if (Utils.isValue(item.name)) {
                    th.attr("data-name", item.name);
                }
                if (Utils.isValue(item.colspan)) {
                    th.attr("colspan", item.colspan);
                }
                if (Utils.isValue(item.size)) {
                    th.attr("data-size", item.size);
                }
                if (Utils.isValue(item.sortable)) {
                    th.attr("data-sortable", item.sortable);
                }
                if (Utils.isValue(item.sortDir)) {
                    th.attr("data-sort-dir", item.sortDir);
                }
                if (Utils.isValue(item.clsColumn)) {
                    th.attr("data-cls-column", item.clsColumn);
                }
                if (Utils.isValue(item.cls)) {
                    th.attr("data-cls", item.cls);
                }
                if (Utils.isValue(item.show)) {
                    th.attr("data-show", item.show);
                }
                if (Utils.isValue(item.required)) {
                    th.attr("data-required", item.required);
                }
                if (Utils.isValue(item.field)) {
                    th.attr("data-field", item.field);
                }
                if (Utils.isValue(item.fieldType)) {
                    th.attr("data-field-type", item.fieldType);
                }
                if (Utils.isValue(item.validator)) {
                    th.attr("data-validator", item.validator);
                }
                if (Utils.isValue(item.template)) {
                    th.attr("data-template", item.template);
                }
                if (Utils.isValue(view[cell_index]["size"])) {
                    th.css({ width: view[cell_index]["size"] });
                }
                if (item.sortable === true) {
                    classes.push("sortable-column");

                    if (Utils.isValue(item.sortDir)) {
                        classes.push("sort-" + item.sortDir);
                    }
                }
                if (Utils.isValue(item.cls)) {
                    $.each(item.cls.toArray(), function () {
                        classes.push(this);
                    });
                }
                if (Utils.bool(view[cell_index]["show"]) === false) {
                    if (classes.indexOf("hidden") === -1) classes.push("hidden");
                }

                classes.push(o.clsHeadCell);

                if (Utils.bool(view[cell_index]["show"])) {
                    Utils.arrayDelete(classes, "hidden");
                }

                th.addClass(classes.join(" "));

                tds[view[cell_index]["index-view"]] = th;
            });

            for (j = 0; j < cells.length; j++) {
                tds[j].appendTo(tr);
            }
        },

        _createTableBody: function () {
            var body,
                head,
                element = this.element;

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
            var element = this.element,
                o = this.options;
            var foot = element.find("tfoot");
            var tr, th;

            if (foot.length === 0) {
                foot = $("<tfoot>").appendTo(element);
            }

            foot.clear().addClass(o.clsFooter);

            if (this.foots.length === 0) {
                return;
            }

            tr = $("<tr>").addClass(o.clsHeadRow).appendTo(foot);
            $.each(this.foots, function () {
                var item = this;
                th = $("<th>").appendTo(tr);

                if (item.title !== undefined) {
                    th.html(item.title);
                }

                if (item.name !== undefined) {
                    th.addClass("foot-column-name-" + item.name);
                }

                if (item.cls !== undefined) {
                    th.addClass(item.cls);
                }

                if (Utils.isValue(item.colspan)) {
                    th.attr("colspan", item.colspan);
                }

                th.appendTo(tr);
            });
        },

        _createTopBlock: function () {
            var that = this,
                element = this.element,
                o = this.options,
                strings = this.strings;
            var top_block = $("<div>").addClass("table-top").addClass(o.clsTableTop).insertBefore(element.parent());
            var search_block, search_input, rows_block, rows_select;

            search_block = Utils.isValue(this.wrapperSearch)
                ? this.wrapperSearch
                : $("<div>").addClass("table-search-block").addClass(o.clsSearch).appendTo(top_block);
            search_block.addClass(o.clsSearch);

            search_input = $("<input>").attr("type", "text").attr("placeholder", o.tableSearchPlaceholder).appendTo(search_block);
            Metro.makePlugin(search_input, "input", {
                prepend: o.tableSearchTitle || strings.label_search,
            });

            if (o.showSearch !== true) {
                search_block.hide();
            }

            rows_block = Utils.isValue(this.wrapperRows) ? this.wrapperRows : $("<div>").addClass("table-rows-block").appendTo(top_block);
            rows_block.addClass(o.clsRowsCount);

            rows_select = $("<select>").appendTo(rows_block);
            $.each(o.rowsSteps.toArray(), function () {
                var val = parseInt(this);
                var option = $("<option>")
                    .attr("value", val)
                    .text(val === -1 ? o.allRecordsTitle || strings.label_all : val)
                    .appendTo(rows_select);
                if (val === parseInt(o.rows)) {
                    option.attr("selected", "selected");
                }
            });
            Metro.makePlugin(rows_select, "select", {
                filter: false,
                prepend: o.tableRowsCountTitle || strings.label_rows_count,
                onChange: function (val) {
                    val = parseInt(val);
                    if (val === parseInt(o.rows)) {
                        return;
                    }
                    o.rows = val;
                    that.currentPage = 1;
                    that._draw();

                    that._fireEvent("rows-count-change", {
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
            var element = this.element,
                o = this.options,
                strings = this.strings;
            var bottom_block = $("<div>").addClass("table-bottom").addClass(o.clsTableBottom).insertAfter(element.parent());
            var info, pagination, skip;

            info = Utils.isValue(this.wrapperInfo) ? this.wrapperInfo : $("<div>").addClass("table-info").appendTo(bottom_block);
            info.addClass(o.clsTableInfo);
            if (o.showTableInfo !== true) {
                info.hide();
            }

            pagination = Utils.isValue(this.wrapperPagination) ? this.wrapperPagination : $("<div>").addClass("table-pagination").appendTo(bottom_block);
            pagination.addClass(o.clsTablePagination);
            if (o.showPagination !== true) {
                pagination.hide();
            }

            skip = Utils.isValue(this.wrapperSkip) ? this.wrapperSkip : $("<div>").appendTo(bottom_block);
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
            var that = this,
                element = this.element,
                o = this.options;
            var columns;
            var w_search = $(o.searchWrapper),
                w_info = $(o.infoWrapper),
                w_rows = $(o.rowsWrapper),
                w_paging = $(o.paginationWrapper),
                w_skip = $(o.skipWrapper);

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

            var need_sort = false;
            if (this.heads.length > 0)
                $.each(this.heads, function (i) {
                    var item = this;
                    if (!need_sort && ["asc", "desc"].indexOf(item.sortDir) > -1) {
                        need_sort = true;
                        that.sort.colIndex = i;
                        that.sort.dir = item.sortDir;
                    }
                });

            if (need_sort) {
                columns = element.find("thead th");
                this._resetSortClass(columns);
                $(columns.get(this.sort.colIndex + that.service.length)).addClass("sort-" + this.sort.dir);
                this.sorting();
            }

            var filter_func;

            if (Utils.isValue(o.filters) && typeof o.filters === "string") {
                $.each(o.filters.toArray(), function () {
                    filter_func = Utils.isFunc(this);
                    if (filter_func !== false) {
                        that.filtersIndexes.push(that.addFilter(filter_func));
                    }
                });
            }

            this.currentPage = 1;

            this._draw();
        },

        _resetSortClass: function (el) {
            $(el).removeClass("sort-asc sort-desc");
        },

        _createEvents: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var component = element.closest(".table-component");
            var table_container = component.find(".table-container");
            var search = component.find(".table-search-block input");
            var skip_button = o.skipWrapper ? $(o.skipWrapper).find(".table-skip-button") : component.find(".table-skip-button");
            var skip_input = o.skipWrapper ? $(o.skipWrapper).find(".table-skip-input") : component.find(".table-skip-input");
            var customSearch;
            var id = element.attr("id");
            var inspectorButton = component.find(".inspector-button");

            inspectorButton.on(Metro.events.click, function () {
                that.toggleInspector();
            });

            skip_button.on(Metro.events.click, function () {
                var skipTo = parseInt(skip_input.val().trim());

                if (isNaN(skipTo) || skipTo <= 0 || skipTo > that.pagesCount) {
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
                function () {
                    if (o.horizontalScroll === true) {
                        if (!Utils.isNull(o.horizontalScrollStop) && Utils.mediaExist(o.horizontalScrollStop)) {
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

                var col = $(this);

                that.activity.show(function () {
                    setImmediate(function () {
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
                        col.addClass("sort-" + that.sort.dir);
                        that.sorting();
                        that._draw(function () {
                            that.busy = false;
                            if (o.muteTable === true) element.removeClass("disabled");
                        });
                    });
                });
            });

            element.on(Metro.events.click, ".table-service-check input", function () {
                var check = $(this);
                var status = check.is(":checked");
                var val = "" + check.val();
                var store_key = o.checkStoreKey.replace("$1", id);
                var storage = Metro.storage;
                var data = storage.getItem(store_key);
                var is_radio = check.attr("type") === "radio";

                if (is_radio) {
                    data = [];
                }

                if (status) {
                    if (!Utils.isValue(data)) {
                        data = [val];
                    } else {
                        if (Array(data).indexOf(val) === -1) {
                            data.push(val);
                        }
                    }
                } else {
                    if (Utils.isValue(data)) {
                        Utils.arrayDelete(data, val);
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
                var checked = $(this).is(":checked");
                var store_key = o.checkStoreKey.replace("$1", id);
                var storage = Metro.storage;
                var data = [];
                var stored_keys;

                if (o.useCurrentSlice === true) {
                    stored_keys = storage.getItem(store_key, []);

                    if (checked) {
                        $.each(that.currentSlice, function () {
                            if (stored_keys.indexOf("" + this[o.checkColIndex]) === -1) {
                                stored_keys.push("" + this[o.checkColIndex]);
                            }
                        });
                    } else {
                        $.each(that.currentSlice, function () {
                            var key = "" + this[o.checkColIndex];
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
                            data.push("" + this[o.checkColIndex]);
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

            var _search = function () {
                that.searchString = this.value.trim().toLowerCase();
                that.currentPage = 1;
                that._draw();
            };

            _search = Hooks.useDebounce(_search, o.searchThreshold);

            search.on(Metro.events.inputchange, _search);

            if (Utils.isValue(this.wrapperSearch)) {
                customSearch = this.wrapperSearch.find("input");
                if (customSearch.length > 0) {
                    customSearch.on(Metro.events.inputchange, _search);
                }
            }

            function pageLinkClick(l) {
                var link = $(l);
                var item = link.parent();
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

            if (Utils.isValue(this.wrapperPagination)) {
                this.wrapperPagination.on(Metro.events.click, ".pagination .page-link", function () {
                    pageLinkClick(this);
                });
            }

            this._createInspectorEvents();

            element.on(Metro.events.click, ".js-table-crud-button", function () {});
        },

        _createInspectorEvents: function () {
            var that = this,
                inspector = this.inspector;
            // Inspector event

            this._removeInspectorEvents();

            inspector.on(Metro.events.click, ".js-table-inspector-field-up", function () {
                var button = $(this),
                    tr = button.closest("tr");
                var tr_prev = tr.prev("tr");
                var index = tr.data("index");
                var index_view;
                if (tr_prev.length === 0) {
                    return;
                }
                tr.insertBefore(tr_prev);
                tr.addClass("flash");
                setTimeout(function () {
                    tr.removeClass("flash");
                }, 1000);
                index_view = tr.index();

                tr.data("index-view", index_view);
                that.view[index]["index-view"] = index_view;

                $.each(tr.nextAll(), function () {
                    var t = $(this);
                    index_view++;
                    t.data("index-view", index_view);
                    that.view[t.data("index")]["index-view"] = index_view;
                });

                that._createTableHeader();
                that._draw();
            });

            inspector.on(Metro.events.click, ".js-table-inspector-field-down", function () {
                var button = $(this),
                    tr = button.closest("tr");
                var tr_next = tr.next("tr");
                var index = tr.data("index");
                var index_view;
                if (tr_next.length === 0) {
                    return;
                }
                tr.insertAfter(tr_next);
                tr.addClass("flash");
                setTimeout(function () {
                    tr.removeClass("flash");
                }, 1000);
                index_view = tr.index();

                tr.data("index-view", index_view);
                that.view[index]["index-view"] = index_view;

                $.each(tr.prevAll(), function () {
                    var t = $(this);
                    index_view--;
                    t.data("index-view", index_view);
                    that.view[t.data("index")]["index-view"] = index_view;
                });

                that._createTableHeader();
                that._draw();
            });

            inspector.on(Metro.events.click, "input[type=checkbox]", function () {
                var check = $(this);
                var status = check.is(":checked");
                var index = check.val();
                var op = ["cls", "clsColumn"];

                if (status) {
                    $.each(op, function () {
                        var a;
                        a = Utils.isValue(that.heads[index][this]) ? that.heads[index][this].toArray(" ") : [];
                        Utils.arrayDelete(a, "hidden");
                        that.heads[index][this] = a.join(" ");
                        that.view[index]["show"] = true;
                    });
                } else {
                    $.each(op, function () {
                        var a;

                        a = Utils.isValue(that.heads[index][this]) ? that.heads[index][this].toArray(" ") : [];
                        if (a.indexOf("hidden") === -1) {
                            a.push("hidden");
                        }
                        that.heads[index][this] = a.join(" ");
                        that.view[index]["show"] = false;
                    });
                }

                that._createTableHeader();
                that._draw();
            });

            inspector.find("input[type=number]").on(Metro.events.inputchange, function () {
                var input = $(this);
                var index = input.attr("data-index");
                var val = parseInt(input.val());

                that.view[index]["size"] = val === 0 ? "" : val;

                that._createTableHeader();
            });

            inspector.on(Metro.events.click, ".js-table-inspector-save", function () {
                that._saveTableView();
                that.openInspector(false);
            });

            inspector.on(Metro.events.click, ".js-table-inspector-cancel", function () {
                that.openInspector(false);
            });

            inspector.on(Metro.events.click, ".js-table-inspector-reset", function () {
                that.resetView();
            });
        },

        _removeInspectorEvents: function () {
            var inspector = this.inspector;
            inspector.off(Metro.events.click, ".js-table-inspector-field-up");
            inspector.off(Metro.events.click, ".js-table-inspector-field-down");
            inspector.off(Metro.events.click, "input[type=checkbox]");
            inspector.off(Metro.events.click, ".js-table-inspector-save");
            inspector.off(Metro.events.click, ".js-table-inspector-cancel");
            inspector.off(Metro.events.click, ".js-table-inspector-reset");
            inspector.off(Metro.events.inputchange, "input[type=number]");
        },

        _saveTableView: function () {
            var that = this,
                element = this.element,
                o = this.options;
            var view = this.view;
            var id = element.attr("id");
            var viewPath = o.viewSavePath.replace("$1", id);
            var storage = Metro.storage;

            if (o.viewSaveMode.toLowerCase() === "client") {
                storage.setItem(viewPath, view);

                this._fireEvent("view-save", {
                    target: "client",
                    path: o.viewSavePath,
                    view: view,
                });
            } else {
                var post_data = {
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
                    .then(function (data) {
                        that._fireEvent("view-save", {
                            target: "server",
                            path: o.viewSavePath,
                            view: view,
                            post_data: post_data,
                            response: data,
                        });
                    })
                    .catch(function (error) {
                        that._fireEvent("data-save-error", {
                            source: o.viewSavePath,
                            error: error,
                            post_data: post_data,
                        });
                    });
            }
        },

        _info: function (start, stop, length) {
            var element = this.element,
                o = this.options,
                strings = this.strings;
            var component = element.closest(".table-component");
            var info = Utils.isValue(this.wrapperInfo) ? this.wrapperInfo : component.find(".table-info");
            var text;

            if (info.length === 0) {
                return;
            }

            if (stop > length) {
                stop = length;
            }

            if (this.items.length === 0) {
                start = stop = length = 0;
            }

            text = o.tableInfoTitle || strings.table_info;
            text = text.replace("$1", start);
            text = text.replace("$2", stop);
            text = text.replace("$3", length);
            info.html(text);
        },

        _paging: function (length) {
            var element = this.element,
                o = this.options,
                strings = this.strings;
            var component = element.closest(".table-component");
            this.pagesCount = Math.ceil(length / o.rows); // Костыль
            Metro.pagination({
                length: length,
                rows: o.rows,
                current: this.currentPage,
                target: Utils.isValue(this.wrapperPagination) ? this.wrapperPagination : component.find(".table-pagination"),
                claPagination: o.clsPagination,
                prevTitle: o.paginationPrevTitle || strings.label_prev,
                nextTitle: o.paginationNextTitle || strings.label_next,
                distance: o.paginationDistance,
                islandSize: o.paginationIslandSize,
                shortTrack: o.paginationShortTrack,
            });
        },

        _filter: function () {
            var that = this,
                o = this.options;
            var items;
            if ((Utils.isValue(this.searchString) && that.searchString.length >= o.searchMinLength) || this.filters.length > 0) {
                items = this.items.filter(function (row) {
                    var row_data = "",
                        result,
                        search_result,
                        i,
                        j = 0;

                    if (that.filters.length > 0) {
                        result = o.filtersOperator.toLowerCase() === "and";
                        for (i = 0; i < that.filters.length; i++) {
                            if (Utils.isNull(that.filters[i])) continue;
                            j++;
                            result =
                                o.filtersOperator.toLowerCase() === "and"
                                    ? result && Utils.exec(that.filters[i], [row, that.heads])
                                    : result || Utils.exec(that.filters[i], [row, that.heads]);
                        }

                        if (j === 0) result = true;
                    } else {
                        result = true;
                    }

                    if (that.searchFields.length > 0) {
                        $.each(that.heads, function (i, v) {
                            if (that.searchFields.indexOf(v.name) > -1) {
                                row_data += "•" + row[i];
                            }
                        });
                    } else {
                        row_data = row.join("•");
                    }

                    row_data = row_data
                        .replace(/[\n\r]+|[\s]{2,}/g, " ")
                        .trim()
                        .toLowerCase();
                    search_result =
                        Utils.isValue(that.searchString) && that.searchString.length >= o.searchMinLength ? ~row_data.indexOf(that.searchString) : true;

                    result = result && search_result;

                    if (result) {
                        that._fireEvent("filter-row-accepted", {
                            row: row,
                        });
                    } else {
                        that._fireEvent("filter-row-declined", {
                            row: row,
                        });
                    }

                    return result;
                });
            } else {
                items = this.items;
            }

            this._fireEvent("search", {
                search: that.searchString,
                items: items,
            });

            this.filteredItems = items;

            return items;
        },

        _draw: function (cb) {
            var that = this,
                element = this.element,
                o = this.options,
                strings = this.strings;
            var body = element.find("tbody");
            var i, j, tr, td, check, cells, tds, is_even_row;
            var start = parseInt(o.rows) === -1 ? 0 : o.rows * (this.currentPage - 1),
                stop = parseInt(o.rows) === -1 ? this.items.length - 1 : start + o.rows - 1;
            var items,
                checkedItems = [];
            var stored_keys = Metro.storage.getItem(o.checkStoreKey.replace("$1", element.attr("id")));

            var view = o.staticView ? this.viewDefault : this.view;

            body.html("");

            if (!this.heads.length) {
                console.warn("Heads is not defined for table ID " + element.attr("id"));
                return;
            }

            items = this._filter();

            this.currentSlice = items.slice(start, stop + 1);
            checkedItems = [];

            if (items.length > 0) {
                for (i = start; i <= stop; i++) {
                    cells = items[i];
                    tds = [];
                    if (!Utils.isValue(cells)) {
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
                            "<input type='checkbox' data-style='" +
                                o.checkStyle +
                                "' data-role='checkbox' name='" +
                                (Utils.isValue(o.checkName) ? o.checkName : "table_row_check") +
                                "[]' value='" +
                                items[i][o.checkColIndex] +
                                "'>",
                        );
                    } else {
                        check = $(
                            "<input type='radio' data-style='" +
                                o.checkStyle +
                                "' data-role='radio' name='" +
                                (Utils.isValue(o.checkName) ? o.checkName : "table_row_check") +
                                "' value='" +
                                items[i][o.checkColIndex] +
                                "'>",
                        );
                    }

                    if (Utils.isValue(stored_keys) && Array.isArray(stored_keys) && stored_keys.indexOf("" + items[i][o.checkColIndex]) > -1) {
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
                        var val = this;
                        var td = $("<td>")
                            .attr("data-label", that.heads[cell_index].title)
                            .attr("aria-label", that.heads[cell_index].title);

                        if (Utils.isValue(that.heads[cell_index].template)) {
                            val = that.heads[cell_index].template.replace(/%VAL%/g, val);
                        }

                        td.html(val);

                        td.addClass(o.clsBodyCell);
                        if (Utils.isValue(that.heads[cell_index].clsColumn)) {
                            td.addClass(that.heads[cell_index].clsColumn);
                        }

                        if (Utils.bool(view[cell_index].show) === false) {
                            td.addClass("hidden");
                        }

                        if (Utils.bool(view[cell_index].show)) {
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
                Utils.exec(cb, null, element[0]);
            }
        },

        _getItemContent: function (row) {
            var o = this.options,
                locale = this.locale;
            var result,
                col = row[this.sort.colIndex];
            var format = this.heads[this.sort.colIndex].format;
            var formatMask =
                !Utils.isNull(this.heads) && !Utils.isNull(this.heads[this.sort.colIndex]) && Utils.isValue(this.heads[this.sort.colIndex]["formatMask"])
                    ? this.heads[this.sort.colIndex]["formatMask"]
                    : "%Y-%m-%d";
            var thousandSeparator =
                this.heads && this.heads[this.sort.colIndex] && this.heads[this.sort.colIndex]["thousandSeparator"]
                    ? this.heads[this.sort.colIndex]["thousandSeparator"]
                    : o.thousandSeparator;
            var decimalSeparator =
                this.heads && this.heads[this.sort.colIndex] && this.heads[this.sort.colIndex]["decimalSeparator"]
                    ? this.heads[this.sort.colIndex]["decimalSeparator"]
                    : o.decimalSeparator;

            result = ("" + col)
                .toLowerCase()
                .replace(/[\n\r]+|[\s]{2,}/g, " ")
                .trim();

            if (Utils.isValue(result) && Utils.isValue(format)) {
                if (["number", "int", "float", "money"].indexOf(format) !== -1) {
                    result = Utils.parseNumber(result, thousandSeparator, decimalSeparator);
                }

                switch (format) {
                    case "date":
                        result = formatMask ? Datetime.from(result, formatMask, locale) : datetime(result);
                        break;
                    case "number":
                        result = +result;
                        break;
                    case "int":
                        result = parseInt(result);
                        break;
                    case "float":
                        result = parseFloat(result);
                        break;
                    case "money":
                        result = Utils.parseMoney(result);
                        break;
                    case "card":
                        result = Utils.parseCard(result);
                        break;
                    case "phone":
                        result = Utils.parsePhone(result);
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
            items.forEach(function (item) {
                if (Array.isArray(item)) this.items.push(item, false);
            });
            this.draw();
            if (redraw !== false) this.draw();
        },

        updateItem: function (key, field, value) {
            var item = this.items[this.index[key]];
            var fieldIndex = null;
            if (Utils.isNull(item)) {
                console.warn("Item is undefined for update");
                return this;
            }
            if (isNaN(field)) {
                this.heads.forEach(function (v, i) {
                    if (v["name"] === field) {
                        fieldIndex = i;
                    }
                });
            }
            if (Utils.isNull(fieldIndex)) {
                console.warn("Item is undefined for update. Field " + field + " not found in data structure");
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
            var i,
                deleteIndexes = [];
            var is_func = Utils.isFunc(value);
            for (i = 0; i < this.items.length; i++) {
                if (is_func) {
                    if (Utils.exec(value, [this.items[i][fieldIndex]])) {
                        deleteIndexes.push(i);
                    }
                } else {
                    if (this.items[i][fieldIndex] === value) {
                        deleteIndexes.push(i);
                    }
                }
            }

            this.items = Utils.arrayDeleteByMultipleKeys(this.items, deleteIndexes);

            return this;
        },

        deleteItemByName: function (fieldName, value) {
            var i,
                fieldIndex,
                deleteIndexes = [];
            var is_func = Utils.isFunc(value);

            for (i = 0; i < this.heads.length; i++) {
                if (this.heads[i]["name"] === fieldName) {
                    fieldIndex = i;
                    break;
                }
            }

            for (i = 0; i < this.items.length; i++) {
                if (is_func) {
                    if (Utils.exec(value, [this.items[i][fieldIndex]])) {
                        deleteIndexes.push(i);
                    }
                } else {
                    if (this.items[i][fieldIndex] === value) {
                        deleteIndexes.push(i);
                    }
                }
            }

            this.items = Utils.arrayDeleteByMultipleKeys(this.items, deleteIndexes);

            return this;
        },

        draw: function () {
            this._draw();
            return this;
        },

        sorting: function (dir) {
            var that = this;

            if (Utils.isValue(dir)) {
                this.sort.dir = dir;
            }

            this._fireEvent("sort-start", {
                items: this.items,
            });

            this.items.sort(function (a, b) {
                var c1 = that._getItemContent(a);
                var c2 = that._getItemContent(b);
                var result = 0;

                if (c1 < c2) {
                    result = that.sort.dir === "asc" ? -1 : 1;
                }
                if (c1 > c2) {
                    result = that.sort.dir === "asc" ? 1 : -1;
                }

                if (result !== 0) {
                    that._fireEvent("sort-item-switch", {
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
            var that = this,
                element = this.element;
            var need_sort = false,
                sortable_columns;

            this._createIndex();

            if (review === true) {
                this.view = this._createView();
            }

            this._createTableHeader();
            this._createTableBody();
            this._createTableFooter();

            if (this.heads.length > 0)
                $.each(this.heads, function (i) {
                    var item = this;
                    if (!need_sort && ["asc", "desc"].indexOf(item.sortDir) > -1) {
                        need_sort = true;
                        that.sort.colIndex = i;
                        that.sort.dir = item.sortDir;
                    }
                });

            if (need_sort) {
                sortable_columns = element.find(".sortable-column");
                this._resetSortClass(sortable_columns);
                $(sortable_columns.get(that.sort.colIndex)).addClass("sort-" + that.sort.dir);
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
            var i, index;
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
            var that = this,
                o = this.options;

            this.activity.show(function () {
                that.items = [];
                that.heads = [];
                that.foots = [];

                if (Array.isArray(o.head)) {
                    that.heads = o.head;
                }

                if (Array.isArray(o.body)) {
                    that.items = o.body;
                }

                that._createItemsFromJSON(data);

                that._rebuild(true);

                that.activity.hide();
            });

            return this;
        },

        loadData: function (source, review) {
            var that = this,
                element = this.element,
                o = this.options;

            if (!Utils.isValue(review)) {
                review = true;
            }

            element.html("");

            if (!Utils.isValue(source)) {
                this._rebuild(review);
            } else {
                o.source = source;

                this._fireEvent("data-load", {
                    source: o.source,
                });

                that.activity.show(function () {
                    fetch(o.source)
                        .then(Metro.fetch.status)
                        .then(Metro.fetch.json)
                        .then(function (data) {
                            that.activity.hide();
                            that.items = [];
                            that.heads = [];
                            that.foots = [];

                            that._fireEvent("data-loaded", {
                                source: o.source,
                                data: data,
                            });

                            if (Array.isArray(o.head)) {
                                that.heads = o.head;
                            }

                            if (Array.isArray(o.body)) {
                                that.items = o.body;
                            }

                            that._createItemsFromJSON(data);
                            that._rebuild(review);
                            that._resetInspector();

                            that._fireEvent("data-load-end", {
                                source: o.source,
                                data: data,
                            });
                        })
                        .catch(function (error) {
                            that.activity.hide();
                            that._fireEvent("data-load-error", {
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
            if (num <= 0) {
                num = 1;
            }

            if (num > this.pagesCount) {
                num = this.pagesCount;
            }

            this.currentPage = num;
            this._draw();
            return this;
        },

        addFilter: function (f, redraw) {
            var filterIndex = null,
                i,
                func = Utils.isFunc(f);
            if (func === false) {
                return;
            }

            for (i = 0; i < this.filters.length; i++) {
                if (Utils.isNull(this.filters[i])) {
                    filterIndex = i;
                    this.filters[i] = func;
                    break;
                }
            }

            if (Utils.isNull(filterIndex)) {
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
            var element = this.element,
                o = this.options;
            var stored_keys = Metro.storage.getItem(o.checkStoreKey.replace("$1", element.attr("id")));
            var selected = [];

            if (!Utils.isValue(stored_keys)) {
                return [];
            }

            $.each(this.items, function () {
                if (stored_keys.indexOf("" + this[o.checkColIndex]) !== -1) {
                    selected.push(this);
                }
            });
            return selected;
        },

        getStoredKeys: function () {
            var element = this.element,
                o = this.options;
            return Metro.storage.getItem(o.checkStoreKey.replace("$1", element.attr("id")), []);
        },

        clearSelected: function (redraw) {
            var element = this.element,
                o = this.options;
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
            var ins = this.inspector;
            if (mode) {
                ins.show(0, function () {
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
            var Export = Metro.export;
            var that = this,
                o = this.options;
            var table = document.createElement("table");
            var head = $("<thead>").appendTo(table);
            var body = $("<tbody>").appendTo(table);
            var i,
                j,
                cells,
                tds = [],
                items,
                tr,
                td;
            var start, stop;

            if (typeof Export.tableToCSV !== "function") {
                return;
            }

            mode = Utils.isValue(mode) ? mode.toLowerCase() : "all-filtered";
            filename = Utils.isValue(filename) ? filename : Utils.elementId("table") + "-export.csv";

            // Create table header
            tr = $("<tr>");
            cells = this.heads;

            for (j = 0; j < cells.length; j++) {
                tds[j] = null;
            }

            $.each(cells, function (cell_index) {
                var item = this;
                if (Utils.bool(that.view[cell_index]["show"]) === false) {
                    return;
                }
                td = $("<th>");
                if (Utils.isValue(item.title)) {
                    td.html(item.title);
                }
                tds[that.view[cell_index]["index-view"]] = td;
            });

            for (j = 0; j < cells.length; j++) {
                if (Utils.isValue(tds[j])) tds[j].appendTo(tr);
            }
            tr.appendTo(head);

            // Create table data
            if (mode === "checked") {
                items = this.getSelectedItems();
                start = 0;
                stop = items.length - 1;
            } else if (mode === "view") {
                items = this._filter();
                start = parseInt(o.rows) === -1 ? 0 : o.rows * (this.currentPage - 1);
                stop = parseInt(o.rows) === -1 ? items.length - 1 : start + o.rows - 1;
            } else if (mode === "all") {
                items = this.items;
                start = 0;
                stop = items.length - 1;
            } else {
                items = this._filter();
                start = 0;
                stop = items.length - 1;
            }

            for (i = start; i <= stop; i++) {
                if (Utils.isValue(items[i])) {
                    tr = $("<tr>");

                    cells = items[i];

                    for (j = 0; j < cells.length; j++) {
                        tds[j] = null;
                    }

                    $.each(cells, function (cell_index) {
                        if (Utils.bool(that.view[cell_index].show) === false) {
                            return;
                        }
                        td = $("<td>").html(this);
                        tds[that.view[cell_index]["index-view"]] = td;
                    });

                    for (j = 0; j < cells.length; j++) {
                        if (Utils.isValue(tds[j])) tds[j].appendTo(tr);
                    }

                    tr.appendTo(body);
                }
            }

            // switch (to) {
            //     default: Export.tableToCSV(table, filename, options);
            // }
            Export.tableToCSV(table, filename, options);
            table.remove();
        },

        changeAttribute: function (attributeName) {
            var that = this,
                element = this.element,
                o = this.options;

            function dataCheck() {
                o.check = Utils.bool(element.attr("data-check"));
                that._service();
                that._createTableHeader();
                that._draw();
            }

            function dataRownum() {
                o.rownum = Utils.bool(element.attr("data-rownum"));
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
            var element = this.element;
            var component = element.closest(".table-component");
            var search_input = component.find("input");
            var rows_select = component.find("select");

            search_input.data("input").destroy();
            rows_select.data("select").destroy();

            $(globalThis).off(Metro.events.resize, { ns: this.id });

            element.off(Metro.events.click, ".sortable-column");

            element.off(Metro.events.click, ".table-service-check input");

            element.off(Metro.events.click, ".table-service-check-all input");

            search_input.off(Metro.events.inputchange);

            if (Utils.isValue(this.wrapperSearch)) {
                var customSearch = this.wrapperSearch.find("input");
                if (customSearch.length > 0) {
                    customSearch.off(Metro.events.inputchange);
                }
            }

            component.off(Metro.events.click, ".pagination .page-link");
            if (Utils.isValue(this.wrapperPagination)) {
                this.wrapperPagination.off(Metro.events.click, ".pagination .page-link");
            }
            element.off(Metro.events.click, ".js-table-crud-button");

            this._removeInspectorEvents();

            return element;
        },
    });
})(Metro, Dom);
