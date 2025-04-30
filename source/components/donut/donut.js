((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let DonutDefaultConfig = {
        donutDeferred: 0,
        size: 100,
        hole: 0.8,
        value: 0,
        background: "transparent",
        color: "",
        stroke: "#d1d8e7",
        fill: "#49649f",
        fontSize: 0,
        total: 100,
        cap: "%",
        showText: true,
        showValue: false,
        animate: 0,
        onChange: Metro.noop,
        onDrawValue: (v) => v,
        onDonutCreate: Metro.noop,
    };

    Metro.donutSetup = (options) => {
        DonutDefaultConfig = $.extend({}, DonutDefaultConfig, options);
    };

    if (typeof globalThis.metroDonutSetup !== "undefined") {
        Metro.donutSetup(globalThis.metroDonutSetup);
    }

    Metro.Component("donut", {
        init: function (options, elem) {
            this._super(elem, options, DonutDefaultConfig, {
                value: 0,
                animation_change_interval: null,
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("donut");

            this._setElementSize();
            this._draw();
            this._addEvents();
            this.val(o.value);

            this._fireEvent("donut-create", {
                element: element,
            });
        },

        _setElementSize: function () {
            const element = this.element;
            const o = this.options;
            const width = o.size;

            element.css({
                width: width,
                background: o.background,
            });

            element.css({
                height: element.width(),
            });
        },

        _draw: function () {
            const element = this.element;
            const o = this.options;
            let html = "";
            const radius = element.width() / 2;
            const r = radius * (1 - (1 - o.hole) / 2);
            const width = radius * (1 - o.hole);
            const transform = `rotate(-90 ${radius},${radius})`;
            const fontSize = o.fontSize === 0 ? r * o.hole * 0.6 : o.fontSize;

            html += "<svg>";
            html += `   <circle class='donut-back' r='${r}px' cx='${radius}px' cy='${radius}px' transform='${transform}' fill='none' stroke='${o.stroke}' stroke-width='${width}'/>`;
            html += `   <circle class='donut-fill' r='${r}px' cx='${radius}px' cy='${radius}px' transform='${transform}' fill='none' stroke='${o.fill}' stroke-width='${width}'/>`;

            if (o.showText === true)
                html += `   <text class='donut-title' x='${radius}px' y='${radius}px' dy='${fontSize / 3}px' text-anchor='middle' fill='${o.color !== "" ? o.color : o.fill}' font-size='${fontSize}px'></text>`;

            html += "</svg>";

            element.html(html);
        },

        _addEvents: function () {
            $(globalThis).on("resize", () => {
                this._setElementSize();
                this._draw();
                this.val(this.value);
            });
        },

        _setValue: function (v) {
            const element = this.element;
            const o = this.options;

            const fill = element.find(".donut-fill");
            const title = element.find(".donut-title");
            const radius = element.width() / 2;
            const r = radius * (1 - (1 - o.hole) / 2);
            const circumference = Math.round(2 * Math.PI * r);
            const title_value = o.showValue ? v : Metro.utils.percent(o.total, v, true); /*  + (o.cap)*/
            const fill_value = Math.round((+v * circumference) / o.total); // + ' ' + circumference;

            let sda = fill.attr("stroke-dasharray");
            if (typeof sda === "undefined") {
                sda = 0;
            } else {
                sda = +sda.split(" ")[0];
            }
            const delta = fill_value - sda;

            fill.animate({
                draw: function (t, p) {
                    $(this).attr("stroke-dasharray", `${sda + delta * p} ${circumference}`);
                },
                dur: o.animate,
            });

            title.html(Metro.utils.exec(o.onDrawValue, [title_value + o.cap]));
        },

        val: function (v) {
            const o = this.options;

            if (v === undefined) {
                return this.value;
            }

            if (Number.parseInt(v) < 0 || Number.parseInt(v) > o.total) {
                return false;
            }

            this._setValue(v);

            this.value = v;

            this._fireEvent("change", {
                value: this.value,
            });
        },

        setColor: function (obj) {
            const validKeys = ["background", "fill", "stroke", "color"];

            $.each(obj, (key, val) => {
                if (validKeys.indexOf(key) !== -1) {
                    this.options[key] = val;
                }
            });

            this._draw();
            this.val(this.value);

            return this;
        },

        changeValue: function () {
            this.val(this.element.attr("data-value"));
        },

        changeAttribute: function (attr, val) {
            switch (attr) {
                case "data-value":
                    this.changeValue();
                    break;
                case "data-background":
                    this.setColor({ background: val });
                    break;
                case "data-fill":
                    this.setColor({ fill: val });
                    break;
                case "data-stroke":
                    this.setColor({ stroke: val });
                    break;
                case "data-color":
                    this.setColor({ color: val });
                    break;
            }
        },

        destroy: function () {
            return this.element;
        },
    });
})(Metro, Dom);
