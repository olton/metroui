((Metro, $) => {
    let ConnectorDefaultConfig = {
        pointA: null,
        pointB: null,
        type: "line", // line, curve, zigzag
        onConnectorCreate: Metro.noop,
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
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent("connector-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;
        },

        _createLine: (id = "") => {
            const line = `
                <svg id="${id}" class="connection-line">
                    <line class="cl-line" stroke="var(--linked-block-line-color)" stroke-width="var(--linked-block-line-width)"/>
                </svg>
            `;
            return $(line);
        },

        _createCurve: (id) => {
            const curve = `
                <svg id="${id}" class="connection-line">
                    <path class="cl-curve" stroke="var(--linked-block-line-color)" stroke-width="var(--linked-block-line-width)" fill="none"/>
                </svg>            
            `;
            return $(curve);
        },

        _updateLine: (a, b, c) => {
            const point1 = $(a);
            const point2 = $(b);
            const svg = $(c);
            const line = c.find(".cl-line");

            // Отримуємо позиції точок відносно документа
            const rect1 = point1.offset();
            const rect2 = point2.offset();

            // Отримуємо позицію SVG контейнера відносно документа
            const svgRect = svg.offset();

            // Отримуємо розміри точок для центрування
            const point1Width = point1.outerWidth();
            const point1Height = point1.outerHeight();
            const point2Width = point2.outerWidth();
            const point2Height = point2.outerHeight();

            // Розраховуємо координати відносно SVG контейнера і центруємо точки
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

        _updateZigzag: (a, b, c) => {
            const point1 = $(a);
            const point2 = $(b);
            const parent1 = point1.parent();
            const parent2 = point2.parent();
            const svg = $(c);
            const path = svg.find(".cl-curve");

            let direction = "horizontal";

            if (parent1.hasClass("east-side") && parent2.hasClass("west-side")) {
                direction = "horizontal";
            } else if (parent1.hasClass("south-side") && parent2.hasClass("north-side")) {
                direction = "vertical";
            }

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

            let pathData = "";
            const tolerance = 5; // допуск для визначення "однакової" позиції

            const dx = x2 - x1;
            const dy = y2 - y1;

            if (direction === "horizontal") {
                // Горизонтальне з'єднання (оригінальна логіка)
                const horizontalDistance = Math.abs(dx);
                const cornerRadius = Math.min(20, horizontalDistance / 6);

                if (Math.abs(y1 - y2) <= tolerance) {
                    // Пряма лінія
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
                // Вертикальне з'єднання
                const verticalDistance = Math.abs(dy);
                const cornerRadius = Math.min(20, verticalDistance / 6);

                if (Math.abs(x1 - x2) <= tolerance) {
                    // Пряма лінія
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

            path.attr("d", pathData);
        },

        _updateCurve: (a, b, c) => {
            const point1 = $(a);
            const point2 = $(b);
            const parent1 = point1.parent();
            const parent2 = point2.parent();
            const svg = $(c);
            const path = svg.find(".cl-curve");
            let direction = "horizontal";

            if (parent1.hasClass("east-side") && parent2.hasClass("west-side")) {
                direction = "horizontal";
            } else if (parent1.hasClass("south-side") && parent2.hasClass("north-side")) {
                direction = "vertical";
            }

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

            // Створюємо плавну криву для горизонтального та вертикального з'єднання
            const dx = x2 - x1;
            const dy = y2 - y1;

            let cp1x, cp1y, cp2x, cp2y;

            // Визначаємо, чи з'єднання більш горизонтальне або вертикальне
            if (direction === "horizontal") {
                // Горизонтальне з'єднання - контрольні точки по X
                const controlDistance = Math.abs(dx) * 0.4;
                cp1x = x1 + (dx > 0 ? controlDistance : -controlDistance);
                cp1y = y1;
                cp2x = x2 - (dx > 0 ? controlDistance : -controlDistance);
                cp2y = y2;
            } else {
                // Вертикальне з'єднання - контрольні точки по Y
                const controlDistance = Math.abs(dy) * 0.4;
                cp1x = x1;
                cp1y = y1 + (dy > 0 ? controlDistance : -controlDistance);
                cp2x = x2;
                cp2y = y2 - (dy > 0 ? controlDistance : -controlDistance);
            }

            // Створюємо кубічну криву Безьє
            const pathData = `M ${x1} ${y1} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;

            path.attr("d", pathData);
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
