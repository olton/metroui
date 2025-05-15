((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let WorkingTreeDefaultConfig = {
        onStateChange: Metro.noop,
        onWorkingTreeCreate: Metro.noop,
    };

    Metro.workingTreeSetup = (options) => {
        WorkingTreeDefaultConfig = $.extend({}, WorkingTreeDefaultConfig, options);
    };

    if (typeof globalThis.metroWorkingTreeSetup !== "undefined") {
        Metro.workingTreeSetup(globalThis.metroWorkingTreeSetup);
    }

    Metro.Component("working-tree", {
        init(options, elem) {
            this._super(elem, options, WorkingTreeDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create() {
            this._createStructure();
            this._createEvents();

            this._fireEvent("tree-create");
        },

        addNode({ id, title = "", value = "", items = [] } = {}) {
            const element = this.element;
            const nodeId = (id || Hooks.useId(`working-tree-node-${element.children().length}`)).replace(/:/gi, "");
            const node = `
                <li id="${nodeId}">
                    <div class="bull"></div>
                    <div class="node">
                        <div class="title">${title}</div>
                        <div class="value">${value}</div>
                    </div>
                    <ul class="leaves">
                        ${items.map((i) => `<li><div class="title">${i.title}</div><div class="value">${i.value}</div> </li>`).join("\n")}                    
                    </ul>
                </li>
            `;
            this.element.append(node);
            return nodeId;
        },

        setState(id, state = "pending") {
            const element = this.element;
            const node = element.find(`#${id}`).clearClasses().addClass(`work-${state}`);
            node.find(".bull").html(`<span data-role="bull" data-type="${state}"></span>`);
            this._fireEvent("state-change", { id, state, node });
            return this;
        },

        _createStructure() {
            const element = this.element;
            element.addClass("working-tree");
        },

        _createEvents() {},

        changeAttribute(attr, newValue) {},

        destroy() {
            this.element.remove();
        },
    });
})(Metro, Dom);
