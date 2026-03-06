import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.model.js";
import { Booking } from "../models/booking.model.js";

const checkAvailability = async(data)=>{
    try {
        const booking = await Booking.find(
            {
               checkIn:{$lt:data.checkIn},
               checkOut:{$gt:data.checkOut}
            }
        )

        const room = await Room.find()
        
        const availableRooms = room.filter(item => !booking.map(item => item.roomNo).includes(item.roomNo))

        return availableRooms
    } catch (error) {
        throw new ApiError(error.statusCode,error.message) 
    }
}

export default checkAvailability