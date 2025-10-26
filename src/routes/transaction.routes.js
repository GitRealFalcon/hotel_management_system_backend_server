import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { createOrder,verifyPayment,getTransactionDetail } from "../controllers/transaction.controller.js";

const transactionRouter = Router()

transactionRouter.route("/create-order").post(verifyJWT,createOrder);
transactionRouter.route("/verify-payment").post(verifyJWT,verifyPayment);
transactionRouter.route("/get-transaction").get(getTransactionDetail);


export {transactionRouter}