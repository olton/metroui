/* global Metro */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var RatingDefaultConfig = {
        ratingDeferred: 0,
        label: "",
        static: false,
        title: null,
        value: 0,
        values: null,
        message: "",
        stars: 5,
        onColor: null,
        offColor: null,
        roundFunc: "round", // ceil, floor, round
        half: true,
        symbol: "★",
        clsRating: "",
        clsTitle: "",
        clsStars: "",
        clsResult: "",
        clsLabel: "",
        onStarClick: Metro.noop,
        onRatingCreate: Metro.noop
    };

    Metro.ratingSetup = function (options) {
        RatingDefaultConfig = $.extend({}, RatingDefaultConfig, options);
    };

    if (typeof globalThis["metroRatingSetup"] !== undefined) {
        Metro.ratingSetup(globalThis["metroRatingSetup"]);
    }

    Metro.Component('rating', {
        init: function( options, elem ) {
            this._super(elem, options, RatingDefaultConfig, {
                value: 0,
                originValue: 0,
                values: [],
                rate: 0,
                rating: null
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;
            var i;

            if (isNaN(o.value)) {
                o.value = 0;
            } else {
                o.value = parseFloat(o.value).toFixed(1);
            }

            if (o.values !== null) {
                if (Array.isArray(o.values)) {
                    this.values = o.values;
                } else if (typeof o.values === "string") {
                    this.values = o.values.toArray()
                }
            } else {
                for(i = 1; i <= o.stars; i++) {
                    this.values.push(i);
                }
            }

            this.originValue = o.value;
            this.value = o.value > 0 && o.roundFunc !== "none" ? Math[o.roundFunc](o.value) : Math.abs(o.value);

            this._createRating();
            this._createEvents();

            this._fireEvent("rating-create", {
                element: element
            });
        },

        _createRating: function(){
            var element = this.element, o = this.options;

            var id = Utils.elementId("rating");
            var i, stars, result, li;
            var sheet = Metro.sheet;
            var value = o.static ? Math.floor(this.originValue) : this.value;

            var rating = element.wrap("<div>").addClass("rating " + element[0].className).addClass(o.clsRating);
            
            element.val(this.value);

            rating.attr("id", element.id() ? "rating--"+element.id() : id);

            stars = $("<ul>").addClass("stars").addClass(o.clsStars).appendTo(rating);

            for(i = 1; i <= o.stars; i++) {
                li = $("<li>").attr("data-symbol", o.symbol).data("value", this.values[i-1]).appendTo(stars);
                if (i <= value) {
                    li.addClass("on");
                }
            }

            result = $("<span>").addClass("result").addClass(o.clsResult).appendTo(rating);

            result.html(o.message);

            if (o.offColor !== null && (o.offColor.includes("var(") || Farbe.Routines.isColor(o.offColor))) {
                
            }
            
            if (o.onColor !== null && (o.onColor.includes("var(") || Farbe.Routines.isColor(o.onColor))) {
                Utils.addCssRule(sheet, "#" + id + " .stars:hover li", "color: " + o.onColor + ";");
                Utils.addCssRule(sheet, "#" + id + " .stars li.on", "color: "+o.onColor+";");
                Utils.addCssRule(sheet, "#" + id + " .stars li.half::after", "color: "+o.onColor+";");
            }

            if (o.title !== null) {
                var title = $("<span>").addClass("title").addClass(o.clsTitle).html(o.title);
                rating.prepend(title);
            }

            if (o.static === true) {
                rating.addClass("static");
                if (o.half === true){
                    var dec = Math.round((this.originValue % 1) * 10);
                    if (dec > 0 && dec <= 9) {
                        rating.find('.stars li.on').last().next("li").addClass("half half-" + ( dec * 10));
                    }
                }
            }

            element[0].className = '';
            if (o.copyInlineStyles === true) {
                for (i = 0; i < element[0].style.length; i++) {
                    rating.css(element[0].style[i], element.css(element[0].style[i]));
                }
            }

            if (o.label) {
                var label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(rating);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (element.is(":disabled")) {
                this.disable();
            } else {
                this.enable();
            }

            this.rating = rating;
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;
            var rating = this.rating;

            rating.on(Metro.events.click, ".stars li", function(){

                if (o.static === true) {
                    return ;
                }

                var star = $(this);
                var value = star.data("value");
                star.addClass("scale");
                setTimeout(function(){
                    star.removeClass("scale");
                }, 300);
                element.val(value).trigger("change");
                star.addClass("on");
                star.prevAll().addClass("on");
                star.nextAll().removeClass("on");

                that._fireEvent("star-click", {
                    value: value,
                    star: star[0]
                });

            });
        },

        val: function(v){
            var that = this, element = this.element, o = this.options;
            var rating = this.rating;

            if (v === undefined) {
                return this.value;
            }

            this.value = v > 0 ? Math[o.roundFunc](v) : 0;
            element.val(this.value).trigger("change");

            var stars = rating.find(".stars li").removeClass("on");
            $.each(stars, function(){
                var star = $(this);
                if (star.data("value") <= that.value) {
                    star.addClass("on");
                }
            });

            return this;
        },

        msg: function(m){
            var rating = this.rating;
            if (m ===  undefined) {
                return ;
            }
            rating.find(".result").html(m);
            return this;
        },

        static: function (mode) {
            var o = this.options;
            var rating = this.rating;

            o.static = mode;

            if (mode === true) {
                rating.addClass("static");
            } else {
                rating.removeClass("static");
            }
        },

        changeAttributeValue: function(a){
            var element = this.element;
            var value = a === "value" ? element.val() : element.attr("data-value");
            this.val(value);
        },

        changeAttributeMessage: function(){
            var element = this.element;
            var message = element.attr("data-message");
            this.msg(message);
        },

        changeAttributeStatic: function(){
            var element = this.element;
            var isStatic = JSON.parse(element.attr("data-static")) === true;

            this.static(isStatic);
        },

        disable: function(){
            this.element.data("disabled", true);
            this.element.parent().addClass("disabled");
        },

        enable: function(){
            this.element.data("disabled", false);
            this.element.parent().removeClass("disabled");
        },

        toggleState: function(){
            if (this.elem.disabled) {
                this.disable();
            } else {
                this.enable();
            }
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case "value":
                case "data-value": this.changeAttributeValue(attributeName); break;
                case "disabled": this.toggleState(); break;
                case "data-message": this.changeAttributeMessage(); break;
                case "data-static": this.changeAttributeStatic(); break;
            }
        },

        destroy: function(){
            var element = this.element;
            var rating = this.rating;

            rating.off(Metro.events.click, ".stars li");

            return element;
        }
    });
}(Metro, Dom));