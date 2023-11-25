import express from "express";
import { Container } from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import CategoryControllers from "../controllers/category.controller";

const categoryControllers = Container.get(CategoryControllers);

// router.post(
//   '/',
//   RequestValidator(requestSchemas.categorySchemas.createCategory.body, 'body'),
//   RequestValidator(requestSchemas.authRoutesSchemas.signup.headers, 'headers'),
//   categoryControllers.create,
// );

router.get("/", categoryControllers.list);

export default router;
