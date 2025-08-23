((Metro, $) => {
    // Глобальний стан з'єднання
    let globalConnectionState = {
        isConnecting: false,
        sourceBlock: null,
        sourcePoint: null,
        tempConnector: null,
        mouseFollower: null,
    };

    let LinkedBlockDefaultConfig = {
        draggable: true,
        resizable: false,
        width: null,
        height: null,
        minWidth: 0,
        minHeight: 0,
        maxWidth: null,
        maxHeight: null,
        content: "",
        showAddButtons: true,
        resizeHotkey: null,
        onAddPoint: Metro.noop,
        onRemovePoint: Metro.noop,
        onStartConnection: Metro.noop,
        onCancelConnection: Metro.noop,
        onConnect: Metro.noop,
        onDisconnect: Metro.noop,
        onDragStart: Metro.noop,
        onDragMove: Metro.noop,
        onDragEnd: Metro.noop,
        onLinkedBlockCreate: Metro.noop,
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
            });
            return this;
        },

        _create: function () {
            const element = this.element;

            this._createStructure();
            this._createEvents();
            this._setupDraggable();
            this._setupResizable();

            Metro.utils.exec(this.options.onLinkedBlockCreate, [element]);
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

            const _content = element.innerHTML;

            let contentContainer = element.find(".linked-block-content");
            if (contentContainer.length === 0) {
                contentContainer = $("<div>").addClass("linked-block-content");
                element.append(contentContainer);
            }
            contentContainer.html(_content || o.content);

            // Створюємо структуру сторін
            this._createSides();

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
                    self.hoverButtons.forEach((btn) => btn.show());
                    self._fireEvent("hover", { element: element });
                });

                element.on("mouseleave.linked-block", () => {
                    if (!self.isConnecting) {
                        self.hoverButtons.forEach((btn) => btn.hide());
                    }

                    self._fireEvent("leave", { element: element });
                });

                // Обробка кліків по кнопках додавання точок
                element.on("click.linked-block", ".add-point-btn", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const side = $(this).attr("data-side");

                    if (globalConnectionState.isConnecting) {
                        // Завершення з'єднання
                        self._completeConnection($(this), side);
                    } else {
                        // Початок з'єднання
                        self._startConnection($(this), side);
                    }
                    self._updateConnections();
                });
            }

            element.on("click.linked-block", (e) => {
                $(".linked-block").removeClass("active-block");
                element.toggleClass("active-block");
                e.stopPropagation();
            });

            if (o.resizeHotkey) {
                $("body").hotkey(o.resizeHotkey, () => {
                    const activeBlock = $(".linked-block.active-block");
                    const canResize = activeBlock.attr("data-can-resize")
                        ? JSON.parse(activeBlock.attr("data-can-resize"))
                        : false;
                    activeBlock.attr("data-can-resize", !canResize);
                });
            }
        },

        _setupDraggable: function () {
            const element = this.element;
            const o = this.options;

            if (o.draggable) {
                // Додаємо draggable через Metro UI
                Metro.makePlugin(element, "draggable", {
                    onDragStart: () => {
                        const { top, left } = element.rect();
                        Metro.utils.exec(o.onDragStart, [{ top, left }, element]);
                    },
                    onDragMove: () => {
                        this.hoverButtons.forEach((btn) => btn.hide());
                        this._updateConnections();
                        const { top, left } = element.rect();
                        Metro.utils.exec(o.onDragMove, [{ top, left }, element]);
                    },
                    onDragStop: () => {
                        this.hoverButtons.forEach((btn) => btn.show());
                        this._updateConnections();
                        const { top, left } = element.rect();
                        Metro.utils.exec(o.onDragEnd, [{ top, left }, element]);
                    },
                });
            }
        },

        _setupResizable: function () {
            const element = this.element;
            const o = this.options;

            if (o.resizable) {
                Metro.makePlugin(element, "resizable", {
                    canResize: false,
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

        _startConnection: function (button, side) {
            Metro.utils.exec(this.options.onStartConnection, [button, side]);
            this._fireEvent("start-connection", {
                element: this.element,
                button: button,
                side: side,
            });

            // Додаємо нову точку
            const newPoint = this.addPoint(side);
            const newPointRect = newPoint.rect();

            // Створюємо тимчасову точку
            const tempPoint = this._createTempPoint();
            tempPoint.css({
                top: newPointRect.y,
                left: newPointRect.x,
            });
            tempPoint.addClass("temp-point");

            // Встановлюємо глобальний стан з'єднання
            globalConnectionState.isConnecting = true;
            globalConnectionState.sourceBlock = this;
            globalConnectionState.sourcePoint = newPoint;

            // Створюємо тимчасовий лінійний коннектор
            const tempId = `temp-connector-${Date.now()}`;

            try {
                globalConnectionState.tempConnector = Metro.connector.create(
                    newPoint, // передаємо DOM елемент
                    tempPoint, // передаємо DOM елемент
                    {
                        type: "line",
                        container: this.element.parent(),
                        id: tempId,
                        autoUpdate: false,
                    },
                );
            } catch (error) {
                console.error("Error creating temp connector:", error);
                this._cancelConnection();
                return;
            }

            // Створюємо елемент для слідування за мишею
            globalConnectionState.mouseFollower = $("<div>")
                .addClass("temp-connection-point")
                .css({
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    pointerEvents: "none",
                    zIndex: 1000,
                })
                .appendTo(this.element.parent());

            button.addClass("connecting");
        },

        _updateMouseFollower: function (clientX, clientY) {
            if (!globalConnectionState.mouseFollower || !globalConnectionState.tempConnector) {
                return;
            }

            const container = this.element.parent();

            if (typeof container === "undefined") {
                return;
            }

            const containerOffset = container.offset();

            const x = clientX - containerOffset.left;
            const y = clientY - containerOffset.top;

            globalConnectionState.mouseFollower.css({
                left: x,
                top: y,
            });

            // Також оновлюємо тимчасову точку в коннекторі
            const tempPoint = $(globalConnectionState.tempConnector.options.pointB);
            tempPoint.css({
                left: x,
                top: y,
            });

            // Оновлюємо тимчасовий коннектор
            try {
                globalConnectionState.tempConnector.update();
            } catch (error) {
                console.error("Error updating temp connector:", error);
            }
        },

        _completeConnection: function (targetButton, targetSide) {
            const o = this.options;
            const targetBlock = targetButton.closest(".linked-block");
            const targetBlockInstance = Metro.getPlugin(targetBlock[0], "linked-block");

            if (!targetBlockInstance || targetBlock[0] === globalConnectionState.sourceBlock.element[0]) {
                this._cancelConnection();
                return;
            }

            // Додаємо точку на цільовому блоці
            const targetPoint = targetBlockInstance.addPoint(targetSide);

            // Видаляємо тимчасовий коннектор
            if (globalConnectionState.tempConnector) {
                globalConnectionState.tempConnector.destroy();
            }

            // Створюємо постійне з'єднання типу curve
            const connectionId = `connection-${Date.now()}`;
            const connector = Metro.connector.create(globalConnectionState.sourcePoint[0], targetPoint[0], {
                // type: connector.options.type || "curve",
                container: globalConnectionState.sourceBlock.element.parent(),
                id: connectionId,
                autoUpdate: true,
            });

            // Зберігаємо з'єднання в обох блоків
            const connectionData = {
                connector: connector,
                sourceBlock: this.element[0],
                targetBlock: targetBlock[0],
                sourcePoint: globalConnectionState.sourcePoint,
                targetPoint: targetPoint,
            };

            // globalConnectionState.sourceBlock.connections.set(connectionId, connectionData);
            this.connections.set(connectionId, connectionData);
            targetBlockInstance.connections.set(connectionId, connectionData);

            // Викликаємо callback
            Metro.utils.exec(o.onConnect, [
                connectionId,
                this.element[0],
                targetBlock[0],
                globalConnectionState.sourcePoint,
                targetPoint,
                connector,
            ]);
            this._fireEvent("connect", { connectionId, ...connectionData });

            this._resetConnectionState();
        },

        _cancelConnection: function () {
            Metro.utils.exec(this.options.onCancelConnection);
            this._fireEvent("cancel-connection", {
                element: this.element,
            });

            // Видаляємо створену точку
            if (globalConnectionState.sourcePoint) {
                $(globalConnectionState.sourcePoint).remove();
            }

            // Видаляємо тимчасовий коннектор
            if (globalConnectionState.tempConnector) {
                globalConnectionState.tempConnector.destroy();
            }

            this._resetConnectionState();
        },

        _resetConnectionState: () => {
            // Очищуємо елемент слідування за мишею
            if (globalConnectionState.mouseFollower) {
                globalConnectionState.mouseFollower.remove();
            }

            // Очищуємо глобальний стан з'єднання
            globalConnectionState = {
                isConnecting: false,
                sourceBlock: null,
                sourcePoint: null,
                tempConnector: null,
                mouseFollower: null,
            };

            // Відновлюємо нормальний стан кнопок
            $(".add-point-btn").removeClass("connecting connection-target").hide();

            // Показуємо кнопки тільки на поточному блоці при hover
            $(".linked-block").each(function () {
                const blockInstance = Metro.getPlugin(this, "linked-block");
                if (blockInstance && $(this).is(":hover")) {
                    blockInstance.hoverButtons.forEach((btn) => btn.show());
                }
            });
        },

        _createTempPoint: function () {
            const container = this.element.parent();
            return $("<div>")
                .addClass("temp-point")
                .css({
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    left: "0px",
                    top: "0px",
                    zIndex: -1,
                })
                .appendTo(container);
        },

        // Перевірка, чи точка вже задіяна у будь-якому з'єднанні цього блоку
        _isPointBusy: function (pointEl) {
            const pid = $(pointEl).attr("id");
            let busy = false;
            this.connections.forEach((connection) => {
                if (connection.sourcePoint?.attr("id") === pid || connection.targetPoint?.attr("id") === pid) {
                    busy = true;
                }
            });
            return busy;
        },

        // Повертає першу вільну точку на стороні або null
        _findFreePoint: function (side) {
            const pts = this.getPoints(side);
            for (let i = 0; i < pts.length; i++) {
                const p = $(pts[i]);
                if (!this._isPointBusy(p)) return p;
            }
            return null;
        },

        // Повертає першу вільну точку на будь-якій стороні (DOM-порядок сторін)
        _findAnyFreePoint: function () {
            const pts = this.getPoints(); // всі точки: north, east, south, west у DOM-порядку сторін
            for (let i = 0; i < pts.length; i++) {
                const p = $(pts[i]);
                if (!this._isPointBusy(p)) return p;
            }
            return null;
        },

        // Повертає вільну точку на стороні або створює нову
        _getOrCreatePoint: function (side) {
            return this._findFreePoint(side) || this.addPoint(side);
        },

        // Публічні методи
        addPoint: function (side) {
            const element = this.element;
            const o = this.options;
            const validSides = ["north", "east", "south", "west"];

            if (validSides.indexOf(side) === -1) {
                console.warn("LinkedBlock: невірна сторона. Доступні: north, east, south, west");
                return null;
            }

            const pointId = this._generatePointId(side);
            const point = $("<div>").addClass("link-point").attr("id", pointId).attr("data-side", side);

            const sideElement = element.find(`.${side}-side`);
            sideElement.append(point);

            Metro.utils.exec(o.onAddPoint, [point[0], side, pointId, element[0]], element[0]);

            this._fireEvent("add-point", {
                element: element,
                point: point,
                side: side,
                pointId: pointId,
            });

            return point;
        },

        removePoint: function (pointId) {
            const element = this.element;
            const o = this.options;
            const point = element.find(`#${pointId}`);

            if (point.length === 0) {
                return false;
            }

            // Видаляємо всі з'єднання цієї точки
            this.disconnectPoint(pointId);

            // Видаляємо точку
            const side = point.attr("data-side");

            Metro.utils.exec(o.onRemovePoint, [point[0], side, pointId, element[0]], element[0]);

            point.remove();

            this._fireEvent("remove-point", {
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
            const o = this.options;
            const target = targetBlock.element ? targetBlock.element : $(targetBlock);

            if (target.length === 0) {
                console.warn("LinkedBlock: цільовий блок не знайдено");
                return null;
            }

            // Визначаємо інстанс цільового блоку
            const targetInst = Metro.getPlugin(target[0], "linked-block");
            if (!targetInst) {
                console.warn("LinkedBlock: інстанс цільового блоку не знайдено");
                return null;
            }

            // Якщо користувач явно передав точки - використати їх без зміни логіки
            if (options.sourcePoint && options.targetPoint) {
                const sourcePoint = $(options.sourcePoint);
                const targetPoint = $(options.targetPoint);

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

                    targetInst.connections.set(connectionId, {
                        target: element,
                        sourcePoint: sourcePoint,
                        targetPoint: targetPoint,
                        connector: connector,
                        options: options,
                    });

                    Metro.utils.exec(
                        o.onConnect,
                        [target[0], sourcePoint[0], targetPoint[0], connector.element[0]],
                        element[0],
                    );

                    this._fireEvent("connect", {
                        element: element[0],
                        target: target[0],
                        sourcePoint: sourcePoint[0],
                        targetPoint: targetPoint[0],
                        connector: connector.element[0],
                        connectionId: connectionId,
                    });

                    this._updateConnections();

                    return {
                        id: connectionId,
                        connector: connector.element[0],
                        sourcePoint: sourcePoint[0],
                        targetPoint: targetPoint[0],
                    };
                }

                this._updateConnections();
                return null;
            }

            // 0) Спочатку шукаємо вільні точки на обох блоках
            const freeSrc = this._findAnyFreePoint();
            const freeTgt = targetInst._findAnyFreePoint();

            if (freeSrc && freeTgt) {
                // Якщо є вільні точки на обох — з'єднуємо їх без створення нових
                if (Metro.connector?.create) {
                    const connector = Metro.connector.create(freeSrc, freeTgt, {
                        type: options.type || "curve",
                        container: options.container || element.parent(),
                    });

                    const connectionId = `${element.attr("id")}-${target.attr("id")}-${Date.now()}`;

                    this.connections.set(connectionId, {
                        target: target,
                        sourcePoint: freeSrc,
                        targetPoint: freeTgt,
                        connector: connector,
                        options: options,
                    });

                    targetInst.connections.set(connectionId, {
                        target: element,
                        sourcePoint: freeSrc,
                        targetPoint: freeTgt,
                        connector: connector,
                        options: options,
                    });

                    Metro.utils.exec(
                        o.onConnect,
                        [target[0], freeSrc[0], freeTgt[0], connector.element[0]],
                        element[0],
                    );

                    this._fireEvent("connect", {
                        element: element[0],
                        target: target[0],
                        sourcePoint: freeSrc[0],
                        targetPoint: freeTgt[0],
                        connector: connector.element[0],
                        connectionId: connectionId,
                    });

                    this._updateConnections();

                    return {
                        id: connectionId,
                        connector: connector.element[0],
                        sourcePoint: freeSrc[0],
                        targetPoint: freeTgt[0],
                    };
                }

                this._updateConnections();
                return null;
            }

            // Отримуємо геометрію блоків
            const srcRect = element.rect();
            const tgtRect = target.rect();

            // Визначаємо сторони за правилами:
            // 1) Якщо північний бік першого блоку вище за другий блок => north(first) -> south(second)
            // 2) Якщо північний бік другого блоку вище за перший блок => north(second) -> south(first)
            // 3) Якщо перший блок зліва від другого => east(first) -> west(second)
            // 4) Якщо перший блок справа від другого => west(first) -> east(second)
            let sourceSide = null;
            let targetSide = null;

            if (srcRect.top + srcRect.height < tgtRect.top) {
                // перший блок вище другого
                sourceSide = "north";
                targetSide = "south";
            } else if (tgtRect.top + tgtRect.height < srcRect.top) {
                // другий блок вище першого
                sourceSide = "south";
                targetSide = "north";
            } else if (srcRect.left < tgtRect.left) {
                // перший зліва від другого
                sourceSide = "east";
                targetSide = "west";
            } else if (tgtRect.left < srcRect.left) {
                // перший справа від другого (або рівно)
                sourceSide = "west";
                targetSide = "east";
            }

            // Підбираємо або створюємо точки згідно сторін, віддаючи перевагу вільним
            const sourcePoint = options.sourcePoint ? $(options.sourcePoint) : this._getOrCreatePoint(sourceSide);
            const targetPoint = options.targetPoint ? $(options.targetPoint) : targetInst._getOrCreatePoint(targetSide);

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

                targetInst.connections.set(connectionId, {
                    target: element,
                    sourcePoint: sourcePoint,
                    targetPoint: targetPoint,
                    connector: connector,
                    options: options,
                });

                Metro.utils.exec(
                    o.onConnect,
                    [target[0], sourcePoint[0], targetPoint[0], connector.element[0]],
                    element[0],
                );

                this._fireEvent("connect", {
                    element: element[0],
                    target: target[0],
                    sourcePoint: sourcePoint[0],
                    targetPoint: targetPoint[0],
                    connector: connector.element[0],
                    connectionId: connectionId,
                });

                this._updateConnections();

                return {
                    id: connectionId,
                    connector: connector.element[0],
                    sourcePoint: sourcePoint[0],
                    targetPoint: targetPoint[0],
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

            Metro.utils.exec(this.options.onDisconnect, [connectionId]);
            this._fireEvent("disconnect", {
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
            const contentContainer = element.find(".linked-block-content");
            contentContainer.html(content);
            this.options.content = content;
        },

        getContent: function () {
            const element = this.element;
            const contentContainer = element.find(".linked-block-content");
            return contentContainer.length ? contentContainer.html() : "";
        },

        getConnections: function () {
            return Array.from(this.connections.values());
        },

        update: function () {
            this._updateConnections();
        },

        changeAttribute: function (attr, val) {
            const o = this.options;
        },

        destroy: function () {
            const element = this.element;
            const o = this.options;

            // Видаляємо всі з'єднання
            this.disconnectAll();

            // Видаляємо обробники подій
            element.off("mouseenter.linked-block");
            element.off("mouseleave.linked-block");
            element.off("click.linked-block");

            element.remove();

            this._fireEvent("linked-block-destroy");
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

        destroy: (element) => {
            const inst = Metro.getPlugin(element, "linked-block");
            if (inst) {
                inst.destroy();
            }
        },

        destroyAll: () => {
            $(".linked-block").each(function () {
                const inst = Metro.getPlugin(this, "linked-block");
                if (inst) {
                    inst.destroy();
                }
            });
        },

        connect: (source, target, options = {}) => {
            const sourceInst = Metro.getPlugin(source, "linked-block");
            if (sourceInst) {
                return sourceInst.connect(target, options);
            }
            return null;
        },

        disconnect: (element, connectionId) => {
            const inst = Metro.getPlugin(element, "linked-block");
            if (inst) {
                return inst.disconnect(connectionId);
            }
            return null;
        },
    };

    // Глобальна обробка кліків для скасування з'єднання
    $(document).on("click.linked-block-global", (e) => {
        $(".linked-block").removeClass("active-block");
        if (
            globalConnectionState.isConnecting &&
            !$(e.target).hasClass("add-point-btn") &&
            globalConnectionState.sourceBlock &&
            typeof globalConnectionState.sourceBlock._cancelConnection === "function"
        ) {
            globalConnectionState.sourceBlock._cancelConnection();
        }
    });

    // Глобальна обробка руху миші для слідування коннектора
    $(document).on("mousemove.linked-block-global", (e) => {
        if (
            globalConnectionState.isConnecting &&
            globalConnectionState.mouseFollower &&
            globalConnectionState.sourceBlock &&
            typeof globalConnectionState.sourceBlock._updateMouseFollower === "function"
        ) {
            globalConnectionState.sourceBlock._updateMouseFollower(e.clientX, e.clientY);
        }
    });

    // Обробка hover над кнопками інших блоків під час з'єднання
    $(document).on("mouseenter.linked-block-connection", ".add-point-btn", (e) => {
        if (
            globalConnectionState.isConnecting &&
            globalConnectionState.sourceBlock &&
            $(e.target).closest(".linked-block")[0] !== globalConnectionState.sourceBlock.element[0]
        ) {
            $(e.target).addClass("connection-target");
        }
    });

    $(document).on("mouseleave.linked-block-connection", ".add-point-btn", (e) => {
        if (globalConnectionState.isConnecting) {
            $(e.target).removeClass("connection-target");
        }
    });
})(Metro, Dom);
