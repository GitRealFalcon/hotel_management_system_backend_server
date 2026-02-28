import { chatBot } from "../controllers/chatBot.controller.js";
import { Router } from "express";

const chatBotRouter = Router()

chatBotRouter.route("/").post(chatBot)

export { chatBotRouter }