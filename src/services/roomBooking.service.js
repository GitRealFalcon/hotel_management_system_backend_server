import { Booking } from "../models/booking.model.js";
import { Room } from "../models/room.model.js";
import { ApiError } from "../utils/ApiError.js";

const roomBooking = async (data)=>{
    try {
        const room = await Room.findOne({
            roomNo:data.roomNo
        })

        if (!room) {
            throw new ApiError(404,"Room Not Found")
        }

        const existingBooking = await Booking.find({
            checkIn:{$lt:data.checkIn},
            checkOut:{$gt:data.checkOut}
        })

        const isExist = existingBooking?.map(item => item.roomNo).includes(data.roomNo)
        if (isExist) {
            throw new ApiError(403,"This Room Not Available in this Date pls change date")
        }

        const perDayCharge = Number(room.price)
        const booking = await Booking.create({
            roomNo:data.roomNo,
            checkIn:data.checkIn,
            checkOut:data.checkOut,
            perDayCharge,
            customer: data.user._id
        })

        return booking
    } catch (error) {
        throw new ApiError(error.statusCode,error.message) 
    }
}

export default roomBooking