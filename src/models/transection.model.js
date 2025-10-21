import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    utr: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      maxlength: [30, "UTR cannot exceed 30 characters"],
      description: "Unique Transaction Reference for online payments",
    },
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Online"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

transactionSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
