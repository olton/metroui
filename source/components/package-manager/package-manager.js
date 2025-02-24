(function (Metro, $) {
    'use strict';

    const copy_image = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z"/>
        <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z"/>
    </svg>`
    
    let PackageManagerDefaultConfig = {
        default: "npm",
        deps: "", // dev, peer, or empty for default
        package: "",
        onPackageManagerCreate: Metro.noop
    };

    Metro.packageManagerSetup = function (options) {
        PackageManagerDefaultConfig = $.extend({}, PackageManagerDefaultConfig, options);
    };

    if (typeof window["metroPackageManagerSetup"] !== undefined) {
        Metro.packageManagerSetup(window["metroPackageManagerSetup"]);
    }

    Metro.Component('package-manager', {
        init: function (options, elem) {
            this._super(elem, options, PackageManagerDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function () {
            const that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('component-create');
        },

        _createStructure: function () {
            const that = this, element = this.element, o = this.options;
            const timestamp = new Date().getTime();
            const npmId = Hooks.useId(`pm-npm-${timestamp}`);
            const pnpmId = Hooks.useId(`pm-pnpm-${timestamp}`);
            const yarnId = Hooks.useId(`pm-yarn-${timestamp}`);
            const bunId = Hooks.useId(`pm-bun-${timestamp}`);
            element.addClass("package-manager");
            element.html(`
                <ul data-role="tabs" data-expand="true" data-link="package-manager">
                    <li ${o.default === "npm" ? "active" : ""}><a href="#${npmId}"><span class="mif-npm"></span> npm</a></li>
                    <li ${o.default === "pnpm" ? "active" : ""}><a href="#${pnpmId}"><span class="mif-pnpm"></span> pnpm</a></li>
                    <li ${o.default === "yarn" ? "active" : ""}><a href="#${yarnId}"><span class="mif-yarn"></span> yarn</a></li>
                    <li ${o.default === "bun" ? "active" : ""}><a href="#${bunId}"><span class="mif-bun"></span> bun</a></li>
                </ul>
                <div>
                    <div class="pm-command" id="${npmId}">
                        <button class="small square"><span class="icon">${copy_image}</span></button>
                        <code>npm i ${o.deps === "" ? "" : o.deps === "dev" ? "-D" : ""} ${o.package}</code>
                    </div>
                    <div class="pm-command" id="${pnpmId}">
                        <button class="small square"><span class="icon">${copy_image}</span></button>
                        <code>pnpm add ${o.deps === "" ? "" : o.deps === "dev" ? "-D" : "--save-peer"} ${o.package}</code>
                    </div>
                    <div class="pm-command" id="${yarnId}">
                        <button class="small square"><span class="icon">${copy_image}</span></button>
                        <code>yarn add ${o.deps === "" ? "" : o.deps === "dev" ? "-D" : "-P"} ${o.package}</code>
                    </div>
                    <div class="pm-command" id="${bunId}">
                        <button class="small square"><span class="icon">${copy_image}</span></button>
                        <code>bun add ${o.deps === "" ? "" : o.deps === "dev" ? "-D" : "--peer"} ${o.package}</code>
                    </div>
                </div>
            `)
        },

        _createEvents: function () {
            const that = this, element = this.element, o = this.options;
            element.on("click", ".pm-command button", function () {
                const command = $(this).parent().find("code").text();
                Metro.utils.copy2clipboard(command);
            });
        },

        changeAttribute: function (attr, newValue) {
        },

        destroy: function () {
            this.element.remove();
        }
    });
}(Metro, Dom));