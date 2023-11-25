"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortLivedToken = exports.createRefreshToken = exports.verifyToken = exports.createAcessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAcessToken = (payload) => {
    payload = Object.assign(Object.assign({}, payload), { type: 'access' });
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};
exports.createAcessToken = createAcessToken;
const verifyToken = (token, type) => {
    try {
        if (type === 'refresh') {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        }
        else
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        console.log(err);
        return null;
    }
};
exports.verifyToken = verifyToken;
const createRefreshToken = (payload) => {
    payload = Object.assign(Object.assign({}, payload), { type: 'refresh' });
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};
exports.createRefreshToken = createRefreshToken;
const createShortLivedToken = (payload) => {
    payload = Object.assign(Object.assign({}, payload), { type: 'short-lived' });
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};
exports.createShortLivedToken = createShortLivedToken;
//# sourceMappingURL=auth.js.map