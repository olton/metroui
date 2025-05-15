((Metro, $) => {
    let WizardClassicDefaultConfig = {
        buttons: "next, prev, finish, cancel, help",
        startPage: 1,
        height: 300,

        labelNext: "",
        labelPrev: "",
        labelHelp: "",
        labelFinish: "",
        labelCancel: "",

        iconNext: "",
        iconPrev: "",
        iconHelp: "",
        iconFinish: "",
        iconCancel: "",

        clsWizard: "",
        clsPage: "",
        clsActions: "",
        clsActionHelp: "",
        clsActionPrev: "",
        clsActionNext: "",
        clsActionFinish: "",
        clsActionCancel: "",

        onBeforePage: Metro.noop_true,
        onPage: Metro.noop,
        onNext: Metro.noop,
        onPrev: Metro.noop,
        onFinish: Metro.noop,
        onCancel: Metro.noop,
        onHelp: Metro.noop,
        onMyObjectCreate: Metro.noop,
    };

    Metro.wizardClassicSetup = (options) => {
        WizardClassicDefaultConfig = $.extend({}, WizardClassicDefaultConfig, options);
    };

    if (typeof window.metroWizardClassicSetup !== "undefined") {
        Metro.wizardClassicSetup(window.metroWizardClassicSetup);
    }

    Metro.Component("wizard-classic", {
        init: function (options, elem) {
            this._super(elem, options, WizardClassicDefaultConfig, {
                // define instance vars here
                currentPage: 0,
            });
            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent("wizard-create");
        },

        _createStructure: function () {
            const element = this.element;
            const o = this.options;

            element.addClass(`wizard-classic ${o.clsWizard}`).css({
                height: o.height,
            });

            const wizard_pages = $("<div>").addClass("wizard-pages").appendTo(element);
            const actions = $("<div>").addClass("wizard-actions").appendTo(element);

            for (const btn of o.buttons.toArray(",")) {
                const button = $("<button>")
                    .addClass("wizard-action")
                    .attr("data-wizard-action", btn)
                    .html(
                        `${o[`icon${str(btn).capitalize()}`] ? o[`icon${str(btn).capitalize()}`] : ""} ${o[`label${str(btn).capitalize()}`] || this.strings[`label_${btn}`]}`,
                    )
                    .appendTo(actions);

                if (btn === "next") {
                    button.addClass(`wizard-next ${o.clsActionNext}`);
                } else if (btn === "prev") {
                    button.addClass(`wizard-prev ${o.clsActionPrev}`);
                } else if (btn === "finish") {
                    button.addClass(`wizard-finish ${o.clsActionFinish}`);
                } else if (btn === "cancel") {
                    button.addClass(`wizard-cancel ${o.clsActionCancel}`);
                } else if (btn === "help") {
                    button.addClass(`wizard-help ${o.clsActionHelp}`);
                }
            }

            this.pages = element.find(".page").addClass(o.clsPage);
            this.pages.appendTo(wizard_pages);
            if (this.pages[o.startPage - 1] === undefined) {
                o.startPage = 0;
            }

            this.currentPage = o.startPage - 1;
            this.pages[this.currentPage]?.classList.add("active");

            this._refreshButtons();
        },

        _createEvents: function () {
            const element = this.element;
            const o = this.options;

            element.on("click", ".wizard-action", (e) => {
                const action = $(e.target).closest("button").attr("data-wizard-action");
                if (action === "next") {
                    if (Metro.utils.exec(o.onBeforePage, [this.currentPage, this.pages[this.currentPage]]) === false) {
                        return false;
                    }
                    this.next();
                    this._fireEvent("next");
                } else if (action === "prev") {
                    if (Metro.utils.exec(o.onBeforePage, [this.currentPage, this.pages[this.currentPage]]) === false) {
                        return false;
                    }
                    this.prev();
                    this._fireEvent("prev");
                } else if (action === "finish") {
                    this._fireEvent("finish");
                } else if (action === "cancel") {
                    this._fireEvent("cancel");
                } else if (action === "help") {
                    this._fireEvent("help");
                }
            });
        },

        _refreshButtons: function () {
            const element = this.element;
            const o = this.options;

            const pages = this.pages;
            const actions = element.find(".wizard-action");

            actions.each((i, btn) => {
                $(btn).removeClass("disabled");
            });

            if (this.currentPage === 0) {
                actions.filter(".wizard-prev").addClass("disabled");
            }

            if (this.currentPage === pages.length - 1) {
                actions.filter(".wizard-next").addClass("disabled");
                actions.filter(".wizard-finish").removeClass("disabled");
            }

            if (this.currentPage >= 0 && this.currentPage < pages.length - 1) {
                actions.filter(".wizard-finish").addClass("disabled");
            }

            if (this.currentPage > 0) {
                actions.filter(".wizard-prev").removeClass("disabled");
            }
        },

        next: function () {
            const element = this.element;
            const o = this.options;

            const pages = element.find(".page");
            if (this.currentPage < pages.length - 1) {
                $(pages[this.currentPage]).addClass("out");
                setTimeout(
                    (i) => {
                        $(pages[i]).removeClass("active");
                    },
                    300,
                    this.currentPage,
                );
                this.currentPage++;
                $(pages[this.currentPage]).addClass("active");
            }
            this._refreshButtons();
        },

        prev: function () {
            const element = this.element;
            const o = this.options;

            const pages = element.find(".page");
            if (this.currentPage > 0) {
                $(pages[this.currentPage]).removeClass("active");
                this.currentPage--;
                $(pages[this.currentPage]).removeClass("out").addClass("active");
            }
            this._refreshButtons();
        },

        changeAttribute: (attr, newValue) => {},

        destroy: function () {
            this.element.remove();
        },
    });
})(Metro, Dom);
