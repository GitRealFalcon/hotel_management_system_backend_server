import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Room } from "../models/room.model.js";

const newBooking = asyncHandler(async (req, res) => {
  let { roomNo, checkIn, checkOut,isPayed,paymentId } = req.body;
  const userId = req.user?._id;
  if ([checkIn, checkOut, roomNo].some((field) => !field?.toString().trim())) {
    throw new ApiError(400, "All fields required");
  }

  const room = await Room.findOne({
    roomNo
  })

  if (!room) {
    throw new ApiError(404,"Room Not Found")
  }

  if (room.isAvailable !== true) {
    throw new ApiError(403,"Room Not Available")
  }

 const perDayCharge = Number(room.price)

  const booking = await Booking.create({
    roomNo,
    checkIn,
    checkOut,
    perDayCharge,
    isPayed,
    customer : userId,
    paymentId

  })

  if (!booking) {
    throw new ApiError(500,"somthing wnt wrong whole Booking")
  }

  await Room.findOneAndUpdate(
    {roomNo},
    {
      $set: { isAvailable: false }
    },
    {new:true}
  )

  await User.findByIdAndUpdate(
    userId,
    {
       $push: { bookingHistory: booking._id }
    },
    {new: true}
  )

  return res
  .status(200)
  .json(new ApiResponce(200,booking,"Booking successfully"))
});

const getBookingDetails = asyncHandler(async (req,res)=>{
    const {bookingId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "booking Id required")
    }

    const bookingDetails = await Booking.findById(bookingId)

    if (!bookingDetails) {
        throw new ApiError(500,"something went error while find booking details")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,bookingDetails,"booking details fetched successfully"))
})

const cancelBooking = asyncHandler(async (req,res)=>{
    const {bookingId} = req.body;
    const userId = req.user?._id;
    
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400,"booking Id required")
    }

    const booking = await Booking.findOne(
        {
            _id: bookingId,
          customer: userId 
        }
    )

    if (booking.status !== "Active") {
        throw new ApiError(400,"booking not active")
    }

    if (booking.isChekedIn !== true) {
      throw new ApiError(403,"Cannot Cancel booking after chekedIn")
    }

    const cancel = await Booking.findOneAndUpdate(
        {
          _id: bookingId,
          customer: userId
        },
        {
            status : "Cancelled"
        },
        {new: true}
    )

    if (!cancel) {
        throw new ApiError(500,"somthing went wrong while cancel booking")
    }

    await Room.findOneAndUpdate(
      {roomNo:cancel.roomNo},
      {
        $set:{isAvailable: true}
      },
      {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponce(200,{},"Booking cancelled successfully"))
})

const checkout = asyncHandler(async (req,res)=>{
   const {bookingId} = req.body;
    const userId = req.user?._id;
    
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400,"booking Id required")
    }

     const booking = await Booking.findOne(
        {
            _id: bookingId,
          customer: userId 
        }
    )

    if (booking.status !== "Active") {
        throw new ApiError(400,"booking not active")
    }

    const ischeckout = await Booking.findOneAndUpdate(
        {
          _id: bookingId,
          customer: userId
        },
        {
            status : "Completed"
        },
        {new: true}
    )

    if (!ischeckout) {
        throw new ApiError(500,"somthing went wrong while checkout")
    }

     await Room.findOneAndUpdate(
      {roomNo:ischeckout.roomNo},
      {
        $set:{isAvailable: true}
      },
      {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponce(200,{},"Booking checkout successfully"))
})

const checkIn = asyncHandler(async (req,res)=>{
  const {bookingId} = req.body;
  const userId = req.user?._id;

  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404,"user Not Found")
  }

  if (user.isAdmin !== true) {
    throw new ApiError(403,"access denied")
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400,"Invalid Booking Id")
  }

  const booking = await Booking.findOne(
    {
      _id : bookingId
    }
  )

  if (!booking) {
    throw new  ApiError(404,"Booking Not Found")
  }

  if (booking.status !== "Active") {
    throw new ApiError(403,`cannot perform checkin, Booking status: ${booking.status}`)
  }

  const checkedInBooking = await Booking.findOneAndUpdate(
    {
      _id: bookingId
    },
    {
      $set:{isChekedIn: true}
    },
    {new: true}
  )

  if (!checkedInBooking) {
    throw new ApiError(500,"Something went wrong while chekedIn")
  }

  return res
  .status(200)
  .json(new ApiResponce(200,checkedInBooking,"checkedIn successfully"))
})

export {newBooking,getBookingDetails, cancelBooking,checkout,checkIn};
