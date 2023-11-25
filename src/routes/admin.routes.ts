import express from "express";
import Container from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import AdminController from "../controllers/admin.controller";
const adminControllers = Container.get(AdminController);

router.get(
  "/doctors",
  RequestValidator(
    requestSchemas.adminRoutesSchemas.getDoctors.headers,
    "headers",
  ),
  adminControllers.getAllDoctors,
);

router.get(
  "/patients",
  RequestValidator(
    requestSchemas.adminRoutesSchemas.getPatients.headers,
    "headers",
  ),
  adminControllers.getAllPatients,
);

router.get(
  "/appointments",
  RequestValidator(
    requestSchemas.adminRoutesSchemas.getAppointments.headers,
    "headers",
  ),
  adminControllers.getAllAppointments,
);

router.get(
  "/patients/:patientId",
  RequestValidator(
    requestSchemas.adminRoutesSchemas.getPatients.headers,
    "headers",
  ),
  adminControllers.getPatientDetails,
);

router.get(
  "/doctors/:doctorId",
  RequestValidator(
    requestSchemas.adminRoutesSchemas.getDoctors.headers,
    "headers",
  ),
  adminControllers.getDoctorDetails,
);

router.put(
  "/doctors/:doctorId/update",
  RequestValidator(requestSchemas.doctorRoutesSchemas.updateMe.body, "body"),
  RequestValidator(
    requestSchemas.adminRoutesSchemas.getDoctors.headers,
    "headers",
  ),
  adminControllers.updateDoctorById,
);

// from this api you'll get appointment Details by ID along with (patient + doctor + diagnosis) details
router.get(
  "/appointments/:appointmentId",
  RequestValidator(
    requestSchemas.adminRoutesSchemas.getAppointments.headers,
    "headers",
  ),
  adminControllers.getAppointmentDetails,
);

export default router;
