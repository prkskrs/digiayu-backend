import Joi from "joi";

const authRoutesSchemas = {
  login: {
    body: Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
      password: Joi.string().required(),
    }),
  },
  signupDoctor: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
    body: Joi.object().keys({
      user: Joi.object({
        name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email(),
        phone: Joi.string().min(10).max(10),
        dob: Joi.number(),
        gender: Joi.string().valid("male", "female", "other"),
        address: Joi.string(),
        avatar: Joi.string(),
      }).required(),
      doctor: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email(),
        dob: Joi.number(),
        gender: Joi.string().valid("male", "female", "other"),
        speciality: Joi.string(),
        availability: Joi.string(),
      }).required(),
    }),
  },

  signupPatient: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
    body: Joi.object().keys({
      user: Joi.object({
        name: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email(),
        dob: Joi.string(),
        phone: Joi.string().min(10).max(10),
        gender: Joi.string().valid("male", "female", "other"),
        address: Joi.string(),
        avatar: Joi.string(),
        anniversary: Joi.number(),
        refferal_code: Joi.string(),
      }).required(),
      patient: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email(),
        dob: Joi.number(),
        gender: Joi.string().valid("male", "female", "other"),
      }).required(),
    }),
  },
  sendOTP: {
    body: Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
    }),
  },
  verifyOTP: {
    body: Joi.object().keys({
      requestId: Joi.string().required(),
      otp: Joi.string().required(),
    }),
  },
  forgotPassword: {
    body: Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
    }),
  },
  resetPassword: {
    body: Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
      password: Joi.string().required(),
    }),
  },
  changePassword: {
    body: Joi.object().keys({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
    }),
  },
};

const adminRoutesSchemas = {
  getPatients: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
  },
  getDoctors: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
  },
  getAppointments: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
  },
};

const userRoutesSchemas = {
  updateMe: {
    body: Joi.object().keys({
      user: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email(),
        dob: Joi.number(),
        gender: Joi.string().required().valid("Male", "Female", "Other"),
        address: Joi.string().required(),
        avatar: Joi.string(),
        anniversary: Joi.number(),
        refferal_code: Joi.string(),
      }).required(),
    }),
  },
};

const SessionAvailabilitySchema = Joi.object({
  startTime: Joi.string(),
  endTime: Joi.string(),
});

const WeeklyAvailabilitySchema = Joi.object({
  day: Joi.string(),
  fullDayAvailability: Joi.array().items(SessionAvailabilitySchema),
});

const doctorRoutesSchemas = {
  updateMe: {
    body: Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      mobile: Joi.string().min(10).max(10),
      dob: Joi.number(),
      gender: Joi.string().valid("male", "female", "other"),
      speciality: Joi.string(),
      city: Joi.string(),
      description: Joi.string(),
      medical_registration_no: Joi.string(),
      medical_registration_council: Joi.string(),
      medical_registration_year: Joi.string(),
      educational_degree: Joi.string(),
      educational_college: Joi.string(),
      educational_year: Joi.string(),
      educational_certificate: Joi.string(),
      has_establishemnt: Joi.boolean(),
      establishment_degree: Joi.string(),
      establishment_name: Joi.string(),
      establishment_address: Joi.string(),
      establishment_city: Joi.string(),
      profile: Joi.string(),
      profile_image: Joi.string(),
      weeklyAvailability: Joi.array().items(WeeklyAvailabilitySchema),
    }).required(),
  },
  getPatients: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
  },
  getDoctor: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required().messages({
        "string.empty": "Invalid request",
      }),
    }),
  },
};

const patientRoutesSchemas = {
  updateMe: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email(),
      mobile: Joi.string().min(10).max(10),
      dob: Joi.string(),
      gender: Joi.string().valid("male", "female", "other"),
      profile_image: Joi.string(),
    }).required(),
  },
};

const bookAppointmentSchema = Joi.object()
  .keys({
    patient_name: Joi.string(),
    patient_phone: Joi.string(),
    doctor_id: Joi.string(),
    questionairre: Joi.object(),
    status: Joi.string().valid(
      "pending",
      "approved",
      "cancelled",
      "rescheduled"
    ),
    date: Joi.date(),
    time: Joi.string(),
  })
  .unknown();

const updateAppointmentSchema = Joi.object()
  .keys({
    patient_name: Joi.string(),
    patient_phone: Joi.string(),
    doctor_id: Joi.string(),
    questionairre: Joi.object(),
    status: Joi.string().valid(
      "pending",
      "approved",
      "cancelled",
      "rescheduled"
    ),
    date: Joi.date(),
    time: Joi.string(),
  })
  .unknown();

const appointmentRoutesSchemas = {
  bookAppointment: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required(),
    }),
    body: bookAppointmentSchema,
  },
  updateAppointment: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required(),
    }),
    body: updateAppointmentSchema,
  },
  getAppointments: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required(),
    }),
  },
};

const diagnosisSchema = Joi.object()
  .keys({
    _id: Joi.string().optional(),
    appointment_id: Joi.string(),
    patient_id: Joi.string(),
    doctor_id: Joi.string(),
    vital_signs: Joi.object()
      .keys({
        weight: Joi.string().optional(),
        bp: Joi.object()
          .keys({
            diastole: Joi.string().optional(),
            systole: Joi.string().optional(),
          })
          .optional(),
        pulse: Joi.string().optional(),
        temperature: Joi.string().optional(),
        respiratory_rate: Joi.string().optional(),
      })
      .optional(),
    clinical_notes: Joi.object()
      .keys({
        instruction: Joi.string().optional(),
        complaint: Joi.string().optional(),
      })
      .optional(),
    prescription: Joi.object()
      .keys({
        _id: Joi.string().optional(),
        patient_id: Joi.string().required(),
        appointment_id: Joi.string().required(),
        doctor_id: Joi.string().optional(),
        summary: Joi.string().optional(),
        prescribedMedicines: Joi.array()
          .items(
            Joi.object().keys({
              medicine: Joi.string(),
              dosage: Joi.string(),
              duration: Joi.string(),
              remarks: Joi.string(),
            })
          )
          .optional(),
      })
      .optional(),
    treatment_plan: Joi.object()
      .keys({
        _id: Joi.string().optional(),
        patient_id: Joi.string().required(),
        appointment_id: Joi.string().required(),
        doctor_id: Joi.string().optional(),
        treatment_plan: Joi.array().items(Joi.string()).optional(),
      })
      .optional(),
    lab_order: Joi.object()
      .keys({
        _id: Joi.string().optional(),
        patient_id: Joi.string().required(),
        appointment_id: Joi.string().required(),
        doctor_id: Joi.string().optional(),
        lab_order: Joi.array().items(Joi.string()).optional(),
      })
      .optional(),
  })
  .unknown();

const diagnosisRoutesSchemas = {
  createDiagnosis: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required(),
    }),
    body: diagnosisSchema,
  },
};

const createUpdateMedicineSchema = Joi.object().keys({
  name: Joi.string(),
  manufacturer: Joi.string(),
  dosage: Joi.string(),
  price: Joi.number(),
  quantity: Joi.number(),
  expiryDate: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),
  prescriptionRequired: Joi.boolean(),
  activeIngredients: Joi.array().items(Joi.string()),
  sideEffects: Joi.array().items(Joi.string()),
  storageConditions: Joi.string(),
  warnings: Joi.array().items(Joi.string()),
  imageUrl: Joi.string(),
});

const medicineRoutesSchemas = {
  createOrUpdateMedicine: {
    headers: Joi.object().keys({
      "x-request-token": Joi.string().required(),
    }),
    body: createUpdateMedicineSchema,
  },
};

const productRoutesSchemas = {
  createProduct: {
    body: Joi.object().keys({
      product: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required(),
        status: Joi.string().required().valid("available", "unavailable"),
        image: Joi.string().required(),
        category_id: Joi.string().required(),
        category_name: Joi.string().required(),
        sub_category_id: Joi.string().required(),
        sub_category_name: Joi.string().required(),
        time_required: Joi.number().required(),
      }).required(),
    }),
  },
};

const categorySchemas = {
  createCategory: {
    body: Joi.object()
      .keys({
        name: Joi.string().required(),
        time_required: Joi.number().required(),
      })
      .required(),
  },
  updateCategory: {
    body: Joi.object()
      .keys({
        name: Joi.string().required(),
        time_required: Joi.number().required(),
      })
      .required(),
  },
};

const chatRoutesSchemas = {
  headers: Joi.object().keys({
    "x-request-token": Joi.string().required().messages({
      "string.empty": "Invalid request",
    }),
  }),
  sendMessage: {
    body: Joi.object().keys({
      sender_id: Joi.string().required(),
      receiver_id: Joi.string().required(),
      message: Joi.string().required(),
      type: Joi.string().required(),
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
  medicineRoutesSchemas,
  chatRoutesSchemas
};

export default requestSchemas;
