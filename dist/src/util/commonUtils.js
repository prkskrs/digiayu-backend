"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviousMonthDate = exports.generateCode = exports.generateRandomString = exports.generateRandomNumber = exports.getUTCStringDate = exports.addHoursInCurrentDT = exports.getNthDayDateFromNow = exports.toTitleCase = exports.isUrlValid = exports.removeTralingSlashFromUrl = exports.wait = exports.convertToBase64 = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function convertToBase64(x) {
    const bufferObj = Buffer.from(x, 'utf8');
    const base64String = bufferObj.toString('base64');
    return base64String;
}
exports.convertToBase64 = convertToBase64;
/**
 *
 * @param time milliseconds to wait
 * @returns
 */
function wait(time) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(null);
        }, time);
    });
}
exports.wait = wait;
function removeTralingSlashFromUrl(url) {
    // function to check if the user submits url with backslash
    if (url.endsWith('/')) {
        return url.slice(0, url.lastIndexOf('/'));
    }
    return url;
}
exports.removeTralingSlashFromUrl = removeTralingSlashFromUrl;
function isUrlValid(url) {
    // this custom regex is used as the host can be
    // 1. www.google.com
    // 2. google.com
    // 3. 142.251.33.68
    // 4. http://www.google.com
    // 5. https://www.google.com
    const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'); // port and path
    if (!pattern.test(url)) {
        return false;
    }
    return true;
}
exports.isUrlValid = isUrlValid;
const toTitleCase = (name) => {
    if (!name)
        return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};
exports.toTitleCase = toTitleCase;
function getNthDayDateFromNow(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
exports.getNthDayDateFromNow = getNthDayDateFromNow;
function addHoursInCurrentDT(h) {
    const dd = new Date();
    dd.setHours(dd.getHours() + h);
    return dd;
}
exports.addHoursInCurrentDT = addHoursInCurrentDT;
function getUTCStringDate(timestamp) {
    const dd = new Date(timestamp).toUTCString();
    if (dd !== 'Invalid Date') {
        const ddArr = dd.split(' ');
        return ddArr
            .splice(0, 4)
            .join(' ')
            .concat(` ${ddArr[ddArr.length - 1]}`);
    }
    return '-';
}
exports.getUTCStringDate = getUTCStringDate;
function generateRandomNumber(min, max) {
    const difference = max - min;
    let random = Math.random();
    random = Math.floor(random * difference);
    random = random + min;
    return random;
}
exports.generateRandomNumber = generateRandomNumber;
function generateRandomString(length = 10) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateRandomString = generateRandomString;
function generateCode(orgIntegrationId) {
    // generate 13 codes for syncs 1st for 7 days from current date and rest for 30 days each
    const codes = [];
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    let payload = {
        orgIntegrationId,
        type: 'custom',
        startDate,
        endDate,
    };
    let code = jsonwebtoken_1.default.sign(payload, process.env.SYNC_JWT_SECRET, {
        expiresIn: '15d',
    });
    codes.push(code);
    for (let i = 0; i < 12; i++) {
        endDate = new Date(startDate);
        startDate = getPreviousMonthDate(startDate);
        payload = {
            orgIntegrationId,
            type: 'custom',
            startDate,
            endDate,
            isBackwardSync: true,
        };
        code = jsonwebtoken_1.default.sign(payload, process.env.SYNC_JWT_SECRET, {
            expiresIn: '15d',
        });
        codes.push(code);
    }
    return codes;
}
exports.generateCode = generateCode;
function getPreviousMonthDate(date) {
    date.setDate(date.getDate() - 30);
    return date;
}
exports.getPreviousMonthDate = getPreviousMonthDate;
//# sourceMappingURL=commonUtils.js.map