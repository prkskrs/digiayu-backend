"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStringDate = exports.firstDayandLastDay = exports.getCustomFormattedDate = exports.getFormmattedDate = void 0;
/**
 *
 * @param date
 * @returns '2022-03-15'
 */
const getFormmattedDate = (date, delimiter = '-') => {
    const formattedDate = [
        `${date.getFullYear()}`,
        `0${date.getMonth() + 1}`.substr(-2),
        `0${date.getDate()}`.substr(-2),
    ].join(delimiter);
    return formattedDate;
};
exports.getFormmattedDate = getFormmattedDate;
const getCustomFormattedDate = (date, delimiter = '-', dateOrder = ['D', 'M', 'Y']) => {
    const formattedDate = [];
    const monthNamesList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (let i = 0; i < dateOrder.length; i++) {
        if (dateOrder[i].toUpperCase() === 'M' || dateOrder[i].toUpperCase() === 'MM') {
            formattedDate.push(`0${date.getMonth() + 1}`.substr(-2));
        }
        if (dateOrder[i].toUpperCase() === 'MMM' || dateOrder[i].toUpperCase() === 'MON') {
            const monthName = monthNamesList[date.getMonth()].substr(0, 3);
            formattedDate.push(monthName);
        }
        if (dateOrder[i].toUpperCase() === 'MONTH') {
            const monthName = monthNamesList[date.getMonth()];
            formattedDate.push(monthName);
        }
        if (dateOrder[i].toUpperCase() === 'D' || dateOrder[i].toUpperCase() === 'DD') {
            formattedDate.push(`0${date.getDate()}`.substr(-2));
        }
        if (dateOrder[i].toUpperCase() === 'Y' || dateOrder[i].toUpperCase() === 'YY' || dateOrder[i].toUpperCase() === 'YYYY') {
            formattedDate.push(`${date.getFullYear()}`);
        }
    }
    return formattedDate.join(delimiter);
};
exports.getCustomFormattedDate = getCustomFormattedDate;
/**
 *
 * @param date
 * @returns
 *  {
      startOfMonth: 2022-07-01T18:30:00.000Z,
      endDateOfMonth: 2022-07-31T18:30:00.000Z
    }
 */
const firstDayandLastDay = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDateOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { startOfMonth, endDateOfMonth };
};
exports.firstDayandLastDay = firstDayandLastDay;
/**
 *
 * @param date
 * @returns '15 March 2022'
 */
const getStringDate = (date) => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const result = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    return result;
};
exports.getStringDate = getStringDate;
//# sourceMappingURL=dates.js.map