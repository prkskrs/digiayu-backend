import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import DoctorController from "../controllers/doctor.controller";
const doctorControllers = Container.get(DoctorController);

router.put(
  "/updateMe",
  RequestValidator(requestSchemas.doctorRoutesSchemas.updateMe.body, "body"),
  RequestValidator(
    requestSchemas.authRoutesSchemas.signupDoctor.headers,
    "headers"
  ),
  doctorControllers.updateMe
);

router.get(
  "/getMe",
  RequestValidator(
    requestSchemas.authRoutesSchemas.signupDoctor.headers,
    "headers"
  ),
  doctorControllers.getMe
);

router.get(
  "/patients",
  RequestValidator(requestSchemas.doctorRoutesSchemas.getPatients.headers, "headers"),
  doctorControllers.getPatients
);

router.get(
  "/patients/:id",
  RequestValidator(requestSchemas.doctorRoutesSchemas.getPatients.headers, "headers"),
  doctorControllers.getPatientById
);


router.get(
  "/",
  doctorControllers.getAllDoctor
);

router.patch(
  "/set-availability/",
  RequestValidator(requestSchemas.doctorRoutesSchemas.getDoctor.headers, "headers"),
  doctorControllers.createOrUpdateAvailability
);

router.get(
  "/get-available-slots/:doctorId/",
  RequestValidator(requestSchemas.doctorRoutesSchemas.getDoctor.headers, "headers"),
  doctorControllers.getAvailabilityTimeSlots
);

router.get(
  "/:id",
  doctorControllers.getDoctorById
);

export default router;
