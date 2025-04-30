((Metro, $) => {

    let MyObjectDefaultConfig = {
        onMyObjectCreate: Metro.noop
    };

    Metro.myObjectSetup = (options) => {
        MyObjectDefaultConfig = $.extend({}, MyObjectDefaultConfig, options);
    };

    if (typeof window.metroMyObjectSetup !== "undefined") {
        Metro.myObjectSetup(window.metroMyObjectSetup);
    }

    Metro.Component('name', {
        init: function( options, elem ) {
            this._super(elem, options, MyObjectDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            const element = this.element;
            const o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('component-create');
        },

        _createStructure: function(){
            const element = this.element;
            const o = this.options;
        },

        _createEvents: function(){
            const element = this.element;
            const o = this.options;
        },

        changeAttribute: (attr, newValue) =>{
        },

        destroy: function(){
            this.element.remove();
        }
    });
})(Metro, Dom);