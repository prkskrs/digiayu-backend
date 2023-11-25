"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedi_1 = require("typedi");
const router = express_1.default.Router();
const validator_1 = __importDefault(require("../middlewares/validator"));
const requestSchemas_1 = __importDefault(require("./requestSchemas"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authControllers = typedi_1.Container.get(auth_controller_1.default);
const upload_1 = __importDefault(require("../middlewares/upload"));
router.post('/signup/doctor', (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupDoctor.body, 'body'), (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupDoctor.headers, 'headers'), authControllers.signUpDoctor);
router.post('/signup/patient', (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupPatient.body, 'body'), (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupPatient.headers, 'headers'), authControllers.signUpPatient);
router.post('/login', (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.login.body, 'body'), authControllers.login);
router.post('/sendOTP', (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.sendOTP.body, 'body'), authControllers.sendOTP);
router.post('/verifyOTP', (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.verifyOTP.body, 'body'), authControllers.verifyOTP);
router.post('/upload/:fieldName/:userId', (0, upload_1.default)('file'), authControllers.uploadAvatar);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map