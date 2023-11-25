"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const mongodb_1 = require("mongodb");
const Constants_1 = __importDefault(require("../../Constants"));
const Database_1 = require("../database/Database");
const typedi_1 = require("typedi");
const auth_1 = require("../util/auth");
class DiagnosisControllers {
    constructor() {
        this.createOrUpdateDiagnosis = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { vital_signs, clinical_notes, prescription, treatment_plan, lab_order, } = req.body;
                const requestToken = req.headers["x-request-token"];
                if (!requestToken) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const requestTokenData = (0, auth_1.verifyToken)(requestToken);
                if (!requestTokenData) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                if (!requestTokenData.userId) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const userId = new mongodb_1.ObjectId(requestTokenData.userId);
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                if (!doctorExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found!",
                    });
                }
                const appointment_id = req.params.appointmentId;
                const appointment = yield this.database.getById('appointment', appointment_id);
                const updatedAppointment = yield this.database.updateById("appointment", new mongodb_1.ObjectId(appointment_id), { status: "diagnosed" });
                const diagnosis = {
                    appointment_id: appointment === null || appointment === void 0 ? void 0 : appointment._id,
                    patient_id: appointment === null || appointment === void 0 ? void 0 : appointment.patient_id,
                    doctor_id: appointment === null || appointment === void 0 ? void 0 : appointment.doctor_id,
                    vital_signs,
                    clinical_notes,
                    prescription,
                    treatment_plan,
                    lab_order,
                };
                let result;
                let message;
                const diagnosisExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DIAGNOSIS, {
                    appointment_id: appointment === null || appointment === void 0 ? void 0 : appointment._id
                });
                if (!diagnosisExists) {
                    result = yield this.database.add("diagnosis", diagnosis);
                    message = "Diagnosis created successfully";
                }
                else {
                    result = yield this.database.updateById("diagnosis", diagnosisExists === null || diagnosisExists === void 0 ? void 0 : diagnosisExists._id, diagnosis);
                    message = "Diagnosis updated successfully";
                }
                return res.status(200).json({
                    success: true,
                    message,
                    data: Object.assign({}, result),
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getDiagnosisById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestToken = req.headers["x-request-token"];
                if (!requestToken) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const requestTokenData = (0, auth_1.verifyToken)(requestToken);
                if (!requestTokenData) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                if (!requestTokenData.userId) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const userId = new mongodb_1.ObjectId(requestTokenData.userId);
                const role = requestTokenData.role;
                // console.log(requestTokenData);
                const patientExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                    user_id: userId,
                });
                // console.log(patientExists);
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                // console.log(doctorExists);
                const appointment_id = req.params.id;
                const diagnosisExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DIAGNOSIS, {
                    appointment_id: new mongodb_1.ObjectId(appointment_id),
                });
                if (!diagnosisExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Diagnosis not found!",
                    });
                }
                // Check if the user is authorized to access the diagnosis
                if ((role === "patient" && diagnosisExists.patient_id.toString() !== patientExists._id.toString()) ||
                    (role === "doctor" && diagnosisExists.doctor_id.toString() !== doctorExists._id.toString())) {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access to diagnosis",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Diagnosis retrieved successfully",
                    data: Object.assign({}, diagnosisExists),
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
    }
}
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", Database_1.Database)
], DiagnosisControllers.prototype, "database", void 0);
exports.default = DiagnosisControllers;
//# sourceMappingURL=diagnosis.controller.js.map