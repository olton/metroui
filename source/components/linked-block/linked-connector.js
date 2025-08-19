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
                deleteButton: null,
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

            // Отримуємо або створюємо спільний SVG у контейнері
            const sharedSvg = this._getOrCreateSharedSVG(o.container);
            this.svgElement = sharedSvg;

            // Створюємо елемент шляху/лінії для поточного конектора у спільному SVG
            const shape = this._createShape(o.id, o.type, sharedSvg);
            const deleteBtn = this._createDeleteButton(sharedSvg, o.id);

            // Зберігаємо з'єднання
            this.connections.set(o.id, {
                pointA: o.pointA,
                pointB: o.pointB,
                type: o.type,
                svg: sharedSvg,
                shape,
                deleteBtn,
            });

            this._incPointRef(o.pointA);
            this._incPointRef(o.pointB);

            // Оновлюємо з'єднання
            this.update();
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
            const self = this;

            if (o.autoUpdate) {
                this._setupAutoUpdate();
            }

            $(document).on("click", ".cl-curve, .cl-line", (e) => {
                const target = $(e.target);
                $(target).toggleClass("selected-path");
                e.stopPropagation();
            });

            $(document).on("click", (e) => {
                $(".cl-line, .cl-curve").removeClass("selected-path");
            });
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

        _getOrCreateSharedSVG: (container) => {
            const $container = $(container);
            let svg = $container.children("svg.connection-area").first();
            if (!svg.length) {
                // Забезпечуємо позиціювання контейнера для абсолютного SVG
                if ($container.css("position") === "static") {
                    $container.css("position", "relative");
                }
                const ns = "http://www.w3.org/2000/svg";
                const svgEl = document.createElementNS(ns, "svg");
                svgEl.setAttribute("xmlns", ns);
                svgEl.setAttribute("class", "connection-area");
                // Розмір і позиціювання через стилі, щоб займати весь контейнер
                svg = $(svgEl);
                $container.append(svg);
            }
            return svg;
        },

        _createShape: (id, type, svg) => {
            const ns = "http://www.w3.org/2000/svg";
            let el;
            if (type === "line") {
                el = document.createElementNS(ns, "line");
                el.setAttribute("class", "cl-line");
            } else {
                el = document.createElementNS(ns, "path");
                el.setAttribute("class", "cl-curve");
                // Важливо для видимості контуру, якщо стилі не підвантажились
                // el.setAttribute("fill", "none");
            }
            el.setAttribute("data-conn-id", id);
            svg[0].appendChild(el);
            return $(el);
        },

        _createDeleteButton: function (svg, id) {
            const ns = "http://www.w3.org/2000/svg";

            // Група кнопки (для позиціонування трансформацією)
            const g = document.createElementNS(ns, "g");
            g.setAttribute("class", "connector-delete");
            g.setAttribute("data-conn-id", id);
            g.style.cursor = "pointer";
            g.style.pointerEvents = "all";

            // Парсимо deleteIcon як SVG
            const parsed = new DOMParser().parseFromString(deleteIcon, "image/svg+xml");
            let iconSvg = parsed.documentElement; // <svg> з іконкою

            // Приводимо до потрібного розміру (наприклад, 16px)
            iconSvg.setAttribute("width", "16");
            iconSvg.setAttribute("height", "16");

            // Приберемо зайві атрибути, які можуть впливати на позиціонування
            iconSvg.removeAttribute("x");
            iconSvg.removeAttribute("y");

            // Трохи фонового кола для кращої видимості і легшого кліку (опційно)
            // можна забрати, якщо не потрібно
            const bg = document.createElementNS(ns, "circle");
            bg.setAttribute("r", "10");
            bg.setAttribute("cx", "8");
            bg.setAttribute("cy", "8");
            bg.setAttribute("fill", "var(--default-background, #fff)");
            bg.setAttribute("stroke", "var(--linked-block-line-color)");
            bg.setAttribute("stroke-width", "0.5");

            g.appendChild(bg);
            g.appendChild(iconSvg);

            svg[0].appendChild(g);

            // Обробник кліку — видалення конкретного конектора
            $(g).on("click", (e) => {
                e.stopPropagation();
                // Знайдемо інстанс плагіну за елементом, на якому він створений
                const plugin = Metro.getPlugin(this.element, "connector");
                if (plugin && plugin.options.id === id) {
                    plugin.destroy();
                } else {
                    // Якщо поточний інстанс не той самий (рідкісний випадок), знайдемо за id у мапі
                    const connection = this.connections.get(id);
                    if (connection) {
                        this.destroy();
                    }
                }
            });

            return $(g);
        },

        // Публічні методи
        update: function () {
            const o = this.options;
            const connection = this.connections.get(o.id);

            if (!connection) return;

            switch (o.type) {
                case "line":
                    this._updateLine(connection.pointA, connection.pointB, connection.shape);
                    break;
                case "curve":
                    this._updateCurve(connection.pointA, connection.pointB, connection.shape);
                    break;
                case "zigzag":
                    this._updateZigzag(connection.pointA, connection.pointB, connection.shape);
                    break;
            }

            // Позиціюємо кнопку видалення у центрі лінії/шляху
            this._positionDeleteButton(connection);

            this._fireEvent("connector-update", {
                connection: connection,
                type: o.type,
            });
        },

        _positionDeleteButton: (connection) => {
            const { type, shape, deleteBtn } = connection;
            if (!deleteBtn || !deleteBtn.length || !shape || !shape.length) return;

            let cx = 0,
                cy = 0;

            if (type === "line") {
                // Для лінії — середина між (x1,y1) та (x2,y2)
                const x1 = parseFloat(shape.attr("x1"));
                const y1 = parseFloat(shape.attr("y1"));
                const x2 = parseFloat(shape.attr("x2"));
                const y2 = parseFloat(shape.attr("y2"));
                if (isFinite(x1) && isFinite(y1) && isFinite(x2) && isFinite(y2)) {
                    cx = (x1 + x2) / 2;
                    cy = (y1 + y2) / 2;
                }
            } else {
                // Для шляхів — беремо середню точку за довжиною
                const pathEl = shape[0];
                if (typeof pathEl.getTotalLength === "function") {
                    const len = pathEl.getTotalLength();
                    const pt = pathEl.getPointAtLength(len / 2);
                    cx = pt.x;
                    cy = pt.y;
                }
            }

            // Центруємо групу на точці (іконка 16x16, фон 20px в діаметрі)
            // Зсув на пів ширини/висоти, щоб центр групи припав на лінію
            const offsetX = 10; // половина діаметра bg кола
            const offsetY = 10;
            deleteBtn.attr("transform", `translate(${cx - offsetX}, ${cy - offsetY})`);
        },

        setType: function (type) {
            if (["line", "curve", "zigzag"].indexOf(type) === -1) {
                console.warn("Connector: невідомий тип з'єднання:", type);
                return;
            }

            const o = this.options;
            const oldType = o.type;
            o.type = type;

            // Створюємо новий shape-елемент у спільному SVG
            const connection = this.connections.get(o.id);
            const oldShape = connection?.shape;
            const svg = connection?.svg || this.svgElement || this._getOrCreateSharedSVG(o.container);
            const newShape = this._createShape(o.id, type, svg);

            if (oldShape?.length) {
                oldShape.remove();
            }

            // Оновлюємо з'єднання
            this.connections.set(o.id, {
                ...connection,
                type: type,
                old: oldType,
                svg: svg,
                shape: newShape,
                deleteBtn: connection?.deleteBtn,
            });

            this.update();
        },

        setPoints: function (pointA, pointB) {
            const o = this.options;

            // Декремент лічильників для старих точок
            if (o.pointA) this._decPointRef(o.pointA);
            if (o.pointB) this._decPointRef(o.pointB);

            o.pointA = pointA;
            o.pointB = pointB;

            // Інкремент лічильників для нових точок
            this._incPointRef(pointA);
            this._incPointRef(pointB);

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
        _updateLine: (pointA, pointB, shape) => {
            const point1 = $(pointA);
            const point2 = $(pointB);
            const line = shape; // <line>
            const svg = line.closest("svg");

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

        _updateCurve: function (pointA, pointB, shape) {
            const point1 = $(pointA);
            const point2 = $(pointB);
            const parent1 = point1.parent();
            const parent2 = point2.parent();
            const path = shape; // <path>
            const svg = path.closest("svg");

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
            path.attr("d", pathData);
        },

        _updateZigzag: function (pointA, pointB, shape) {
            const point1 = $(pointA);
            const point2 = $(pointB);
            const parent1 = point1.parent();
            const parent2 = point2.parent();
            const path = shape; // <path>
            const svg = path.closest("svg");

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
                        if (Math.abs(x1 - x2) <= tolerance) {
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

        _incPointRef: (point) => {
            const $p = $(point);
            const count = parseInt($p.attr("data-conn-count") || "0", 10) + 1;
            $p.attr("data-conn-count", String(count));
        },

        _decPointRef: (point, removeIfAuto = false) => {
            const $p = $(point);
            const current = parseInt($p.attr("data-conn-count") || "0", 10);
            const next = Math.max(0, current - 1);
            if (next === 0) {
                $p.removeAttr("data-conn-count");
                if (removeIfAuto && $p.attr("data-auto-point") === "1") {
                    // Видалимо точку, якщо вона була створена автоматично під час з'єднання
                    $p.remove();
                }
            } else {
                $p.attr("data-conn-count", String(next));
            }
        },

        changeAttribute: function (attr, newValue) {
            if (attr === "data-type") {
                this.setType(newValue);
            }
        },

        destroy: function () {
            const o = this.options;

            const pointA = $(o.pointA);
            const pointB = $(o.pointB);

            if (!pointB.hasClass("temp-point")) {
                pointA.remove();
                pointB.remove();
            }

            this._cleanupAutoUpdate();

            const connection = this.connections.get(o.id);

            if (connection?.shape) {
                const svg = connection.svg || this.svgElement;
                connection.shape.remove();

                // Видаляємо кнопку видалення
                if (connection.deleteBtn) {
                    connection.deleteBtn.remove();
                }

                // Якщо у спільному SVG більше немає елементів конекторів — прибираємо SVG
                if (svg && svg.find(".cl-line, .cl-curve").length === 0) {
                    svg.remove();
                }
            }

            // Декремент/видалення точок
            if (o.pointA) this._decPointRef(o.pointA, true);
            if (o.pointB) this._decPointRef(o.pointB, true);

            if (this.svgElement) {
                this.svgElement = null;
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
