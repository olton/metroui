/** @format */

import { Datetime, datetime } from "@olton/datetime";

Datetime.correctDate = (date) => datetime(date).addDay(1).align("day").addMinute(new Date().getTimezoneOffset());

globalThis.Datetime = Datetime;
globalThis.datetime = datetime;

(() => {
    // biome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
    "use strict";

    const MONTHS = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ];
    const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    const getLocale = Datetime.getLocale;

    Datetime.getLocale = function (locale = "en") {
        let _locale = locale;

        if (!Metro) {
            return getLocale.call(this, locale);
        }

        if (!Metro.locales[_locale]) {
            _locale = "en";
        }

        const data = Metro.locales[_locale];
        const months = MONTHS.map((el, i) => data[el]);
        const monthsShort = MONTHS.map((el, i) => data[`${el}_short`]);
        const weekdays = DAYS.map((el, i) => data[el]);
        const weekdaysShort = DAYS.map((el, i) => data[`${el}_short`]);
        const weekdaysMin = DAYS.map((el, i) => data[`${el}_short_2`]);

        return {
            months,
            monthsShort,
            weekdays,
            weekdaysShort,
            weekdaysMin,
            weekStart: data.weekStart,
        };
    };
})();
