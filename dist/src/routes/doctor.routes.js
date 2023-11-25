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
const doctor_controller_1 = __importDefault(require("../controllers/doctor.controller"));
const doctorControllers = typedi_1.Container.get(doctor_controller_1.default);
router.put("/updateMe", (0, validator_1.default)(requestSchemas_1.default.doctorRoutesSchemas.updateMe.body, "body"), (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupDoctor.headers, "headers"), doctorControllers.updateMe);
router.get("/getMe", (0, validator_1.default)(requestSchemas_1.default.authRoutesSchemas.signupDoctor.headers, "headers"), doctorControllers.getMe);
router.get("/patients", (0, validator_1.default)(requestSchemas_1.default.doctorRoutesSchemas.getPatients.headers, "headers"), doctorControllers.getPatients);
router.get("/patients/:id", (0, validator_1.default)(requestSchemas_1.default.doctorRoutesSchemas.getPatients.headers, "headers"), doctorControllers.getPatientById);
router.get("/", doctorControllers.getAllDoctor);
router.patch("/set-availability/", (0, validator_1.default)(requestSchemas_1.default.doctorRoutesSchemas.getDoctor.headers, "headers"), doctorControllers.createOrUpdateAvailability);
router.get("/get-available-slots/:doctorId/", (0, validator_1.default)(requestSchemas_1.default.doctorRoutesSchemas.getDoctor.headers, "headers"), doctorControllers.getAvailabilityTimeSlots);
router.get("/:id", doctorControllers.getDoctorById);
exports.default = router;
//# sourceMappingURL=doctor.routes.js.map