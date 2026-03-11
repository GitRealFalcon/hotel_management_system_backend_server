import { ApiError } from "../utils/ApiError.js";
import { Booking } from "../models/booking.model.js";
import mongoose from "mongoose";


const getBookingById = async(bookingId)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            throw new ApiError(400,"Invalid BookingId")
        }

        const booking = await Booking.findById(bookingId)

        if (!booking) {
            throw new ApiError(404,"Booking Not Found")
        }

        return booking
    } catch (error) {
       throw new ApiError(error.statusCode,error.message) 
    }
}

export default getBookingById