(function(Metro, $) {
    'use strict';

    let DraggableDefaultConfig = {
        dragContext: null,
        draggableDeferred: 0,
        dragElement: 'self',
        dragArea: "parent",
        timeout: 0,
        boundaryRestriction: true,
        onCanDrag: Metro.noop_true,
        onDragStart: Metro.noop,
        onDragStop: Metro.noop,
        onDragMove: Metro.noop,
        onDraggableCreate: Metro.noop
    };

    Metro.draggableSetup = function (options) {
        DraggableDefaultConfig = $.extend({}, DraggableDefaultConfig, options);
    };

    if (typeof globalThis["metroDraggableSetup"] !== undefined) {
        Metro.draggableSetup(globalThis["metroDraggableSetup"]);
    }

    Metro.Component('draggable', {
        init: function( options, elem ) {
            this._super(elem, options, DraggableDefaultConfig, {
                drag: false,
                move: false,
                backup: {
                    cursor: 'default',
                    zIndex: '0'
                },
                dragArea: null,
                dragElement: null,
                id: Metro.utils.elementId("draggable")
            });

            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();

            this._fireEvent("draggable-create", {
                element: this.element
            });
        },

        _createStructure: function(){
            const that = this, element = this.element, o = this.options;
            const offset = element.offset();
            const dragElement = o.dragElement !== 'self' ? element.find(o.dragElement) : element;

            element.data("canDrag", true);

            this.dragElement = dragElement;

            dragElement[0].ondragstart = function(){return false;};

            element.css("position", "absolute");

            if (o.dragArea === 'document' || o.dragArea === 'window') {
                o.dragArea = "body";
            }

            setTimeout(function(){
                that.dragArea = o.dragArea === 'parent' ? element.parent() : $(o.dragArea);
                if (that.dragArea.css("position") === "static") {
                    that.dragArea.css("position", "relative");                    
                }
                if (o.dragArea !== 'parent') {
                    element.appendTo(that.dragArea);
                    element.css({
                        top: offset.top,
                        left: offset.left
                    });
                }
            });

            if (!element.attr("id")) {
                element.attr("id", Metro.utils.elementId("draggable"));
            }
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;
            const position = {
                x: 0,
                y: 0
            };

            this.dragElement.on(Metro.events.startAll, function(e){
                const coord = element.position(),
                    shiftX = Metro.utils.pageXY(e).x - coord.left,
                    shiftY = Metro.utils.pageXY(e).y - coord.top;

                const moveElement = function (e) {
                    let top = Metro.utils.pageXY(e).y - shiftY;
                    let left = Metro.utils.pageXY(e).x - shiftX;

                    if (o.boundaryRestriction) {
                        if (top < 0) top = 0;
                        if (left < 0) left = 0;

                        if (top > that.dragArea.outerHeight() - element.outerHeight()) top = that.dragArea.outerHeight() - element.outerHeight();
                        if (left > that.dragArea.outerWidth() - element.outerWidth()) left = that.dragArea.outerWidth() - element.outerWidth();
                    }

                    position.y = top;
                    position.x = left;

                    element.css({
                        left: left,
                        top: top
                    });

                    that._fireEvent("drag-move", {
                        position: position,
                        context: o.dragContext
                    });
                };

                if (element.data("canDrag") === false || Metro.utils.exec(o.onCanDrag, [element]) !== true) {
                    return ;
                }

                if (Metro.isTouchable === false && e.which !== 1) {
                    return ;
                }

                that.drag = true;

                element.addClass("draggable");

                that._fireEvent("drag-start", {
                    position: position,
                    context: o.dragContext
                });

                $(document).on(Metro.events.moveAll, moveElement, {ns: that.id, passive: false});

                $(document).on(Metro.events.stopAll, function(){
                    element.removeClass("draggable");

                    $(document).off(Metro.events.moveAll, {ns: that.id});
                    $(document).off(Metro.events.stopAll, {ns: that.id});

                    that.drag = false;
                    that.move = false;

                    that._fireEvent("drag-stop", {
                        position: position,
                        context: o.dragContext
                    });
                }, {ns: that.id});
            });
        },

        off: function(){
            this.element.data("canDrag", false);
        },

        on: function(){
            this.element.data("canDrag", true);
        },

        /* eslint-disable-next-line */
        changeAttribute: function(attributeName, newValue){
        },

        destroy: function(){
            const element = this.element;
            this.dragElement.off(Metro.events.startAll);
            return element;
        }
    });
}(Metro, m4q));