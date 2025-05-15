((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const ValidatorFuncs = {
        required: (val) => G.safeParse(G.required(), val).ok,
        length: (val, len) => G.safeParse(G.length(+len), val).ok,
        minlength: (val, len) => G.safeParse(G.minLength(+len), val).ok,
        maxlength: (val, len) => G.safeParse(G.maxLength(+len), val).ok,
        min: (val, min_value) => G.safeParse(G.minValue(+min_value), +val).ok,
        max: (val, max_value) => G.safeParse(G.maxValue(+max_value), +val).ok,
        email: (val) => G.safeParse(G.email(), val).ok,
        domain: (val) => G.safeParse(G.domain(), val).ok,
        url: (val) => G.safeParse(G.url(), val).ok,
        date: (val, format, locale) => {
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
        number: (val) => G.safeParse(G.number(), +val).ok,
        integer: (val) => G.safeParse(G.integer(), +val).ok,
        safeInteger: (val) => G.safeParse(G.safeInteger(), +val).ok,
        float: (val) => G.safeParse(G.float(), +val).ok,
        digits: (val) => G.safeParse(G.digits(), val).ok,
        hexcolor: (val) => G.safeParse(G.hexColor(), val).ok,
        color: (val) => {
            if (!Metro.utils.isValue(val)) return false;
            return Farbe.Palette.color(val, Farbe.StandardColors) || Farbe.Routines.isColor(val);
        },
        pattern: (val, pat) => G.safeParse(G.pattern(pat), val).ok,
        // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
        compare: (val, val2) => val == val2,
        // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
        not: (val, not_this) => val != not_this,
        notequals: (val, val2) => val !== val2,
        equals: (val, val2) => val === val2,
        custom: (val, func) => {
            if (Metro.utils.isFunc(func) === false) {
                return false;
            }
            return Metro.utils.exec(func, [val]);
        },

        is_control: (el) => el.attr("data-role"),

        reset_state: (el) => {
            const input = $(el);
            const is_control = ValidatorFuncs.is_control(input);

            if (is_control) {
                input.parent().removeClass("invalid valid");
            } else {
                input.removeClass("invalid valid");
            }
        },

        set_valid_state: (el) => {
            const input = $(el);
            const is_control = ValidatorFuncs.is_control(input);

            if (is_control) {
                input.parent().addClass("valid");
            } else {
                input.addClass("valid");
            }
        },

        set_invalid_state: (el) => {
            const input = $(el);
            const is_control = ValidatorFuncs.is_control(input);

            if (is_control) {
                input.parent().addClass("invalid");
            } else {
                input.addClass("invalid");
            }
        },

        reset: function (form) {
            const that = this;
            $.each($(form).find("[data-validate]"), function () {
                that.reset_state(this);
            });

            return this;
        },

        validate: function (el, result, cb_ok, cb_error, required_mode) {
            let this_result = true;
            const input = $(el);
            const funcs =
                input.data("validate") !== undefined
                    ? String(input.data("validate"))
                          .split(" ")
                          .map((s) => s.trim())
                    : [];
            const errors = [];
            const hasForm = input.closest("form").length > 0;
            let attr_name;
            let radio_checked;

            if (funcs.length === 0) {
                return true;
            }

            this.reset_state(input);

            if (input.attr("type") && input.attr("type").toLowerCase() === "checkbox") {
                if (funcs.indexOf("required") === -1) {
                    this_result = true;
                } else {
                    this_result = input.is(":checked");
                }

                if (this_result === false) {
                    errors.push("required");
                }

                if (result !== undefined) {
                    result.val += this_result ? 0 : 1;
                }
            } else if (input.attr("type") && input.attr("type").toLowerCase() === "radio") {
                attr_name = input.attr("name");
                if (typeof attr_name === "undefined") {
                    this_result = true;
                } else {
                    /*
                     * Fix with escaped name by nlared https://github.com/nlared
                     * */
                    radio_checked = $(`input[name=${attr_name.replace("[", "\\[").replace("]", "\\]")}]:checked`); // eslint-disable-line
                    this_result = radio_checked.length > 0;
                }
                if (result !== undefined) {
                    result.val += this_result ? 0 : 1;
                }
            } else {
                $.each(funcs, function () {
                    if (this_result === false) return;
                    const rule = this.split("=");
                    let f;
                    let a;
                    let b;

                    f = rule[0];
                    rule.shift();
                    a = rule.join("=");

                    if (["compare", "not", "equals", "notequals"].indexOf(f) > -1) {
                        a = hasForm ? input[0].form.elements[a].value : $(`[name=${a}]`).val();
                    }

                    if (f === "date") {
                        a = input.attr("data-value-format");
                        b = input.attr("data-value-locale");
                    }

                    if (Metro.utils.isFunc(ValidatorFuncs[f]) === false) {
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
                        errors: errors,
                    });
                }

                if (cb_error !== undefined) Metro.utils.exec(cb_error, [input, input.val()], input[0]);
            } else {
                this.set_valid_state(input);

                if (cb_ok !== undefined) Metro.utils.exec(cb_ok, [input, input.val()], input[0]);
            }

            return this_result;
        },
    };

    Metro.validator = ValidatorFuncs;

    let ValidatorDefaultConfig = {
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
        onValidatorCreate: Metro.noop,
    };

    Metro.validatorSetup = (options) => {
        ValidatorDefaultConfig = $.extend({}, ValidatorDefaultConfig, options);
    };

    if (typeof globalThis.metroValidatorSetup !== "undefined") {
        Metro.validatorSetup(globalThis.metroValidatorSetup);
    }

    Metro.Component("validator", {
        init: function (options, elem) {
            this._super(elem, options, ValidatorDefaultConfig, {
                _onsubmit: null,
                _onreset: null,
                result: [],
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;
            const inputs = element.find("[data-validate]");

            element.attr("novalidate", "novalidate");

            $.each(inputs, function () {
                const input = $(this);
                const funcs = input.data("validate");
                const required = funcs.indexOf("required") > -1;
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

            element[0].onsubmit = () => this._submit();

            element[0].onreset = () => this._reset();

            this._fireEvent("validator-create", {
                element: element,
            });
        },

        _reset: function () {
            ValidatorFuncs.reset(this.element);
            if (this._onreset !== null) Metro.utils.exec(this._onreset, null, this.element[0]);
        },

        _submit: function () {
            const element = this.element;
            const o = this.options;
            const form = this.elem;
            const inputs = element.find("[data-validate]");
            const submit = element.find("input[type=submit], button[type=submit]");
            const result = {
                val: 0,
                log: [],
            };
            const formData = $.serializeToArray(element);

            if (submit.length > 0) {
                submit.attr("disabled", "disabled").addClass("disabled");
            }

            $.each(inputs, function () {
                ValidatorFuncs.validate(this, result, o.onValidate, o.onError, o.requiredMode);
            });

            submit.removeAttr("disabled").removeClass("disabled");

            result.val += Metro.utils.exec(o.onBeforeSubmit, [formData], this.elem) === false ? 1 : 0;

            if (result.val === 0) {
                this._fireEvent("validate-form", {
                    data: formData,
                });

                setTimeout(() => {
                    // TODO need fix event name to equivalent
                    Metro.utils.exec(o.onSubmit, [formData], form);
                    element.fire("formsubmit", {
                        data: formData,
                    });
                    if (this._onsubmit !== null) Metro.utils.exec(this._onsubmit, null, form);
                }, o.submitTimeout);
            } else {
                this._fireEvent("error-form", {
                    log: result.log,
                    data: formData,
                });

                if (o.clearInvalid > 0) {
                    setTimeout(() => {
                        $.each(inputs, function () {
                            const inp = $(this);
                            if (ValidatorFuncs.is_control(inp)) {
                                inp.parent().removeClass("invalid");
                            } else {
                                inp.removeClass("invalid");
                            }
                        });
                    }, o.clearInvalid);
                }
            }

            return result.val === 0;
        },

        changeAttribute: () => {},
    });
})(Metro, Dom);
