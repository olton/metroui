((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    const file_icon = `
    <svg width="800px" height="800px" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path class="a" d="M39.5,15.5h-9a2,2,0,0,1-2-2v-9h-18a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2Z"/>
        <line class="a" x1="28.5" y1="4.5" x2="39.5" y2="15.5"/>
    </svg>`
    const toggleImage = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"></path></svg>`
    
    let ListViewDefaultConfig = {
        listviewDeferred: 0,
        selectable: false,
        duration: 100,
        view: Metro.listView.LIST,
        selectCurrent: true,
        defaultIcon: file_icon,
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

    Metro.listViewSetup = (options) => {
        ListViewDefaultConfig = $.extend({}, ListViewDefaultConfig, options);
    };

    if (typeof globalThis.metroListViewSetup !== "undefined") {
        Metro.listViewSetup(globalThis.metroListViewSetup);
    }

    Metro.Component('listview', {
        init: function( options, elem ) {
            this._super(elem, options, ListViewDefaultConfig);

            return this;
        },

        _create: function(){
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("listview-create", {
                element: element
            });
        },

        _createIcon: (data)=> $("<div>").addClass("icon").html(data),
        _createCaption: (data = "")=> $("<div>").addClass("caption").html(data),
        _createContent: (data = "")=> $("<div>").addClass("content").html(data),
        _createDesc: (data = "")=> $("<div>").addClass("desc").html(data),
        _createDate: (data = "")=> $("<div>").addClass("date").html(data),
        _createToggle: ()=> $("<span>").addClass("node-toggle").html(toggleImage),
        _createNode: function(data){
            const o = this.options;
            const node = $("<li>");

            node.append($("<input type='checkbox' data-role='checkbox'>").data("node", node));
            node.append(this._createIcon(data.icon ?? o.defaultIcon));
            node.append(this._createCaption(data.caption));
            node.append(this._createDesc(data.desc));
            node.append(this._createDate(data.date));
            node.append(this._createContent(data.content));
            
            return node;
        },

        _createStructure: function(){
            const that = this;
            const element = this.element;
            const o = this.options;
            const nodes = element.find("li");

            element.addClass("listview");
            element.find("ul").addClass("listview");
            if (o.selectable) {
                element.addClass("selectable");
            }

            $.each(nodes, function(index){
                const node = $(this);
                const nodeContent = node.html();
                const defaultFileName = `Item_${index+1}`;

                if (node.children("ul").length > 0) {
                    node.prepend(that._createCaption(node.data("caption") ?? defaultFileName));
                    node.addClass("node-group");
                    node.append(that._createToggle());
                    if (node.data("collapsed") !== true) node.addClass("expanded");
                } else {
                    node.clear().addClass("node");
                    node.append($("<input type='checkbox' data-role='checkbox'>").data("node", node));
                    node.append(that._createIcon(node.data('icon') ?? o.defaultIcon));
                    node.append(that._createCaption(node.data("caption") ?? defaultFileName));
                    node.append(that._createDesc(node.data("desc")));
                    node.append(that._createDate(node.data("date")));
                    node.append(that._createContent(nodeContent));
                }               
            });

            if (o.selectable) {
                element.addClass("selectable");
            }
            
            this.view(o.view);
        },

        _createEvents: function(){
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.dblclick, ".node", function(){
                const node = $(this);
                that._fireEvent("node-dblclick", {
                    node: node
                });
            });

            element.on(Metro.events.click, ".node", function(){
                const node = $(this);
                const href = $(this).attr("href");

                if (href) {
                    globalThis.location.href = href;
                    return;
                }

                const isCurrent = node.hasClass("current");
                
                element.find(".node").removeClass("current");
                if (!isCurrent) {
                    node.addClass("current");
                }
                if (o.selectCurrent === true) {
                    element.find(".node").removeClass("current-select");
                    if (!isCurrent) {
                        node.addClass("current-select");
                    }
                }
                that._fireEvent("node-click", {
                    node: node
                });
            });

            element.on(Metro.events.click, ".node-toggle", function(){
                const node = $(this).closest("li");
                that.toggleNode(node);
            });

            element.on(Metro.events.click, ".node-group > .caption", function(){
                const node = $(this).closest("li");
                element.find(".node-group").removeClass("current-group");
                node.addClass("current-group");

                that._fireEvent("group-node-click", {
                    node: node
                });

            });

            element.on(Metro.events.dblclick, ".node-group > .caption", function(){
                const node = $(this).closest("li");
                that.toggleNode(node);

                that._fireEvent("node-dbl-click", {
                    node: node
                });
            });
        },

        view: function(v){
            const element = this.element;
            const o = this.options;

            if (v === undefined) {
                return o.view;
            }

            o.view = v;

            $.each(Metro.listView, (i, v)=> {
                element.removeClass(`view-${v}`);
                element.find("ul").removeClass(`view-${v}`);
            });

            element.addClass(`view-${o.view}`);
            element.find("ul").addClass(`view-${o.view}`);
        },

        toggleNode: function(node){
            const o = this.options;
            const n = $(node)

            if (!n.hasClass("node-group")) {
                return ;
            }

            n.toggleClass("expanded");

            const func = n.hasClass("expanded") !== true ? "slideUp" : "slideDown"
            this._fireEvent("collapse-node", {
                node: n
            });

            n.children("ul")[func](o.duration);
        },

        toggleSelectable: function(){
            const element = this.element;
            const o = this.options;
            o.selectable = !o.selectable;
            const func = o.selectable === true ? "addClass" : "removeClass";
            console.log(func);
            element[func]("selectable");
            element.find("ul")[func]("selectable");
        },

        add: function(data, node = null){
            const element = this.element;
            const o = this.options;
            let target;
            let toggle;
            let n;

            if (node === null) {
                target = element;
            } else {

                n = $(node);

                if (!n.hasClass("node-group")) {
                    return ;
                }

                target = n.children("ul");
                if (target.length === 0) {
                    target = $("<ul>").addClass("listview").addClass(`view-${o.view}`).appendTo(n);
                    toggle = this._createToggle();
                    toggle.appendTo(n);
                    n.addClass("expanded");
                }
            }

            const new_node = this._createNode(data)
            new_node.addClass("node").appendTo(target);

            const cb = $("<input type='checkbox'>");
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
            const element = this.element;
            const o = this.options;

            // biome-ignore lint/performance/noDelete: <explanation>
            if (data.icon) delete data.icon;

            const node = this._createNode(data)
            node.addClass("node-group").appendTo(element);
            node.append(this._createToggle());
            node.addClass("expanded");
            node.append($("<ul>").addClass("listview").addClass(`view-${o.view}`));

            this._fireEvent("node-insert", {
                newNode: node,
                parentNode: null,
                list: element
            })

            return node;
        },

        insertBefore: function(data, node){
            const n = $(node);

            if (!n.length) {return;}

            const new_node = this._createNode(data)
            new_node.addClass("node").insertBefore(n);
            const parent_node = new_node.closest(".node")
            const list = new_node.closest("ul")
            this._fireEvent("node-insert", {
                newNode: new_node,
                parentNode: parent_node,
                list: list
            });

            return new_node;
        },

        insertAfter: function(data, node){
            const n = $(node);

            if (!n.length) {return;}

            const new_node = this._createNode(data)
            new_node.addClass("node").insertAfter(n);
            const parent_node = new_node.closest(".node")
            const list = new_node.closest("ul")
            this._fireEvent("node-insert", {
                newNode: new_node,
                parentNode: parent_node,
                list: list
            });

            return new_node;
        },

        del: function(node){
            const element = this.element;
            const n = $(node);

            if (!n.length) {return;}

            const parent_list = n.closest("ul");
            const parent_node = parent_list.closest("li");
            n.remove();
            if (parent_list.children().length === 0 && !parent_list.is(element)) {
                parent_list.remove();
                parent_node.removeClass("expanded");
                parent_node.children(".node-toggle").remove();
            }

            this._fireEvent("node-delete", {
                node: n
            });
        },

        clean: function(node){
            const n = $(node);

            if (!n.length) {return;}

            n.children("ul").remove();
            n.removeClass("expanded");
            n.children(".node-toggle").remove();

            this._fireEvent("node-clean", {
                node: n
            });
        },

        getSelected: function(){
            const element = this.element;
            const nodes = [];

            $.each(element.find(":checked"), function(){
                const check = $(this);
                nodes.push(check.closest(".node")[0])
            });

            return nodes;
        },

        clearSelected: function(){
            this.element.find(":checked").prop("checked", false);
            this.element.trigger('change');
        },

        selectAll: function(mode = true){
            this.element.find(".checkbox input").prop("checked", mode);
            this.element.trigger('change');
        },

        selectByAttribute: function(attributeName, attributeValue, select = true) {
            this.element.find(`li[${attributeName}="${attributeValue}"] > .checkbox input`).prop("checked", select);
            this.element.trigger('change');
        },

        changeAttribute: function(attributeName){
            const element = this.element;
            const o = this.options;

            const changeView = () => {
                const new_view = `view-${element.attr("data-view")}`;
                this.view(new_view);
            };

            const changeSelectable = () => {
                o.selectable = JSON.parse(element.attr("data-selectable")) === true;
                this.toggleSelectable();
            };

            switch (attributeName) {
                case "data-view": changeView(); break;
                case "data-selectable": changeSelectable(); break;
            }
        },

        destroy: function(){
            const element = this.element;

            element.off(Metro.events.click, ".node");
            element.off(Metro.events.click, ".node-toggle");
            element.off(Metro.events.click, ".node-group > .caption");
            element.off(Metro.events.dblclick, ".node-group > .caption");

            element.remove();
        }
    });
})(Metro, Dom);