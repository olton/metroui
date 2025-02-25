(function(Metro, $) {
    'use strict';
       
    const note_icon = `
    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.75 3.5V2C8.75 1.59 8.41 1.25 8 1.25C7.59 1.25 7.25 1.59 7.25 2V3.56C7.5 3.53 7.73 3.5 8 3.5H8.75Z"/>
        <path d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25C15.59 1.25 15.25 1.59 15.25 2V3.5H16C16.27 3.5 16.5 3.53 16.75 3.56Z"/>
        <path d="M16.75 3.56V5C16.75 5.41 16.41 5.75 16 5.75C15.59 5.75 15.25 5.41 15.25 5V3.5H8.75V5C8.75 5.41 8.41 5.75 8 5.75C7.59 5.75 7.25 5.41 7.25 5V3.56C4.3 3.83 3 5.73 3 8.5V17C3 20 4.5 22 8 22H16C19.5 22 21 20 21 17V8.5C21 5.73 19.7 3.83 16.75 3.56ZM12 16.75H8C7.59 16.75 7.25 16.41 7.25 16C7.25 15.59 7.59 15.25 8 15.25H12C12.41 15.25 12.75 15.59 12.75 16C12.75 16.41 12.41 16.75 12 16.75ZM16 11.75H8C7.59 11.75 7.25 11.41 7.25 11C7.25 10.59 7.59 10.25 8 10.25H16C16.41 10.25 16.75 10.59 16.75 11C16.75 11.41 16.41 11.75 16 11.75Z"/>
    </svg>
    `
    const info_icon = `
    <svg width="800px" height="800px" viewBox="-160 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"/>
    </svg>
    `

    const warning_icon = `
    <svg height="800px" width="800px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 294.995 294.995" xml:space="preserve">
        <path d="M291.874,248.279L165.605,26.526c-4.007-7.037-10.776-11.26-18.107-11.26s-14.101,4.202-18.107,11.239L3.121,248.238 c-3.979,6.989-4.164,15.013-0.493,21.326c3.67,6.313,10.663,10.165,18.705,10.165h252.329c8.042,0,15.035-3.852,18.705-10.165 C296.038,263.251,295.854,255.268,291.874,248.279z M146.665,86.229c9.665,0,17.5,7.835,17.5,17.5v63c0,9.665-7.835,17.5-17.5,17.5 c-9.665,0-17.5-7.835-17.5-17.5v-63C129.165,94.064,137,86.229,146.665,86.229z M147.498,204.005c9.665,0,17.5,7.835,17.5,17.5 c0,9.665-7.835,17.5-17.5,17.5c-9.665,0-17.5-7.835-17.5-17.5C129.998,211.84,137.833,204.005,147.498,204.005z"/>
    </svg>
    `
    
    const caution_icon = `
    <svg height="800px" width="800px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"  xml:space="preserve">
        <path class="st0" d="M387.317,0.005H284.666h-57.332h-102.65L0,124.688v102.67v57.294v102.67l124.684,124.674h102.65h57.332
            h102.651L512,387.321v-102.67v-57.294v-102.67L387.317,0.005z M255.45,411.299c-19.082,0-34.53-15.467-34.53-34.549
            c0-19.053,15.447-34.52,34.53-34.52c19.082,0,34.53,15.467,34.53,34.52C289.98,395.832,274.532,411.299,255.45,411.299z
             M283.414,278.692c0,15.448-12.516,27.964-27.964,27.964c-15.458,0-27.964-12.516-27.964-27.964l-6.566-135.368
            c0-19.072,15.447-34.54,34.53-34.54c19.082,0,34.53,15.467,34.53,34.54L283.414,278.692z"/>
    </svg>
    `
    
    const tip_icon = `
    <svg height="800px" width="800px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256" xml:space="preserve">
        <path d="M216.2,92.5c-5.2-5.3-13.8-5.4-19-0.1L157.8,134l-0.3,0.3c-25.5,0.1-46.2,16.8-46.2,37.3h-5.8c0-23.6,23.1-42.8,51.6-43.1
            l-0.1-19.4c0,0-0.1-85.4-0.1-85.5c-0.7-5.8-5.6-10.3-11.7-10.3c-6.5,0-11.7,5.3-11.7,11.7c0,0.2,0,72.9,0,72.9l-5.2,0.2l-0.1-81.2
            c0-6.5-5.3-11.7-11.8-11.7s-11.7,5.3-11.7,11.8v81h-5.6l0.1-63.6c0-6.5-5.3-11.7-11.8-11.7S75.7,28,75.7,34.4V98h-5.2l0.1-34.2
            c0-6.5-5.3-11.7-11.8-11.7s-11.7,5.3-11.7,11.8c0,108.4,0,108.4,0,111c0,13.2,6.8,24.4,16.2,28.1v48.4h0.2v0.4l81.2-0.4v-51.1
            c2.5-0.9,5.1-2,7.6-3.3c15.4-7.9,26.1-20.3,29.5-32.5c2.9-4.3,36.8-56.2,36.8-56.2C221.4,103.7,220.6,96.9,216.2,92.5z"/>
    </svg>  
    `
    
    const success_icon = `
        <svg width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM35.4,18.4l-14,14a1.9,1.9,0,0,1-2.8,0l-5.9-5.9a2.2,2.2,0,0,1-.4-2.7,2,2,0,0,1,3.1-.2L20,28.2,32.6,15.6a2,2,0,0,1,2.8,2.8Z"/>
        </svg>    
    `
    
    const icons = {
        note: note_icon,
        info: info_icon,
        warning: warning_icon,
        caution: caution_icon,
        tip: tip_icon,
        success: success_icon,
    }


    let DirectiveDefaultConfig = {
        directive: "note",
        showIcon: true,
        title: "default",
        style: 1, // default - 1, vue - 2
        onDirectiveCreate: Metro.noop
    };

    Metro.directiveSetup = function (options) {
        DirectiveDefaultConfig = $.extend({}, DirectiveDefaultConfig, options);
    };

    if (typeof window["metroDirectiveSetup"] !== undefined) {
        Metro.directiveSetup(window["metroDirectiveSetup"]);
    }

    Metro.Component('directive', {
        init: function( options, elem ) {
            this._super(elem, options, DirectiveDefaultConfig, {
                // define instance vars here
            });
            return this;
        },

        _create: function(){
            const that = this, element = this.element, o = this.options;

            this._createStructure();
            this._createEvents();

            this._fireEvent('directive-create');
        },

        _createStructure: function(){
            const that = this, element = this.element, o = this.options;
            const directive = element.wrap("<div>").addClass("directive").addClass(`directive-style-${o.style}`).addClass(`directive-${o.directive}`);
            const title = $("<div>").addClass("directive-title").html(o.title === "default" ? this.strings[`label_${o.directive.toLowerCase()}`].toUpperCase() : o.title);
            if (o.showIcon) {
                title.prepend($("<span>").addClass("icon").html(icons[o.directive]));                
            }
            directive.prepend(title);
            this.component = directive
        },

        _createEvents: function(){
            const that = this, element = this.element, o = this.options;

        },

        changeAttribute: function(attr, newValue){
        },

        destroy: function(){
            this.element.remove();
        }
    });
}(Metro, Dom));