"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authControllers = typedi_1.Container.get(auth_controller_1.default);
// router.post(
//   '/signup',
//   RequestValidator(requestSchemas.productRoutesSchemas.createProduct.body, 'body'),
//   RequestValidator(requestSchemas.authRoutesSchemas.signup.headers, 'headers'),
//   authControllers.signUp,
// );
exports.default = router;
//# sourceMappingURL=product.routes.js.map