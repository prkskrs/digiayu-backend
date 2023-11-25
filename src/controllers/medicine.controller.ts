import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import Constants from "../../Constants";
import { Database } from "../database/Database";
import { Inject } from "typedi";
import { Medicine } from "../interfaces/db";
import { verifyToken } from "../util/auth";

export default class MedicineControllers {
  @Inject()
  private database: Database;

  public createOrUpdateMedicine = async (req: Request, res: Response) => {
    try {
      const {
        name,
        manufacturer,
        dosage,
        price,
        quantity,
        expiryDate,
        description,
        category,
        prescriptionRequired,
        activeIngredients,
        sideEffects,
        storageConditions,
        warnings,
        imageUrl,
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
      const role = requestTokenData.role;
      // console.log(requestTokenData);

      if (role !== "vendor") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      const vendorExists = await this.database.getOne(
        Constants.COLLECTIONS.USER,
        {
          _id: userId,
        },
      );

      if (!vendorExists) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found!",
        });
      }

      const medicine: Medicine = {
        name,
        manufacturer,
        dosage,
        price,
        quantity,
        expiryDate,
        description,
        category,
        prescriptionRequired,
        activeIngredients,
        sideEffects,
        storageConditions,
        warnings,
        imageUrl,
      };

      const medicineExists = await this.database.getOne(
        Constants.COLLECTIONS.MEDICINE,
        {
          name: name,
        },
      );

      if (expiryDate) {
        const expDate = new Date(expiryDate);
        const currentDate = new Date();
        if (expDate < currentDate) {
          return res.status(400).json({
            success: false,
            error: "Expiry date cannot be in the past.",
          });
        }
      }

      let result;
      let message;

      if (!medicineExists) {
        result = await this.database.add("medicine", medicine);
        message = "Medicine added successfully";
      } else {
        result = await this.database.updateById(
          "medicine",
          medicineExists?._id,
          medicine,
        );
        message = "Medicine updated successfully";
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

  public getMedicineById = async (req: Request, res: Response) => {
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

      // Check if the user is authorized to access the diagnosis
      if (role !== "vendor") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to diagnosis",
        });
      }

      const { medicineId } = req.params;

      const medicineExists = await this.database.getOne(
        Constants.COLLECTIONS.MEDICINE,
        {
          _id: new ObjectId(medicineId),
        },
      );

      if (!medicineExists) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found!",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Medicine retrieved successfully",
        data: {
          ...medicineExists,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public deleteMedicineById = async (req: Request, res: Response) => {
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

      // Check if the user is authorized to access the diagnosis
      if (role !== "vendor") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to diagnosis",
        });
      }

      const { medicineId } = req.params;

      const medicineExists = await this.database.getOne(
        Constants.COLLECTIONS.MEDICINE,
        {
          _id: new ObjectId(medicineId),
        },
      );

      if (!medicineExists) {
        return res.status(404).json({
          success: false,
          message: "Medicine not found!",
        });
      }

      const deletedMedicine = await this.database.delete(
        Constants.COLLECTIONS.MEDICINE,
        {
          _id: new ObjectId(medicineId),
        },
      );

      return res.status(200).json({
        success: true,
        message: "Medicine removed successfully",
        data: {
          ...deletedMedicine,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };

  public getAllMedicine = async (req: Request, res: Response) => {
    try {
      const condition = {};
      const medicines = await this.database.get(
        Constants.COLLECTIONS.MEDICINE,
        condition,
      );

      if (!medicines || medicines.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Medicines found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "All Medicines",
        data: {
          medicines,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };
}
