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
class AppointmentControllers {
    constructor() {
        this.bookAppointment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { patient_name, patient_phone, doctor_id, patient_details, questionnaire, status, appointment_date, appointment_time, } = req.body;
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
                const appointment = {
                    patient_id: patientExists === null || patientExists === void 0 ? void 0 : patientExists._id,
                    patient_name,
                    patient_phone,
                    doctor_id: new mongodb_1.ObjectId(doctor_id),
                    patient_details,
                    questionnaire,
                    status: "pending",
                    appointment_date: new Date(appointment_date),
                    appointment_time,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const result = yield this.database.add("appointment", appointment);
                return res.status(200).json({
                    success: result.acknowledged,
                    message: "Appointment Booked successfully",
                    data: {
                        appointment: appointment,
                    },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getAppointments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { status, dateFrom, dateTo, limit, skip } = req.query;
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
                // console.log(userId);
                let doctor_id, patient_id, common_id = null;
                let role = null;
                const patientExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                    user_id: userId,
                });
                if (patientExists) {
                    role = "patient";
                    patient_id = patientExists === null || patientExists === void 0 ? void 0 : patientExists._id;
                }
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                if (doctorExists) {
                    role = "doctor";
                    doctor_id = doctorExists === null || doctorExists === void 0 ? void 0 : doctorExists._id;
                }
                const query = {};
                if (patient_id) {
                    query.patient_id = new mongodb_1.ObjectId(patient_id.toString());
                }
                if (doctor_id) {
                    query.doctor_id = new mongodb_1.ObjectId(doctor_id.toString());
                }
                if (status) {
                    query.status = status;
                }
                // if (dateFrom || dateTo) {
                //   query.date = {};
                //   if (dateFrom) {
                //     query.date.$gte = new Date(dateFrom.toString());
                //   }
                //   if (dateTo) {
                //     query.date.$lte = new Date(dateTo.toString());
                //   }
                // }
                const appointments = yield this.database.aggregate("appointment", [
                    {
                        $match: query,
                    },
                    {
                        $lookup: {
                            from: "patient",
                            localField: "patient_id",
                            foreignField: "_id",
                            as: "patient",
                        },
                    },
                    {
                        $lookup: {
                            from: "doctor",
                            localField: "doctor_id",
                            foreignField: "_id",
                            as: "doctor",
                        },
                    },
                    {
                        $project: {
                            patient_id: 1,
                            patient_name: 1,
                            patient_phone: 1,
                            patient_details: 1,
                            appointment_time: 1,
                            appointment_date: 1,
                            doctor_id: 1,
                            status: 1,
                            date: 1,
                            time: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            patient: { $arrayElemAt: ["$patient", 0] },
                            doctor: { $arrayElemAt: ["$doctor", 0] },
                        },
                    },
                    {
                        $sort: { date: 1 },
                    },
                    {
                        $limit: parseInt((_a = limit === null || limit === void 0 ? void 0 : limit.toString()) !== null && _a !== void 0 ? _a : "20"),
                    },
                    {
                        $skip: parseInt((_b = skip === null || skip === void 0 ? void 0 : skip.toString()) !== null && _b !== void 0 ? _b : "0"),
                    },
                ]);
                if (patient_id) {
                    common_id = patient_id;
                }
                else {
                    common_id = doctor_id;
                }
                return res.status(200).json({
                    success: true,
                    message: `All Appointments for  ${role} with id ${common_id}`,
                    data: { appointments },
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, error: "Internal Server Error" });
            }
        });
        this.getAppointmentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                if (role !== "patient" && role !== "doctor") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const { id } = req.params;
                const appointmentId = new mongodb_1.ObjectId(id);
                const pipeline = [
                    {
                        $match: {
                            _id: appointmentId,
                        },
                    },
                    {
                        $lookup: {
                            from: "patient",
                            localField: "patient_id",
                            foreignField: "_id",
                            as: "patient",
                        },
                    },
                    {
                        $lookup: {
                            from: "doctor",
                            localField: "doctor_id",
                            foreignField: "_id",
                            as: "doctor",
                        },
                    },
                    {
                        $lookup: {
                            from: "diagnosis",
                            localField: "_id",
                            foreignField: "appointment_id",
                            as: "diagnosis",
                        },
                    },
                    {
                        $project: {
                            patient_id: 1,
                            doctor_id: 1,
                            patient_details: 1,
                            appointment_date: 1,
                            appointment_time: 1,
                            status: 1,
                            date: 1,
                            time: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            patient: { $arrayElemAt: ["$patient", 0] },
                            doctor: { $arrayElemAt: ["$doctor", 0] },
                            diagnosis: { $arrayElemAt: ["$diagnosis", 0] },
                        },
                    },
                ];
                const appointment = yield this.database.aggregate("appointment", pipeline);
                if (!appointment || appointment.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Appointment not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    appointment: appointment[0],
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
        this.updateAppointmentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
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
                // console.log(requestTokenData);
                const userId = new mongodb_1.ObjectId(requestTokenData.userId);
                const userExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.USER, {
                    _id: userId,
                });
                // console.log(userExists.role);
                if (userExists.role !== "patient" &&
                    userExists.role !== "doctor" &&
                    userExists.role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "You are not allowed to update appointment!",
                    });
                }
                if (!mongodb_1.ObjectId.isValid(id)) {
                    res.status(400).json({ status: false, message: "Invalid id format" });
                    return;
                }
                const appointment = yield this.database.getById("appointment", id);
                if (!appointment) {
                    res
                        .status(404)
                        .json({ status: false, message: "Appointment not found" });
                    return;
                }
                if (appointment.status === "cancelled") {
                    return res
                        .status(404)
                        .json({ status: false, message: "Appoinment Already Cancelled" });
                }
                const { patient_name, patient_phone, doctor_id, patient_details, status, appointment_date, appointment_time, } = req.body;
                const update = {};
                if (patient_name) {
                    update.patient_name = patient_name;
                }
                if (patient_phone) {
                    update.patient_phone = patient_phone;
                }
                if (doctor_id) {
                    if (!mongodb_1.ObjectId.isValid(doctor_id)) {
                        return res
                            .status(400)
                            .json({ success: false, message: "Invalid doctor id format" });
                    }
                    update.doctor_id = new mongodb_1.ObjectId(doctor_id);
                }
                if (patient_details) {
                    update.patient_details = patient_details;
                }
                if (status) {
                    update.status = status;
                }
                if (appointment_date) {
                    update.appointment_date = appointment_date;
                }
                if (appointment_time) {
                    update.appointment_time = appointment_time;
                }
                update.updatedAt = new Date();
                const result = yield this.database.updateById("appointment", new mongodb_1.ObjectId(id), update);
                const updatedAppointment = yield this.database.getById("appointment", id);
                if (result.acknowledged === true) {
                    res.status(200).json({
                        status: true,
                        message: "Appointment updated successfully",
                        data: { updatedAppointment },
                    });
                }
                else {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to update appointment",
                    });
                }
            }
            catch (error) {
                console.error(`Error occurred while updating appointment: ${error}`);
                res.status(500).send({ message: "Failed to update appointment" });
            }
        });
    }
}
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", Database_1.Database)
], AppointmentControllers.prototype, "database", void 0);
exports.default = AppointmentControllers;
//# sourceMappingURL=appointment.controller.js.map