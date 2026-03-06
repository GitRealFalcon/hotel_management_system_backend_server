import { Booking } from "../models/booking.model.js";
import { Room } from "../models/room.model.js";
import { ApiError } from "../utils/ApiError.js";


const cancelBooking = async(data)=>{
    try {
        const {bookingId,user} = data
        const booking = await Booking.findOne({
            _id:bookingId,
            customer:user._id
        })
            
        
        if (!booking) {
            throw new ApiError(404,"Booking Not Found")
        }

        if (booking.status !== "Active") {
        throw new ApiError(403,`Cannot cancel booking,Booking status: ${booking.status}`)
    }

     if (booking.isChekedIn === true) {
      throw new ApiError(403,"Cannot Cancel booking after chekedIn")
    }

    const cancel = await Booking.findOneAndUpdate(
        {
            _id:bookingId,
            customer:user._id
        },
        {
            status: "Cancelled"
        },
        {
            new:true
        }
    )

    const room = await Room.findOneAndUpdate(
        {
            roomNo:cancel.roomNo
        },
        {
            $set:{isAvailable:true}
        },
        {
            new:true
        }
    )

    return cancel

    } catch (error) {
       
       throw new ApiError(error.statusCode,error.message) 
    }
}

export default cancelBooking