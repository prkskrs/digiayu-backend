import express from "express";
import Container from "typedi";
const router = express.Router();
import RequestValidator from "../middlewares/validator";
import requestSchemas from "./requestSchemas";
import ChatController from "../controllers/chat.controller";
const chatController = Container.get(ChatController);

router.get(
  "/",
  RequestValidator(requestSchemas.chatRoutesSchemas.headers, "headers"),
  chatController.getAllChats,
);

router.get(
  "/:id",
  RequestValidator(requestSchemas.chatRoutesSchemas.headers, "headers"),
  chatController.getChatMessages,
);

router.post(
  "/",
  RequestValidator(requestSchemas.chatRoutesSchemas.headers, "headers"),
  chatController.sendMessage,
);

export default router;
