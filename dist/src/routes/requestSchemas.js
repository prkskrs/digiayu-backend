"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const authRoutesSchemas = {
    login: {
        body: joi_1.default.object().keys({
            phone: joi_1.default.string().required().min(10).max(10),
            password: joi_1.default.string().required(),
        }),
    },
    signupDoctor: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required().messages({
                "string.empty": "Invalid request",
            }),
        }),
        body: joi_1.default.object().keys({
            user: joi_1.default.object({
                name: joi_1.default.string().required(),
                password: joi_1.default.string().required(),
                email: joi_1.default.string().email(),
                phone: joi_1.default.string().min(10).max(10),
                dob: joi_1.default.number(),
                gender: joi_1.default.string().valid("male", "female", "other"),
                address: joi_1.default.string(),
                avatar: joi_1.default.string(),
            }).required(),
            doctor: joi_1.default.object({
                name: joi_1.default.string().required(),
                email: joi_1.default.string().email(),
                dob: joi_1.default.number(),
                gender: joi_1.default.string().valid("male", "female", "other"),
                speciality: joi_1.default.string(),
                availability: joi_1.default.string(),
            }).required(),
        }),
    },
    signupPatient: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required().messages({
                "string.empty": "Invalid request",
            }),
        }),
        body: joi_1.default.object().keys({
            user: joi_1.default.object({
                name: joi_1.default.string().required(),
                password: joi_1.default.string().required(),
                email: joi_1.default.string().email(),
                dob: joi_1.default.string(),
                phone: joi_1.default.string().min(10).max(10),
                gender: joi_1.default.string().valid("male", "female", "other"),
                address: joi_1.default.string(),
                avatar: joi_1.default.string(),
                anniversary: joi_1.default.number(),
                refferal_code: joi_1.default.string(),
            }).required(),
            patient: joi_1.default.object({
                name: joi_1.default.string().required(),
                email: joi_1.default.string().email(),
                dob: joi_1.default.number(),
                gender: joi_1.default.string().valid("male", "female", "other"),
            }).required(),
        }),
    },
    sendOTP: {
        body: joi_1.default.object().keys({
            phone: joi_1.default.string().required().min(10).max(10),
        }),
    },
    verifyOTP: {
        body: joi_1.default.object().keys({
            requestId: joi_1.default.string().required(),
            otp: joi_1.default.string().required(),
        }),
    },
    forgotPassword: {
        body: joi_1.default.object().keys({
            phone: joi_1.default.string().required().min(10).max(10),
        }),
    },
    resetPassword: {
        body: joi_1.default.object().keys({
            phone: joi_1.default.string().required().min(10).max(10),
            password: joi_1.default.string().required(),
        }),
    },
    changePassword: {
        body: joi_1.default.object().keys({
            oldPassword: joi_1.default.string().required(),
            newPassword: joi_1.default.string().required(),
        }),
    },
};
const adminRoutesSchemas = {
    getPatients: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required().messages({
                "string.empty": "Invalid request",
            }),
        }),
    },
    getDoctors: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required().messages({
                "string.empty": "Invalid request",
            }),
        }),
    },
    getAppointments: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required().messages({
                "string.empty": "Invalid request",
            }),
        }),
    },
};
const userRoutesSchemas = {
    updateMe: {
        body: joi_1.default.object().keys({
            user: joi_1.default.object({
                name: joi_1.default.string().required(),
                email: joi_1.default.string().email(),
                dob: joi_1.default.number(),
                gender: joi_1.default.string().required().valid("Male", "Female", "Other"),
                address: joi_1.default.string().required(),
                avatar: joi_1.default.string(),
                anniversary: joi_1.default.number(),
                refferal_code: joi_1.default.string(),
            }).required(),
        }),
    },
};
const SessionAvailabilitySchema = joi_1.default.object({
    startTime: joi_1.default.string(),
    endTime: joi_1.default.string(),
});
const WeeklyAvailabilitySchema = joi_1.default.object({
    day: joi_1.default.string(),
    fullDayAvailability: joi_1.default.array().items(SessionAvailabilitySchema),
});
const doctorRoutesSchemas = {
    updateMe: {
        body: joi_1.default.object({
            name: joi_1.default.string(),
            email: joi_1.default.string().email(),
            mobile: joi_1.default.string().min(10).max(10),
            dob: joi_1.default.number(),
            gender: joi_1.default.string().valid("male", "female", "other"),
            speciality: joi_1.default.string(),
            city: joi_1.default.string(),
            description: joi_1.default.string(),
            medical_registration_no: joi_1.default.string(),
            medical_registration_council: joi_1.default.string(),
            medical_registration_year: joi_1.default.string(),
            educational_degree: joi_1.default.string(),
            educational_college: joi_1.default.string(),
            educational_year: joi_1.default.string(),
            educational_certificate: joi_1.default.string(),
            has_establishemnt: joi_1.default.boolean(),
            establishment_degree: joi_1.default.string(),
            establishment_name: joi_1.default.string(),
            establishment_address: joi_1.default.string(),
            establishment_city: joi_1.default.string(),
            profile: joi_1.default.string(),
            profile_image: joi_1.default.string(),
            weeklyAvailability: joi_1.default.array().items(WeeklyAvailabilitySchema),
        }).required(),
    },
    getPatients: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required().messages({
                "string.empty": "Invalid request",
            }),
        }),
    },
    getDoctor: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required().messages({
                "string.empty": "Invalid request",
            }),
        }),
    },
};
const patientRoutesSchemas = {
    updateMe: {
        body: joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().email(),
            mobile: joi_1.default.string().min(10).max(10),
            dob: joi_1.default.string(),
            gender: joi_1.default.string().valid("male", "female", "other"),
            profile_image: joi_1.default.string(),
        }).required(),
    },
};
const bookAppointmentSchema = joi_1.default.object()
    .keys({
    patient_name: joi_1.default.string(),
    patient_phone: joi_1.default.string(),
    doctor_id: joi_1.default.string(),
    questionairre: joi_1.default.object(),
    status: joi_1.default.string().valid("pending", "approved", "cancelled", "rescheduled"),
    date: joi_1.default.date(),
    time: joi_1.default.string(),
})
    .unknown();
const updateAppointmentSchema = joi_1.default.object()
    .keys({
    patient_name: joi_1.default.string(),
    patient_phone: joi_1.default.string(),
    doctor_id: joi_1.default.string(),
    questionairre: joi_1.default.object(),
    status: joi_1.default.string().valid("pending", "approved", "cancelled", "rescheduled"),
    date: joi_1.default.date(),
    time: joi_1.default.string(),
})
    .unknown();
const appointmentRoutesSchemas = {
    bookAppointment: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required(),
        }),
        body: bookAppointmentSchema,
    },
    updateAppointment: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required(),
        }),
        body: updateAppointmentSchema,
    },
    getAppointments: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required(),
        }),
    },
};
const diagnosisSchema = joi_1.default.object()
    .keys({
    _id: joi_1.default.string().optional(),
    appointment_id: joi_1.default.string(),
    patient_id: joi_1.default.string(),
    doctor_id: joi_1.default.string(),
    vital_signs: joi_1.default.object()
        .keys({
        weight: joi_1.default.string().optional(),
        bp: joi_1.default.object()
            .keys({
            diastole: joi_1.default.string().optional(),
            systole: joi_1.default.string().optional(),
        })
            .optional(),
        pulse: joi_1.default.string().optional(),
        temperature: joi_1.default.string().optional(),
        respiratory_rate: joi_1.default.string().optional(),
    })
        .optional(),
    clinical_notes: joi_1.default.object()
        .keys({
        instruction: joi_1.default.string().optional(),
        complaint: joi_1.default.string().optional(),
    })
        .optional(),
    prescription: joi_1.default.object()
        .keys({
        _id: joi_1.default.string().optional(),
        patient_id: joi_1.default.string().required(),
        appointment_id: joi_1.default.string().required(),
        doctor_id: joi_1.default.string().optional(),
        summary: joi_1.default.string().optional(),
        prescribedMedicines: joi_1.default.array()
            .items(joi_1.default.object().keys({
            medicine: joi_1.default.string(),
            dosage: joi_1.default.string(),
            duration: joi_1.default.string(),
            remarks: joi_1.default.string(),
        }))
            .optional(),
    })
        .optional(),
    treatment_plan: joi_1.default.object()
        .keys({
        _id: joi_1.default.string().optional(),
        patient_id: joi_1.default.string().required(),
        appointment_id: joi_1.default.string().required(),
        doctor_id: joi_1.default.string().optional(),
        treatment_plan: joi_1.default.array().items(joi_1.default.string()).optional(),
    })
        .optional(),
    lab_order: joi_1.default.object()
        .keys({
        _id: joi_1.default.string().optional(),
        patient_id: joi_1.default.string().required(),
        appointment_id: joi_1.default.string().required(),
        doctor_id: joi_1.default.string().optional(),
        lab_order: joi_1.default.array().items(joi_1.default.string()).optional(),
    })
        .optional(),
})
    .unknown();
const diagnosisRoutesSchemas = {
    createDiagnosis: {
        headers: joi_1.default.object().keys({
            "x-request-token": joi_1.default.string().required(),
        }),
        body: diagnosisSchema,
    },
};
const productRoutesSchemas = {
    createProduct: {
        body: joi_1.default.object().keys({
            product: joi_1.default.object({
                name: joi_1.default.string().required(),
                price: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                status: joi_1.default.string().required().valid("available", "unavailable"),
                image: joi_1.default.string().required(),
                category_id: joi_1.default.string().required(),
                category_name: joi_1.default.string().required(),
                sub_category_id: joi_1.default.string().required(),
                sub_category_name: joi_1.default.string().required(),
                time_required: joi_1.default.number().required(),
            }).required(),
        }),
    },
};
const categorySchemas = {
    createCategory: {
        body: joi_1.default.object()
            .keys({
            name: joi_1.default.string().required(),
            time_required: joi_1.default.number().required(),
        })
            .required(),
    },
    updateCategory: {
        body: joi_1.default.object()
            .keys({
            name: joi_1.default.string().required(),
            time_required: joi_1.default.number().required(),
        })
            .required(),
    },
};
const chatRoutesSchemas = {
    headers: joi_1.default.object().keys({
        "x-request-token": joi_1.default.string().required().messages({
            "string.empty": "Invalid request",
        }),
    }),
    sendMessage: {
        body: joi_1.default.object().keys({
            sender_id: joi_1.default.string().required(),
            receiver_id: joi_1.default.string().required(),
            message: joi_1.default.string().required(),
            type: joi_1.default.string().required(),
        }),
    },
};
const requestSchemas = {
    authRoutesSchemas,
    adminRoutesSchemas,
    userRoutesSchemas,
    doctorRoutesSchemas,
    appointmentRoutesSchemas,
    productRoutesSchemas,
    categorySchemas,
    patientRoutesSchemas,
    diagnosisRoutesSchemas,
    chatRoutesSchemas
};
exports.default = requestSchemas;
//# sourceMappingURL=requestSchemas.js.map