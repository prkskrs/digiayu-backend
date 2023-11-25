import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import DiagnosisController from "../controllers/diagnosis.controller";
const diagnosisController = Container.get(DiagnosisController);

router.put(
  "/:appointmentId",
  RequestValidator(
    requestSchemas.diagnosisRoutesSchemas.createDiagnosis.body,
    "body",
  ),
  RequestValidator(
    requestSchemas.diagnosisRoutesSchemas.createDiagnosis.headers,
    "headers",
  ),
  diagnosisController.createOrUpdateDiagnosis,
);

router.get(
  "/appointment/:id",
  RequestValidator(
    requestSchemas.diagnosisRoutesSchemas.createDiagnosis.headers,
    "headers",
  ),
  diagnosisController.getDiagnosisById,
);

export default router;
