"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = __importDefault(require("typedi"));
const router = express_1.default.Router();
const validator_1 = __importDefault(require("../middlewares/validator"));
const requestSchemas_1 = __importDefault(require("./requestSchemas"));
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
const chatController = typedi_1.default.get(chat_controller_1.default);
router.get("/", (0, validator_1.default)(requestSchemas_1.default.chatRoutesSchemas.headers, "headers"), chatController.getAllChats);
router.get("/:id", (0, validator_1.default)(requestSchemas_1.default.chatRoutesSchemas.headers, "headers"), chatController.getChatMessages);
router.post("/", (0, validator_1.default)(requestSchemas_1.default.chatRoutesSchemas.headers, "headers"), chatController.sendMessage);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map