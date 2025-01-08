/* global Metro, METRO_ANIMATION_DURATION, Cake */
(function(Metro, $) {
    'use strict';
    var Utils = Metro.utils;
    var StreamerDefaultConfig = {
        streamerDeferred: 0,
        wheel: true,
        wheelStep: 20,
        duration: METRO_ANIMATION_DURATION,
        defaultClosedIcon: "",
        defaultOpenIcon: "",
        changeUri: true,
        encodeLink: true,
        closed: false,
        chromeNotice: false,
        startFrom: null,
        slideToStart: true,
        startSlideSleep: 1000,
        source: null,
        data: null,
        eventClick: "select",
        selectGlobal: true,
        streamSelect: false,
        excludeSelectElement: null,
        excludeClickElement: null,
        excludeElement: null,
        excludeSelectClass: "",
        excludeClickClass: "",
        excludeClass: "",

        onDataLoad: Metro.noop,
        onDataLoaded: Metro.noop,
        onDataLoadError: Metro.noop,

        onDrawEvent: Metro.noop,
        onDrawGlobalEvent: Metro.noop,
        onDrawStream: Metro.noop,

        onStreamClick: Metro.noop,
        onStreamSelect: Metro.noop,
        onEventClick: Metro.noop,
        onEventSelect: Metro.noop,
        onEventsScroll: Metro.noop,
        onStreamerCreate: Metro.noop
    };

    Metro.streamerSetup = function (options) {
        StreamerDefaultConfig = $.extend({}, StreamerDefaultConfig, options);
    };

    if (typeof globalThis["metroStreamerSetup"] !== undefined) {
        Metro.streamerSetup(globalThis["metroStreamerSetup"]);
    }

    Metro.Component('streamer', {
        init: function( options, elem ) {
            this._super(elem, options, StreamerDefaultConfig, {
                data: null,
                scroll: 0,
                scrollDir: "left",
                events: null
            });

            return this;
        },

        _create: function(){
            var element = this.element, o = this.options;

            element.addClass("streamer");

            if (element.attr("id") === undefined) {
                element.attr("id", Utils.elementId("streamer"));
            }

            if (o.source === null && o.data === null) {
                return false;
            }

            $("<div>").addClass("streams").appendTo(element);
            $("<div>").addClass("events-area").appendTo(element);

            if (o.source !== null) {

                this._fireEvent("data-load", {
                    source: o.source
                });

                this._loadSource();
            } else {
                this.data = o.data;
                this.build();
            }

            // TODO Fix mouse scroll
            // if (o.chromeNotice === true && Utils.detectChrome() === true && $.touchable === false) {
            //     $("<p>").addClass("text-small text-muted").html("*) In Chrome browser please press and hold Shift and turn the mouse wheel.").insertAfter(element);
            // }
        },

        _loadSource: function(){
            var that = this, o = this.options;

            fetch(o.source)
                .then(Metro.fetch.status)
                .then(Metro.fetch.json)
                .then(function(data){
                    that._fireEvent("data-loaded", {
                        source: o.source,
                        data: data
                    });

                    that.data = data;
                    that.build();
                })
                .catch(function (error) {
                    that._fireEvent("data-load-error", {
                        source: o.source,
                        error: error
                    });
                });
        },

        build: function(){
            var that = this, element = this.element, o = this.options, data = this.data;
            var streams = element.find(".streams").html("");
            var events_area = element.find(".events-area").html("");
            var fake_timeline;
            var timeline = $("<ul>").addClass("streamer-timeline").html("").appendTo(events_area);
            var streamer_events = $("<div>").addClass("streamer-events").appendTo(events_area);
            var event_group_main = $("<div>").addClass("event-group").appendTo(streamer_events);
            var StreamerIDS = Utils.getURIParameter(null, "StreamerIDS");

            if (StreamerIDS !== null && o.encodeLink === true) {
                StreamerIDS = atob(StreamerIDS);
            }

            var StreamerIDS_i = StreamerIDS ? StreamerIDS.split("|")[0] : null;
            var StreamerIDS_a = StreamerIDS ? StreamerIDS.split("|")[1].split(",") : [];

            if (data.actions !== undefined) {
                var actions = $("<div>").addClass("streamer-actions").appendTo(streams);
                $.each(data.actions, function(){
                    var item = this;
                    var button = $("<button>").addClass("streamer-action").addClass(item.cls).html(item.html);
                    if (item.onclick !== undefined) button.on(Metro.events.click, function(){
                        Utils.exec(item.onclick, [element]);
                    });
                    button.appendTo(actions);
                });
            }

            // Create timeline

            timeline.html("");

            if (data.timeline === undefined) {
                data.timeline = {
                    start: "09:00",
                    stop: "18:00",
                    step: 20
                }
            }

            var start = new Date(), stop = new Date();
            var start_time_array = data.timeline.start ? data.timeline.start.split(":") : [9,0];
            var stop_time_array = data.timeline.stop ? data.timeline.stop.split(":") : [18,0];
            var step = data.timeline.step ? parseInt(data.timeline.step) * 60 : 1200;

            start.setHours(start_time_array[0]);
            start.setMinutes(start_time_array[1]);
            start.setSeconds(0);

            stop.setHours(stop_time_array[0]);
            stop.setMinutes(stop_time_array[1]);
            stop.setSeconds(0);

            var i, t, h, v, m, j, fm, li, fli, fli_w;

            for (i = start.getTime()/1000; i <= stop.getTime()/1000; i += step) {
                t = new Date(i * 1000);
                h = t.getHours();
                m = t.getMinutes();
                v = Str.lpad(h, "0", 2)+":"+Str.lpad(m, "0", 2);

                li = $("<li>").data("time", v).addClass("js-time-point-" + v.replace(":", "-")).html("<em>"+v+"</em>").appendTo(timeline);

                fli_w = li.width() / parseInt(data.timeline.step);
                fake_timeline = $("<ul>").addClass("streamer-fake-timeline").html("").appendTo(li);
                for(j = 0; j < parseInt(data.timeline.step); j++) {
                    fm = m + j;
                    v = Str.lpad(h, "0", 2)+":"+Str.lpad(fm, "0", 2);
                    fli = $("<li>").data("time", v).addClass("js-fake-time-point-" + v.replace(":", "-")).html("|").appendTo(fake_timeline);
                    fli.css({
                        width: fli_w
                    })
                }
            }

            // -- End timeline creator

            if (data.streams !== undefined) {
                $.each(data.streams, function(stream_index){
                    var stream_height = 75, rows = 0;
                    var stream_item = this;
                    var stream = $("<div>").addClass("stream").addClass(this.cls).appendTo(streams);
                    stream
                        .addClass(stream_item.cls)
                        .data("one", false)
                        .data("data", stream_item.data);

                    $("<div>").addClass("stream-title").html(stream_item.title).appendTo(stream);
                    $("<div>").addClass("stream-secondary").html(stream_item.secondary).appendTo(stream);
                    $(stream_item.icon).addClass("stream-icon").appendTo(stream);

                    var bg = Farbe.Routines.toHEX(Utils.getStyleOne(stream, "background-color"));
                    var fg = Farbe.Routines.toHEX(Utils.getStyleOne(stream, "color"));

                    var stream_events = $("<div>").addClass("stream-events")
                        .data("background-color", bg)
                        .data("text-color", fg)
                        .appendTo(event_group_main);

                    if (stream_item.events !== undefined) {
                        $.each(stream_item.events, function(event_index){
                            var event_item = this;
                            var row = event_item.row === undefined ? 1 : parseInt(event_item.row);
                            var _icon;
                            var sid = stream_index+":"+event_index;
                            var custom_html = event_item.custom !== undefined ? event_item.custom : "";
                            var custom_html_open = event_item.custom_open !== undefined ? event_item.custom_open : "";
                            var custom_html_close = event_item.custom_close !== undefined ? event_item.custom_close : "";
                            var event;

                            if (event_item.skip !== undefined && Utils.bool(event_item.skip)) {
                                return ;
                            }

                            event = $("<div>")
                                .data("origin", event_item)
                                .data("sid", sid)
                                .data("data", event_item.data)
                                .data("time", event_item.time)
                                .data("target", event_item.target)
                                .addClass("stream-event")
                                .addClass("size-"+event_item.size+(["half", "one-third"].includes(event_item.size) ? "" : "x"))
                                .addClass(event_item.cls)
                                .appendTo(stream_events);


                            var time_point = timeline.find(".js-fake-time-point-"+this.time.replace(":", "-"));
                            var left = time_point.offset().left - stream_events.offset().left;
                            var top = 75 * (row - 1);

                            if (row > rows) {
                                rows = row;
                            }

                            event.css({
                                position: "absolute",
                                left: left,
                                top: top
                            });


                            if (Utils.isNull(event_item.html)) {

                                var slide = $("<div>").addClass("stream-event-slide").appendTo(event);
                                var slide_logo = $("<div>").addClass("slide-logo").appendTo(slide);
                                var slide_data = $("<div>").addClass("slide-data").appendTo(slide);

                                if (event_item.icon !== undefined) {
                                    if (Utils.isTag(event_item.icon)) {
                                        $(event_item.icon).addClass("icon").appendTo(slide_logo);
                                    } else {
                                        $("<img>").addClass("icon").attr("src", event_item.icon).attr("alt", "").appendTo(slide_logo);
                                    }
                                }

                                $("<span>").addClass("time").css({
                                    backgroundColor: bg,
                                    color: fg
                                }).html(event_item.time).appendTo(slide_logo);

                                $("<div>").addClass("title").html(event_item.title).appendTo(slide_data);
                                $("<div>").addClass("subtitle").html(event_item.subtitle).appendTo(slide_data);
                                $("<div>").addClass("desc").html(event_item.desc).appendTo(slide_data);

                                if (o.closed === false && (element.attr("id") === StreamerIDS_i && StreamerIDS_a.indexOf(sid) !== -1) || event_item.selected === true || parseInt(event_item.selected) === 1) {
                                    event.addClass("selected");
                                }

                                if (o.closed === true || event_item.closed === true || parseInt(event_item.closed) === 1) {
                                    _icon = event_item.closedIcon !== undefined ? Utils.isTag(event_item.closedIcon) ? event_item.closedIcon : "<span>" + event_item.closedIcon + "</span>" : Utils.isTag(o.defaultClosedIcon) ? o.defaultClosedIcon : "<span>" + o.defaultClosedIcon + "</span>";
                                    $(_icon).addClass("state-icon").addClass(event_item.clsClosedIcon).appendTo(slide);
                                    event
                                        .data("closed", true)
                                        .data("target", event_item.target);
                                    event.append(custom_html_open);
                                } else {
                                    _icon = event_item.openIcon !== undefined ? Utils.isTag(event_item.openIcon) ? event_item.openIcon : "<span>" + event_item.openIcon + "</span>" : Utils.isTag(o.defaultOpenIcon) ? o.defaultOpenIcon : "<span>" + o.defaultOpenIcon + "</span>";
                                    $(_icon).addClass("state-icon").addClass(event_item.clsOpenIcon).appendTo(slide);
                                    event
                                        .data("closed", false);
                                    event.append(custom_html_close);
                                }

                                event.append(custom_html);
                            } else {
                                event.html(event_item.html);
                            }

                            that._fireEvent("draw-event", {
                                event: event[0]
                            });

                        });

                        var last_child = stream_events.find(".stream-event").last();
                        if (last_child.length > 0) stream_events.outerWidth(last_child[0].offsetLeft + last_child.outerWidth());
                    }

                    stream_events.css({
                        height: stream_height * rows
                    });

                    element.find(".stream").eq(stream_events.index()).css({
                        height: stream_height * rows
                    });

                    that._fireEvent("draw-stream", {
                        stream: stream[0]
                    });

                });
            }

            if (data.global !== undefined) {
                var streamer_events_left = streamer_events.offset().left;
                $.each(['before', 'after'], function(){
                    var global_item = this;
                    if (data.global[global_item] !== undefined) {
                        $.each(data.global[global_item], function(){
                            var event_item = this;
                            var group = $("<div>").addClass("event-group").addClass("size-"+event_item.size+(["half", "one-third"].includes(event_item.size) ? "" : "x"));
                            var events = $("<div>").addClass("stream-events global-stream").appendTo(group);
                            var event = $("<div>").addClass("stream-event").appendTo(events);
                            event
                                .addClass("global-event")
                                .addClass(event_item.cls)
                                .data("time", event_item.time)
                                .data("origin", event_item)
                                .data("data", event_item.data);

                            $("<div>").addClass("event-title").html(event_item.title).appendTo(event);
                            $("<div>").addClass("event-subtitle").html(event_item.subtitle).appendTo(event);
                            $("<div>").addClass("event-html").html(event_item.html).appendTo(event);

                            var left, t = timeline.find(".js-fake-time-point-"+this.time.replace(":", "-"));

                            if (t.length > 0) {
                                // left = t[0].offsetLeft - streams.find(".stream").outerWidth();
                                left = t.offset().left - streamer_events_left;
                            }
                            group.css({
                                position: "absolute",
                                left: left,
                                height: "100%"
                            }).appendTo(streamer_events);

                            that._fireEvent("draw-global-event", {
                                event: event[0]
                            });

                        });
                    }
                });
            }

            element.data("stream", -1);
            element.find(".events-area").scrollLeft(0);

            this.events = element.find(".stream-event");

            this._createEvents();

            if (o.startFrom !== null && o.slideToStart === true) {
                setTimeout(function(){
                    that.slideTo(o.startFrom);
                }, o.startSlideSleep);
            }

            this._fireEvent("streamer-create");

            this._fireScroll();
        },

        _fireScroll: function(){
            var that = this, element = this.element;
            var scrollable = element.find(".events-area");
            var oldScroll = this.scroll;

            if (scrollable.length === 0) {
                return undefined;
            }

            this.scrollDir = this.scroll < scrollable[0].scrollLeft ? "left" : "right";
            this.scroll = scrollable[0].scrollLeft;

            this._fireEvent("events-scroll", {
                scrollLeft: scrollable[0].scrollLeft,
                oldScroll: oldScroll,
                scrollDir: that.scrollDir,
                events: $.toArray(this.events)
            });
        },

        _createEvents: function(){
            var that = this, element = this.element, o = this.options;

            function disableScroll() {
                var scrollTop = globalThis.pageYOffset || document.documentElement.scrollTop;
                var scrollLeft = globalThis.pageXOffset || document.documentElement.scrollLeft;

                globalThis.onscroll = function() {
                    globalThis.scrollTo(scrollLeft, scrollTop);
                };
            }

            function enableScroll() {
                globalThis.onscroll = function() {};
            }

            element.off(Metro.events.click, ".stream-event").on(Metro.events.click, ".stream-event", function(e){
                var event = $(this);

                if (o.excludeClass !== "" && event.hasClass(o.excludeClass)) {
                    return ;
                }

                if (o.excludeElement !== null && $(e.target).is(o.excludeElement)) {
                    return ;
                }

                if (o.closed === false && event.data("closed") !== true && o.eventClick === 'select') {
                    if (o.excludeSelectClass !== "" && event.hasClass(o.excludeSelectClass)) {
                        /* eslint-disable-next-line */

                    } else {
                        if (o.excludeSelectElement !== null && $(e.target).is(o.excludeSelectElement)) {
                            /* eslint-disable-next-line */

                        } else {
                            if (event.hasClass("global-event")) {
                                if (o.selectGlobal === true) {
                                    event.toggleClass("selected");
                                }
                            } else {
                                event.toggleClass("selected");
                            }
                            if (o.changeUri === true) {
                                that._changeURI();
                            }

                            that._fireEvent("event-select", {
                                event: event[0],
                                selected: event.hasClass("selected")
                            });
                        }
                    }
                } else {
                    if (o.excludeClickClass !== "" && event.hasClass(o.excludeClickClass)) {
                        /* eslint-disable-next-line */

                    } else {

                        if (o.excludeClickElement !== null && $(e.target).is(o.excludeClickElement)) {
                            /* eslint-disable-next-line */

                        } else {

                            that._fireEvent("event-click", {
                                event: event[0]
                            });

                            if (o.closed === true || event.data("closed") === true) {
                                var target = event.data("target");
                                if (target) {
                                    globalThis.location.href = target;
                                }
                            }

                        }
                    }
                }
            });

            element.off(Metro.events.click, ".stream").on(Metro.events.click, ".stream", function(){
                var stream = $(this);
                var index = stream.index();

                if (o.streamSelect === false) {
                    return;
                }

                if (element.data("stream") === index) {
                    element.find(".stream-event").removeClass("disabled");
                    element.data("stream", -1);
                } else {
                    element.data("stream", index);
                    element.find(".stream-event").addClass("disabled");
                    that.enableStream(stream);
                    that._fireEvent("stream-select", {
                        stream: stream
                    });
                }

                that._fireEvent("stream-click", {
                    stream: stream
                });
            });

            if (o.wheel === true) {
                element.find(".events-area")
                    .off(Metro.events.mousewheel)
                    .on(Metro.events.mousewheel, function(e) {

                        if (e.deltaY === undefined) {
                            return ;
                        }

                        var scroll, scrollable = $(this);
                        var dir = e.deltaY > 0 ? -1 : 1;
                        var step = o.wheelStep;


                        scroll = scrollable.scrollLeft() - ( dir * step);
                        scrollable.scrollLeft(scroll);

                    }, {
                        passive: true
                    });

                element.find(".events-area").off("mouseenter").on("mouseenter", function() {
                    disableScroll();
                });

                element.find(".events-area").off("mouseleave").on("mouseleave", function() {
                    enableScroll();
                });
            }

            element.find(".events-area").last().off("scroll").on("scroll", function(){
                that._fireScroll();
            });

            if ($.touchable === true) {
                element.off(Metro.events.click, ".stream").on(Metro.events.click, ".stream", function(){
                    var stream = $(this);
                    stream.toggleClass("focused");
                    $.each(element.find(".stream"), function () {
                        if ($(this).is(stream)) return ;
                        $(this).removeClass("focused");
                    })
                })
            }
        },

        _changeURI: function(){
            var link = this.getLink();
            history.pushState({}, document.title, link);
        },

        slideTo: function(time){
            var element = this.element, o = this.options;
            var target;
            if (time === undefined) {
                target = $(element.find(".streamer-timeline li")[0]);
            } else {
                target = $(element.find(".streamer-timeline .js-time-point-" + time.replace(":", "-"))[0]);
            }

            element
                .find(".events-area")
                .animate({
                    draw: {
                        scrollLeft: target[0].offsetLeft - element.find(".streams .stream").outerWidth()
                    },
                    dur: o.duration
                });
        },

        enableStream: function(stream){
            var element = this.element;
            var index = stream.index()-1;
            stream.removeClass("disabled").data("streamDisabled", false);
            element.find(".stream-events").eq(index).find(".stream-event").removeClass("disabled");
        },

        disableStream: function(stream){
            var element = this.element;
            var index = stream.index()-1;
            stream.addClass("disabled").data("streamDisabled", true);
            element.find(".stream-events").eq(index).find(".stream-event").addClass("disabled");
        },

        toggleStream: function(stream){
            if (stream.data("streamDisabled") === true) {
                this.enableStream(stream);
            } else {
                this.disableStream(stream);
            }
        },

        getLink: function(){
            var element = this.element, o = this.options;
            var events = element.find(".stream-event");
            var a = [];
            var link;
            var origin = globalThis.location.href;

            $.each(events, function(){
                var event = $(this);
                if (event.data("sid") === undefined || !event.hasClass("selected")) {
                    return;
                }

                a.push(event.data("sid"));
            });

            link = element.attr("id") + "|" + a.join(",");

            if (o.encodeLink === true) {
                link = btoa(link);
            }

            return Utils.updateURIParameter(origin, "StreamerIDS", link);
        },

        getTimes: function(){
            var element = this.element;
            var times = element.find(".streamer-timeline > li");
            var result = [];
            $.each(times, function(){
                result.push($(this).data("time"));
            });
            return result;
        },

        getEvents: function(event_type, include_global){
            var element = this.element;
            var items, events = [];

            switch (event_type) {
                case "selected": items = element.find(".stream-event.selected"); break;
                case "non-selected": items = element.find(".stream-event:not(.selected)"); break;
                default: items = element.find(".stream-event");
            }

            $.each(items, function(){
                var item = $(this);
                var origin;

                if (include_global !== true && item.parent().hasClass("global-stream")) return ;

                origin = item.data("origin");

                events.push(origin);
            });

            return events;
        },

        source: function(s){
            var element = this.element;

            if (s === undefined) {
                return this.options.source;
            }

            element.attr("data-source", s);

            this.options.source = s;
            this.changeSource();
        },

        dataSet: function(s){
            if (s === undefined) {
                return this.options.data;
            }

            this.options.data = s;
            this.changeData(s);
        },

        getStreamerData: function(){
            return this.data;
        },

        toggleEvent: function(event){
            var o = this.options;
            event = $(event);

            if (event.hasClass("global-event") && o.selectGlobal !== true) {
                return ;
            }

            if (event.hasClass("selected")) {
                this.selectEvent(event, false);
            } else {
                this.selectEvent(event, true);
            }
        },

        selectEvent: function(event, state){
            var that = this, o = this.options;
            if (state === undefined) {
                state = true;
            }
            event = $(event);

            if (event.hasClass("global-event") && o.selectGlobal !== true) {
                return ;
            }

            if (state === true) event.addClass("selected"); else event.removeClass("selected");

            if (o.changeUri === true) {
                that._changeURI();
            }

            this._fireEvent("event-select", {
                event: event[0],
                selected: state
            });
        },

        changeSource: function(){
            var element = this.element, o = this.options;
            var new_source = element.attr("data-source");

            if (String(new_source).trim() === "") {
                return ;
            }

            o.source = new_source;

            this._fireEvent("data-load", {
                source: o.source
            });

            this._loadSource();

            // $.json(o.source).then(function(data){
            //
            //     that._fireEvent("data-loaded", {
            //         source: o.source,
            //         data: data
            //     });
            //
            //     that.data = data;
            //     that.build();
            // }, function(xhr){
            //
            //     that._fireEvent("data-load-error", {
            //         source: o.source,
            //         xhr: xhr
            //     });
            // });

            this._fireEvent("source-change");
        },

        changeData: function(data){
            var element = this.element, o = this.options;
            var old_data = this.data;

            o.data =  typeof data === 'object' ? data : JSON.parse(element.attr("data-data"));

            this.data = o.data;

            this.build();

            this._fireEvent("data-change", {
                oldData: old_data,
                newData: o.data
            });
        },

        changeStreamSelectOption: function(){
            var element = this.element, o = this.options;

            o.streamSelect = element.attr("data-stream-select").toLowerCase() === "true";
        },

        changeAttribute: function(attributeName){
            switch (attributeName) {
                case 'data-source': this.changeSource(); break;
                case 'data-data': this.changeData(); break;
                case 'data-stream-select': this.changeStreamSelectOption(); break;
            }
        },

        destroy: function(){
            var element = this.element;

            element.off(Metro.events.click, ".stream-event");
            element.off(Metro.events.click, ".stream");
            element.find(".events-area").off(Metro.events.mousewheel);
            element.find(".events-area").last().off("scroll");
            // element.off(Metro.events.click, ".stream");

            return element;
        }
    });
}(Metro, m4q));