(function(Metro, $) {
    'use strict';

    globalThis.CHECKBOX_STATE = {
        CHECKED: 1,
        UNCHECKED: -1,
        INDETERMINATE: 0,
    }

    let CheckboxDefaultConfig = {
        checkboxDeferred: 0,
        state: CHECKBOX_STATE.UNCHECKED,
        threeState: false,
        prepend: "",
        append: "",
        clsCheckbox: "",
        clsCaption: "",
        clsPrepend: "",
        clsAppend: "",
        onCheckboxCreate: Metro.noop
    };

    Metro.metroCheckboxSetup = function (options) {
        CheckboxDefaultConfig = $.extend({}, CheckboxDefaultConfig, options);
    };

    if (typeof globalThis["metroCheckboxSetup"] !== undefined) {
        Metro.metroCheckboxSetup(globalThis["metroCheckboxSetup"]);
    }

    Metro.Component('checkbox', {
        init: function( options, elem ) {
            this._super(elem, options, CheckboxDefaultConfig, {
                origin: {
                    className: ""
                },
                state: CHECKBOX_STATE.UNCHECKED
            });

            return this;
        },

        _create: function(){
            const o = this.options;

            if (o.threeState === false && o.state === 0 || o.state === "indeterminate") {
                o.state = CHECKBOX_STATE.UNCHECKED                
            }
            
            if (o.state === CHECKBOX_STATE.UNCHECKED || o.state === "unchecked") {
                this.state = CHECKBOX_STATE.UNCHECKED
            } else if (o.state === 0 || o.state === "indeterminate") {
                this.state = CHECKBOX_STATE.INDETERMINATE
            } else {
                this.state = CHECKBOX_STATE.CHECKED
            }

            this._createStructure();
            this._createEvents();
            this._fireEvent("checkbox-create");
        },

        _indeterminate: function(v = true){
            const element = this.element;

            element[0].indeterminate = v;
            element.attr("data-indeterminate", v);
        },

        _createStructure: function(){
            const element = this.element, o = this.options;
            
            const container = element.wrap("<label>").addClass("checkbox").addClass(o.clsCheckbox);

            element.attr("type", "checkbox");

            if (o.prepend) { container.prepend($("<span>").addClass("caption-prepend").addClass(o.clsPrepend).addClass(o.clsCaption).html(o.prepend)); }
            if (o.append)  { container.append($("<span>").addClass("caption-append").addClass(o.clsAppend).addClass(o.clsCaption).html(o.append)); }
            
            if (element.attr("readonly") !== undefined) {
                element.on("click", function(e){
                    e.preventDefault();
                })
            }

            if (this.elem.checked && this.state !== CHECKBOX_STATE.INDETERMINATE) {
                this.state = true
            }

            this._drawState()
        },

        _drawState: function(){
            const elem = this.elem;

            this._indeterminate(false)

            elem.checked = this.state !== CHECKBOX_STATE.UNCHECKED;

            if (this.state === CHECKBOX_STATE.INDETERMINATE) {
                this._indeterminate(true)
            }
        },

        _createEvents: function(){
            const element = this.element, o = this.options;
            const that = this

            element.on("click", function(){
                that.state++
                if (that.state === 0 && o.threeState === false) {
                    that.state = 1
                }
                if (that.state === 2) {
                    that.state = -1
                }
                that._drawState()
            })
        },

        check: function(){
            this.setCheckState(CHECKBOX_STATE.CHECKED)
        },

        uncheck: function(){
            this.setCheckState(CHECKBOX_STATE.UNCHECKED)
        },

        indeterminate: function(){
            this.setCheckState(CHECKBOX_STATE.INDETERMINATE)
        },

        setCheckState: function(state){
            if (state === -1 || state === "unchecked") {
                this.state = CHECKBOX_STATE.UNCHECKED
            } else if (state === 0 || state === "indeterminate") {
                this.state = CHECKBOX_STATE.INDETERMINATE
            } else {
                this.state = CHECKBOX_STATE.CHECKED
            }

            this._drawState();

            return this;
        },

        getCheckState: function(asString = false){
            if (!asString) {
                return this.state;
            }

            switch (this.state) {
                case -1: return "unchecked";
                case 0: return "indeterminate";
                case 1: return "checked";
            }
        },

        toggle: function(){
            this.state++
            if (this.state === 2) {
                this.state = -1
            }
            this._drawState()
        },

        changeAttribute: function(attr, newVal){
            const changeState = function(val){
                this.toggle(val);
            };

            switch (attr) {
                case 'data-state': changeState(newVal); break;
            }
        },

        destroy: function(){
            const element = this.element;
            element.off("click");
            element.parent().remove();
        }
    });
}(Metro, Dom));