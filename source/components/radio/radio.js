((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';

    let RadioDefaultConfig = {
        radioDeferred: 0,
        prepend: "",
        append: "",
        caption: "",
        clsRadio: "",
        clsCaption: "",
        clsPrepend: "",
        clsAppend: "",
        onRadioCreate: Metro.noop
    };

    Metro.metroRadioSetup = (options) => {
        RadioDefaultConfig = $.extend({}, RadioDefaultConfig, options);
    };

    if (typeof globalThis.metroRadioSetup !== "undefined") {
        Metro.metroRadioSetup(globalThis.metroRadioSetup);
    }

    Metro.Component('radio', {
        init: function( options, elem ) {
            this._super(elem, options, RadioDefaultConfig, {
                origin: {
                    className: ""
                },
            });

            return this;
        },

        _create: function(){
            this._createStructure();
            this._createEvents();
            this._fireEvent("radio-create");
        },

        _createStructure: function(){
            const element = this.element;
            const o = this.options;

            const container = element.wrap("<label>").addClass("radio").addClass(o.clsCheckbox);

            element.attr("type", "radio");

            if (o.prepend) { container.prepend($("<span>").addClass("caption-prepend").addClass(o.clsPrepend).addClass(o.clsCaption).html(o.prepend)); }
            if (o.append)  { container.append($("<span>").addClass("caption-append").addClass(o.clsAppend).addClass(o.clsCaption).html(o.append)); }

            if (element.attr("readonly")) {
                element.on("click", (e)=> {
                    e.preventDefault();
                })
            }

            if (this.elem.checked) {
                this.state = true
            }

            this._drawState()
        },

        _drawState: ()=> {
        },

        _createEvents: function(){
            const element = this.element;

            element.on("click", ()=> {
                this._drawState()
            })
        },

        check: function(){
            this.setCheckState(CHECKBOX_STATE.CHECKED)
        },

        uncheck: function(){
            this.setCheckState(CHECKBOX_STATE.UNCHECKED)
        },

        setCheckState: function(state = true){
            this.elem.checked = state;
            this._drawState();
            return this;
        },

        getCheckState: function(asString = false){
            const state = this.elem.checked
            
            if (!asString) {
                return state;
            }

            switch (this.state) {
                case false: return "unchecked";
                case true: return "checked";
            }
        },

        toggle: function(){
            this.elem.checked = !this.elem.checked;
            this._drawState()
        },

        changeAttribute: (attr, newVal)=> {
        },

        destroy: function(){
            const element = this.element;
            element.off("click");
            element.parent().remove();
        }
    });
})(Metro, Dom);