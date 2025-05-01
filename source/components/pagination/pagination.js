((Metro, $) => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";
    Metro.pagination = (c) => {
        const defConf = {
            length: 0, //total rows
            rows: 0, // page size
            current: 0,
            target: "body",
            clsPagination: "",
            prevTitle: "",
            nextTitle: "",
            distance: 5,
            islandSize: 3,
            shortTrack: 10,
        };

        const strings = Metro.locales[$("html").attr("lang") || "en"];

        let i;
        let prev;
        let next;

        const conf = $.extend({}, defConf, c);
        const distance = Number.parseInt(conf.distance);
        const shortTrack = Number.parseInt(conf.shortTrack);
        const islandSize = Number.parseInt(conf.islandSize);
        const totalRows = Number.parseInt(conf.length);
        const pageSize = Number.parseInt(conf.rows);
        const totalPages = Math.ceil(totalRows / pageSize);
        const current = Number.parseInt(conf.current);
        const pagination_wrapper = $(conf.target);
        pagination_wrapper.html("");
        const pagination = $("<ul>").addClass("pagination").addClass(conf.clsPagination).appendTo(pagination_wrapper);

        if (totalRows === 0) {
            return;
        }

        if (pageSize === -1) {
            return;
        }

        const add_item = (item_title, item_type, data) => {
            const li = $("<li>").addClass("page-item").addClass(item_type);
            const a = $("<a>").addClass("page-link").html(item_title);
            a.data("page", data);
            a.appendTo(li);

            return li;
        };

        prev = add_item(conf.prevTitle || strings.label_prev, "service prev-page", "prev");
        pagination.append(prev);

        pagination.append(add_item(1, current === 1 ? "active" : "", 1));

        if (distance === 0 || totalPages <= shortTrack) {
            for (i = 2; i < totalPages; i++) {
                pagination.append(add_item(i, i === current ? "active" : "", i));
            }
        } else {
            if (current < distance) {
                for (i = 2; i <= distance; i++) {
                    pagination.append(add_item(i, i === current ? "active" : "", i));
                }

                if (totalPages > distance) {
                    pagination.append(add_item("...", "no-link", null));
                }
            } else if (current <= totalPages && current > totalPages - distance + 1) {
                if (totalPages > distance) {
                    pagination.append(add_item("...", "no-link", null));
                }

                for (i = totalPages - distance + 1; i < totalPages; i++) {
                    pagination.append(add_item(i, i === current ? "active" : "", i));
                }
            } else {
                pagination.append(add_item("...", "no-link", null));

                for (let i = islandSize; i > 0; i--) {
                    pagination.append(add_item(current - i, "", current - i));
                }

                pagination.append(add_item(current, "active", current));

                for (let i = 1; i <= islandSize; i++) {
                    pagination.append(add_item(current + i, "", current + i));
                }

                pagination.append(add_item("...", "no-link", null));
            }
        }

        if (totalPages > 1 || current < totalPages)
            pagination.append(add_item(totalPages, current === totalPages ? "active" : "", totalPages));

        next = add_item(conf.nextTitle || strings.label_next, "service next-page", "next");
        pagination.append(next);

        if (current === 1) {
            prev.addClass("disabled");
        }

        if (current === totalPages) {
            next.addClass("disabled");
        }

        if (totalRows === 0) {
            pagination.addClass("disabled");
            pagination.children().addClass("disabled");
        }

        return pagination;
    };
})(Metro, Dom);
