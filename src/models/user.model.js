import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },

    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    bookingHistory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified(this.password)) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password){
    return  await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function (){
  return JWT.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCEESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = async function (){
  return JWT.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User", userSchema);
