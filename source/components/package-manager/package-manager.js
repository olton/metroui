(function (Metro, $) {
    'use strict';

    const copy_image = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21 8C21 6.34315 19.6569 5 18 5H10C8.34315 5 7 6.34315 7 8V20C7 21.6569 8.34315 23 10 23H18C19.6569 23 21 21.6569 21 20V8ZM19 8C19 7.44772 18.5523 7 18 7H10C9.44772 7 9 7.44772 9 8V20C9 20.5523 9.44772 21 10 21H18C18.5523 21 19 20.5523 19 20V8Z"/>
        <path d="M6 3H16C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1H6C4.34315 1 3 2.34315 3 4V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V4C5 3.44772 5.44772 3 6 3Z"/>
    </svg>`
    
    const npm_image = `<svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 9.781v10.667h8.885v1.771h7.115v-1.771h16v-10.667zM8.885 18.661h-1.771v-5.333h-1.781v5.333h-3.552v-7.104h7.104zM14.219 18.661v1.787h-3.552v-8.891h7.115v7.109h-3.563zM30.224 18.661h-1.776v-5.333h-1.781v5.333h-1.781v-5.333h-1.771v5.333h-3.563v-7.104h10.672zM14.219 13.333h1.781v3.557h-1.781z"/>
    </svg>`
    const pnpm_image = `<svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,10.75H21.251V2H30Z" />
        <path d="M20.374,10.75h-8.75V2h8.75Z" />
        <path d="M10.749,10.75H2V2h8.749Z" />
        <path d="M30,20.375H21.251v-8.75H30Z" />
        <path d="M20.374,20.375h-8.75v-8.75h8.75Z"/>
        <path d="M20.374,30h-8.75V21.25h8.75Z"/>
        <path d="M30,30H21.251V21.25H30Z" />
        <path d="M10.749,30H2V21.25h8.749Z" />
    </svg>`
    const yarn_image = `<svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.208,24.409a10.493,10.493,0,0,0-3.959,1.822,23.743,23.743,0,0,1-5.835,2.642,1.632,1.632,0,0,1-.983.55A62.228,62.228,0,0,1,10.984,30c-1.163.009-1.876-.3-2.074-.776a1.573,1.573,0,0,1,.866-2.074,3.759,3.759,0,0,1-.514-.379c-.171-.171-.352-.514-.406-.388-.225.55-.343,1.894-.947,2.5-.83.839-2.4.559-3.328.072-1.019-.541.072-1.813.072-1.813a.73.73,0,0,1-.992-.343,4.847,4.847,0,0,1-.667-2.949,5.374,5.374,0,0,1,1.749-2.895,9.334,9.334,0,0,1,.658-4.4,10.445,10.445,0,0,1,3.165-3.661S6.628,10.747,7.35,8.817c.469-1.262.658-1.253.812-1.308a3.633,3.633,0,0,0,1.452-.857,5.265,5.265,0,0,1,4.41-1.7S15.2,1.4,16.277,2.09a18.349,18.349,0,0,1,1.533,2.886s1.281-.748,1.425-.469a11.334,11.334,0,0,1,.523,6.132,14.01,14.01,0,0,1-2.6,5.411c-.135.225,1.551.938,2.615,3.887.983,2.7.108,4.96.262,5.212.027.045.036.063.036.063s1.127.09,3.391-1.308A8.5,8.5,0,0,1,27.739,22.3a1.081,1.081,0,0,1,.469,2.11Z"/>
    </svg>`
    const bun_image = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.966 22.566c6.609 0 11.966-4.326 11.966-9.661 0-3.308-2.051-6.23-5.204-7.963-1.283-.713-2.291-1.353-3.13-1.885-1.58-1.004-2.555-1.623-3.632-1.623-1.094 0-2.327.783-3.955 1.816a49.78 49.78 0 0 1-2.808 1.692C2.051 6.675 0 9.597 0 12.905c0 5.335 5.357 9.66 11.966 9.66Zm-1.397-17.83a5.885 5.885 0 0 0 .497-2.403c0-.144.201-.186.229-.028.656 2.775-.9 4.15-2.051 4.61-.124.048-.199-.12-.103-.208a5.748 5.748 0 0 0 1.428-1.971Zm2.052-.102a5.795 5.795 0 0 0-.78-2.3v-.015c-.068-.123.086-.263.185-.172 1.956 2.105 1.303 4.055.554 5.037-.082.102-.229-.003-.188-.126a5.837 5.837 0 0 0 .229-2.424Zm1.771-.559a5.708 5.708 0 0 0-1.607-1.801V2.26c-.112-.085-.024-.274.113-.218 2.588 1.084 2.766 3.171 2.452 4.395a.116.116 0 0 1-.048.071.11.11 0 0 1-.153-.026.118.118 0 0 1-.022-.083 5.864 5.864 0 0 0-.735-2.324Zm-5.072.559c-.616.544-1.279.758-2.058.997-.116 0-.194-.078-.155-.18 1.747-.907 2.369-1.645 2.99-2.771 0 0 .155-.117.188.085 0 .303-.348 1.325-.965 1.869Zm4.931 11.205a2.949 2.949 0 0 1-.935 1.549 2.16 2.16 0 0 1-1.282.618 2.167 2.167 0 0 1-1.323-.618 2.95 2.95 0 0 1-.923-1.549.243.243 0 0 1 .064-.197.23.23 0 0 1 .192-.069h3.954a.226.226 0 0 1 .19.07.239.239 0 0 1 .063.196Zm-5.443-2.17a1.85 1.85 0 0 1-2.377-.244 1.969 1.969 0 0 1-.233-2.44c.207-.318.502-.565.846-.711a1.84 1.84 0 0 1 1.089-.11c.365.075.701.26.964.53.264.27.443.616.515.99a1.98 1.98 0 0 1-.108 1.118 1.923 1.923 0 0 1-.696.866Zm8.471.005a1.849 1.849 0 0 1-2.374-.252 1.956 1.956 0 0 1-.546-1.362c0-.383.11-.758.319-1.076.207-.318.502-.566.847-.711a1.84 1.84 0 0 1 1.09-.108c.366.076.702.261.965.533s.44.617.512.993a1.98 1.98 0 0 1-.113 1.118 1.922 1.922 0 0 1-.7.865Z"/>
    </svg>`
    
    let PackageManagerDefaultConfig = {
        link: "package-manager",
        default: "npm",
        deps: "", // dev, peer, or empty for default
        package: "",
        onPackageManagerCreate: Metro.noop
    };

    Metro.packageManagerSetup = function (options) {
        PackageManagerDefaultConfig = $.extend({}, PackageManagerDefaultConfig, options);
    };

    if (typeof globalThis["metroPackageManagerSetup"] !== "undefined") {
        Metro.packageManagerSetup(globalThis["metroPackageManagerSetup"]);
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
                <ul data-role="tabs" data-expand="true" data-link="${o.link}">
                    <li class="${o.default === "npm" ? "active" : ""}"><a href="#${npmId}">${npm_image} npm</a></li>
                    <li class="${o.default === "pnpm" ? "active" : ""}"><a href="#${pnpmId}">${pnpm_image} pnpm</a></li>
                    <li class="${o.default === "yarn" ? "active" : ""}"><a href="#${yarnId}">${yarn_image} yarn</a></li>
                    <li class="${o.default === "bun" ? "active" : ""}"><a href="#${bunId}">${bun_image} bun</a></li>
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