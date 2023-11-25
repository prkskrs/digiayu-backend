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
class DoctorControllers {
    constructor() {
        this.updateMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, mobile, dob, gender, speciality, city, description, medical_registration_no, medical_registration_council, medical_registration_year, medical_experience, educational_degree, educational_college, educational_year, educational_certificate, has_establishment, establishment_type, establishment_name, establishment_address, establishment_city, profile_type, profile_name, profile_description, profile_image, consultation_fee, weeklyAvailability, } = req.body;
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
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
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
                    status: "verification_pending",
                    profile_completed: true,
                    weeklyAvailability,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                // console.log(doctor);
                const result = yield this.database.updateById("doctor", doctorExists === null || doctorExists === void 0 ? void 0 : doctorExists._id, doctor);
                return res.status(200).json({
                    success: true,
                    message: "Doctor updated successfully",
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
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                if (!doctorExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found!",
                    });
                }
                delete doctorExists["password"];
                return res.status(200).json({
                    success: true,
                    message: "doctor get successfully",
                    data: Object.assign({}, doctorExists),
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getAllDoctor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
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
        this.getDoctorById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({
                        success: false,
                        message: "Doctor ID is required",
                    });
                }
                const doctor = yield this.database.getById("doctor", id);
                // console.log(doctor);
                if (!doctor) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: `Doctor with ID: ${id}`,
                    data: {
                        doctor,
                    },
                });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
        });
        this.getPatients = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                // console.log(doctorExists);
                if (!doctorExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found!",
                    });
                }
                const appointments = yield this.database.get(Constants_1.default.COLLECTIONS.APPOINTMENT, { doctor_id: doctorExists._id });
                // console.log(appointments);
                const patientIds = appointments.map((appointment) => appointment.patient_id);
                const uniquePatientIds = [...new Set(patientIds)];
                const patients = yield this.database.get(Constants_1.default.COLLECTIONS.PATIENT, {
                    _id: { $in: uniquePatientIds },
                });
                return res.status(200).json({
                    success: true,
                    message: `Patients for doctor with id: ${doctorExists._id}`,
                    data: {
                        patients,
                    },
                });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
        });
        this.getPatientById = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                if (!doctorExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found!",
                    });
                }
                const patientId = req.params.id;
                const patient = yield this.database.getOne(Constants_1.default.COLLECTIONS.PATIENT, {
                    _id: new mongodb_1.ObjectId(patientId),
                });
                if (!patient) {
                    return res.status(404).json({
                        success: false,
                        message: "Patient not found!",
                    });
                }
                const appointments = yield this.database.get(Constants_1.default.COLLECTIONS.APPOINTMENT, {
                    patient_id: new mongodb_1.ObjectId(patientId),
                    doctor_id: doctorExists._id,
                });
                const totalAppointment = appointments.length;
                return res.status(200).json({
                    success: true,
                    message: `Patient found with ID: ${patientId}`,
                    data: {
                        patient,
                        appointments,
                        totalAppointment,
                    },
                });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
        });
        this.createOrUpdateAvailability = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const doctorId = req.params.id;
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
                if (role !== "doctor") {
                    return res.status(403).json({
                        success: false,
                        message: "Unauthorized access",
                    });
                }
                const doctorExists = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    user_id: userId,
                });
                if (!doctorExists) {
                    return res.status(404).json({
                        success: false,
                        message: "Doctor not found!",
                    });
                }
                const { weeklyAvailability } = req.body;
                const updateDoctor = yield this.database.updateById("doctor", doctorExists === null || doctorExists === void 0 ? void 0 : doctorExists._id, { weeklyAvailability: weeklyAvailability });
                const updatedDoctor = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    _id: doctorExists === null || doctorExists === void 0 ? void 0 : doctorExists._id,
                });
                return res.status(200).json({
                    success: true,
                    message: "Availability updated successfully",
                    data: updatedDoctor.weeklyAvailability,
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        });
        this.getAvailabilityTimeSlots = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { doctorId } = req.params;
            const { date } = req.query;
            console.log(doctorId);
            try {
                // Get the doctor's weekly availability
                const doctor = yield this.database.getOne(Constants_1.default.COLLECTIONS.DOCTOR, {
                    _id: new mongodb_1.ObjectId(doctorId),
                });
                if (!doctor) {
                    return res.status(404).json({ message: "Doctor not found" });
                }
                // Find the availability for the requested date
                const requestedDate = new Date(date);
                const day = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });
                const availability = (_a = doctor.weeklyAvailability.find((week) => {
                    const weekDay = week.day.charAt(0).toUpperCase() + week.day.slice(1).toLowerCase();
                    return weekDay === day;
                })) === null || _a === void 0 ? void 0 : _a.fullDayAvailability;
                if (!availability) {
                    return res.status(404).json({ message: "Availability not found" });
                }
                // checking if there are any existing appointments for the requested date
                const existingAppointments = yield this.database.get("appointment", {
                    doctor_id: new mongodb_1.ObjectId(doctorId),
                    appointment_date: requestedDate,
                    status: { $ne: "cancelled" },
                });
                // console.log(existingAppointments);
                // removing the occupied timeslot from the availability
                const availableTimeSlots = availability.filter((session) => {
                    const sessionStartTime = session.startTime.toString();
                    return !existingAppointments.find((appointment) => appointment.appointment_time.toString() === sessionStartTime);
                });
                return res.status(200).json({
                    availability,
                    existingAppointments,
                    availableTimeSlots,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Failed to fetch availability" });
            }
        });
    }
}
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", Database_1.Database)
], DoctorControllers.prototype, "database", void 0);
exports.default = DoctorControllers;
//# sourceMappingURL=doctor.controller.js.map