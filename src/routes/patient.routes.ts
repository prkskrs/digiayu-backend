import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import PatientController from "../controllers/patient.controller";
const patientControllers = Container.get(PatientController);

router.put(
  "/updateMe",
  RequestValidator(requestSchemas.patientRoutesSchemas.updateMe.body, "body"),
  RequestValidator(
    requestSchemas.authRoutesSchemas.signupDoctor.headers,
    "headers",
  ),
  patientControllers.updateMe,
);

router.get(
  "/getMe",
  RequestValidator(
    requestSchemas.authRoutesSchemas.signupDoctor.headers,
    "headers",
  ),
  patientControllers.getMe,
);

// For Doctors
router.get(
  "/",
  RequestValidator(
    requestSchemas.authRoutesSchemas.signupDoctor.headers,
    "headers",
  ),
  patientControllers.getAllPatientForDoctor,
);

export default router;
