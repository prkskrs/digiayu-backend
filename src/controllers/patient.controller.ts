import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database } from "../database/Database";
import { Inject } from "typedi";
import { Appointment, Patient } from "../interfaces/db";
import { verifyToken } from "../util/auth";

export default class PatientControllers {
  @Inject()
  private database: Database;

  public updateMe = async (req: Request, res: Response) => {
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

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);

      const patientExists = await this.database.getOne(
        Constants.COLLECTIONS.PATIENT,
        {
          user_id: userId,
        }
      );

      if (!patientExists) {
        return res.status(404).json({
          success: false,
          message: "Patient not found!",
        });
      }

      const patient: Patient = {
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

      const result = await this.database.updateById(
        "patient",
        patientExists?._id,
        patient
      );
      return res.status(200).json({
        success: true,
        message: "patient updated successfully",
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

      const userId = new ObjectId(requestTokenData.userId);

      const patient = await this.database.getOne(
        Constants.COLLECTIONS.PATIENT,
        {
          user_id: userId,
        }
      );

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
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };


  public getAllPatientForDoctor = async (req: Request, res: Response) => {
    try {
      const requestToken = req.headers["x-request-token"];
      if (!requestToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
        });
      }

      const requestTokenData = verifyToken(requestToken as string);

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

      const userId = new ObjectId(requestTokenData.userId);

      const userRole = await this.database.getOne(
        Constants.COLLECTIONS.USER,
        {
          _id: userId,
        }
      );

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

      const doctor = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        }
      );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor Not Found",
        });
      }

      const appointments = await this.database.get(
        "appointment",
        { doctor_id: doctor._id } // filter appointments by doctor_id
      );

      const patientIds = appointments.map(appointment => appointment.patient_id);
      const patients = await this.database.get(
        "patient",
        { _id: { $in: patientIds } } // filter patients by their IDs
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

    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

};
