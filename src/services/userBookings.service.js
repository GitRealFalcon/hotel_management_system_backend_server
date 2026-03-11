import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";

const userBookings = async (user)=>{
    try {
        const booking = await Booking.find({
            customer:user._id
        })

        if(booking.length < 1){
            throw new ApiError(404,"Booking not found")
        }

        return booking
    } catch (error) {
      throw new ApiError(error.statusCode,error.message) 
    }
}

export default userBookings