import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database } from "../database/Database";
import { Inject } from "typedi";
import { Diagnosis } from "../interfaces/db";
import { verifyToken } from "../util/auth";

export default class DiagnosisControllers {
  @Inject()
  private database: Database;

  public createOrUpdateDiagnosis = async (req: Request, res: Response) => {
    try {
      const {
        vital_signs,
        clinical_notes,
        prescription,
        treatment_plan,
        lab_order,
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

      const appointment_id = req.params.appointmentId;

      const appointment = await this.database.getById(
        "appointment",
        appointment_id,
      );

      const updatedAppointment = await this.database.updateById(
        "appointment",
        new ObjectId(appointment_id),
        { status: "diagnosed" },
      );

      const diagnosis: Diagnosis = {
        appointment_id: appointment?._id,
        patient_id: appointment?.patient_id,
        doctor_id: appointment?.doctor_id,
        vital_signs,
        clinical_notes,
        prescription,
        treatment_plan,
        lab_order,
      };

      let result;
      let message;

      const diagnosisExists = await this.database.getOne(
        Constants.COLLECTIONS.DIAGNOSIS,
        {
          appointment_id: appointment?._id,
        },
      );

      if (!diagnosisExists) {
        result = await this.database.add("diagnosis", diagnosis);
        message = "Diagnosis created successfully";
      } else {
        result = await this.database.updateById(
          "diagnosis",
          diagnosisExists?._id,
          diagnosis,
        );
        message = "Diagnosis updated successfully";
      }

      return res.status(200).json({
        success: true,
        message,
        data: {
          ...result,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getDiagnosisById = async (req: Request, res: Response) => {
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

      const patientExists = await this.database.getOne(
        Constants.COLLECTIONS.PATIENT,
        {
          user_id: userId,
        },
      );

      // console.log(patientExists);

      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        },
      );

      // console.log(doctorExists);

      const appointment_id = req.params.id;

      const diagnosisExists = await this.database.getOne(
        Constants.COLLECTIONS.DIAGNOSIS,
        {
          appointment_id: new ObjectId(appointment_id),
        },
      );

      if (!diagnosisExists) {
        return res.status(404).json({
          success: false,
          message: "Diagnosis not found!",
        });
      }

      // Check if the user is authorized to access the diagnosis
      if (
        (role === "patient" &&
          diagnosisExists.patient_id.toString() !==
            patientExists._id.toString()) ||
        (role === "doctor" &&
          diagnosisExists.doctor_id.toString() !== doctorExists._id.toString())
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to diagnosis",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Diagnosis retrieved successfully",
        data: {
          ...diagnosisExists,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };
}
