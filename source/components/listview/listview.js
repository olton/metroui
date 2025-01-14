/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var ListViewDefaultConfig = {
        listviewDeferred: 0,
        selectable: false,
        checkStyle: 1,
        duration: 100,
        view: Metro.listView.LIST,
        selectCurrent: true,
        structure: {},
        onNodeInsert: Metro.noop,
        onNodeDelete: Metro.noop,
        onNodeClean: Metro.noop,
        onCollapseNode: Metro.noop,
        onExpandNode: Metro.noop,
        onGroupNodeClick: Metro.noop,
        onNodeClick: Metro.noop,
        onNodeDblclick: Metro.noop,
        onListViewCreate: Metro.noop
    };

    Metro.listViewSetup = function (options) {
        ListViewDefaultConfig = $.extend({}, ListViewDefaultConfig, options);
    };

    if (typeof globalThis["metroListViewSetup"] !== undefined) {
        Metro.listViewSetup(globalThis["metroListViewSetup"]);
    }

    Metro.Component('listview', {
        init: function( options, elem ) {
            this._super(elem, options, ListViewDefaultConfig);

            return this;
        },

        _create: function(){
            var element = this.element;

            this._createView();
            this._createEvents();

            this._fireEvent("listview-create", {
                element: element
            });
        },

        _createIcon: function(data){
            var icon, src;

            src = Utils.isTag(data) ? $(data) : $("<img>").attr("src", data);
            icon = $("<span>").addClass("icon");
            icon.html(src.outerHTML());

            return icon;
        },

        _createCaption: function(data){
            return $("<div>").addClass("caption").html(data);
        },

        _createContent: function(data){
            return $("<div>").addClass("content").html(data);
        },

        _createToggle: function(){
            return $("<span>").addClass("node-toggle");
        },

        _createNode: function(data){
            var that = this, o = this.options;
            var node;

            node = $("<li>");

            if (data.caption !== undefined || data.content !== undefined ) {
                var d = $("<div>").addClass("data");
                node.prepend(d);
                if (data.caption !== undefined) d.append(that._createCaption(data.caption));
                if (data.content !== undefined) d.append(that._createContent(data.content));
            }

            if (data.icon !== undefined) {
                node.prepend(this._createIcon(data.icon));
            }

            if (Utils.objectLength(o.structure) > 0) $.each(o.structure, function(key, val){
                if (data[key] !== undefined) {
                    $("<div>").addClass("node-data item-data-"+key).addClass(data[val]).html(data[key]).appendTo(node);
                }
            });

            if (data.attributes && Utils.isObject(data.attributes)) {
                for(let key in data.attributes) {
                    node.attr(`data-${key}`, data.attributes[key])
                }
            }

            if (data.class) {
                node.addClass(data.class)
            }

            if (data.badge) {
                node.append(
                    $("<span>").addClass("badge").html(data.badge)
                )
            }

            if (data.badges) {
                const badges = $("<div>").addClass("badges").appendTo(node);
                data.badges.map(b => {
                    if (!b) return;
                    badges.append(
                        $(b).addClass("badge")
                    )
                })
            }

            return node;
        },

        _createView: function(){
            var that = this, element = this.element, o = this.options;
            var nodes = element.find("li");
            var struct_length = Utils.objectLength(o.structure);

            element.addClass("listview");
            element.find("ul").addClass("listview");

            $.each(nodes, function(){
                var node = $(this);

                if (node.data("caption") !== undefined || node.data("content") !== undefined) {
                    var data = $("<div>").addClass("data");
                    node.prepend(data);
                    if (node.data("caption") !== undefined) data.append(that._createCaption(node.data("caption")));
                    if (node.data("content") !== undefined) data.append(that._createContent(node.data("content")));
                }

                if (node.data('icon') !== undefined) {
                    node.prepend(that._createIcon(node.data('icon')));
                }

                if (node.children("ul").length > 0) {
                    node.addClass("node-group");
                    node.append(that._createToggle());
                    if (node.data("collapsed") !== true) node.addClass("expanded");
                } else {
                    node.addClass("node");
                }

                if (node.hasClass("node")) {
                    var cb = $("<input type='checkbox' data-role='checkbox' data-style='"+o.checkStyle+"'>");
                    cb.data("node", node);
                    node.prepend(cb);
                }

                if (struct_length > 0) $.each(o.structure, function(key){
                    if (node.data(key) !== undefined) {
                        $("<div>").addClass("node-data item-data-"+key).addClass(node.data(key)).html(node.data(key)).appendTo(node);
                    }
                });

                if (node.data("class") !== undefined) {
                    node.addClass(node.data("class"))
                }
            });

            this.toggleSelectable();

            this.view(o.view);
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            element.on(Metro.events.dblclick, ".node", function(){
                var node = $(this);
                that._fireEvent("node-dblclick", {
                    node: node
                });
            });

            element.on(Metro.events.click, ".node", function(){
                var node = $(this);
                var href = $(this).attr("href");

                if (href) {
                    globalThis.location.href = href;
                    return;
                }

                element.find(".node").removeClass("current");
                node.toggleClass("current");
                if (o.selectCurrent === true) {
                    element.find(".node").removeClass("current-select");
                    node.toggleClass("current-select");
                }
                that._fireEvent("node-click", {
                    node: node
                });
            });

            element.on(Metro.events.click, ".node-toggle", function(){
                var node = $(this).closest("li");
                that.toggleNode(node);
            });

            element.on(Metro.events.click, ".node-group > .data > .caption", function(){
                var node = $(this).closest("li");
                element.find(".node-group").removeClass("current-group");
                node.addClass("current-group");

                that._fireEvent("group-node-click", {
                    node: node
                });

            });

            element.on(Metro.events.dblclick, ".node-group > .data > .caption", function(){
                var node = $(this).closest("li");
                that.toggleNode(node);

                that._fireEvent("node-dbl-click", {
                    node: node
                });
            });
        },

        view: function(v){
            var element = this.element, o = this.options;

            if (v === undefined) {
                return o.view;
            }

            o.view = v;

            $.each(Metro.listView, function(i, v){
                element.removeClass("view-"+v);
                element.find("ul").removeClass("view-"+v);
            });

            element.addClass("view-" + o.view);
            element.find("ul").addClass("view-" + o.view);
        },

        toggleNode: function(node){
            var o = this.options;
            var func;

            node=$(node);

            if (!node.hasClass("node-group")) {
                return ;
            }

            node.toggleClass("expanded");

            func = node.hasClass("expanded") !== true ? "slideUp" : "slideDown";

            this._fireEvent("collapse-node", {
                node: node
            });

            node.children("ul")[func](o.duration);
        },

        toggleSelectable: function(){
            var element = this.element, o = this.options;
            var func = o.selectable === true ? "addClass" : "removeClass";
            element[func]("selectable");
            element.find("ul")[func]("selectable");
        },

        add: function(node, data){
            var element = this.element, o = this.options;
            var target;
            var new_node;
            var toggle;

            if (node === null) {
                target = element;
            } else {

                node=$(node);

                if (!node.hasClass("node-group")) {
                    return ;
                }

                target = node.children("ul");
                if (target.length === 0) {
                    target = $("<ul>").addClass("listview").addClass("view-"+o.view).appendTo(node);
                    toggle = this._createToggle();
                    toggle.appendTo(node);
                    node.addClass("expanded");
                }
            }

            new_node = this._createNode(data);

            new_node.addClass("node").appendTo(target);

            var cb = $("<input type='checkbox'>");
            cb.data("node", new_node);
            new_node.prepend(cb);
            Metro.makePlugin(cb, "checkbox", {});

            this._fireEvent("node-insert", {
                newNode: new_node,
                parentNode: node,
                list: target
            });

            return new_node;
        },

        addGroup: function(data){
            var element = this.element, o = this.options;
            var node;

            delete data['icon'];

            node = this._createNode(data);
            node.addClass("node-group").appendTo(element);
            node.append(this._createToggle());
            node.addClass("expanded");
            node.append($("<ul>").addClass("listview").addClass("view-"+o.view));

            this._fireEvent("node-insert", {
                newNode: node,
                parentNode: null,
                list: element
            })

            return node;
        },

        insertBefore: function(node, data){
            var new_node, parent_node, list;

            node=$(node);

            if (!node.length) {return;}

            new_node = this._createNode(data);
            new_node.addClass("node").insertBefore(node);
            parent_node = new_node.closest(".node");
            list = new_node.closest("ul");

            this._fireEvent("node-insert", {
                newNode: new_node,
                parentNode: parent_node,
                list: list
            });

            return new_node;
        },

        insertAfter: function(node, data){
            var new_node, parent_node, list;

            node=$(node);

            if (!node.length) {return;}

            new_node = this._createNode(data);
            new_node.addClass("node").insertAfter(node);
            parent_node = new_node.closest(".node");
            list = new_node.closest("ul");

            this._fireEvent("node-insert", {
                newNode: new_node,
                parentNode: parent_node,
                list: list
            });

            return new_node;
        },

        del: function(node){
            var element = this.element;

            node=$(node);

            if (!node.length) {return;}

            var parent_list = node.closest("ul");
            var parent_node = parent_list.closest("li");
            node.remove();
            if (parent_list.children().length === 0 && !parent_list.is(element)) {
                parent_list.remove();
                parent_node.removeClass("expanded");
                parent_node.children(".node-toggle").remove();
            }

            this._fireEvent("node-delete", {
                node: node
            });
        },

        clean: function(node){
            node=$(node);

            if (!node.length) {return;}

            node.children("ul").remove();
            node.removeClass("expanded");
            node.children(".node-toggle").remove();

            this._fireEvent("node-clean", {
                node: node
            });
        },

        getSelected: function(){
            var element = this.element;
            var nodes = [];

            $.each(element.find(":checked"), function(){
                var check = $(this);
                nodes.push(check.closest(".node")[0])
            });

            return nodes;
        },

        clearSelected: function(){
            this.element.find(":checked").prop("checked", false);
            this.element.trigger('change');
        },

        selectAll: function(mode){
            this.element.find(".node > .checkbox input").prop("checked", mode !== false);
            this.element.trigger('change');
        },

        selectByAttribute: function(attributeName, attributeValue, select) {
            if (select !== false) {
                select = true;
            }
            this.element.find('li[' + attributeName + '="' + attributeValue + '"]' + ' > .checkbox input').prop("checked", select);
            this.element.trigger('change');
        },

        changeAttribute: function(attributeName){
            var that = this, element = this.element, o = this.options;

            var changeView = function(){
                var new_view = "view-"+element.attr("data-view");
                that.view(new_view);
            };

            var changeSelectable = function(){
                o.selectable = JSON.parse(element.attr("data-selectable")) === true;
                that.toggleSelectable();
            };

            switch (attributeName) {
                case "data-view": changeView(); break;
                case "data-selectable": changeSelectable(); break;
            }
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.click, ".node");
            element.off(Metro.events.click, ".node-toggle");
            element.off(Metro.events.click, ".node-group > .data > .caption");
            element.off(Metro.events.dblclick, ".node-group > .data > .caption");

            return element;
        }
    });
}(Metro, Dom));