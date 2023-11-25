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
const appointment_controller_1 = __importDefault(require("../controllers/appointment.controller"));
const appointmentControllers = typedi_1.Container.get(appointment_controller_1.default);
router.post('/book', (0, validator_1.default)(requestSchemas_1.default.appointmentRoutesSchemas.bookAppointment.body, 'body'), (0, validator_1.default)(requestSchemas_1.default.appointmentRoutesSchemas.bookAppointment.headers, 'headers'), appointmentControllers.bookAppointment);
// For both doctor and patient based on token
router.get('/', (0, validator_1.default)(requestSchemas_1.default.appointmentRoutesSchemas.getAppointments.headers, 'headers'), appointmentControllers.getAppointments);
router.get('/:id', (0, validator_1.default)(requestSchemas_1.default.appointmentRoutesSchemas.getAppointments.headers, 'headers'), appointmentControllers.getAppointmentById);
router.patch('/:id', (0, validator_1.default)(requestSchemas_1.default.appointmentRoutesSchemas.updateAppointment.body, 'body'), (0, validator_1.default)(requestSchemas_1.default.appointmentRoutesSchemas.updateAppointment.headers, 'headers'), appointmentControllers.updateAppointmentById);
exports.default = router;
//# sourceMappingURL=appointment.routes.js.map