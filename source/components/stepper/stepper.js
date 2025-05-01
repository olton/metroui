((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    'use strict';
    let StepperDefaultConfig = {
        stepperDeferred: 0,
        view: Metro.stepperView.SQUARE, // square, cycle, diamond
        steps: 3,
        step: 1,
        stepClick: false,
        clsStepper: "",
        clsStep: "",
        clsComplete: "",
        clsCurrent: "",
        onStep: Metro.noop,
        onStepClick: Metro.noop,
        onStepperCreate: Metro.noop
    };

    Metro.stepperSetup = (options) => {
        StepperDefaultConfig = $.extend({}, StepperDefaultConfig, options);
    };

    if (typeof globalThis.metroStepperSetup !== "undefined") {
        Metro.stepperSetup(globalThis.metroStepperSetup);
    }

    Metro.Component('stepper', {
        init: function( options, elem ) {
            this._super(elem, options, StepperDefaultConfig, {
                current: 0
            });

            return this;
        },

        _create: function(){
            const element = this.element;
            const o = this.options;

            if (o.step <= 0) {
                o.step = 1;
            }

            this._createStepper();
            this._createEvents();

            this._fireEvent("stepper-create", {
                element: element
            });
        },

        _createStepper: function(){
            const element = this.element;
            const o = this.options;
            let i;

            element.addClass("stepper").addClass(o.view).addClass(o.clsStepper);

            for(i = 1; i <= o.steps; i++) {
                $("<span>").addClass("step").addClass(o.clsStep).data("step", i).html(`<span>${i}</span>`).appendTo(element);
            }

            this.current = 1;
            this.toStep(o.step);
        },

        _createEvents: function(){
            const that = this;
            const element = this.element;
            const o = this.options;

            element.on(Metro.events.click, ".step", function(){
                const step = $(this).data("step");
                if (o.stepClick === true) {
                    that.toStep(step);

                    that._fireEvent("step-click", {
                        step: step
                    });
                }
            });
        },

        next: function(){
            const element = this.element;
            const steps = element.find(".step");

            if (this.current + 1 > steps.length) {
                return ;
            }

            this.current++;

            this.toStep(this.current);
        },

        prev: function(){
            if (this.current - 1 === 0) {
                return ;
            }

            this.current--;

            this.toStep(this.current);
        },

        last: function(){
            const element = this.element;

            this.toStep(element.find(".step").length);
        },

        first: function(){
            this.toStep(1);
        },

        toStep: function(step){
            const element = this.element;
            const o = this.options;
            const target = $(element.find(".step").get(step - 1));
            const prevStep = this.current;

            if (target.length === 0) {
                return ;
            }

            this.current = step;

            element.find(".step")
                .removeClass("complete current")
                .removeClass(o.clsCurrent)
                .removeClass(o.clsComplete);

            target.addClass("current").addClass(o.clsCurrent);
            target.prevAll().addClass("complete").addClass(o.clsComplete);

            this._fireEvent("step", {
                step: this.current,
                prev: prevStep
            });

        },

        changeAttribute: ()=> {
        },

        destroy: function(){
            const element = this.element;
            element.off(Metro.events.click, ".step");
            element.remove();
        }
    });
})(Metro, Dom);