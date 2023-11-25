"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentryParseLinkHeader = exports.parseLinkHeader = void 0;
/**
 * @description returns an object parsed from the link header
 * @param data Link Header - '<https://api.github.com/users?since=46>; rel="next", <https://api.github.com/users>; rel="first"'
 * @returns : {
  first: "https://api.github.com/users",
  next: "https://api.github.com/users?since=46"
}
 */
const parseLinkHeader = (data) => {
    const links = data.split(',');
    const result = {};
    for (const link of links) {
        if (link.length === 0) {
            continue;
        }
        const temp = link.split(';');
        const key = temp[1].split('=')[1].replace('"', '').replace('"', '');
        const value = temp[0].replace('<', '').replace('>', '').trim();
        result[key] = value;
    }
    return result;
};
exports.parseLinkHeader = parseLinkHeader;
/**
 * @description returns an object parsed from the link header
 * @param data Link Header - '<https://sentry.io/api/0/projects/zluri/zluri-integration-v1/events/?&cursor=0:100:1>; rel="previous"; results="true"; cursor="0:100:1", <https://sentry.io/api/0/projects/zluri/zluri-integration-v1/events/?&cursor=0:300:0>; rel="next"; results="true"; cursor="0:300:0"'
 * @returns : {
  previous: {
    value: 'https://sentry.io/api/0/projects/zluri/zluri-integration-v1/events/?&cursor=0:100:1',
    results: true
  },
  next: {
    value: 'https://sentry.io/api/0/projects/zluri/zluri-integration-v1/events/?&cursor=0:300:0',
    results: true
  }
}
 */
const sentryParseLinkHeader = (data) => {
    const links = data.split(',');
    const result = {};
    for (const link of links) {
        const temp = link.split(';');
        const key = temp[1].split('=')[1].replace('"', '').replace('"', '');
        const value = temp[0].replace('<', '').replace('>', '').trim();
        const bools = temp[2].split('=')[1].replace('"', '').replace('"', '');
        const results = bools == 'true' ? true : false;
        result[key] = { value, results };
    }
    return result;
};
exports.sentryParseLinkHeader = sentryParseLinkHeader;
//# sourceMappingURL=header.js.map