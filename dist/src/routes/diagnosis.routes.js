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
const diagnosis_controller_1 = __importDefault(require("../controllers/diagnosis.controller"));
const diagnosisController = typedi_1.Container.get(diagnosis_controller_1.default);
router.put("/:appointmentId", (0, validator_1.default)(requestSchemas_1.default.diagnosisRoutesSchemas.createDiagnosis.body, "body"), (0, validator_1.default)(requestSchemas_1.default.diagnosisRoutesSchemas.createDiagnosis.headers, "headers"), diagnosisController.createOrUpdateDiagnosis);
router.get("/appointment/:id", (0, validator_1.default)(requestSchemas_1.default.diagnosisRoutesSchemas.createDiagnosis.headers, "headers"), diagnosisController.getDiagnosisById);
exports.default = router;
//# sourceMappingURL=diagnosis.routes.js.map