import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import AuthControllers from "../controllers/auth.controller";
const authControllers = Container.get(AuthControllers);
import upload from "../middlewares/upload";

router.post(
  "/signup/doctor",
  RequestValidator(requestSchemas.authRoutesSchemas.signupDoctor.body, "body"),
  RequestValidator(
    requestSchemas.authRoutesSchemas.signupDoctor.headers,
    "headers",
  ),
  authControllers.signUpDoctor,
);

router.post(
  "/signup/patient",
  RequestValidator(requestSchemas.authRoutesSchemas.signupPatient.body, "body"),
  RequestValidator(
    requestSchemas.authRoutesSchemas.signupPatient.headers,
    "headers",
  ),
  authControllers.signUpPatient,
);

router.post(
  "/login",
  RequestValidator(requestSchemas.authRoutesSchemas.login.body, "body"),
  authControllers.login,
);

router.post(
  "/sendOTP",
  RequestValidator(requestSchemas.authRoutesSchemas.sendOTP.body, "body"),
  authControllers.sendOTP,
);

router.post(
  "/verifyOTP",
  RequestValidator(requestSchemas.authRoutesSchemas.verifyOTP.body, "body"),
  authControllers.verifyOTP,
);

router.post(
  "/upload/:fieldName/:userId",
  upload("file"),
  authControllers.uploadAvatar,
);

export default router;
