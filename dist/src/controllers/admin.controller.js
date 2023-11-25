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
class AdminControllers {
    constructor() {
        this.getAllDoctors = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                if (role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const condition = {};
                const doctors = yield this.database.get(Constants_1.default.COLLECTIONS.DOCTOR, condition);
                if (!doctors || doctors.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "No doctors found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "All Doctors",
                    data: { doctors },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getAllPatients = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                if (role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const condition = {};
                const patients = yield this.database.get(Constants_1.default.COLLECTIONS.PATIENT, condition);
                if (!patients || patients.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "No patients found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "All Patients",
                    data: { patients },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getAllAppointments = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                if (role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const condition = {};
                const appointments = yield this.database.get(Constants_1.default.COLLECTIONS.APPOINTMENT, condition);
                if (!appointments || appointments.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "No appointment found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "All Appointments",
                    data: { appointments },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getPatientDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                if (role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const { patientId } = req.params;
                // Retrieve patient details
                const patient = yield this.database.getById('patient', patientId);
                if (!patient) {
                    return res.status(404).json({
                        success: false,
                        message: 'Patient not found',
                    });
                }
                // Retrieve patient's appointments
                const condition = { patient_id: new mongodb_1.ObjectId(patientId) };
                const appointments = yield this.database.get(Constants_1.default.COLLECTIONS.APPOINTMENT, condition);
                // console.log(appointments);
                return res.status(200).json({
                    success: true,
                    message: 'Patient details and his appointments',
                    data: { patient, appointments },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.getDoctorDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                if (role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const { doctorId } = req.params;
                // Retrieve doctor details
                const doctor = yield this.database.getById('doctor', doctorId);
                if (!doctor) {
                    return res.status(404).json({
                        success: false,
                        message: 'Doctor not found',
                    });
                }
                // Retrieve doctor's appointments
                const condition = { doctor_id: new mongodb_1.ObjectId(doctorId) };
                const appointments = yield this.database.get(Constants_1.default.COLLECTIONS.APPOINTMENT, condition);
                // console.log(appointments);
                return res.status(200).json({
                    success: true,
                    message: 'Doctor details and his appointments',
                    data: { doctor, appointments },
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.updateDoctorById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, mobile, dob, gender, speciality, city, description, medical_registration_no, medical_registration_council, medical_registration_year, medical_experience, educational_degree, educational_college, educational_year, educational_certificate, has_establishment, establishment_type, establishment_name, establishment_address, establishment_city, profile_type, profile_name, profile_description, profile_image, consultation_fee, status, weeklyAvailability, } = req.body;
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
                const role = requestTokenData.role;
                // console.log(requestTokenData);
                if (role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const { doctorId } = req.params;
                const doctorExists = yield this.database.getById('doctor', doctorId);
                if (!doctorExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found!",
                    });
                }
                const doctor = {
                    user_id: userId,
                    name,
                    email,
                    mobile,
                    dob,
                    gender,
                    speciality,
                    city,
                    description,
                    medical_registration_no,
                    medical_registration_council,
                    medical_registration_year,
                    medical_experience,
                    educational_degree,
                    educational_college,
                    educational_year,
                    educational_certificate,
                    has_establishment,
                    establishment_type,
                    establishment_name,
                    establishment_address,
                    establishment_city,
                    profile_type,
                    profile_name,
                    profile_description,
                    profile_image,
                    consultation_fee,
                    status: status,
                    profile_completed: true,
                    weeklyAvailability,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                // console.log(doctor);
                const result = yield this.database.updateById("doctor", doctorExists === null || doctorExists === void 0 ? void 0 : doctorExists._id, doctor);
                const updatedDoctor = yield this.database.getById('doctor', doctorId);
                return res.status(200).json({
                    success: true,
                    message: "Doctor updated successfully",
                    data: Object.assign(Object.assign({}, result), { doctor: updatedDoctor }),
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getAppointmentDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                if (role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const { appointmentId } = req.params;
                const id = new mongodb_1.ObjectId(appointmentId);
                const pipeline = [
                    {
                        $match: {
                            _id: id,
                        },
                    },
                    {
                        $lookup: {
                            from: 'patient',
                            localField: 'patient_id',
                            foreignField: '_id',
                            as: 'patient',
                        },
                    },
                    {
                        $lookup: {
                            from: 'doctor',
                            localField: 'doctor_id',
                            foreignField: '_id',
                            as: 'doctor',
                        },
                    },
                    {
                        $lookup: {
                            from: 'diagnosis',
                            localField: '_id',
                            foreignField: 'appointment_id',
                            as: 'diagnosis',
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
                            patient: { $arrayElemAt: ['$patient', 0] },
                            doctor: { $arrayElemAt: ['$doctor', 0] },
                            diagnosis: { $arrayElemAt: ['$diagnosis', 0] },
                        },
                    },
                ];
                const appointment = yield this.database.aggregate('appointment', pipeline);
                if (!appointment || appointment.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Appointment not found',
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
                    message: 'Internal server error',
                });
            }
        });
    }
}
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", Database_1.Database)
], AdminControllers.prototype, "database", void 0);
exports.default = AdminControllers;
//# sourceMappingURL=admin.controller.js.map