import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive value"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Room must have at least one occupant capacity"],
    },
    image: [
      {
        secure_url: {
          type: String,
          default: "https://example.com/default-room.jpg",
        },
        public_id: {
          type: String,
        },
      },
    ],
    type: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Suite", "Deluxe", "Family"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
