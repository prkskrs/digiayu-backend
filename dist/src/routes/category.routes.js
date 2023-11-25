"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const router = express_1.default.Router();
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const categoryControllers = typedi_1.Container.get(category_controller_1.default);
// router.post(
//   '/',
//   RequestValidator(requestSchemas.categorySchemas.createCategory.body, 'body'),
//   RequestValidator(requestSchemas.authRoutesSchemas.signup.headers, 'headers'),
//   categoryControllers.create,
// );
router.get('/', categoryControllers.list);
exports.default = router;
//# sourceMappingURL=category.routes.js.map