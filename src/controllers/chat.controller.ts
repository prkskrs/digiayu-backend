import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database } from "../database/Database";
import { Inject } from "typedi";
// import { Appointment, Doctor } from "../interfaces/db";
import { verifyToken } from "../util/auth";

export default class ChatController {
  @Inject()
  private database: Database;

  public getAllChats = async (req: Request, res: Response) => {
    try {
      const { status } = req.query;

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

      let doctor_id, patient_id;
      // common_id = null;
      // const role = null;

      const patientExists = await this.database.getOne(
        Constants.COLLECTIONS.PATIENT,
        {
          user_id: userId,
        },
      );

      if (patientExists) {
        patient_id = patientExists?._id;
      }

      const doctorExists = await this.database.getOne(
        Constants.COLLECTIONS.DOCTOR,
        {
          user_id: userId,
        },
      );

      if (doctorExists) {
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

      console.log(query);

      const chats = await this.database.aggregate("chat", [
        { $match: query },
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
            _id: 1,
            status: 1,
            patient_id: 1,
            doctor_id: 1,
            patient: {
              _id: 1,
              name: 1,
              email: 1,
              phone: 1,
              avatar: 1,
            },
            doctor: {
              _id: 1,
              name: 1,
              email: 1,
              mobile: 1,
              profile_image: 1,
            },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "All Doctors",
        data: { chats },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getChatMessages = async (req: Request, res: Response) => {
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

      const chatId = req.params.id;
      console.log(chatId);
      const chat = await this.database.get("chat_message", {
        chat_id: new ObjectId(chatId.toString()),
      });

      return res.status(200).json({
        success: true,
        message: "All chat Messages",
        data: { message: chat },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public sendMessage = async (req: Request, res: Response) => {
    try {
      const { message, sender_id, receiver_id, doctor_id, patient_id } =
        req.body;

      if (!message || !sender_id || !receiver_id || !doctor_id || !patient_id) {
        return res.status(400).json({
          success: false,
          message: "Bad request",
        });
      }
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

      const chatExist = await this.database.getOne("chat", {
        doctor_id: new ObjectId(doctor_id),
        patient_id: new ObjectId(patient_id),
      });

      // console.log(chatExist);

      const chat_id = chatExist?._id;

      if (!chat_id) {
        const chat: any = await this.database.add("chat", {
          doctor_id: new ObjectId(doctor_id),
          patient_id: new ObjectId(patient_id),
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        if (chat) {
          const chatId = chat?.insertedId;

          const chatMessage = await this.database.add("chat_message", {
            chat_id: new ObjectId(chatId),
            message,
            sender_id: new ObjectId(sender_id),
            receiver_id: new ObjectId(receiver_id),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: "sent",
          });
          if (chatMessage) {
            return res.status(200).json({
              success: true,
              message: "Message sent successfully",
              data: { chatMessage },
            });
          }
        }
      } else {
        // console.log("chat exist");
        const chatMessage = await this.database.add("chat_message", {
          chat_id: new ObjectId(chat_id),
          message,
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "sent",
        });

        if (chatMessage) {
          return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: { chatMessage },
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  // public updateChat = async (req: Request, res: Response) => {};
}
