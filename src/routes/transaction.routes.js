import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { createOrder,verifyPayment,getTransactionDetail, getTransactions } from "../controllers/transaction.controller.js";

const transactionRouter = Router()

transactionRouter.route("/create-order").post(verifyJWT,createOrder);
transactionRouter.route("/verify-payment").post(verifyJWT,verifyPayment);
transactionRouter.route("/get-transaction").get(getTransactionDetail);
transactionRouter.route("/get-transections").get(verifyJWT,getTransactions)


export {transactionRouter}