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
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const adminControllers = typedi_1.default.get(admin_controller_1.default);
router.get("/doctors", (0, validator_1.default)(requestSchemas_1.default.adminRoutesSchemas.getDoctors.headers, "headers"), adminControllers.getAllDoctors);
router.get("/patients", (0, validator_1.default)(requestSchemas_1.default.adminRoutesSchemas.getPatients.headers, "headers"), adminControllers.getAllPatients);
router.get("/appointments", (0, validator_1.default)(requestSchemas_1.default.adminRoutesSchemas.getAppointments.headers, "headers"), adminControllers.getAllAppointments);
router.get("/patients/:patientId", (0, validator_1.default)(requestSchemas_1.default.adminRoutesSchemas.getPatients.headers, "headers"), adminControllers.getPatientDetails);
router.get("/doctors/:doctorId", (0, validator_1.default)(requestSchemas_1.default.adminRoutesSchemas.getDoctors.headers, "headers"), adminControllers.getDoctorDetails);
router.put("/doctors/:doctorId/update", (0, validator_1.default)(requestSchemas_1.default.doctorRoutesSchemas.updateMe.body, "body"), (0, validator_1.default)(requestSchemas_1.default.adminRoutesSchemas.getDoctors.headers, "headers"), adminControllers.updateDoctorById);
// from this api you'll get appointment Details by ID along with (patient + doctor + diagnosis) details
router.get("/appointments/:appointmentId", (0, validator_1.default)(requestSchemas_1.default.adminRoutesSchemas.getAppointments.headers, "headers"), adminControllers.getAppointmentDetails);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map