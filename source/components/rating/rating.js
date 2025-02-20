/* global Metro */
(function(Metro, $) {
    'use strict';

    let RatingDefaultConfig = {
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
            const element = this.element, o = this.options;
            let i;

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
            const element = this.element, o = this.options;

            const id = Metro.utils.elementId("rating");
            let i, stars, result, li;
            const sheet = Metro.sheet;
            const value = o.static ? Math.floor(this.originValue) : this.value;

            const rating = element.wrap("<div>").addClass("rating " + element[0].className).addClass(o.clsRating);

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
                // nothing current
            }
            
            if (o.onColor !== null && (o.onColor.includes("var(") || Farbe.Routines.isColor(o.onColor))) {
                Metro.utils.addCssRule(sheet, "#" + id + " .stars:hover li", "color: " + o.onColor + ";");
                Metro.utils.addCssRule(sheet, "#" + id + " .stars li.on", "color: "+o.onColor+";");
                Metro.utils.addCssRule(sheet, "#" + id + " .stars li.half::after", "color: "+o.onColor+";");
            }

            if (o.title !== null) {
                const title = $("<span>").addClass("title").addClass(o.clsTitle).html(o.title);
                rating.prepend(title);
            }

            if (o.static === true) {
                rating.addClass("static");
                if (o.half === true){
                    const dec = Math.round((this.originValue % 1) * 10);
                    if (dec > 0 && dec <= 9) {
                        rating.find('.stars li.on').last().next("li").addClass("half half-" + ( dec * 10));
                    }
                }
            }

            element[0].className = '';

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(rating);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                } else {
                    const id = Hooks.useId(element[0])
                    label.attr("for", id);
                    element.attr("id", id);
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
            const that = this, element = this.element, o = this.options;
            const rating = this.rating;

            rating.on(Metro.events.click, ".stars li", function(){

                if (o.static === true) {
                    return ;
                }

                const star = $(this);
                const value = star.data("value");
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
            const that = this, element = this.element, o = this.options;
            const rating = this.rating;

            if (v === undefined) {
                return this.value;
            }

            this.value = v > 0 ? Math[o.roundFunc](v) : 0;
            element.val(this.value).trigger("change");

            const stars = rating.find(".stars li").removeClass("on");
            $.each(stars, function(){
                var star = $(this);
                if (star.data("value") <= that.value) {
                    star.addClass("on");
                }
            });

            return this;
        },

        msg: function(m){
            const rating = this.rating;
            if (m ===  undefined) {
                return ;
            }
            rating.find(".result").html(m);
            return this;
        },

        static: function (mode) {
            const o = this.options;
            const rating = this.rating;

            o.static = mode;

            if (mode === true) {
                rating.addClass("static");
            } else {
                rating.removeClass("static");
            }
        },

        changeAttributeStatic: function(){
            const element = this.element;
            const isStatic = JSON.parse(element.attr("data-static")) === true;

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

        changeAttribute: function(attributeName, value){
            switch (attributeName) {
                case "value":
                case "data-value": this.val(value); break;
                case "disabled": this.toggleState(); break;
                case "data-message": this.msg(value); break;
                case "data-static": this.changeAttributeStatic(); break;
            }
        },

        destroy: function(){
            const o = this.options;
            const rating = this.rating;

            rating.off(Metro.events.click, ".stars li");

            if (o.label) {
                rating.prev("label").remove()
            }
            rating.remove()
        }
    });
}(Metro, Dom));