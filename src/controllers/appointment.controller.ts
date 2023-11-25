import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database, db } from "../database/Database";
import { Inject } from "typedi";
import { Appointment } from "../interfaces/db";
import { verifyToken } from "../util/auth";
import axios, { AxiosError } from "axios";

export default class AppointmentControllers {
  @Inject()
  private database: Database;

  public bookAppointment = async (req: Request, res: Response) => {
    try {
      const {
        patient_name,
        patient_phone,
        doctor_id,
        patient_details,
        questionnaire,
        meeting_link,
        status,
        appointment_date,
        appointment_time,
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

      const appointment: Appointment = {
        patient_id: patientExists?._id,
        patient_name,
        patient_phone,
        doctor_id: new ObjectId(doctor_id),
        patient_details,
        meeting_link,
        questionnaire,
        status: "pending",
        appointment_date: new Date(appointment_date),
        appointment_time,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.database.add("appointment", appointment);
      return res.status(200).json({
        success: result.acknowledged,
        message: "Appointment Booked successfully",
        data: {
          appointment: appointment,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getAppointments = async (req: Request, res: Response) => {
    try {
      const { status, dateFrom, dateTo, limit, skip } = req.query;
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
      // console.log(userId);

      let doctor_id,
        patient_id,
        common_id = null;
      let role = null;

      const patientExists = await this.database.getOne(
        Constants.COLLECTIONS.PATIENT,
        {
          user_id: userId,
        }
      );

      if (patientExists) {
        role = "patient";
        patient_id = patientExists?._id;
      }

      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        }
      );

      if (doctorExists) {
        role = "doctor";
        doctor_id = doctorExists?._id;
      }

      const query: any = {};

      if (patient_id) {
        query.patient_id = new ObjectId(patient_id.toString());
      }

      if (doctor_id) {
        query.doctor_id = new ObjectId(doctor_id.toString());
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

      const appointments = await this.database.aggregate("appointment", [
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
          $limit: parseInt(limit?.toString() ?? "20"),
        },
        {
          $skip: parseInt(skip?.toString() ?? "0"),
        },
      ]);

      if (patient_id) {
        common_id = patient_id;
      } else {
        common_id = doctor_id;
      }

      return res.status(200).json({
        success: true,
        message: `All Appointments for  ${role} with id ${common_id}`,
        data: { appointments },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  };

  public getAppointmentById = async (req: Request, res: Response) => {
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

      if (role !== "patient" && role !== "doctor") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const { id } = req.params;
      const appointmentId = new ObjectId(id);

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

      const appointment = await this.database.aggregate(
        "appointment",
        pipeline
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

  public updateAppointmentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

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

      const userExists = await this.database.getOne(
        Constants.COLLECTIONS.USER,
        {
          _id: userId,
        }
      );
      // console.log(userExists.role);

      if (
        userExists.role !== "patient" &&
        userExists.role !== "doctor" &&
        userExists.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update appointment!",
        });
      }

      if (!ObjectId.isValid(id)) {
        res.status(400).json({ status: false, message: "Invalid id format" });
        return;
      }

      const appointment = await this.database.getById("appointment", id);

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

      const {
        patient_name,
        patient_phone,
        doctor_id,
        patient_details,
        status,
        appointment_date,
        appointment_time,
      } = req.body;

      const update: Partial<Appointment> = {};
      if (patient_name) {
        update.patient_name = patient_name;
      }
      if (patient_phone) {
        update.patient_phone = patient_phone;
      }
      if (doctor_id) {
        if (!ObjectId.isValid(doctor_id)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid doctor id format" });
        }
        update.doctor_id = new ObjectId(doctor_id);
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
      const result = await this.database.updateById(
        "appointment",
        new ObjectId(id),
        update
      );
      const updatedAppointment = await this.database.getById("appointment", id);

      if (result.acknowledged === true) {
        res.status(200).json({
          status: true,
          message: "Appointment updated successfully",
          data: { updatedAppointment },
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to update appointment",
        });
      }
    } catch (error) {
      console.error(`Error occurred while updating appointment: ${error}`);
      res.status(500).send({ message: "Failed to update appointment" });
    }
  };


  // public generateZoomMeetingLink = async (req: Request, res: Response) => {
  //   const zoomAuthUrl = 'https://zoom.us/oauth/authorize';
  //   const clientId = "QMWnxfRGSqy8KAOxJJDn0A";
  //   const redirectUri = "http://localhost:8000/api/v1/zoom/callback";
  //   const responseType = 'code';

  //   const authParams = new URLSearchParams({
  //     response_type: responseType,
  //     client_id: clientId,
  //     redirect_uri: redirectUri,
  //   });

  //   const authorizationUrl = `${zoomAuthUrl}?${authParams.toString()}`;
  //   res.redirect(authorizationUrl);
  // };

  // public generateZoomMeetingLink = async (req: Request, res: Response) => {
  //   try {
  //     const zoomTokenUrl = 'https://zoom.us/oauth/token';
  //     const clientId = '2UC2f8YvSyiQAGRGdwSWQ';
  //     const clientSecret = 'nC9sEBQC9FHHxUDJv36p5e3NP0dp4msF';
  //     console.log(zoomTokenUrl);

  //     // Request access token from Zoom
  //     const response = await axios.post(zoomTokenUrl, {
  //       grant_type: 'client_credentials',
  //       client_id: clientId,
  //       client_secret: clientSecret,
  //     });

  //     console.log(response.data);


  //     const { access_token } = response.data;

  //     // Create Zoom meeting
  //     const zoomMeetingUrl = 'https://api.zoom.us/v2/users/me/meetings';
  //     // const { patient_name, appointment_date, appointment_time } = appointment;

  //     // const startDateTime = new Date(appointment_date);
  //     // startDateTime.setHours(appointment_time.getHours());
  //     // startDateTime.setMinutes(appointment_time.getMinutes());

  //     const startDateTime = new Date();
  //     startDateTime.setHours(10);
  //     startDateTime.setMinutes(30);

  //     // const payload = {
  //     //   topic: `Appointment with ${patient_name}`,
  //     //   type: 2,
  //     //   start_time: startDateTime.toISOString(),
  //     //   duration: 60,
  //     // };

  //     const payload = {
  //       topic: `Appointment with Prakash`,
  //       type: 2,
  //       start_time: startDateTime.toISOString(),
  //       duration: 60,
  //     };

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     };

  //     const zoomResponse = await axios.post(zoomMeetingUrl, payload, config);

  //     console.log(zoomResponse.data);


  //     const { join_url } = zoomResponse.data;


  //     res.send(join_url);
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       const axiosError: AxiosError = error;
  //       console.error(`Axios error occurred while generating Zoom meeting link: ${axiosError.message}`);
  //       res.status(500).send({ message: 'Failed to generate Zoom meeting link' });
  //     } else {
  //       console.error(`Error occurred while generating Zoom meeting link: ${error}`);
  //       res.status(500).send({ message: 'Failed to generate Zoom meeting link' });
  //     }
  //   }

  // };

  public zoomAuthorization = async (req: Request, res: Response) => {
    const clientId = '2UC2f8YvSyiQAGRGdwSWQ';
    const clientSecret = 'nC9sEBQC9FHHxUDJv36p5e3NP0dp4msF';
    const redirectUri = 'https://dev-api.digiayu.com/api/appointment/zoom/callback/6496ac0456af2725b193e9ca';

    const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return res.redirect(authorizationUrl)
  }

  public zoomCallback = async (req: Request, res: Response) => {
    const code = req.query.code;
    const { appointmentId } = req.params;
    console.log(code);

    try {
      // Exchange authorization code for an access token
      const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: "https://dev-api.digiayu.com/api/appointment/zoom/callback/6496ac0456af2725b193e9ca",
        },
        auth: {
          username: "2UC2f8YvSyiQAGRGdwSWQ",
          password: "nC9sEBQC9FHHxUDJv36p5e3NP0dp4msF",
        },
      });

      const accessToken = tokenResponse.data.access_token;
      console.log(accessToken);


      // Use the access token to make Zoom API requests
      // Here's an example of creating a new meeting link
      const createMeetingResponse = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
        topic: 'My New Meeting',
        type: 1,
        settings: {
          host_video: true,
          participant_video: true,
        },
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(createMeetingResponse.data);

      const meetingLink = createMeetingResponse.data.join_url;
      console.log(meetingLink);

      const appointment = await this.database.getById("appointment", appointmentId);

      if (!appointment) {
        return res
          .status(404)
          .json({ status: false, message: "Appointment not found" });
      }

      const result = await this.database.updateById(
        "appointment",
        new ObjectId(appointmentId),
        { meeting_link: meetingLink }
      );

      return res.status(200).json({
        message: "Meet Link Added",
        data: meetingLink
      });

    } catch (error) {
      console.error('Error during OAuth callback:', error);
      res.status(500).send('OAuth callback failed');
    }
  }
};


