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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const decodeMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = (req.query.code || req.body.code);
    if (!code) {
        return res.status(400).json({ error: "Empty code value" });
    }
    let secret = process.env.JWT_SECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(code, secret);
        const body = req.body;
        req.body = Object.assign({}, body, decoded);
    }
    catch (codeError) {
        return res.status(400).json({
            error: codeError.name === "TokenExpiredError"
                ? "Code has expired"
                : "Code is invalid",
        });
    }
    next();
});
exports.default = decodeMiddleware;
//# sourceMappingURL=decodeMiddleware.js.map