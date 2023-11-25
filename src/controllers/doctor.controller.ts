import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database } from "../database/Database";
import { Inject } from "typedi";
import { Doctor } from "../interfaces/db";
import { verifyToken } from "../util/auth";

export default class DoctorControllers {
  @Inject()
  private database: Database;

  public updateMe = async (req: Request, res: Response) => {
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

      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        },
      );

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

        status: "verification_pending",
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

      return res.status(200).json({
        success: true,
        message: "Doctor updated successfully",
        data: {
          ...result,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getMe = async (req: Request, res: Response) => {
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
      // console.log(requestTokenData);

      const userId = new ObjectId(requestTokenData.userId);

      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        },
      );

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
        data: {
          ...doctorExists,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getAllDoctor = async (req: Request, res: Response) => {
    try {
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

  public getDoctorById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Doctor ID is required",
        });
      }

      const doctor: Doctor | null = await this.database.getById("doctor", id);
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
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  };

  public getPatients = async (req: Request, res: Response) => {
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

      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        },
      );

      // console.log(doctorExists);

      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found!",
        });
      }

      const appointments = await this.database.get(
        Constants.COLLECTIONS.APPOINTMENT,
        { doctor_id: doctorExists._id },
      );

      // console.log(appointments);

      const patientIds = appointments.map(
        (appointment) => appointment.patient_id,
      );
      const uniquePatientIds = [...new Set(patientIds)];

      const patients = await this.database.get(Constants.COLLECTIONS.PATIENT, {
        _id: { $in: uniquePatientIds },
      });

      return res.status(200).json({
        success: true,
        message: `Patients for doctor with id: ${doctorExists._id}`,
        data: {
          patients,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  };

  public getPatientById = async (req: Request, res: Response) => {
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
      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        },
      );

      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found!",
        });
      }

      const patientId = req.params.id;
      const patient = await this.database.getOne(
        Constants.COLLECTIONS.PATIENT,
        {
          _id: new ObjectId(patientId),
        },
      );

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found!",
        });
      }

      const appointments = await this.database.get(
        Constants.COLLECTIONS.APPOINTMENT,
        {
          patient_id: new ObjectId(patientId),
          doctor_id: doctorExists._id,
        },
      );

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
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  };

  public createOrUpdateAvailability = async (req: Request, res: Response) => {
    try {
      // const doctorId = req.params.id;
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

      if (role !== "doctor") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        },
      );

      if (!doctorExists) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found!",
        });
      }

      const { weeklyAvailability } = req.body;

      await this.database.updateById("doctor", doctorExists?._id, {
        weeklyAvailability: weeklyAvailability,
      });
      const updatedDoctor = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          _id: doctorExists?._id,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Availability updated successfully",
        data: updatedDoctor.weeklyAvailability,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getAvailabilityTimeSlots = async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const { date } = req.query;
    console.log(doctorId);

    try {
      // Get the doctor's weekly availability
      const doctor: Doctor | null = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          _id: new ObjectId(doctorId),
        },
      );

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // Find the availability for the requested date
      const requestedDate = new Date(date as string);
      const day = requestedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const availability = doctor.weeklyAvailability.find((week) => {
        const weekDay =
          week.day.charAt(0).toUpperCase() + week.day.slice(1).toLowerCase();
        return weekDay === day;
      })?.fullDayAvailability;

      if (!availability) {
        return res.status(404).json({ message: "Availability not found" });
      }

      // checking if there are any existing appointments for the requested date
      const existingAppointments = await this.database.get("appointment", {
        doctor_id: new ObjectId(doctorId),
        appointment_date: requestedDate,
        status: { $ne: "cancelled" },
      });

      // console.log(existingAppointments);

      // removing the occupied timeslot from the availability
      const availableTimeSlots = availability.filter((session) => {
        const sessionStartTime = session.startTime.toString();
        return !existingAppointments.find(
          (appointment) =>
            appointment.appointment_time.toString() === sessionStartTime,
        );
      });

      return res.status(200).json({
        availability,
        existingAppointments,
        availableTimeSlots,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  };
}
