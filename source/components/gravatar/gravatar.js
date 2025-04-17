/* global Metro */
(function(Metro, $) {
    'use strict';

    var GravatarDefaultConfig = {
        gravatarDeferred: 0,
        email: "",
        size: 80,
        default: "mp",
        onGravatarCreate: Metro.noop
    };

    Metro.gravatarSetup = function (options) {
        GravatarDefaultConfig = $.extend({}, GravatarDefaultConfig, options);
    };

    if (typeof globalThis["metroGravatarSetup"] !== "undefined") {
        Metro.gravatarSetup(globalThis["metroGravatarSetup"]);
    }

    Metro.Component('gravatar', {
        init: function( options, elem ) {
            this._super(elem, options, GravatarDefaultConfig);

            return this;
        },

        _create: function(){
            var element = this.element;

            this.get();

            this._fireEvent("gravatar-create", {
                element: element
            });
        },

        getImage: function(email, size, def, is_object){
            var image = $("<img>").attr('alt', email);

            image.attr("src", this.getImageSrc(email, size));

            return is_object === true ? image : image[0];
        },

        getImageSrc: function(email, size, def){
            if (email === undefined || email.trim() === '') {
                return "";
            }

            size = size || 80;
            def = Metro.utils.encodeURI(def) || '404';

            return "//www.gravatar.com/avatar/" + Metro.md5((email.toLowerCase()).trim()) + '?size=' + size + '&d=' + def;
        },

        get: function(){
            var element = this.element, o = this.options;
            var img = element[0].tagName === 'IMG' ? element : element.find("img");

            if (img.length === 0) {
                return;
            }
            img.attr("src", this.getImageSrc(o.email, o.size, o.default));

            return this;
        },

        resize: function(new_size){
            this.options.size = new_size !== undefined ? new_size : this.element.attr("data-size");
            this.get();
        },

        email: function(new_email){
            this.options.email = new_email !== undefined ? new_email : this.element.attr("data-email");
            this.get();
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'data-size': this.resize(); break;
                case 'data-email': this.email(); break;
            }
        },

        destroy: function(){
            return this.element;
        }
    });
}(Metro, Dom));