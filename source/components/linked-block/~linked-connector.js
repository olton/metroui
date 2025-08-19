((Metro, $) => {
    const deleteIcon = `<?xml version="1.0" encoding="utf-8"?><svg fill="var(--linked-block-line-color)" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"/></svg>`;

    let ConnectorDefaultConfig = {
        pointA: null,
        pointB: null,
        type: "curve", // line, curve, zigzag
        container: null, // контейнер для SVG
        autoUpdate: true, // автоматичне оновлення при переміщенні блоків
        id: null, // унікальний ID для з'єднання
        onConnectorCreate: Metro.noop,
        onConnectorUpdate: Metro.noop,
        onConnectorDestroy: Metro.noop,
    };

    Metro.connectorSetup = (options) => {
        ConnectorDefaultConfig = $.extend({}, ConnectorDefaultConfig, options);
    };

    if (typeof window.metroConnectorSetup !== "undefined") {
        Metro.connectorSetup(window.metroConnectorSetup);
    }

    Metro.Component("connector", {
        init: function (options, elem) {
            this._super(elem, options, ConnectorDefaultConfig, {
                connections: new Map(),
                svgElement: null,
                observers: new Map(),
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createConnection();
            this._createEvents();

            this._fireEvent("connector-create", {
                element: element,
                options: o,
            });
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            // Якщо не задано контейнер, використовуємо батьківський елемент
            if (!o.container) {
                o.container = element.parent();
            }

            // Генеруємо ID якщо не задано
            if (!o.id) {
                o.id = `connector-${Hooks.useId(element[0])}`;
            }

            // Створюємо кнопку видалення
            // this.deleteButton = this._createDeleteButton();
        },

        _createConnection: function () {
            const o = this.options;

            if (!o.pointA || !o.pointB) {
                console.warn("Connector: PointA and PointB are required to create connection");
                return;
            }

            // Створюємо SVG елемент
            this.svgElement = this._createSVG(o.id, o.type);
            $(o.container).append(this.svgElement);

            // Створюємо кнопку видалення
            this.deleteButton = this._createDeleteButton();

            // Додаємо обробники подій для видалення
            this._setupDeleteEvents();

            // Оновлюємо з'єднання
            this.update();

            // Зберігаємо з'єднання
            this.connections.set(o.id, {
                pointA: o.pointA,
                pointB: o.pointB,
                type: o.type,
                svg: this.svgElement,
            });
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            if (o.autoUpdate) {
                this._setupAutoUpdate();
            }
        },

        _setupDeleteEvents: function () {
            const self = this;
            const o = this.options;

            console.log("Setting up delete events for connector:", o.id);

            // Обробка hover над областю наведення (товстий невидимий шар)
            if (this.svgElement) {
                const hoverArea = this.svgElement.find(".cl-hover-area");

                hoverArea.on("mouseenter", function (e) {
                    console.log("Hover area mouseenter");
                    e.stopPropagation();
                    self._showDeleteButton();
                    self._highlightConnection(true);
                });

                hoverArea.on("mouseleave", function (e) {
                    console.log("Hover area mouseleave");
                    e.stopPropagation();

                    // Додаємо невелику затримку щоб дати час курсору перейти на кнопку
                    setTimeout(() => {
                        if (!self._isOverDeleteButton(e)) {
                            self._hideDeleteButton();
                            self._highlightConnection(false);
                        }
                    }, 50);
                });

                // Також додаємо обробку кліку для мобільних пристроїв
                hoverArea.on("click", function (e) {
                    console.log("Hover area clicked");
                    e.stopPropagation();
                    if (self.deleteButton && self.deleteButton.is(":visible")) {
                        self._hideDeleteButton();
                        self._highlightConnection(false);
                    } else {
                        self._showDeleteButton();
                        self._highlightConnection(true);
                    }
                });
            }

            // Клік по кнопці видалення
            if (this.deleteButton) {
                this.deleteButton.on("click.connector-delete", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Delete button clicked");
                    self._deleteConnection();
                });

                // Обробники для кнопки
                this.deleteButton.on("mouseenter.connector-delete", function (e) {
                    e.stopPropagation();
                });

                this.deleteButton.on("mouseleave.connector-delete", function (e) {
                    e.stopPropagation();
                    self._hideDeleteButton();
                    self._highlightConnection(false);
                });
            }

            // Глобальний клік для приховування кнопки
            $(document).on(`click.connector-delete-${o.id}`, function (e) {
                // const target = $(e.target);
                // const isConnectorElement = target.closest(`#${o.id}`).length > 0;
                // const isDeleteButton =
                //     self.deleteButton && (target.is(self.deleteButton) || target.closest(self.deleteButton).length > 0);
                //
                // if (!isConnectorElement && !isDeleteButton) {
                //     self._hideDeleteButton();
                //     self._highlightConnection(false);
                // }
                self._hideDeleteButton();
                self._highlightConnection(false);
            });
        },

        _isOverDeleteButton: function (e) {
            if (!this.deleteButton) return false;

            const deleteButtonElement = this.deleteButton[0];
            if (!deleteButtonElement) return false;

            // Перевіряємо чи курсор над кнопкою або її дочірніми елементами
            return (
                e.relatedTarget === deleteButtonElement ||
                (deleteButtonElement.contains && deleteButtonElement.contains(e.relatedTarget))
            );
        },

        _highlightConnection: function (highlight) {
            if (!this.svgElement) return;

            console.log("Highlighting connection:", highlight);

            const visiblePath = this.svgElement.find(".cl-visible");
            if (visiblePath.length) {
                const strokeColor = highlight ? "#ff6b6b" : "var(--linked-block-line-color)";
                const strokeWidth = highlight ? "3px" : "var(--linked-block-line-width)";

                visiblePath.attr({
                    stroke: strokeColor,
                    "stroke-width": strokeWidth,
                });
            }
        },

        _createDeleteButton: function () {
            const o = this.options;

            const deleteButton = $(`
                <button class="connector-delete-btn" data-connector-id="${o.id}">
                    ${deleteIcon}
                </button>
            `).css({
                position: "absolute",
                display: "none",
                width: "24px",
                height: "24px",
                border: "1px solid var(--linked-block-border-color)",
                borderRadius: "50%",
                background: "var(--linked-block-background)",
                cursor: "pointer",
                zIndex: 1000,
                padding: "2px",
            });

            $(o.container).append(deleteButton);
            return deleteButton;
        },

        _showDeleteButton: function () {
            if (!this.deleteButton || !this.svgElement) return;
            // Знаходимо центр з'єднання
            const centerPoint = this._getConnectionCenter();
            if (!centerPoint) return;

            this.deleteButton.css({
                display: "block",
                left: centerPoint.x - 12 + "px",
                top: centerPoint.y - 12 + "px",
            });
        },

        _hideDeleteButton: function () {
            if (this.deleteButton) {
                this.deleteButton.hide();
            }
        },

        // _highlightConnection: function (highlight) {
        //     if (!this.svgElement) return;
        //
        //     const connection = this.connections.get(this.options.id);
        //     if (!connection || !connection.svg) return;
        //
        //     const strokeColor = highlight ? "#ff6b6b" : "var(--linked-block-line-color)";
        //     const strokeWidth = highlight ? "3px" : "var(--linked-block-line-width)";
        //
        //     // Оновлюємо стиль залежно від типу
        //     if (this.options.type === "line") {
        //         connection.svg.find(".cl-line").attr({
        //             stroke: strokeColor,
        //             "stroke-width": strokeWidth,
        //         });
        //     } else {
        //         connection.svg.find(".cl-curve").attr({
        //             stroke: strokeColor,
        //             "stroke-width": strokeWidth,
        //         });
        //     }
        // },

        _getConnectionCenter: function () {
            const o = this.options;
            const connection = this.connections.get(o.id);

            if (!connection || !connection.pointA || !connection.pointB) return null;

            const point1 = $(connection.pointA);
            const point2 = $(connection.pointB);

            if (!point1.length || !point2.length) return null;

            const rect1 = point1.offset();
            const rect2 = point2.offset();

            if (!rect1 || !rect2) return null;

            // Обчислюємо центральну точку між двома точками
            const centerX = (rect1.left + point1.outerWidth() / 2 + rect2.left + point2.outerWidth() / 2) / 2;
            const centerY = (rect1.top + point1.outerHeight() / 2 + rect2.top + point2.outerHeight() / 2) / 2;

            // Конвертуємо в координати контейнера
            const containerOffset = $(o.container).offset() || { left: 0, top: 0 };

            return {
                x: centerX - containerOffset.left,
                y: centerY - containerOffset.top,
            };
        },

        _deleteConnection: function () {
            const o = this.options;
            console.log("Deleting connection:", o.id);

            // Знаходимо точки з'єднання
            const connection = this.connections.get(o.id);
            if (!connection) return;

            const pointA = $(connection.pointA);
            const pointB = $(connection.pointB);

            // Знаходимо батьківські блоки
            const blockA = pointA.closest(".linked-block");
            const blockB = pointB.closest(".linked-block");

            // Видаляємо з'єднання з блоків
            if (blockA.length) {
                const blockAInstance = Metro.getPlugin(blockA[0], "linked-block");
                if (blockAInstance) {
                    blockAInstance.connections.delete(o.id);
                }
            }

            if (blockB.length) {
                const blockBInstance = Metro.getPlugin(blockB[0], "linked-block");
                if (blockBInstance) {
                    blockBInstance.connections.delete(o.id);
                }
            }

            // Видаляємо точки якщо вони не мають інших з'єднань
            this._removeOrphanedPoint(pointA);
            this._removeOrphanedPoint(pointB);

            // Знищуємо коннектор
            this.destroy();
        },

        _removeOrphanedPoint: (point) => {
            if (!point || !point.length) return;

            const pointId = point.attr("id");
            if (!pointId) return;

            // Перевіряємо чи використовується точка в інших з'єднаннях
            let isUsed = false;

            // Перевіряємо всі блоки на наявність з'єднань з цією точкою
            $(".linked-block").each(function () {
                const blockInstance = Metro.getPlugin(this, "linked-block");
                if (blockInstance) {
                    blockInstance.connections.forEach((connection) => {
                        const sourcePointId = $(connection.sourcePoint).attr("id");
                        const targetPointId = $(connection.targetPoint).attr("id");
                        if (sourcePointId === pointId || targetPointId === pointId) {
                            isUsed = true;
                        }
                    });
                }
            });

            // Видаляємо точку якщо вона не використовується
            if (!isUsed) {
                console.log("Removing orphaned point:", pointId);
                point.remove();
            }
        },

        _setupAutoUpdate: function () {
            const o = this.options;
            const pointA = $(o.pointA);
            const pointB = $(o.pointB);

            // Спостерігач за переміщенням блоків
            if (window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (
                            mutation.type === "attributes" &&
                            (mutation.attributeName === "style" || mutation.attributeName === "class")
                        ) {
                            this.update();
                        }
                    });
                });

                // Спостерігаємо за батьківськими блоками точок
                const blockA = pointA.closest(".linked-block");
                const blockB = pointB.closest(".linked-block");

                if (blockA?.length) {
                    observer.observe(blockA[0], {
                        attributes: true,
                        attributeFilter: ["style", "class"],
                    });
                }

                if (blockB?.length) {
                    observer.observe(blockB[0], {
                        attributes: true,
                        attributeFilter: ["style", "class"],
                    });
                }

                this.observers.set(o.id, observer);
            }

            // Також підписуємось на події drag
            const self = this;
            $(document).on("drag-move.connector." + o.id, () => {
                setTimeout(() => self.update(), 10);
            });

            $(document).on("drag-stop.connector." + o.id, () => {
                setTimeout(() => self.update(), 10);
            });
        },

        _createSVG: (id, type) => {
            let svg;

            if (type === "line") {
                svg = $(`
                    <svg id="${id}" class="connection-line" data-connector-id="${id}">
                        <line class="cl-line cl-hover-area" 
                              stroke="transparent" 
                              stroke-width="12"
                              style="cursor: pointer;"/>
                        <line class="cl-line cl-visible" 
                              stroke="var(--linked-block-line-color)" 
                              stroke-width="var(--linked-block-line-width)"
                              pointer-events="none"/>
                    </svg>
                `);
            } else {
                svg = $(`
                    <svg id="${id}" class="connection-line" data-connector-id="${id}">
                        <path class="cl-curve cl-hover-area" 
                              stroke="transparent" 
                              stroke-width="12" 
                              fill="none"
                              style="cursor: pointer;"/>
                        <path class="cl-curve cl-visible" 
                              stroke="var(--linked-block-line-color)" 
                              stroke-width="var(--linked-block-line-width)" 
                              fill="none"
                              pointer-events="none"/>
                    </svg>
                `);
            }

            return svg;
        },

        // Публічні методи
        update: function () {
            const o = this.options;
            const connection = this.connections.get(o.id);

            if (!connection || !connection.svg) return;

            switch (o.type) {
                case "line":
                    this._updateLine(connection.pointA, connection.pointB, connection.svg);
                    break;
                case "curve":
                    this._updateCurve(connection.pointA, connection.pointB, connection.svg);
                    break;
                case "zigzag":
                    this._updateZigzag(connection.pointA, connection.pointB, connection.svg);
                    break;
            }

            this._fireEvent("connector-update", {
                connection: connection,
                type: o.type,
            });
        },

        setType: function (type) {
            if (["line", "curve", "zigzag"].indexOf(type) === -1) {
                console.warn("Connector: невідомий тип з'єднання:", type);
                return;
            }

            const o = this.options;
            const oldType = o.type;
            o.type = type;

            // Створюємо новий SVG елемент з новим типом
            const oldSvg = this.svgElement;
            this.svgElement = this._createSVG(o.id, type);

            // Замінюємо старий елемент
            oldSvg.replaceWith(this.svgElement);

            // Оновлюємо з'єднання
            this.connections.set(o.id, {
                ...this.connections.get(o.id),
                type: type,
                old: oldType,
                svg: this.svgElement,
            });

            this.update();
        },

        setPoints: function (pointA, pointB) {
            const o = this.options;
            o.pointA = pointA;
            o.pointB = pointB;

            // Оновлюємо з'єднання
            this.connections.set(o.id, {
                ...this.connections.get(o.id),
                pointA: pointA,
                pointB: pointB,
            });

            // Переналаштовуємо автоновлення
            if (o.autoUpdate) {
                this._cleanupAutoUpdate();
                this._setupAutoUpdate();
            }

            this.update();
        },

        // Приватні методи оновлення
        _updateLine: (pointA, pointB, svg) => {
            if (!svg || !svg.find) {
                console.warn("Connector: svg element is not available for _updateLine");
                return;
            }

            const point1 = $(pointA);
            const point2 = $(pointB);
            const lines = svg.find(".cl-line"); // Знаходимо всі лінії

            if (lines.length === 0) {
                console.warn("Connector: .cl-line elements not found in svg");
                return;
            }

            // Отримуємо координати
            let rect1, rect2;

            if (point1.offset && point1.offset()) {
                rect1 = point1.offset();
            } else {
                // Якщо це тимчасова точка без offset
                const containerOffset = $(svg).parent().offset() || { left: 0, top: 0 };
                rect1 = {
                    left: containerOffset.left + (parseFloat(point1.css("left")) || 0),
                    top: containerOffset.top + (parseFloat(point1.css("top")) || 0),
                };
            }

            if (point2.offset && point2.offset()) {
                rect2 = point2.offset();
            } else {
                // Якщо це тимчасова точка без offset
                const containerOffset = $(svg).parent().offset() || { left: 0, top: 0 };
                rect2 = {
                    left: containerOffset.left + (parseFloat(point2.css("left")) || 0),
                    top: containerOffset.top + (parseFloat(point2.css("top")) || 0),
                };
            }

            const svgRect = svg.offset() || { left: 0, top: 0 };

            const point1Width = point1.outerWidth() || 1;
            const point1Height = point1.outerHeight() || 1;
            const point2Width = point2.outerWidth() || 1;
            const point2Height = point2.outerHeight() || 1;

            const x1 = rect1.left - svgRect.left + point1Width / 2;
            const y1 = rect1.top - svgRect.top + point1Height / 2;
            const x2 = rect2.left - svgRect.left + point2Width / 2;
            const y2 = rect2.top - svgRect.top + point2Height / 2;

            // Оновлюємо всі лінії (і hover область, і видиму)
            lines.attr({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
            });
        },

        _updateCurve: function (pointA, pointB, svg) {
            if (!svg || !svg.find) {
                console.warn("Connector: svg element is not available for _updateCurve");
                return;
            }

            const point1 = $(pointA);
            const point2 = $(pointB);
            const parent1 = point1.parent();
            const parent2 = point2.parent();
            const paths = svg.find(".cl-curve"); // Знаходимо всі шляхи

            if (paths.length === 0) {
                console.warn("Connector: .cl-curve elements not found in svg");
                return;
            }

            const coords = this._getCoordinates(point1, point2, svg);
            const { x1, y1, x2, y2 } = coords;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let cp1x, cp1y, cp2x, cp2y;

            // Визначаємо сторони точок
            const side1 = parent1.attr("class")?.match(/(north|south|east|west)-side/)?.[1] || "north";
            const side2 = parent2.attr("class")?.match(/(north|south|east|west)-side/)?.[1] || "north";

            // Спеціальна логіка для точок на одній стороні
            if (side1 === side2) {
                const controlOffset = Math.max(60, distance * 0.3);

                switch (side1) {
                    case "north":
                        cp1x = x1;
                        cp1y = y1 - controlOffset;
                        cp2x = x2;
                        cp2y = y2 - controlOffset;
                        break;
                    case "south":
                        cp1x = x1;
                        cp1y = y1 + controlOffset;
                        cp2x = x2;
                        cp2y = y2 + controlOffset;
                        break;
                    case "east":
                        cp1x = x1 + controlOffset;
                        cp1y = y1;
                        cp2x = x2 + controlOffset;
                        cp2y = y2;
                        break;
                    case "west":
                        cp1x = x1 - controlOffset;
                        cp1y = y1;
                        cp2x = x2 - controlOffset;
                        cp2y = y2;
                        break;
                }
            } else {
                // Стандартна логіка для точок на різних сторонах
                const direction = this._getDirection(parent1, parent2);

                if (direction === "horizontal") {
                    const controlDistance = Math.abs(dx) * 0.4;
                    cp1x = x1 + (dx > 0 ? controlDistance : -controlDistance);
                    cp1y = y1;
                    cp2x = x2 - (dx > 0 ? controlDistance : -controlDistance);
                    cp2y = y2;
                } else {
                    const controlDistance = Math.abs(dy) * 0.4;
                    cp1x = x1;
                    cp1y = y1 + (dy > 0 ? controlDistance : -controlDistance);
                    cp2x = x2;
                    cp2y = y2 - (dy > 0 ? controlDistance : -controlDistance);
                }
            }

            const pathData = `M ${x1} ${y1} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;

            // Оновлюємо всі шляхи (і hover область, і видимий)
            paths.attr("d", pathData);
        },

        _updateZigzag: function (pointA, pointB, svg) {
            if (!svg || !svg.find) {
                console.warn("Connector: svg element is not available for _updateCurve");
                return;
            }

            const point1 = $(pointA);
            const point2 = $(pointB);
            const parent1 = point1.parent();
            const parent2 = point2.parent();
            const path = svg.find(".cl-curve");

            const coords = this._getCoordinates(point1, point2, svg);
            const { x1, y1, x2, y2 } = coords;

            let pathData;
            const tolerance = 5;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Визначаємо сторони точок
            const side1 = parent1.attr("class").match(/(north|south|east|west)-side/)?.[1] || "north";
            const side2 = parent2.attr("class").match(/(north|south|east|west)-side/)?.[1] || "north";

            // Спеціальна логіка для точок на одній стороні
            if (side1 === side2) {
                const offset = Math.max(40, distance * 0.25);
                const cornerRadius = Math.min(15, offset / 3);

                switch (side1) {
                    case "north":
                        // Обидві точки зверху - йдемо вгору, потім горизонтально, потім вниз
                        if (Math.abs(x1 - x2) <= tolerance) {
                            // Точки вертикально одна над одною
                            pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
                        } else {
                            const topY = Math.min(y1, y2) - offset;
                            pathData = `M ${x1} ${y1}
                                L ${x1} ${topY + cornerRadius}
                                Q ${x1} ${topY} ${x1 + (x2 > x1 ? cornerRadius : -cornerRadius)} ${topY}
                                L ${x2 - (x2 > x1 ? cornerRadius : -cornerRadius)} ${topY}
                                Q ${x2} ${topY} ${x2} ${topY + cornerRadius}
                                L ${x2} ${y2}`;
                        }
                        break;

                    case "south":
                        // Обидві точки знизу - йдемо вниз, потім горизонтально, потім вгору
                        if (Math.abs(x1 - x2) <= tolerance) {
                            pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
                        } else {
                            const bottomY = Math.max(y1, y2) + offset;
                            pathData = `M ${x1} ${y1}
                                L ${x1} ${bottomY - cornerRadius}
                                Q ${x1} ${bottomY} ${x1 + (x2 > x1 ? cornerRadius : -cornerRadius)} ${bottomY}
                                L ${x2 - (x2 > x1 ? cornerRadius : -cornerRadius)} ${bottomY}
                                Q ${x2} ${bottomY} ${x2} ${bottomY - cornerRadius}
                                L ${x2} ${y2}`;
                        }
                        break;

                    case "east":
                        // Обidві точки праворуч - йдемо вправо, потім вертикально, потім вліво
                        if (Math.abs(y1 - y2) <= tolerance) {
                            pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
                        } else {
                            const rightX = Math.max(x1, x2) + offset;
                            pathData = `M ${x1} ${y1}
                                L ${rightX - cornerRadius} ${y1}
                                Q ${rightX} ${y1} ${rightX} ${y1 + (y2 > y1 ? cornerRadius : -cornerRadius)}
                                L ${rightX} ${y2 - (y2 > y1 ? cornerRadius : -cornerRadius)}
                                Q ${rightX} ${y2} ${rightX - cornerRadius} ${y2}
                                L ${x2} ${y2}`;
                        }
                        break;

                    case "west":
                        // Обидві точки ліворуч - йдемо вліво, потім вертикально, потім вправо
                        if (Math.abs(y1 - y2) <= tolerance) {
                            pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
                        } else {
                            const leftX = Math.min(x1, x2) - offset;
                            pathData = `M ${x1} ${y1}
                                L ${leftX + cornerRadius} ${y1}
                                Q ${leftX} ${y1} ${leftX} ${y1 + (y2 > y1 ? cornerRadius : -cornerRadius)}
                                L ${leftX} ${y2 - (y2 > y1 ? cornerRadius : -cornerRadius)}
                                Q ${leftX} ${y2} ${leftX + cornerRadius} ${y2}
                                L ${x2} ${y2}`;
                        }
                        break;
                }
            } else {
                // Стандартна логіка для точок на різних сторонах
                const direction = this._getDirection(parent1, parent2);

                if (direction === "horizontal") {
                    const horizontalDistance = Math.abs(dx);
                    const cornerRadius = Math.min(20, horizontalDistance / 6);

                    if (Math.abs(y1 - y2) <= tolerance) {
                        pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
                    } else {
                        const midX = x1 + dx / 2;
                        if (y1 < y2) {
                            pathData = `M ${x1} ${y1} 
                                L ${midX - cornerRadius} ${y1} 
                                Q ${midX} ${y1} ${midX} ${y1 + cornerRadius}
                                L ${midX} ${y2 - cornerRadius}
                                Q ${midX} ${y2} ${midX + cornerRadius} ${y2}
                                L ${x2} ${y2}`;
                        } else {
                            pathData = `M ${x1} ${y1} 
                                L ${midX - cornerRadius} ${y1} 
                                Q ${midX} ${y1} ${midX} ${y1 - cornerRadius}
                                L ${midX} ${y2 + cornerRadius}
                                Q ${midX} ${y2} ${midX + cornerRadius} ${y2}
                                L ${x2} ${y2}`;
                        }
                    }
                } else {
                    const verticalDistance = Math.abs(dy);
                    const cornerRadius = Math.min(20, verticalDistance / 6);

                    if (Math.abs(x1 - x2) <= tolerance) {
                        pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
                    } else {
                        const midY = y1 + dy / 2;
                        if (x1 < x2) {
                            pathData = `M ${x1} ${y1} 
                                L ${x1} ${midY - cornerRadius} 
                                Q ${x1} ${midY} ${x1 + cornerRadius} ${midY}
                                L ${x2 - cornerRadius} ${midY}
                                Q ${x2} ${midY} ${x2} ${midY + cornerRadius}
                                L ${x2} ${y2}`;
                        } else {
                            pathData = `M ${x1} ${y1} 
                                L ${x1} ${midY - cornerRadius} 
                                Q ${x1} ${midY} ${x1 - cornerRadius} ${midY}
                                L ${x2 + cornerRadius} ${midY}
                                Q ${x2} ${midY} ${x2} ${midY + cornerRadius}
                                L ${x2} ${y2}`;
                        }
                    }
                }
            }

            path.attr("d", pathData);
        },

        // Допоміжні методи
        _getDirection: (parent1, parent2) => {
            const side1 = parent1.attr("class").match(/(north|south|east|west)-side/)?.[1];
            const side2 = parent2.attr("class").match(/(north|south|east|west)-side/)?.[1];

            // Якщо обидві точки на одній стороні
            if (side1 === side2) {
                return side1 === "north" || side1 === "south" ? "horizontal" : "vertical";
            }

            // Стандартна логіка для різних сторін
            if ((side1 === "east" && side2 === "west") || (side1 === "west" && side2 === "east")) {
                return "horizontal";
            } else if ((side1 === "south" && side2 === "north") || (side1 === "north" && side2 === "south")) {
                return "vertical";
            }

            // Для інших випадків визначаємо за домінуючим напрямком
            return side1 === "north" || side1 === "south" ? "vertical" : "horizontal";
        },

        _getCoordinates: (point1, point2, svg) => {
            let rect1, rect2;

            if (point1.offset && point1.offset()) {
                rect1 = point1.offset();
            } else {
                // Якщо це тимчасова точка без offset
                const containerOffset = $(svg).parent().offset() || { left: 0, top: 0 };
                rect1 = {
                    left: containerOffset.left + (parseFloat(point1.css("left")) || 0),
                    top: containerOffset.top + (parseFloat(point1.css("top")) || 0),
                };
            }

            if (point2.offset && point2.offset()) {
                rect2 = point2.offset();
            } else {
                // Якщо це тимчасова точка без offset
                const containerOffset = $(svg).parent().offset() || { left: 0, top: 0 };
                rect2 = {
                    left: containerOffset.left + (parseFloat(point2.css("left")) || 0),
                    top: containerOffset.top + (parseFloat(point2.css("top")) || 0),
                };
            }

            const svgRect = svg.offset() || { left: 0, top: 0 };

            const point1Width = point1.outerWidth() || 1;
            const point1Height = point1.outerHeight() || 1;
            const point2Width = point2.outerWidth() || 1;
            const point2Height = point2.outerHeight() || 1;

            return {
                x1: rect1.left - svgRect.left + point1Width / 2,
                y1: rect1.top - svgRect.top + point1Height / 2,
                x2: rect2.left - svgRect.left + point2Width / 2,
                y2: rect2.top - svgRect.top + point2Height / 2,
            };
        },

        _cleanupAutoUpdate: function () {
            const o = this.options;

            // Видаляємо спостерігача
            const observer = this.observers.get(o.id);
            if (observer) {
                observer.disconnect();
                this.observers.delete(o.id);
            }

            // Видаляємо обробники подій
            $(document).off(".connector." + o.id);
        },

        changeAttribute: function (attr, newValue) {
            if (attr === "data-type") {
                this.setType(newValue);
            }
        },

        destroy: function () {
            const o = this.options;

            console.log("Destroying connector:", o.id);

            // Очищуємо події видалення
            if (this.svgElement) {
                this.svgElement.off(".connector-delete");
            }

            if (this.deleteButton) {
                this.deleteButton.off(".connector-delete");
                this.deleteButton.remove();
            }

            $(document).off(`click.connector-delete-${o.id}`);

            // Очищуємо автооновлення
            this._cleanupAutoUpdate();

            // Видаляємо SVG елемент
            if (this.svgElement) {
                this.svgElement.remove();
            }

            // Очищуємо з'єднання
            this.connections.delete(o.id);

            // Видаляємо основний елемент
            this.element.remove();

            this._fireEvent("connector-destroy", {
                id: o.id,
            });
        },
    });

    // Статичні методи для створення з'єднань
    Metro.connector = {
        create: (pointA, pointB, options = {}) => {
            console.log("Metro.connector.create called with:", { pointA, pointB, options });

            const defaultOptions = {
                pointA: pointA,
                pointB: pointB,
                container: $("body"),
                autoUpdate: true,
            };

            const config = $.extend({}, defaultOptions, options);
            console.log("Final config:", config);

            // Створюємо фіктивний елемент для компонента
            const element = $("<div>").css({
                position: "absolute",
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                pointerEvents: "none",
            });

            $(config.container).append(element);

            try {
                const connector = Metro.makePlugin(element, "connector", config);
                console.log("Connector plugin created:", connector);
                return connector;
            } catch (error) {
                console.error("Error creating connector plugin:", error);
                element.remove();
                return null;
            }
        },

        connect: function (blockA, blockB, options = {}) {
            const $blockA = $(blockA);
            const $blockB = $(blockB);

            // Знаходимо найближчі точки з'єднання
            const pointA = $blockA.find(".link-point").first();
            const pointB = $blockB.find(".link-point").first();

            if (pointA.length === 0 || pointB.length === 0) {
                console.warn("Connector: не знайдено точок з'єднання на блоках");
                return null;
            }

            return this.create(pointA[0], pointB[0], options);
        },
    };
})(Metro, Dom);
