import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    roomNo: {
      type: Number,
      required: [true, "Room number is required"],
      min: [1, "Room number must be positive"],
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status:{
      type: String,
      default: "Active",
      enum:["Active","Cancelled","Completed"]
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    isChekedIn:{
      type:Boolean,
      default:false
    },
    checkOut: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.checkIn || value > this.checkIn;
        },
        message: "Check-out date must be after check-in date",
      },
    },
    payment: {
      isPayed: {
        type: Boolean,
        default: false,
      },
      paymentId: {
        type: mongoose.Types.ObjectId,
        ref: "Transection",
      },
    },
    perDayCharge: {
      type: Number,
      min: [0, "Amount cannot be negative"],
      required: [true, "per Day charge required"]
    },
  },
  {
    timestamps: true,
  }
);

// Optional: virtual field for total days
bookingSchema.virtual("totalDays").get(function () {
  if (!this.checkIn || !this.checkOut) return 0;
  const diff = this.checkOut - this.checkIn;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // days
});
bookingSchema.virtual("totalAmount").get(function () {
  if (!this.checkIn || !this.checkOut) return 0;
  const diff = this.checkOut - this.checkIn;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // days
  return days * this.perDayCharge
});

bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

export const Booking = mongoose.model("Booking", bookingSchema);
