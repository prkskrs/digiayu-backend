import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import MedicineController from "../controllers/medicine.controller";
const medicineController = Container.get(MedicineController);

router.put(
    "/",
    RequestValidator(requestSchemas.medicineRoutesSchemas.createOrUpdateMedicine.body,
        "body"),
    RequestValidator(
        requestSchemas.medicineRoutesSchemas.createOrUpdateMedicine.headers,
        "headers"
    ),
    medicineController.createOrUpdateMedicine
);

router.get(
    "/",
    medicineController.getAllMedicine
);

router.get(
    "/:medicineId",
    RequestValidator(
        requestSchemas.medicineRoutesSchemas.createOrUpdateMedicine.headers,
        "headers"
    ),
    medicineController.getMedicineById
);

router.delete(
    "/:medicineId",
    RequestValidator(
        requestSchemas.medicineRoutesSchemas.createOrUpdateMedicine.headers,
        "headers"
    ),
    medicineController.deleteMedicineById
);

export default router;
