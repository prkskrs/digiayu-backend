import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database } from "../database/Database";
import { Inject } from "typedi";
import { Appointment, Doctor } from "../interfaces/db";
import { verifyToken } from "../util/auth";

export default class AdminControllers {
  @Inject()
  private database: Database;

  public getAllDoctors = async (req: Request, res: Response) => {
    try {
      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);
      const role = requestTokenData.role;
      // console.log(requestTokenData);

      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const condition = {};
      const doctors = await this.database.get(
        Constants.COLLECTIONS.DOCTOR,
        condition,
      );

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
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getAllPatients = async (req: Request, res: Response) => {
    try {
      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);
      const role = requestTokenData.role;
      // console.log(requestTokenData);

      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const condition = {};
      const patients = await this.database.get(
        Constants.COLLECTIONS.PATIENT,
        condition,
      );

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
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getAllAppointments = async (req: Request, res: Response) => {
    try {
      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);
      const role = requestTokenData.role;
      // console.log(requestTokenData);

      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const condition = {};
      const appointments = await this.database.get(
        Constants.COLLECTIONS.APPOINTMENT,
        condition,
      );

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
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getPatientDetails = async (req: Request, res: Response) => {
    try {
      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);
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
      const patient = await this.database.getById("patient", patientId);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      }

      // Retrieve patient's appointments
      const condition = { patient_id: new ObjectId(patientId) };
      const appointments = await this.database.get(
        Constants.COLLECTIONS.APPOINTMENT,
        condition,
      );
      // console.log(appointments);

      return res.status(200).json({
        success: true,
        message: "Patient details and his appointments",
        data: { patient, appointments },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public getDoctorDetails = async (req: Request, res: Response) => {
    try {
      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);
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
      const doctor = await this.database.getById("doctor", doctorId);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      // Retrieve doctor's appointments
      const condition = { doctor_id: new ObjectId(doctorId) };
      const appointments = await this.database.get(
        Constants.COLLECTIONS.APPOINTMENT,
        condition,
      );
      // console.log(appointments);

      return res.status(200).json({
        success: true,
        message: "Doctor details and his appointments",
        data: { doctor, appointments },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  public updateDoctorById = async (req: Request, res: Response) => {
    try {
      const {
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
        status,
        weeklyAvailability,
      } = req.body;

      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);
      const role = requestTokenData.role;
      // console.log(requestTokenData);

      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const { doctorId } = req.params;

      const doctorExists = await this.database.getById("doctor", doctorId);

      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found!",
        });
      }

      const doctor: Doctor = {
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

      const result = await this.database.updateById(
        "doctor",
        doctorExists?._id,
        doctor,
      );

      const updatedDoctor = await this.database.getById("doctor", doctorId);

      return res.status(200).json({
        success: true,
        message: "Doctor updated successfully",
        data: {
          ...result,
          doctor: updatedDoctor,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getAppointmentDetails = async (req: Request, res: Response) => {
    try {
      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);
      const role = requestTokenData.role;

      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const { appointmentId } = req.params;
      const id = new ObjectId(appointmentId);

      const pipeline = [
        {
          $match: {
            _id: id,
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

      const appointment = await this.database.aggregate(
        "appointment",
        pipeline,
      );

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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
