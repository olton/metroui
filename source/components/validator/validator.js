(function(Metro, $) {
    'use strict';

    var ValidatorFuncs = {
        required: function(val){
            return G.safeParse(G.required(), val).ok
        },
        length: function(val, len){
            return G.safeParse(G.length(+len), val).ok
        },
        minlength: function(val, len){
            return G.safeParse(G.minLength(+len), val).ok
        },
        maxlength: function(val, len){
            return G.safeParse(G.maxLength(+len), val).ok
        },
        min: function(val, min_value){
            return G.safeParse(G.minValue(+min_value), +val).ok
        },
        max: function(val, max_value){
            return G.safeParse(G.maxValue(+max_value), +val).ok
        },
        email: function(val){
            return G.safeParse(G.email(), val).ok
        },
        domain: function(val){
            return G.safeParse(G.domain(), val).ok
        },
        url: function(val){
            return G.safeParse(G.url(), val).ok
        },
        date: function(val, format, locale){
            try {
                if (!format) {
                    datetime(val);
                } else {
                    Datetime.from(val, format, locale);
                }
                return true;
            } catch (e) {
                return false;
            }
        },
        number: function(val){
            return G.safeParse(G.number(), +val).ok
        },
        integer: function(val){
            return G.safeParse(G.integer(), +val).ok
        },
        safeInteger: function(val){
            return G.safeParse(G.safeInteger(), +val).ok
        },
        float: function(val){
            return G.safeParse(G.float(), +val).ok
        },
        digits: function(val){
            return G.safeParse(G.digits(), val).ok
        },
        hexcolor: function(val){
            return G.safeParse(G.hexColor(), val).ok
        },
        color: function(val){
            if (!Metro.utils.isValue(val)) return false;
            return Farbe.Palette.color(val, Farbe.StandardColors) || Farbe.Routines.isColor(val);
        },
        pattern: function(val, pat){
            return G.safeParse(G.pattern(pat), val).ok
        },
        compare: function(val, val2){
            return val == val2;
        },
        not: function(val, not_this){
            return val != not_this;
        },
        notequals: function(val, val2){
            return val !== val2
        },
        equals: function(val, val2){
            return val === val2
        },
        custom: function(val, func){
            if (Metro.utils.isFunc(func) === false) {
                return false;
            }
            return Metro.utils.exec(func, [val]);
        },

        is_control: function(el){
            return el.attr("data-role");
        },

        reset_state: function(el){
            var input = $(el);
            var is_control = ValidatorFuncs.is_control(input);

            if (is_control) {
                input.parent().removeClass("invalid valid");
            } else {
                input.removeClass("invalid valid");
            }
        },

        set_valid_state: function(el){
            var input = $(el);
            var is_control = ValidatorFuncs.is_control(input);

            if (is_control) {
                input.parent().addClass("valid");
            } else {
                input.addClass("valid");
            }
        },

        set_invalid_state: function(el){
            var input = $(el);
            var is_control = ValidatorFuncs.is_control(input);

            if (is_control) {
                input.parent().addClass("invalid");
            } else {
                input.addClass("invalid");
            }
        },

        reset: function(form){
            var that = this;
            $.each($(form).find("[data-validate]"), function(){
                that.reset_state(this);
            });

            return this;
        },

        validate: function(el, result, cb_ok, cb_error, required_mode){
            var this_result = true;
            var input = $(el);
            var funcs = input.data('validate') !== undefined ? String(input.data('validate')).split(" ").map(function(s){return s.trim();}) : [];
            var errors = [];
            var hasForm = input.closest('form').length > 0;
            var attr_name, radio_checked;

            if (funcs.length === 0) {
                return true;
            }

            this.reset_state(input);

            if (input.attr('type') && input.attr('type').toLowerCase() === "checkbox") {
                if (funcs.indexOf('required') === -1) {
                    this_result = true;
                } else {
                    this_result = input.is(":checked");
                }

                if (this_result === false) {
                    errors.push('required');
                }

                if (result !== undefined) {
                    result.val += this_result ? 0 : 1;
                }
            } else if (input.attr('type') && input.attr('type').toLowerCase() === "radio") {
                attr_name = input.attr('name');
                if (typeof attr_name  === undefined) {
                    this_result = true;
                } else {
                    /*
                    * Fix with escaped name by nlared https://github.com/nlared
                    * */
                    radio_checked = $("input[name=" + attr_name.replace("[", "\\\[").replace("]", "\\\]") + "]:checked"); // eslint-disable-line
                    this_result = radio_checked.length > 0;
                }
                if (result !== undefined) {
                    result.val += this_result ? 0 : 1;
                }
            } else {
                $.each(funcs, function(){
                    if (this_result === false) return;
                    var rule = this.split("=");
                    var f, a, b;

                    f = rule[0]; rule.shift();
                    a = rule.join("=");

                    if (['compare', 'not', 'equals', 'notequals'].indexOf(f) > -1) {
                        a = hasForm ? input[0].form.elements[a].value : $("[name="+a+"]").val();
                    }

                    if (f === 'date') {
                        a = input.attr("data-value-format");
                        b = input.attr("data-value-locale");
                    }

                    if (Metro.utils.isFunc(ValidatorFuncs[f]) === false)  {
                        this_result = true;
                    } else {
                        if (required_mode === true || f === "required") {
                            this_result = ValidatorFuncs[f](input.val(), a, b);
                        } else {
                            if (input.val().trim() !== "") {
                                this_result = ValidatorFuncs[f](input.val(), a, b);
                            } else {
                                this_result = true; 
                            }
                        }
                    }

                    if (this_result === false) {
                        errors.push(f);
                    }

                    if (result !== undefined) {
                        result.val += this_result ? 0 : 1;
                    }
                });
            }

            if (this_result === false) {
                this.set_invalid_state(input);

                if (result !== undefined) {
                    result.log.push({
                        input: input[0],
                        name: input.attr("name"),
                        value: input.val(),
                        funcs: funcs,
                        errors: errors
                    });
                }

                if (cb_error !== undefined) Metro.utils.exec(cb_error, [input, input.val()], input[0]);

            } else {
                this.set_valid_state(input);

                if (cb_ok !== undefined) Metro.utils.exec(cb_ok, [input, input.val()], input[0]);
            }

            return this_result;
        }
    };

    Metro['validator'] = ValidatorFuncs;

    var ValidatorDefaultConfig = {
        validatorDeferred: 0,
        submitTimeout: 200,
        interactiveCheck: false,
        clearInvalid: 0,
        requiredMode: true,
        useRequiredClass: true,
        onBeforeSubmit: Metro.noop_true,
        onSubmit: Metro.noop,
        onError: Metro.noop,
        onValidate: Metro.noop,
        onErrorForm: Metro.noop,
        onValidateForm: Metro.noop,
        onValidatorCreate: Metro.noop
    };

    Metro.validatorSetup = function (options) {
        ValidatorDefaultConfig = $.extend({}, ValidatorDefaultConfig, options);
    };

    if (typeof globalThis["metroValidatorSetup"] !== undefined) {
        Metro.validatorSetup(globalThis["metroValidatorSetup"]);
    }

    Metro.Component('validator', {
        init: function( options, elem ) {
            this._super(elem, options, ValidatorDefaultConfig, {
                _onsubmit: null,
                _onreset: null,
                result: []
            });

            return this;
        },

        _create: function(){
            var that = this, element = this.element, o = this.options;
            var inputs = element.find("[data-validate]");

            element
                .attr("novalidate", 'novalidate');

            $.each(inputs, function(){
                var input = $(this);
                var funcs = input.data("validate");
                var required = funcs.indexOf("required") > -1;
                if (required && o.useRequiredClass === true) {
                    if (ValidatorFuncs.is_control(input)) {
                        input.parent().addClass("required");
                    } else {
                        input.addClass("required");
                    }
                }
                if (o.interactiveCheck === true) {
                    input.on(Metro.events.inputchange, function () {
                        ValidatorFuncs.validate(this, undefined, undefined, undefined, o.requiredMode);
                    });
                }
            });

            this._onsubmit = null;
            this._onreset = null;

            if (element[0].onsubmit !== null) {
                this._onsubmit = element[0].onsubmit;
                element[0].onsubmit = null;
            }

            if (element[0].onreset !== null) {
                this._onreset = element[0].onreset;
                element[0].onreset = null;
            }

            element[0].onsubmit = function(){
                return that._submit();
            };

            element[0].onreset = function(){
                return that._reset();
            };

            this._fireEvent("validator-create", {
                element: element
            });
        },

        _reset: function(){
            ValidatorFuncs.reset(this.element);
            if (this._onreset !==  null) Metro.utils.exec(this._onreset, null, this.element[0]);
        },

        _submit: function(){
            var that = this, element = this.element, o = this.options;
            var form = this.elem;
            var inputs = element.find("[data-validate]");
            var submit = element.find("input[type=submit], button[type=submit]");
            var result = {
                val: 0,
                log: []
            };
            var formData = $.serializeToArray(element);

            if (submit.length > 0) {
                submit.attr('disabled', 'disabled').addClass('disabled');
            }

            $.each(inputs, function(){
                ValidatorFuncs.validate(this, result, o.onValidate, o.onError, o.requiredMode);
            });

            submit.removeAttr("disabled").removeClass("disabled");

            result.val += Metro.utils.exec(o.onBeforeSubmit, [formData], this.elem) === false ? 1 : 0;

            if (result.val === 0) {

                this._fireEvent("validate-form", {
                    data: formData
                });

                setTimeout(function(){
                    // TODO need fix event name to equivalent
                    Metro.utils.exec(o.onSubmit, [formData], form);
                    element.fire("formsubmit", {
                        data: formData
                    });
                    if (that._onsubmit !==  null) Metro.utils.exec(that._onsubmit, null, form);
                }, o.submitTimeout);
            } else {

                this._fireEvent("error-form", {
                    log: result.log,
                    data: formData
                });

                if (o.clearInvalid > 0) {
                    setTimeout(function(){
                        $.each(inputs, function(){
                            var inp  = $(this);
                            if (ValidatorFuncs.is_control(inp)) {
                                inp.parent().removeClass("invalid");
                            } else {
                                inp.removeClass("invalid");
                            }
                        })
                    }, o.clearInvalid);
                }
            }

            return result.val === 0;
        },

        changeAttribute: function(){
        }
    });
}(Metro, Dom));