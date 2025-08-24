((Metro, $) => {
    let StackMenuDefaultConfig = {
        rootTitle: "Root Menu",
        backButtonIcon: "←",
        size: "default",
        onStackMenuCreate: Metro.noop,
    };

    Metro.stackMenuSetup = (options) => {
        StackMenuDefaultConfig = $.extend({}, StackMenuDefaultConfig, options);
    };

    if (typeof window.metroStackMenuSetup !== "undefined") {
        Metro.stackMenuSetup(window.metroStackMenuSetup);
    }

    Metro.Component("stack-menu", {
        init: function (options, elem) {
            this._super(elem, options, StackMenuDefaultConfig, {
                // define instance vars here
                menus: new Map(),
                stack: [],
            });
            return this;
        },

        _create: function () {
            this._createStructure();
            this._createEvents();

            this._fireEvent("menu-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("stack-menu");
            if (o.size !== "default") {
                element.css({
                    width: o.size,
                });
            }

            element.find("ul").each((i, el) => {
                const parent = $(el).parent("li");

                if (typeof parent === "undefined") {
                    this.menus.set("root", el);
                } else {
                    parent.attr("data-menu-id", `ul-${i}`);
                    this.menus.set(`ul-${i}`, el);
                }
            });

            element.children("ul").hide();
            element.append($("<ul>").addClass("--menu"));

            this._drawMenu("root");
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;

            element.on(Metro.events.click, "li", function (e) {
                e.preventDefault();
                e.stopPropagation();
                const key = $(this).attr("data-menu-id");
                const title = that._getText($(this).children("a")[0]);

                if (key && that.menus.has(key)) {
                    // Додаємо поточний стан до стеку
                    that.stack.push({
                        key: that.currentKey || "root",
                        title: that.currentTitle || that.options.rootTitle,
                    });

                    that.currentKey = key;
                    that.currentTitle = title;
                    that._drawMenu(key, title);
                }
            });

            element.on(Metro.events.click, ".back-menu-button", (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (that.stack.length > 0) {
                    const previousState = that.stack.pop();

                    that.currentKey = previousState.key;
                    that.currentTitle = previousState.title;
                    that._drawMenu(previousState.key, previousState.title);
                }
            });
        },

        _getText: (el) => {
            const whitespace = /^\s*$/;

            for (const node of el.childNodes) {
                if (node.nodeType === node.TEXT_NODE && !whitespace.test(node.textContent)) {
                    return node.textContent;
                }
            }
            return "";
        },

        _setTitle: function (title) {
            const element = this.element;
            const o = this.options;

            const titleContent = `
                ${this.stack.length === 0 ? "" : `<button class='back-menu-button cycle small flat mr-2'>${o.backButtonIcon}</button>`}
                <span>${title || o.rootTitle}</span>
            `;
            element.find(".title").html(titleContent);
        },

        _drawMenu: function (key = "root", title) {
            const menu = this.menus.get(key);
            const target = this.element.children("ul.--menu");

            this._setTitle(title);

            target.clear();

            if (menu) {
                const items = [];

                $(menu)
                    .children("li")
                    .each((_, el) => {
                        const item = $(el);
                        const id = item.attr("data-menu-id") || "none";
                        const anchor = item.children("a").clone(true);

                        const newItem = $("<li>")
                            .addClass("-initial")
                            .attr("data-menu-id", id)
                            .appendTo(target)
                            .append(anchor);
                        items.push(newItem);
                    });

                setTimeout(() => {
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.removeClass("-initial");
                        }, index * 30); // Поступова анімація кожного елемента з затримкою 50ms
                    });
                }, 10);
            }
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
