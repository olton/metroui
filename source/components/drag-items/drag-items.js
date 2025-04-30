((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let DragItemsDefaultConfig = {
        dragItemsDeferred: 0,
        target: null,
        dragItem: "li",
        dragMarker: ".drag-item-marker",
        drawDragMarker: false,
        clsDragItemAvatar: "",
        clsDragItem: "",
        canDrag: true,
        onDragStartItem: Metro.noop,
        onDragMoveItem: Metro.noop,
        onDragDropItem: Metro.noop,
        onTarget: Metro.noop,
        onTargetIn: Metro.noop, //TODO
        onTargetOut: Metro.noop, //TODO
        onDragItemsCreate: Metro.noop
    };

    Metro.dragItemsSetup = (options) => {
        DragItemsDefaultConfig = $.extend({}, DragItemsDefaultConfig, options);
    };

    if (typeof globalThis.metroDragItemsSetup !== "undefined") {
        Metro.dragItemsSetup(globalThis.metroDragItemsSetup);
    }

    Metro.Component('drag-items', {
        init: function( options, elem ) {
            this._super(elem, options, DragItemsDefaultConfig, {
                id: Metro.utils.elementId("dragItems"),
                canDrag: false
            });

            return this;
        },

        _create: function(){
            const element = this.element;

            this._createStructure();
            this._createEvents();

            this._fireEvent("drag-items-create", {
                element: element
            });
        },

        _createStructure: function(){
            const element = this.element;
            const o = this.options;

            element.addClass("drag-items-target");

            if (o.drawDragMarker === true) {
                element.find(o.dragItem).each(function(){
                    $("<span>").addClass("drag-item-marker").appendTo(this);
                })
            }

            o.canDrag ? this.on() : this.off();
        },

        _createEvents: function(){
            const element = this.element;
            const o = this.options;
            const doc = $.document();
            const body = $.body();
            let offset;
            const shift = {top: 0, left: 0};
            let width;
            let height;

            const move = (e, avatar, dragItem)=> {
                const x = Metro.utils.pageXY(e).x;
                const y = Metro.utils.pageXY(e).y;
                const _top = y - shift.top;
                const _left = x - shift.left;

                avatar.css({
                    top: _top,
                    left: _left
                });

                const target = document.elementsFromPoint(x, y).filter((el)=> $(el).hasClass('drag-items-target'));

                if (target.length === 0) {
                    return;
                }

                this._fireEvent("target", {
                    target: target
                });

                const sibling = document.elementsFromPoint(x, y).filter((el)=> {
                    const $el = $(el);
                    return $.matches(el, o.dragItem) && !$el.hasClass("dragged-item-avatar");
                })[0];

                if (!Metro.utils.isValue(sibling)) {
                    dragItem.appendTo(target);
                } else {
                    const $sibling = $(sibling);
                    const $sibling_offset = $sibling.offset();
                    const offsetY = y - $sibling_offset.top;
                    const offsetX = x - $sibling_offset.left;
                    let side;
                    const dim = {w: $sibling.width(), h: $sibling.height()};

                    if (offsetX < dim.w / 3 && (offsetY < dim.h / 2 || offsetY > dim.h / 2)) {
                        side = 'left';
                    } else if (offsetX > dim.w * 2 / 3 && (offsetY < dim.h / 2 || offsetY > dim.h / 2)) {
                        side = 'right';
                    } else if (offsetX > dim.w / 3 && offsetX < dim.w * 2 / 3 && offsetY > dim.h / 2) {
                        side = 'bottom';
                    } else {
                        side = "top";
                    }

                    if (!$sibling.hasClass("dragged-item")) {
                        if (side === "top" || side === "left") {
                            dragItem.insertBefore($sibling);
                        } else {
                            dragItem.insertAfter($sibling);
                        }
                    }
                }
            };

            element.on(Metro.events.startAll, (o.drawDragMarker ? o.dragMarker : o.dragItem), (e_start)=> {
                const dragItem = $(e_start.target).closest(o.dragItem);

                if (Metro.utils.isRightMouse(e_start)) {
                    return ;
                }

                if (this.canDrag !== true) {
                    return ;
                }

                dragItem.addClass("dragged-item").addClass(o.clsDragItem);
                const avatar = $("<div>").addClass("dragged-item-avatar").addClass(o.clsDragItemAvatar)
                offset = dragItem.offset();
                width = dragItem.width();
                height = dragItem.height();
                shift.top = Metro.utils.pageXY(e_start).y - offset.top;
                shift.left = Metro.utils.pageXY(e_start).x - offset.left;

                avatar.css({
                    top: offset.top,
                    left: offset.left,
                    width: width,
                    height: height
                }).appendTo(body);

                this._fireEvent("drag-start-item", {
                    dragItem: dragItem[0],
                    avatar: avatar[0]
                });

                doc.on(Metro.events.moveAll, (e_move)=> {
                    move(e_move, avatar, dragItem);
                    this._fireEvent("drag-move-item", {
                        dragItem: dragItem[0],
                        avatar: avatar[0]
                    });
                    e_move.preventDefault();
                }, {ns: this.id, passive: false});

                doc.on(Metro.events.stopAll, ()=> {
                    this._fireEvent("drag-drop-item", {
                        dragItem: dragItem[0],
                        avatar: avatar[0]
                    });
                    dragItem.removeClass("dragged-item").removeClass(o.clsDragItem);
                    avatar.remove();
                    doc.off(Metro.events.moveAll, {ns: this.id});
                    doc.off(Metro.events.stopAll, {ns: this.id});
                }, {ns: this.id});

                if (o.drawDragMarker) {
                    e_start.preventDefault();
                    e_start.stopPropagation();
                }
            });
        },

        on: function(){
            this.canDrag = true;
            this.element.find(".drag-item-marker").show();
        },

        off: function(){
            this.canDrag = false;
            this.element.find(".drag-item-marker").hide();
        },

        toggle: function(){
            this.canDrag = this.canDrag ? this.off() : this.on();
        },

        changeAttribute: function(attributeName){
            const element = this.element;
            const o = this.options;
            const changeCanDrag = ()=> {
                o.canDtag = JSON.parse(element.attr("data-can-drag"));
                o.canDtag ? this.on() : this.off();
            };

            if (attributeName === "data-can-drag") {
                changeCanDrag();
            }
        },

        destroy: function(){
            const element = this.element;
            const o = this.options;
            element.off(Metro.events.startAll, (o.drawDragMarker ? o.dragMarker : o.dragItem));
            return element;
        }
    });
})(Metro, Dom);