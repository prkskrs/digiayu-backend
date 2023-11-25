"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApiCall = void 0;
const axios_1 = __importDefault(require("axios"));
function makeApiCall(requestConfig, options) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response;
            if (options === null || options === void 0 ? void 0 : options.adapter) {
                response = yield options.adapter(requestConfig);
            }
            else {
                response = yield (0, axios_1.default)(requestConfig);
            }
            if (options === null || options === void 0 ? void 0 : options.includeHeaders) {
                return { data: response.data, headers: response.headers };
            }
            return response.data;
        }
        catch (error) {
            console.log(error);
            const axiosError = error;
            if (!axiosError.response) {
                return {
                    error: true,
                    message: `No response from server. Please try again later.`,
                };
            }
            const data = (_a = axiosError === null || axiosError === void 0 ? void 0 : axiosError.response) === null || _a === void 0 ? void 0 : _a.data;
            const headers = (_b = axiosError === null || axiosError === void 0 ? void 0 : axiosError.response) === null || _b === void 0 ? void 0 : _b.headers;
            const statusText = (_c = axiosError === null || axiosError === void 0 ? void 0 : axiosError.response) === null || _c === void 0 ? void 0 : _c.statusText;
            const responseConfig = (_d = axiosError === null || axiosError === void 0 ? void 0 : axiosError.response) === null || _d === void 0 ? void 0 : _d.config;
            const status = (_e = axiosError === null || axiosError === void 0 ? void 0 : axiosError.response) === null || _e === void 0 ? void 0 : _e.status;
            const errorObj = {
                error: data === null || data === void 0 ? void 0 : data.error,
                request: {
                    data: responseConfig.data,
                    headers: responseConfig.headers,
                    method: responseConfig.method,
                    url: responseConfig.url,
                },
                response: {
                    headers,
                    data: JSON.stringify(data),
                },
                status,
                statusText,
            };
            console.log(JSON.stringify(errorObj));
            return Object.assign(Object.assign({ responseHeader: headers, error: true, status }, (typeof data === "string" ? { data } : Object.assign({}, data))), { axiosError: true, axiosStatus: status, statusText });
        }
    });
}
exports.makeApiCall = makeApiCall;
//# sourceMappingURL=api.js.map