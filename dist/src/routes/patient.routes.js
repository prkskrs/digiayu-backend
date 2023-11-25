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
const patient_controller_1 = __importDefault(require("../controllers/patient.controller"));
const patientControllers = typedi_1.Container.get(patient_controller_1.default);
router.put("/updateMe", (0, validator_1.default)(requestSchemas_1.default.patientRoutesSchemas.updateMe.body, "body"), (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupDoctor.headers, "headers"), patientControllers.updateMe);
router.get("/getMe", (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupDoctor.headers, "headers"), patientControllers.getMe);
// For Doctors
router.get("/", (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupDoctor.headers, "headers"), patientControllers.getAllPatientForDoctor);
exports.default = router;
//# sourceMappingURL=patient.routes.js.map