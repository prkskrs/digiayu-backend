import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email?: string;
  password: string;
  role: "doctor" | "patient" | "admin" | "vendor";
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "inactive" | "pending";
}

export interface OTP {
  _id?: ObjectId;
  phone: string;
  otp: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface Product {
  _id?: ObjectId;
  name: string;
  price: number;
  description: string;
  status: "available" | "unavailable";
  image: string;
  createdAt: Date;
  updatedAt: Date;
  category_id?: ObjectId;
  category_name: string;
  sub_category_id?: ObjectId;
  sub_category_name: string;
  time_required?: number;
  rating?: number;
}
export interface Category {
  _id?: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  time_required: number;
}
export interface SubCategory {
  _id?: ObjectId;
  name: string;
  category_id?: ObjectId;
  category_name: string;
  createdAt: Date;
  updatedAt: Date;
  time_required: number;
}
export interface Order {
  _id?: ObjectId;
  user_id: ObjectId;
  user_name: string;
  user_phone: string;
  delivery_address: string;
  delivery_time: Date;
  delivery_charge: number;
  total_amount: number;
  order_status:
  | "accepted"
  | "rejected"
  | "cancelled"
  | "delivered"
  | "out_for_delivery"
  | "ready_for_pickup"
  | "preparing";
  order_items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  type: "pickup" | "delivery";
  delivery_person_id?: ObjectId;
  delivery_person_name?: string;
  delivery_person_phone?: string;
  instructions?: string;
}
interface OrderItem {
  product_id: ObjectId;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
  time_required: number;
  rating?: number;
}

export interface UserWallet {
  _id?: ObjectId;
  user_id?: ObjectId;
  user_name: string;
  user_phone: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface Offer {
  _id?: ObjectId;
  user_id?: string;
  name: string;
  description: string;
  offer_code: string;
  status: "active" | "inactive";
  offer_type: "percentage" | "flat";
  offer_for:
  | "all"
  | "specific_days"
  | "birthday"
  | "anniversary"
  | "cart_value"
  | "specific_product"
  | "specific_category"
  | "specific_sub_category"
  | "occasion"
  | "specific_user";
  specific_days?: string[];
  cart_value?: number;
  specific_product_id?: ObjectId;
  specific_category_id?: ObjectId;
  specific_sub_category_id?: ObjectId;
  discount_percentage: number;
  valid_from: Date;
  valid_to: Date;
}
export interface Cart {
  _id?: ObjectId;
  user_id: ObjectId;
  user_name: string;
  user_phone: string;
  cart_items: OrderItem[];
  total_amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id?: ObjectId;
  user_id?: ObjectId;
  user_name: string;
  user_phone: string;
  order_id?: ObjectId;
  order_amount: number;
  payment_status: "pending" | "success" | "failed";
  payment_method: "cash" | "online";
  payment_id: string;
  payment_response: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Delivery {
  _id?: ObjectId;
  user_name: string;
  user_phone: string;
  order_id?: ObjectId;
  delivery_address: string;
  deliver_person_id: ObjectId;
  deliver_person_name: string;
  deliver_person_phone: string;
  status: "accepted" | "out_for_delivery" | "delivered" | "cancelled";
  delivery_time: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  _id?: ObjectId;
  user_id: ObjectId;
  name: string;
  email?: string;
  mobile: string;
  dob: Date;
  gender: "male" | "female" | "other";
  speciality: string;
  city: string;
  description: string;

  medical_registration_no: string;
  medical_registration_council: string;
  medical_registration_year: string;
  medical_experience: string;

  educational_degree: string;
  educational_college: string;
  educational_year: string;
  educational_certificate: string;

  has_establishment: boolean;
  establishment_type: string;
  establishment_name: string;
  establishment_address: string;
  establishment_city: string;

  profile_type: string;
  profile_name: string;
  profile_description: string;
  profile_image: string;
  consultation_fee: number;

  status: "active" | "inactive" | "verification_pending";
  profile_completed: boolean;
  weeklyAvailability: WeeklyAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyAvailability {
  day: string; // ex : "Monday", "Tuesday", etc.
  fullDayAvailability: SessionAvailability[];
}

export interface SessionAvailability {
  startTime: string; // ex : "09:00 AM"
  endTime: string; //ex : "05:00 PM"
}

export interface Patient {
  _id?: ObjectId;
  name: string;
  email?: string;
  phone: string;
  avatar: string;
  user_id: ObjectId;
  gender: "male" | "female" | "other";
  dob: Date;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id?: ObjectId;
  patient_id: ObjectId;
  patient_name: string;
  patient_phone: string;
  doctor_id: ObjectId;
  meeting_link: string;
  patient_details: PatientDetail;
  questionnaire: Questionnaire;
  status: "pending" | "approved" | "cancelled" | "rescheduled" | "diagnosed";
  appointment_date: Date;
  appointment_time: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Questionnaire {
  question: string;
  answer: string;
}

export interface PatientDetail {
  appointmentFor: "myself" | "someone else";
  fullname: string;
  phone_number: string;
  email: string;
  covidVaccination: "yes" | "no" | "partially";
  gender: "male" | "female" | "other";
  height: string;
  weight: string;
  reason: string;
}

// export interface Medicine

export interface Diagnosis {
  _id?: ObjectId;
  appointment_id: ObjectId;
  patient_id: ObjectId;
  doctor_id: ObjectId;
  vital_signs: VitalSign;
  clinical_notes: ClinicalNotes;
  prescription: Prescription;
  treatment_plan: TreatmentPlan;
  lab_order: LabOrder;
}

export interface VitalSign {
  weight: string;
  bp: {
    diastole: string;
    systole: string;
  };
  pulse: string;
  temperature: string;
  respiratory_rate: string;
}

export interface ClinicalNotes {
  instruction: string;
  complaint: string;
}

export interface Prescription {
  _id?: ObjectId;
  patient_id: ObjectId;
  appointment_id: ObjectId;
  doctor_id: ObjectId;
  summary: string;
  prescribedMedicines: [
    {
      medicine: ObjectId;
      dosage: string;
      duration: string;
      remarks: string;
    }
  ];
}

export interface TreatmentPlan {
  _id?: ObjectId;
  patient_id: ObjectId;
  appointment_id: ObjectId;
  doctor_id: ObjectId;
  assignedPlans: [
    {
      treatment_plan: ObjectId;
      discount: Number;
      cost: Number;
    }
  ];
}

export interface LabOrder {
  _id?: ObjectId;
  patient_id: ObjectId;
  appointment_id: ObjectId;
  doctor_id: ObjectId;
  assingedLabOrders: [
    {
      lab_test: ObjectId;
      discount: Number;
    }
  ];
}

export interface Chat {
  _id?: ObjectId;
  patient_id: ObjectId;
  doctor_id: ObjectId;
  status: "active" | "inactive" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id?: ObjectId;
  chat_id: ObjectId;
  sender_id: ObjectId;
  receiver_id: ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  status: "sent" | "delivered" | "read";
}

export interface Medicine {
  _id?: ObjectId;
  name: string;
  manufacturer: string;
  dosage: string;
  price: number;
  quantity: number;
  expiryDate: string;
  description: string;
  category: string;
  prescriptionRequired: boolean;
  activeIngredients: string[];
  sideEffects: string[];
  storageConditions: string;
  warnings: string[];
  imageUrl: string;
}


export interface Notification {
  _id?: ObjectId;
  user_id: ObjectId;
  title: string;
  message: string;
  type: "order" | "appointment" | "chat";
  createdAt: Date;
  updatedAt: Date;
}
