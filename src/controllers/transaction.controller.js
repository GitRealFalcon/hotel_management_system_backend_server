import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Transaction } from "../models/transection.model.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Booking } from "../models/booking.model.js";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  headers: {
    "X-Razorpay-Account": "J3XNv7a50HBT5e",
  },
});

const createOrder = asyncHandler(async (req, res) => {
  const { amount, bookingId } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(401,"invalid booking Id")
  }

  if (!amount || !bookingId) {
    throw new ApiError(400, "Amount and BookingId required");
  }

  const booking = await Booking.findById(bookingId)


  if (userId?.toString().trim() !== booking.customer?.toString().trim()) {
    throw new ApiError(401,"access denied")
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${bookingId}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    throw new ApiError(500, "Order creation field");
  }

  return res
  .status(200)
  .json(
    new ApiResponce(
      200,
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        bookingId,
      },
      "order created"
    )
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    bookingId,
  } = req.body;
  const userId = req.user?._id;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(401, "Invalid payment signature");
  }

  const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

  let paymentMethod = "Online"; // default
  switch (paymentDetails.method) {
    case "upi":
      paymentMethod = "UPI";
      break;
    case "card":
      paymentMethod = "Card";
      break;
    case "netbanking":
      paymentMethod = "Online";
      break;
    case "wallet":
      paymentMethod = "Online";
      break;
    default:
      paymentMethod = "Online";
  }

  let status = "Pending";
  switch (paymentDetails.status) {
    case "created":
    case "authorized":
      status = "Pending";
      break;
    case "captured":
      status = "Success";
      break;
    case "failed":
      status = "Failed";
      break;
    case "refunded":
      status = "Refunded";
      break;
    default:
      status = "Unknown";
  }

  const transaction = await Transaction.create({
    utr: razorpay_payment_id,
    bookingId,
    amount,
    paymentMethod,
    status,
    customerId: userId,
  });

  if (!transaction) {
    throw new ApiError(500,"error while create transaction")
  }

  await Booking.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        "payment.isPayed": status === "Success",
        "payment.paymentId": transaction._id,
      },
    },
    { new: true }
  );

 return res
 .status(200)
 .json(new ApiError(200,transaction,"Payment verified successfully"))
});

const getTransactionDetail = asyncHandler(async (req,res)=>{
    const {transactionId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        throw new ApiError(400,"Invali transactionId")
    }

    const transaction = await Transaction.findById(transactionId)

    if (!transaction) {
        throw new ApiError(404,"Transaction Not Found")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,transaction,"Transaction Found"))
})

export { createOrder,verifyPayment,getTransactionDetail };
