((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    let StreamerDefaultConfig = {
        streamerDeferred: 0,
        wheel: true,
        wheelStep: 20,
        duration: 200,
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
        onStreamerCreate: Metro.noop,
    };

    Metro.streamerSetup = (options) => {
        StreamerDefaultConfig = $.extend({}, StreamerDefaultConfig, options);
    };

    if (typeof globalThis.metroStreamerSetup !== "undefined") {
        Metro.streamerSetup(globalThis.metroStreamerSetup);
    }

    Metro.Component("streamer", {
        init: function (options, elem) {
            this._super(elem, options, StreamerDefaultConfig, {
                data: null,
                scroll: 0,
                scrollDir: "left",
                events: null,
            });

            return this;
        },

        _create: function () {
            const element = this.element;
            const o = this.options;

            element.addClass("streamer");

            if (element.attr("id") === undefined) {
                element.attr("id", Metro.utils.elementId("streamer"));
            }

            if (o.source === null && o.data === null) {
                return false;
            }

            $("<div>").addClass("streams").appendTo(element);
            $("<div>").addClass("events-area").appendTo(element);

            if (o.source !== null) {
                this._fireEvent("data-load", {
                    source: o.source,
                });

                this._loadSource();
            } else {
                this.data = o.data;
                this.build();
            }

            // TODO Fix mouse scroll
            // if (o.chromeNotice === true && Metro.utils.detectChrome() === true && $.touchable === false) {
            //     $("<p>").addClass("text-small text-muted").html("*) In Chrome browser please press and hold Shift and turn the mouse wheel.").insertAfter(element);
            // }
        },

        _loadSource: function () {
            const o = this.options;

            fetch(o.source)
                .then(Metro.fetch.status)
                .then(Metro.fetch.json)
                .then((data) => {
                    this._fireEvent("data-loaded", {
                        source: o.source,
                        data: data,
                    });

                    this.data = data;
                    this.build();
                })
                .catch((error) => {
                    this._fireEvent("data-load-error", {
                        source: o.source,
                        error: error,
                    });
                });
        },

        build: function () {
            const that = this;
            const element = this.element;
            const o = this.options;
            const data = this.data;
            const streams = element.find(".streams").html("");
            const events_area = element.find(".events-area").html("");
            let fake_timeline;
            const timeline = $("<ul>").addClass("streamer-timeline").html("").appendTo(events_area);
            const streamer_events = $("<div>").addClass("streamer-events").appendTo(events_area);
            const event_group_main = $("<div>").addClass("event-group").appendTo(streamer_events);
            let StreamerIDS = Metro.utils.getURIParameter(null, "StreamerIDS");

            if (StreamerIDS !== null && o.encodeLink === true) {
                StreamerIDS = atob(StreamerIDS);
            }

            const StreamerIDS_i = StreamerIDS ? StreamerIDS.split("|")[0] : null;
            const StreamerIDS_a = StreamerIDS ? StreamerIDS.split("|")[1].split(",") : [];

            if (data.actions !== undefined) {
                const actions = $("<div>").addClass("streamer-actions").appendTo(streams);
                $.each(data.actions, function () {
                    const button = $("<button>").addClass("streamer-action").addClass(this.cls).html(this.html);
                    if (this.onclick)
                        button.on(Metro.events.click, () => {
                            Metro.utils.exec(this.onclick, [element]);
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
                    step: 20,
                };
            }

            const start = new Date();
            const stop = new Date();
            const start_time_array = data.timeline.start ? data.timeline.start.split(":") : [9, 0];
            const stop_time_array = data.timeline.stop ? data.timeline.stop.split(":") : [18, 0];
            const step = data.timeline.step ? Number.parseInt(data.timeline.step) * 60 : 1200;

            start.setHours(start_time_array[0]);
            start.setMinutes(start_time_array[1]);
            start.setSeconds(0);

            stop.setHours(stop_time_array[0]);
            stop.setMinutes(stop_time_array[1]);
            stop.setSeconds(0);

            let i;
            let t;
            let h;
            let v;
            let m;
            let j;
            let fm;
            let li;
            let fli;
            let fli_w;

            for (i = start.getTime() / 1000; i <= stop.getTime() / 1000; i += step) {
                t = new Date(i * 1000);
                h = t.getHours();
                m = t.getMinutes();
                v = `${Str.lpad(h, "0", 2)}:${Str.lpad(m, "0", 2)}`;
                li = $("<li>")
                    .data("time", v)
                    .addClass(`js-time-point-${v.replace(":", "-")}`)
                    .html(`<em>${v}</em>`)
                    .appendTo(timeline);

                fli_w = li.width() / Number.parseInt(data.timeline.step);
                fake_timeline = $("<ul>").addClass("streamer-fake-timeline").html("").appendTo(li);
                for (j = 0; j < Number.parseInt(data.timeline.step); j++) {
                    fm = m + j;
                    v = `${Str.lpad(h, "0", 2)}:${Str.lpad(fm, "0", 2)}`;
                    fli = $("<li>")
                        .data("time", v)
                        .addClass(`js-fake-time-point-${v.replace(":", "-")}`)
                        .html("|")
                        .appendTo(fake_timeline);
                    fli.css({
                        width: fli_w,
                    });
                }
            }

            // -- End timeline creator

            if (data.streams !== undefined) {
                $.each(data.streams, function (stream_index, stream_item) {
                    const stream_height = 75;
                    let rows = 0;
                    const stream = $("<div>").addClass("stream").addClass(this.cls).appendTo(streams);
                    stream.addClass(stream_item.cls).data("one", false).data("data", stream_item.data);

                    $("<div>").addClass("stream-title").html(stream_item.title).appendTo(stream);
                    $("<div>").addClass("stream-secondary").html(stream_item.secondary).appendTo(stream);
                    $(stream_item.icon).addClass("stream-icon").appendTo(stream);

                    const bg = Farbe.Routines.toHEX(Metro.utils.getStyleOne(stream, "background-color"));
                    const fg = Farbe.Routines.toHEX(Metro.utils.getStyleOne(stream, "color"));

                    const stream_events = $("<div>")
                        .addClass("stream-events")
                        .data("background-color", bg)
                        .data("text-color", fg)
                        .appendTo(event_group_main);

                    if (stream_item.events !== undefined) {
                        $.each(stream_item.events, function (event_index, event_item) {
                            const row = event_item.row === undefined ? 1 : Number.parseInt(event_item.row);
                            let _icon;
                            const sid = `${stream_index}:${event_index}`;
                            const custom_html = event_item.custom !== undefined ? event_item.custom : "";
                            const custom_html_open = event_item.custom_open !== undefined ? event_item.custom_open : "";
                            const custom_html_close =
                                event_item.custom_close !== undefined ? event_item.custom_close : "";
                            let event;

                            if (event_item.skip !== undefined && Metro.utils.bool(event_item.skip)) {
                                return;
                            }

                            event = $("<div>")
                                .data("origin", event_item)
                                .data("sid", sid)
                                .data("data", event_item.data)
                                .data("time", event_item.time)
                                .data("target", event_item.target)
                                .addClass("stream-event")
                                .addClass(
                                    `size-${event_item.size}${["half", "one-third"].includes(event_item.size) ? "" : "x"}`,
                                )
                                .addClass(event_item.cls)
                                .appendTo(stream_events);

                            const time_point = timeline.find(`.js-fake-time-point-${this.time.replace(":", "-")}`);
                            const left = time_point.offset().left - stream_events.offset().left;
                            const top = 75 * (row - 1);

                            if (row > rows) {
                                rows = row;
                            }

                            event.css({
                                position: "absolute",
                                left: left,
                                top: top,
                            });

                            if (Metro.utils.isNull(event_item.html)) {
                                const slide = $("<div>").addClass("stream-event-slide").appendTo(event);
                                const slide_logo = $("<div>").addClass("slide-logo").appendTo(slide);
                                const slide_data = $("<div>").addClass("slide-data").appendTo(slide);

                                if (event_item.icon !== undefined) {
                                    if (Metro.utils.isTag(event_item.icon)) {
                                        $(event_item.icon).addClass("icon").appendTo(slide_logo);
                                    } else {
                                        $("<img>")
                                            .addClass("icon")
                                            .attr("src", event_item.icon)
                                            .attr("alt", "")
                                            .appendTo(slide_logo);
                                    }
                                }

                                $("<span>")
                                    .addClass("time")
                                    .css({
                                        backgroundColor: bg,
                                        color: fg,
                                    })
                                    .html(event_item.time)
                                    .appendTo(slide_logo);

                                $("<div>").addClass("title").html(event_item.title).appendTo(slide_data);
                                $("<div>").addClass("subtitle").html(event_item.subtitle).appendTo(slide_data);
                                $("<div>").addClass("desc").html(event_item.desc).appendTo(slide_data);

                                if (
                                    (o.closed === false &&
                                        element.attr("id") === StreamerIDS_i &&
                                        StreamerIDS_a.indexOf(sid) !== -1) ||
                                    event_item.selected === true ||
                                    Number.parseInt(event_item.selected) === 1
                                ) {
                                    event.addClass("selected");
                                }

                                if (
                                    o.closed === true ||
                                    event_item.closed === true ||
                                    Number.parseInt(event_item.closed) === 1
                                ) {
                                    _icon =
                                        event_item.closedIcon !== undefined
                                            ? Metro.utils.isTag(event_item.closedIcon)
                                                ? event_item.closedIcon
                                                : `<span>${event_item.closedIcon}</span>`
                                            : Metro.utils.isTag(o.defaultClosedIcon)
                                              ? o.defaultClosedIcon
                                              : `<span>${o.defaultClosedIcon}</span>`;
                                    $(_icon).addClass("state-icon").addClass(event_item.clsClosedIcon).appendTo(slide);
                                    event.data("closed", true).data("target", event_item.target);
                                    event.append(custom_html_open);
                                } else {
                                    _icon =
                                        event_item.openIcon !== undefined
                                            ? Metro.utils.isTag(event_item.openIcon)
                                                ? event_item.openIcon
                                                : `<span>${event_item.openIcon}</span>`
                                            : Metro.utils.isTag(o.defaultOpenIcon)
                                              ? o.defaultOpenIcon
                                              : `<span>${o.defaultOpenIcon}</span>`;
                                    $(_icon).addClass("state-icon").addClass(event_item.clsOpenIcon).appendTo(slide);
                                    event.data("closed", false);
                                    event.append(custom_html_close);
                                }

                                event.append(custom_html);
                            } else {
                                event.html(event_item.html);
                            }

                            that._fireEvent("draw-event", {
                                event: event[0],
                            });
                        });

                        const last_child = stream_events.find(".stream-event").last();
                        if (last_child.length > 0)
                            stream_events.outerWidth(last_child[0].offsetLeft + last_child.outerWidth());
                    }

                    stream_events.css({
                        height: stream_height * rows,
                    });

                    element
                        .find(".stream")
                        .eq(stream_events.index())
                        .css({
                            height: stream_height * rows,
                        });

                    that._fireEvent("draw-stream", {
                        stream: stream[0],
                    });
                });
            }

            if (data.global !== undefined) {
                const streamer_events_left = streamer_events.offset().left;
                $.each(["before", "after"], (_, global_item) => {
                    if (data.global[global_item] !== undefined) {
                        $.each(data.global[global_item], function (_, event_item) {
                            const group = $("<div>")
                                .addClass("event-group")
                                .addClass(
                                    `size-${event_item.size}${["half", "one-third"].includes(event_item.size) ? "" : "x"}`,
                                );
                            const events = $("<div>").addClass("stream-events global-stream").appendTo(group);
                            const event = $("<div>").addClass("stream-event").appendTo(events);
                            event
                                .addClass("global-event")
                                .addClass(event_item.cls)
                                .data("time", event_item.time)
                                .data("origin", event_item)
                                .data("data", event_item.data);

                            $("<div>").addClass("event-title").html(event_item.title).appendTo(event);
                            $("<div>").addClass("event-subtitle").html(event_item.subtitle).appendTo(event);
                            $("<div>").addClass("event-html").html(event_item.html).appendTo(event);

                            let left;
                            const t = timeline.find(`.js-fake-time-point-${this.time.replace(":", "-")}`);

                            if (t.length > 0) {
                                // left = t[0].offsetLeft - streams.find(".stream").outerWidth();
                                left = t.offset().left - streamer_events_left;
                            }
                            group
                                .css({
                                    position: "absolute",
                                    left: left,
                                    height: "100%",
                                })
                                .appendTo(streamer_events);

                            that._fireEvent("draw-global-event", {
                                event: event[0],
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
                setTimeout(() => {
                    that.slideTo(o.startFrom);
                }, o.startSlideSleep);
            }

            this._fireEvent("streamer-create");

            this._fireScroll();
        },

        _fireScroll: function () {
            const element = this.element;
            const scrollable = element.find(".events-area");
            const oldScroll = this.scroll;

            if (scrollable.length === 0) {
                return undefined;
            }

            this.scrollDir = this.scroll < scrollable[0].scrollLeft ? "left" : "right";
            this.scroll = scrollable[0].scrollLeft;

            this._fireEvent("events-scroll", {
                scrollLeft: scrollable[0].scrollLeft,
                oldScroll: oldScroll,
                scrollDir: this.scrollDir,
                events: $.toArray(this.events),
            });
        },

        _createEvents: function () {
            const that = this;
            const element = this.element;
            const o = this.options;

            function disableScroll() {
                const scrollTop = globalThis.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = globalThis.pageXOffset || document.documentElement.scrollLeft;

                globalThis.onscroll = () => {
                    globalThis.scrollTo(scrollLeft, scrollTop);
                };
            }

            function enableScroll() {
                globalThis.onscroll = () => {};
            }

            element.off(Metro.events.click, ".stream-event").on(Metro.events.click, ".stream-event", function (e) {
                const event = $(this);

                if (o.excludeClass !== "" && event.hasClass(o.excludeClass)) {
                    return;
                }

                if (o.excludeElement !== null && $(e.target).is(o.excludeElement)) {
                    return;
                }

                if (o.closed === false && event.data("closed") !== true && o.eventClick === "select") {
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
                                selected: event.hasClass("selected"),
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
                                event: event[0],
                            });

                            if (o.closed === true || event.data("closed") === true) {
                                const target = event.data("target");
                                if (target) {
                                    globalThis.location.href = target;
                                }
                            }
                        }
                    }
                }
            });

            element.off(Metro.events.click, ".stream").on(Metro.events.click, ".stream", function () {
                const stream = $(this);
                const index = stream.index();

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
                        stream: stream,
                    });
                }

                that._fireEvent("stream-click", {
                    stream: stream,
                });
            });

            if (o.wheel === true) {
                element
                    .find(".events-area")
                    .off(Metro.events.mousewheel)
                    .on(
                        Metro.events.mousewheel,
                        function (e) {
                            if (e.deltaY === undefined) {
                                return;
                            }

                            const scrollable = $(this);
                            const dir = e.deltaY > 0 ? -1 : 1;
                            const step = o.wheelStep;

                            const scroll = scrollable.scrollLeft() - dir * step;
                            scrollable.scrollLeft(scroll);
                        },
                        {
                            passive: true,
                        },
                    );

                element
                    .find(".events-area")
                    .off("mouseenter")
                    .on("mouseenter", () => {
                        disableScroll();
                    });

                element
                    .find(".events-area")
                    .off("mouseleave")
                    .on("mouseleave", () => {
                        enableScroll();
                    });
            }

            element
                .find(".events-area")
                .last()
                .off("scroll")
                .on("scroll", () => {
                    that._fireScroll();
                });

            if ($.touchable === true) {
                element.off(Metro.events.click, ".stream").on(Metro.events.click, ".stream", function () {
                    const stream = $(this);
                    stream.toggleClass("focused");
                    $.each(element.find(".stream"), function () {
                        if ($(this).is(stream)) return;
                        $(this).removeClass("focused");
                    });
                });
            }
        },

        _changeURI: function () {
            const link = this.getLink();
            history.pushState({}, document.title, link);
        },

        slideTo: function (time) {
            const element = this.element;
            const o = this.options;
            let target;
            if (time === undefined) {
                target = $(element.find(".streamer-timeline li")[0]);
            } else {
                target = $(element.find(`.streamer-timeline .js-time-point-${time.replace(":", "-")}`)[0]);
            }

            element.find(".events-area").animate({
                draw: {
                    scrollLeft: target[0].offsetLeft - element.find(".streams .stream").outerWidth(),
                },
                dur: o.duration,
            });
        },

        enableStream: function (stream) {
            const element = this.element;
            const index = stream.index() - 1;
            stream.removeClass("disabled").data("streamDisabled", false);
            element.find(".stream-events").eq(index).find(".stream-event").removeClass("disabled");
        },

        disableStream: function (stream) {
            const element = this.element;
            const index = stream.index() - 1;
            stream.addClass("disabled").data("streamDisabled", true);
            element.find(".stream-events").eq(index).find(".stream-event").addClass("disabled");
        },

        toggleStream: function (stream) {
            if (stream.data("streamDisabled") === true) {
                this.enableStream(stream);
            } else {
                this.disableStream(stream);
            }
        },

        getLink: function () {
            const element = this.element;
            const o = this.options;
            const events = element.find(".stream-event");
            const a = [];
            let link;
            const origin = globalThis.location.href;

            $.each(events, function () {
                const event = $(this);
                if (event.data("sid") === undefined || !event.hasClass("selected")) {
                    return;
                }

                a.push(event.data("sid"));
            });

            link = `${element.attr("id")}|${a.join(",")}`;

            if (o.encodeLink === true) {
                link = btoa(link);
            }

            return Metro.utils.updateURIParameter(origin, "StreamerIDS", link);
        },

        getTimes: function () {
            const element = this.element;
            const times = element.find(".streamer-timeline > li");
            const result = [];
            $.each(times, function () {
                result.push($(this).data("time"));
            });
            return result;
        },

        getEvents: function (event_type, include_global) {
            const element = this.element;
            let items;
            const events = [];

            switch (event_type) {
                case "selected":
                    items = element.find(".stream-event.selected");
                    break;
                case "non-selected":
                    items = element.find(".stream-event:not(.selected)");
                    break;
                default:
                    items = element.find(".stream-event");
            }

            $.each(items, function () {
                const item = $(this);
                if (include_global !== true && item.parent().hasClass("global-stream")) return;
                const origin = item.data("origin");
                events.push(origin);
            });

            return events;
        },

        source: function (s) {
            const element = this.element;

            if (s === undefined) {
                return this.options.source;
            }

            element.attr("data-source", s);

            this.options.source = s;
            this.changeSource();
        },

        dataSet: function (s) {
            if (s === undefined) {
                return this.options.data;
            }

            this.options.data = s;
            this.changeData(s);
        },

        getStreamerData: function () {
            return this.data;
        },

        toggleEvent: function (event) {
            const o = this.options;
            const _event = $(event);

            if (_event.hasClass("global-event") && o.selectGlobal !== true) {
                return;
            }

            if (_event.hasClass("selected")) {
                this.selectEvent(event, false);
            } else {
                this.selectEvent(event, true);
            }
        },

        selectEvent: function (event, state = true) {
            const o = this.options;
            const _event = $(event);

            if (_event.hasClass("global-event") && o.selectGlobal !== true) {
                return;
            }

            if (state === true) _event.addClass("selected");
            else _event.removeClass("selected");

            if (o.changeUri === true) {
                this._changeURI();
            }

            this._fireEvent("event-select", {
                event: _event[0],
                selected: state,
            });
        },

        changeSource: function () {
            const element = this.element;
            const o = this.options;
            const new_source = element.attr("data-source");

            if (String(new_source).trim() === "") {
                return;
            }

            o.source = new_source;

            this._fireEvent("data-load", {
                source: o.source,
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

        changeData: function (data) {
            const element = this.element;
            const o = this.options;
            const old_data = this.data;

            o.data = typeof data === "object" ? data : JSON.parse(element.attr("data-data"));

            this.data = o.data;

            this.build();

            this._fireEvent("data-change", {
                oldData: old_data,
                newData: o.data,
            });
        },

        changeStreamSelectOption: function () {
            const element = this.element;
            const o = this.options;

            o.streamSelect = element.attr("data-stream-select").toLowerCase() === "true";
        },

        changeAttribute: function (attributeName) {
            switch (attributeName) {
                case "data-source":
                    this.changeSource();
                    break;
                case "data-data":
                    this.changeData();
                    break;
                case "data-stream-select":
                    this.changeStreamSelectOption();
                    break;
            }
        },

        destroy: function () {
            const element = this.element;

            element.off(Metro.events.click, ".stream-event");
            element.off(Metro.events.click, ".stream");
            element.find(".events-area").off(Metro.events.mousewheel);
            element.find(".events-area").last().off("scroll");

            element.remove();
        },
    });
})(Metro, Dom);
