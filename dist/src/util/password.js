"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = (password) => {
    const salt = bcryptjs_1.default.genSaltSync(10);
    return bcryptjs_1.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
// compare password
const comparePassword = (password, hash) => {
    return bcryptjs_1.default.compareSync(password, hash);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.js.map