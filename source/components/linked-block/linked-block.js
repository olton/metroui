((Metro, $) => {
    let LinkedBlockDefaultConfig = {
        draggable: true,
        resizable: false,
        width: null,
        height: null,
        minWidth: 100,
        minHeight: 100,
        maxWidth: null,
        maxHeight: null,
        content: "",
        showAddButtons: true,
        initialPoints: {
            north: 0,
            east: 0,
            south: 0,
            west: 0,
        },
        onLinkedBlockCreate: Metro.noop,
        onLinkedBlockDestroy: Metro.noop,
        onPointAdd: Metro.noop,
        onPointRemove: Metro.noop,
        onConnect: Metro.noop,
        onDisconnect: Metro.noop,
        onDragStart: Metro.noop,
        onDragMove: Metro.noop,
        onDragEnd: Metro.noop,
        onHover: Metro.noop,
        onLeave: Metro.noop,
    };

    Metro.linkedBlockSetup = (options) => {
        LinkedBlockDefaultConfig = $.extend({}, LinkedBlockDefaultConfig, options);
    };

    if (typeof window.metroLinkedBlockSetup !== "undefined") {
        Metro.linkedBlockSetup(window.metroLinkedBlockSetup);
    }

    Metro.Component("linked-block", {
        init: function (options, elem) {
            this._super(elem, options, LinkedBlockDefaultConfig, {
                pointCount: 0,
                connections: new Map(),
                hoverButtons: [],
                isDragging: false,
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createInitialPoints();
            this._createEvents();
            this._setupDraggable();
            this._setupResizable();

            this._fireEvent("linked-block-create", {
                element: element,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            // Встановлюємо ID якщо немає
            if (!element.attr("id")) {
                element.attr("id", `linked-block-${Hooks.useId(element[0])}`);
            }

            // Додаємо основні класи
            element.addClass("linked-block");

            // Встановлюємо розміри
            if (o.width) element.css("width", o.width);
            if (o.height) element.css("height", o.height);
            if (o.minWidth) element.css("min-width", o.minWidth);
            if (o.minHeight) element.css("min-height", o.minHeight);
            if (o.maxWidth) element.css("max-width", o.maxWidth);
            if (o.maxHeight) element.css("max-height", o.maxHeight);

            // Створюємо структуру сторін
            this._createSides();

            // Додаємо контент
            this._createContent();

            // Створюємо кнопки додавання точок
            if (o.showAddButtons) {
                this._createAddButtons();
            }
        },

        _createSides: function () {
            const element = this.element;

            const sides = [
                { name: "north-side", position: "top" },
                { name: "east-side", position: "right" },
                { name: "south-side", position: "bottom" },
                { name: "west-side", position: "left" },
            ];

            sides.forEach((side) => {
                const sideElement = $("<div>").addClass(`side ${side.name}`).attr("data-side", side.position);
                element.append(sideElement);
            });
        },

        _createContent: function () {
            const element = this.element;
            const o = this.options;

            // Створюємо контейнер для контенту
            let contentContainer = element.find(".block-content");
            if (contentContainer.length === 0) {
                contentContainer = $("<div>").addClass("block-content").css({
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "calc(100% - 20px)",
                    height: "calc(100% - 20px)",
                    textAlign: "center",
                });
                element.append(contentContainer);
            }

            // Додаємо контент
            if (o.content) {
                contentContainer.html(o.content);
            } else if (element.text().trim() && !element.find(".side").length) {
                // Переносимо існуючий текст у контентний контейнер
                const existingContent = element.html();
                element.empty();
                this._createSides();
                contentContainer = $("<div>")
                    .addClass("block-content")
                    .css({
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "calc(100% - 20px)",
                        height: "calc(100% - 20px)",
                        textAlign: "center",
                    })
                    .html(existingContent);
                element.append(contentContainer);
            }
        },

        _createInitialPoints: function () {
            const o = this.options;

            // Створюємо початкові точки згідно конфігурації
            Object.keys(o.initialPoints).forEach((side) => {
                const count = o.initialPoints[side];
                for (let i = 0; i < count; i++) {
                    this.addPoint(side);
                }
            });
        },

        _createAddButtons: function () {
            const element = this.element;

            const sides = ["north", "east", "south", "west"];

            sides.forEach((side) => {
                const button = $("<button>")
                    .addClass(`add-point-btn add-point-${side}`)
                    .attr("type", "button")
                    .attr("data-side", side)
                    .text("+");

                element.append(button);
                this.hoverButtons.push(button);
            });
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const self = this;

            // Обробка hover для показу кнопок додавання
            if (o.showAddButtons) {
                element.on("mouseenter.linked-block", () => {
                    if (!self.isDragging) {
                        self.hoverButtons.forEach((btn) => btn.show());
                        self._fireEvent("hover", { element: element });
                    }
                });

                element.on("mouseleave.linked-block", () => {
                    self.hoverButtons.forEach((btn) => btn.hide());
                    self._fireEvent("leave", { element: element });
                });

                // Обробка кліків по кнопках додавання точок
                element.on("click.linked-block", ".add-point-btn", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const side = $(this).attr("data-side");
                    self.addPoint(side);
                });
            }

            // Обробка подвійного кліку для додавання точки
            element.on("dblclick.linked-block", (e) => {
                e.preventDefault();
                const rect = element[0].getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const side = self._getSideFromCoordinates(x, y, rect.width, rect.height);
                self.addPoint(side);
            });

            // Обробка кліку по точці з'єднання для видалення
            element.on("contextmenu.linked-block", ".link-point", function (e) {
                e.preventDefault();
                const pointId = $(this).attr("id");
                self.removePoint(pointId);
            });
        },

        _setupDraggable: function () {
            const element = this.element;
            const o = this.options;
            const self = this;

            if (o.draggable) {
                // Додаємо draggable через Metro UI
                Metro.makePlugin(element, "draggable", {
                    onDragStart: () => {
                        const { top, left } = element.rect();
                        Metro.utils.exec(o.onDragStart, [{ top, left }, element]);
                    },
                    onDragMove: () => {
                        self.hoverButtons.forEach((btn) => btn.hide());
                        self._updateConnections();
                        const { top, left } = element.rect();
                        Metro.utils.exec(o.onDragMove, [{ top, left }, element]);
                    },
                    onDragStop: () => {
                        self.hoverButtons.forEach((btn) => btn.show());
                        self._updateConnections();
                        const { top, left } = element.rect();
                        Metro.utils.exec(o.onDragStop, [{ top, left }, element]);
                    },
                });
            }
        },

        _setupResizable: function () {
            const element = this.element;
            const o = this.options;

            if (o.resizable) {
                Metro.makePlugin(element, "resizable", {
                    minWidth: o.minWidth,
                    minHeight: o.minHeight,
                    maxWidth: o.maxWidth,
                    maxHeight: o.maxHeight,
                    onResize: () => {
                        const { width, height } = element.rect();
                        this._updateConnections();
                        Metro.utils.exec(o.onResize, [{ width, height }, element]);
                    },
                });
            }
        },

        _getSideFromCoordinates: (x, y, width, height) => {
            const threshold = 20;

            if (y < threshold) return "north";
            if (y > height - threshold) return "south";
            if (x < threshold) return "west";
            if (x > width - threshold) return "east";

            // За замовчуванням повертаємо найближчу сторону
            const distances = {
                north: y,
                south: height - y,
                west: x,
                east: width - x,
            };

            return Object.keys(distances).reduce((a, b) => (distances[a] < distances[b] ? a : b));
        },

        _updateConnections: function () {
            // Оновлюємо всі з'єднання цього блока
            this.connections.forEach((connection) => {
                if (connection.connector?.update) {
                    connection.connector.update();
                }
            });
        },

        _generatePointId: function (side) {
            const element = this.element;
            const blockId = element.attr("id");
            return `${blockId}_${side}_${this.pointCount++}`;
        },

        // Публічні методи
        addPoint: function (side) {
            const element = this.element;
            const validSides = ["north", "east", "south", "west"];

            if (validSides.indexOf(side) === -1) {
                console.warn("LinkedBlock: невірна сторона. Доступні: north, east, south, west");
                return null;
            }

            const pointId = this._generatePointId(side);
            const point = $("<div>").addClass("link-point").attr("id", pointId).attr("data-side", side);

            const sideElement = element.find(`.${side}-side`);
            sideElement.append(point);

            this._fireEvent("point-add", {
                element: element,
                point: point,
                side: side,
                pointId: pointId,
            });

            return point;
        },

        removePoint: function (pointId) {
            const element = this.element;
            const point = element.find(`#${pointId}`);

            if (point.length === 0) {
                return false;
            }

            // Видаляємо всі з'єднання цієї точки
            this.disconnectPoint(pointId);

            // Видаляємо точку
            const side = point.attr("data-side");
            point.remove();

            this._fireEvent("point-remove", {
                element: element,
                pointId: pointId,
                side: side,
            });

            return true;
        },

        getPoints: function (side = null) {
            const element = this.element;

            if (side) {
                return element.find(`.${side}-side .link-point`);
            }

            return element.find(".link-point");
        },

        connect: function (targetBlock, options = {}) {
            const element = this.element;
            const target = $(targetBlock);

            if (target.length === 0) {
                console.warn("LinkedBlock: цільовий блок не знайдено");
                return null;
            }

            // Знаходимо точки для з'єднання
            const sourcePoints = this.getPoints();
            const targetPoints = target.find(".link-point");

            if (sourcePoints.length === 0 || targetPoints.length === 0) {
                console.warn("LinkedBlock: не знайдено точок для з'єднання");
                return null;
            }

            // Беремо перші доступні точки або створюємо нові
            const sourcePoint = options.sourcePoint ? $(options.sourcePoint) : sourcePoints.first();
            const targetPoint = options.targetPoint ? $(options.targetPoint) : targetPoints.first();

            // Створюємо з'єднання через connector
            if (Metro.connector?.create) {
                const connector = Metro.connector.create(sourcePoint, targetPoint, {
                    type: options.type || "curve",
                    container: options.container || element.parent(),
                });

                const connectionId = `${element.attr("id")}-${target.attr("id")}-${Date.now()}`;

                this.connections.set(connectionId, {
                    target: target,
                    sourcePoint: sourcePoint,
                    targetPoint: targetPoint,
                    connector: connector,
                    options: options,
                });

                this._fireEvent("connect", {
                    element: element,
                    target: target,
                    sourcePoint: sourcePoint,
                    targetPoint: targetPoint,
                    connector: connector,
                    connectionId: connectionId,
                });

                this._updateConnections();

                return {
                    id: connectionId,
                    connector: connector,
                    sourcePoint: sourcePoint,
                    targetPoint: targetPoint,
                };
            }

            this._updateConnections();

            return null;
        },

        disconnect: function (connectionId) {
            const connection = this.connections.get(connectionId);

            if (!connection) {
                return false;
            }

            // Знищуємо connector
            if (connection.connector?.destroy) {
                connection.connector.destroy();
            }

            this.connections.delete(connectionId);

            this._fireEvent("disconnect", {
                element: this.element,
                connectionId: connectionId,
            });

            return true;
        },

        disconnectPoint: function (pointId) {
            const connectionsToRemove = [];

            this.connections.forEach((connection, id) => {
                if (connection.sourcePoint.attr("id") === pointId || connection.targetPoint.attr("id") === pointId) {
                    connectionsToRemove.push(id);
                }
            });

            connectionsToRemove.forEach((id) => this.disconnect(id));
            return connectionsToRemove.length;
        },

        disconnectAll: function () {
            const connectionIds = Array.from(this.connections.keys());
            connectionIds.forEach((id) => this.disconnect(id));
            return connectionIds.length;
        },

        setContent: function (content) {
            const element = this.element;
            let contentContainer = element.find(".block-content");

            if (contentContainer.length === 0) {
                this._createContent();
                contentContainer = element.find(".block-content");
            }

            contentContainer.html(content);
            this.options.content = content;
        },

        getContent: function () {
            const element = this.element;
            const contentContainer = element.find(".block-content");
            return contentContainer.length ? contentContainer.html() : "";
        },

        getConnections: function () {
            return Array.from(this.connections.values());
        },

        changeAttribute: function (attr, newValue) {
            const o = this.options;

            switch (attr) {
                case "data-draggable":
                    o.draggable = Metro.utils.isValue(newValue);
                    this._setupDraggable();
                    break;
                case "data-resizable":
                    o.resizable = Metro.utils.isValue(newValue);
                    this._setupResizable();
                    break;
                case "data-content":
                    this.setContent(newValue);
                    break;
            }
        },

        destroy: function () {
            const element = this.element;

            // Видаляємо всі з'єднання
            this.disconnectAll();

            // Видаляємо обробники подій
            element.off(".linked-block");

            // Видаляємо кнопки hover
            this.hoverButtons.forEach((btn) => btn.remove());
            this.hoverButtons = [];

            this._fireEvent("linked-block-destroy", {
                element: element,
            });

            return element;
        },
    });

    // Статичні методи для роботи з блоками
    Metro.linkedBlock = {
        create: (options = {}) => {
            const defaultOptions = {
                id: null,
                container: null,
                content: options.content || "Block",
                draggable: true,
            };

            const config = $.extend({}, defaultOptions, options);

            const element = $("<div>")
                .attr("data-role", "linked-block")
                .css({
                    position: "absolute",
                    top: config.top || 100,
                    left: config.left || 100,
                });

            if (config.id) {
                element.id(config.id);
            }

            if (config.container) {
                $(config.container).append(element);
            } else {
                $("body").append(element);
            }

            return Metro.makePlugin(element, "linked-block", config);
        },
    };
})(Metro, Dom);
