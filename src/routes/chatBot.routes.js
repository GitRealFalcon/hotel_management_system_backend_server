import { chatBot } from "../controllers/chatBot.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const chatBotRouter = Router()

chatBotRouter.route("/").post(verifyJWT,chatBot)

export { chatBotRouter }