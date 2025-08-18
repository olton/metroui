((Metro, $) => {
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

                if (blockA.length) {
                    observer.observe(blockA[0], {
                        attributes: true,
                        attributeFilter: ["style", "class"],
                    });
                }

                if (blockB.length) {
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
                    <svg id="${id}" class="connection-line">
                        <line class="cl-line" 
                              stroke="var(--linked-block-line-color)" 
                              stroke-width="var(--linked-block-line-width)"/>
                    </svg>
                `);
            } else {
                svg = $(`
                    <svg id="${id}" class="connection-line">
                        <path class="cl-curve" 
                              stroke="var(--linked-block-line-color)" 
                              stroke-width="var(--linked-block-line-width)" 
                              fill="none"/>
                    </svg>
                `);
            }

            return svg;
        },

        // Публічні методи
        update: function () {
            const o = this.options;
            const connection = this.connections.get(o.id);

            if (!connection) return;

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
            const point1 = $(pointA);
            const point2 = $(pointB);
            const line = svg.find(".cl-line");

            const rect1 = point1.offset();
            const rect2 = point2.offset();
            const svgRect = svg.offset();

            const point1Width = point1.outerWidth();
            const point1Height = point1.outerHeight();
            const point2Width = point2.outerWidth();
            const point2Height = point2.outerHeight();

            const x1 = rect1.left - svgRect.left + point1Width / 2;
            const y1 = rect1.top - svgRect.top + point1Height / 2;
            const x2 = rect2.left - svgRect.left + point2Width / 2;
            const y2 = rect2.top - svgRect.top + point2Height / 2;

            line.attr({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
            });
        },

        _updateCurve: function (pointA, pointB, svg) {
            const point1 = $(pointA);
            const point2 = $(pointB);
            const parent1 = point1.parent();
            const parent2 = point2.parent();
            const path = svg.find(".cl-curve");

            const coords = this._getCoordinates(point1, point2, svg);
            const { x1, y1, x2, y2 } = coords;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let cp1x, cp1y, cp2x, cp2y;

            // Визначаємо сторони точок
            const side1 = parent1.attr("class").match(/(north|south|east|west)-side/)?.[1] || "north";
            const side2 = parent2.attr("class").match(/(north|south|east|west)-side/)?.[1] || "north";

            // Спеціальна логіка для точок на одній стороні
            if (side1 === side2) {
                const controlOffset = Math.max(60, distance * 0.3);

                switch (side1) {
                    case "north":
                        // Обидві точки зверху - створюємо дугу вгору
                        cp1x = x1;
                        cp1y = y1 - controlOffset;
                        cp2x = x2;
                        cp2y = y2 - controlOffset;
                        break;
                    case "south":
                        // Обидві точки знизу - створюємо дугу вниз
                        cp1x = x1;
                        cp1y = y1 + controlOffset;
                        cp2x = x2;
                        cp2y = y2 + controlOffset;
                        break;
                    case "east":
                        // Обидві точки праворуч - створюємо дугу вправо
                        cp1x = x1 + controlOffset;
                        cp1y = y1;
                        cp2x = x2 + controlOffset;
                        cp2y = y2;
                        break;
                    case "west":
                        // Обидві точки ліворуч - створюємо дугу вліво
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
            path.attr("d", pathData);
        },

        _updateZigzag: function (pointA, pointB, svg) {
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
            const rect1 = point1.offset();
            const rect2 = point2.offset();
            const svgRect = svg.offset();

            const point1Width = point1.outerWidth();
            const point1Height = point1.outerHeight();
            const point2Width = point2.outerWidth();
            const point2Height = point2.outerHeight();

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

            this._cleanupAutoUpdate();

            if (this.svgElement) {
                this.svgElement.remove();
            }

            this.connections.delete(o.id);

            this._fireEvent("connector-destroy", {
                id: o.id,
            });

            return this.element;
        },
    });

    // Статичні методи для створення з'єднань
    Metro.connector = {
        create: (pointA, pointB, options = {}) => {
            const defaultOptions = {
                pointA: pointA,
                pointB: pointB,
                container: $("body"),
            };

            const config = $.extend({}, defaultOptions, options);

            // Створюємо фіктивний елемент для компонента
            const element = $("<div>");
            config.container.append(element);

            return Metro.makePlugin(element, "connector", config);
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

            return this.create(pointA, pointB, options);
        },
    };
})(Metro, Dom);
