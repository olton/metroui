(function(Metro, $) {
    'use strict';

    var DoubleSelectBoxDefaultConfig = {
        height: "auto",
        multiSelect: false,

        moveRightIcon: "&rsaquo;",
        moveRightAllIcon: "&raquo;",
        moveLeftIcon: "&lsaquo;",
        moveLeftAllIcon: "&laquo;",

        clsBox: "",
        clsMoveButton: "",
        clsMoveRightButton: "",
        clsMoveRightAllButton: "",
        clsMoveLeftButton: "",
        clsMoveLeftAllButton: "",
        clsListLeft: "",
        clsListRight: "",

        onDoubleSelectBoxCreate: Metro.noop
    };

    Metro.doubleSelectBoxSetup = function (options) {
        DoubleSelectBoxDefaultConfig = $.extend({}, DoubleSelectBoxDefaultConfig, options);
    };

    if (typeof globalThis["metroDoubleSelectBoxSetup"] !== undefined) {
        Metro.doubleSelectBoxSetup(globalThis["metroDoubleSelectBoxSetup"]);
    }

    Metro.Component('double-select-box', {
        init: function( options, elem ) {
            this._super(elem, options, DoubleSelectBoxDefaultConfig, {
                // define instance vars here
                select1: null,
                select2: null,
                list1: null,
                list2: null
            });
            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;

            if (element.children("select").length !== 2) {
                throw new Error("Component DoubleSelectBox required two select elements!")
            }

            this._createStructure();
            this._createEvents();

            this._fireEvent('double-select-box-create');
        },

        _drawList: function(){
            var that = this;

            this.list1.clear();
            this.select1.find("option").each(function(i, option){
                const $op = $(option);
                const icon = $op.attr("data-icon");
                let html = $op.attr("data-template") ? $op.attr("data-template").replace(/\$1/g, $op.text()) : $op.text();
                
                if (icon) {
                    html = $("<span>").addClass("icon").append(icon).outerHTML() + html
                }
                
                that.list1.append(
                    $("<li>").html(html).attr("data-value", option.value).data("option", option)
                )
            });

            this.list2.clear();
            this.select2.find("option").each(function(i, option){
                const $op = $(option);
                const icon = $op.attr("data-icon");
                let html = $op.attr("data-template") ? $op.attr("data-template").replace(/\$1/g, $op.text()) : $op.text();

                if (icon) {
                    html = $("<span>").addClass("icon").append(icon).outerHTML() + html
                }
                
                that.list2.append(
                    $("<li>").html(html).attr("data-value", option.value).data("option", option)
                )
            });
        },

        _createStructure: function(){
            var that = this, element = this.element, o = this.options;
            var selects = element.children("select");
            var select1 = selects.eq(0);
            var select2 = selects.eq(1);
            var controls = $("<div>").addClass("controls").insertBefore(select2);
            var list1, list2;

            element.addClass("double-select-box").addClass(o.clsBox).css({
                height: o.height
            });

            selects.prop("multiple", true);

            controls.append(
                $([
                    $("<button>").attr("type", "button").addClass("button square small --move-right").addClass(o.clsMoveButton).addClass(o.clsMoveRightButton).html(`<span class="icon">${o.moveRightIcon}</span>`),
                    $("<button>").attr("type", "button").addClass("button square small --move-right-all").addClass(o.clsMoveButton).addClass(o.clsMoveRightAllButton).html(`<span class="icon">${o.moveRightAllIcon}</span>`),
                    $("<button>").attr("type", "button").addClass("button square small --move-left-all").addClass(o.clsMoveButton).addClass(o.clsMoveLeftAllButton).html(`<span class="icon">${o.moveLeftAllIcon}</span>`),
                    $("<button>").attr("type", "button").addClass("button square small --move-left").addClass(o.clsMoveButton).addClass(o.clsMoveLeftButton).html(`<span class="icon">${o.moveLeftIcon}</span>`),
                ])
            )

            list1 = $("<ul>").addClass("--list1").addClass(o.clsListLeft).insertBefore(select1);
            list2 = $("<ul>").addClass("--list2").addClass(o.clsListRight).insertBefore(select2);


            this.select1 = select1;
            this.select2 = select2;
            this.list1 = list1;
            this.list2 = list2;

            this._drawList();
        },

        _moveItems: function(items, targets){
            $.each(items, function(){
                var $item = $(this);
                var option = $item.data('option');

                $(option).appendTo(targets[0]);
                $item.removeClass("active").appendTo(targets[1]);
            })
        },

        _move: function(dir, scope){
            var that = this;

            if (scope === 'selected') {
                if (dir === 'ltr') { // left to right
                    that._moveItems(this.list1.find("li.active"), [that.select2, that.list2]);
                } else {
                    that._moveItems(this.list2.find("li.active"), [that.select1, that.list1]);
                }
            } else {
                if (dir === 'ltr') { // left to right
                    that._moveItems(this.list1.find("li"), [that.select2, that.list2]);
                } else {
                    that._moveItems(this.list2.find("li"), [that.select1, that.list1]);
                }
            }
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var items = element.find("li");

            items.on("click", function(){
                var $el = $(this);

                if (o.multiSelect === false) {
                    that.list1.find("li").removeClass("active");
                    that.list2.find("li").removeClass("active");
                }

                $el.addClass("active");
            });

            items.on("dblclick", function(){
                var $el = $(this);
                var dir = $el.parent().hasClass("--list1") ? 'ltr' : 'rtl';
                var scope = 'selected';

                that.list1.find("li").removeClass("active");
                that.list2.find("li").removeClass("active");

                $el.addClass("active");

                that._move(dir, scope);
            });

            element.on("click", "button", function(){
                var btn = $(this)
                if (btn.hasClass("--move-right")) {
                    that._move('ltr', 'selected');
                } else if (btn.hasClass("--move-right-all")) {
                    that._move('ltr', 'all');
                } else if (btn.hasClass("--move-left")) {
                    that._move('rtl', 'selected');
                } else if (btn.hasClass("--move-left-all")) {
                    that._move('rtl', 'all');
                } else {
                    throw new Error("Pressed unregistered button!")
                }
            });
        },

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, m4q));
/* eslint-enable */
