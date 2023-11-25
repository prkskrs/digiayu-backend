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
class PatientControllers {
    constructor() {
        this.updateMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, mobile, dob, gender, avatar, blood_group } = req.body;
                const requestToken = req.headers["x-request-token"];
                if (!requestToken) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                console.log(requestToken);
                const requestTokenData = (0, auth_1.verifyToken)(requestToken);
                console.log(requestTokenData);
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
                // console.log(requestTokenData);
                const userId = new mongodb_1.ObjectId(requestTokenData.userId);
                const patientExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                    user_id: userId,
                });
                if (!patientExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Patient not found!",
                    });
                }
                const patient = {
                    user_id: userId,
                    name: name,
                    email: email,
                    phone: mobile,
                    dob: dob,
                    avatar: avatar,
                    gender,
                    blood_group,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const result = yield this.database.updateById("patient", patientExists === null || patientExists === void 0 ? void 0 : patientExists._id, patient);
                return res.status(200).json({
                    success: true,
                    message: "patient updated successfully",
                    data: Object.assign({}, result),
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestToken = req.headers["x-request-token"];
                if (!requestToken) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const requestTokenData = (0, auth_1.verifyToken)(requestToken);
                console.log(requestTokenData);
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
                const patient = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                    user_id: userId,
                });
                if (!patient) {
                    return res.status(404).json({
                        success: false,
                        message: "Patient not found!",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: `Patient with id : ${userId}`,
                    data: {
                        patient,
                    },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getAllPatientForDoctor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const requestToken = req.headers["x-request-token"];
                if (!requestToken) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid request",
                    });
                }
                const requestTokenData = (0, auth_1.verifyToken)(requestToken);
                console.log(requestTokenData);
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
                const userRole = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                    _id: userId,
                });
                if (!userRole) {
                    return res.status(404).json({
                        success: false,
                        message: "User Not Found",
                    });
                }
                // for admin it will not work
                if (userRole.role !== "doctor") {
                    return res.status(404).json({
                        success: false,
                        message: "Unauthorized User",
                    });
                }
                const doctor = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                if (!doctor) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor Not Found",
                    });
                }
                const appointments = yield this.database.get("appointment", { doctor_id: doctor._id } // filter appointments by doctor_id
                );
                const patientIds = appointments.map(appointment => appointment.patient_id);
                const patients = yield this.database.get("patient", { _id: { $in: patientIds } } // filter patients by their IDs
                );
                const patientsWithAppointments = patients.map(patient => {
                    const patientAppointments = appointments.filter(appointment => appointment.patient_id.equals(patient._id));
                    return {
                        patient,
                        appointments: patientAppointments
                    };
                });
                return res.status(200).json({
                    success: true,
                    message: `All Patients for doctor ${userId}`,
                    data: patientsWithAppointments,
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
], PatientControllers.prototype, "database", void 0);
exports.default = PatientControllers;
;
//# sourceMappingURL=patient.controller.js.map