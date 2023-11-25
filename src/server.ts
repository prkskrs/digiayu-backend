import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
const app: Express = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import doctorRoutes from "./routes/doctor.routes";
import patientRoutes from "./routes/patient.routes";
import appointmentRoutes from "./routes/appointment.routes";
import diagnosisRoutes from "./routes/diagnosis.routes";
import medicineRoutes from "./routes/medicine.routes";
import categoryRoutes from "./routes/category.routes";
import chatRoutes from "./routes/chat.routes";

app.use(
  logger("short", {
    skip: (req, res) => {
      return req.originalUrl === "/status";
    },
  }),
);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({
    uptime: process.uptime(),
    message: "Catalyst's API health check :: GOOD",
    timestamp: Date.now(),
  });
});

app.get("/status", (req: Request, res: Response) => {
  res.status(200).end();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/product", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use(function onError(error, req, res, next) {
  const { status = 500 } = error;
  const is_error_array = Array.isArray(error);
  console.log({ url: req.url, body: req.body, error });
  res.status(status).json({
    success: false,
    message: `Something went wrong. Please try again later.`,
    errorTrace: is_error_array
      ? new Error(JSON.stringify(error))
      : new Error(error),
  });
});
