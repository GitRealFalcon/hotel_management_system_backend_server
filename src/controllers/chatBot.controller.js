import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import assistentService from "../services/assistent.service.js";
import checkAvailability from "../services/checkAvailablity.service.js";
import userBookings from "../services/userBookings.service.js";
import roomBooking from "../services/roomBooking.service.js";
import cancelBooking from "../services/cancelBooking.service.js";
import getBookingById from "../services/getBooking.service.js";
import suggetsRooms from "../services/suggestRooms.service.js";


const chatBot = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = req.user;

  if (data.text) {
    const response = await assistentService(data.text);
    const payload = JSON.parse(response.data.choices[0].message.content);
    const { checkIn, checkOut, roomNo, bookingId, intent ,chatResponce} = payload;

    if (intent === "suggestions") {
      
      const rooms = await suggetsRooms(data.text)
      
      res.status(200)
      .json(new ApiResponce(200,rooms,"suggestions"))
    }

    if (intent === "chat") {
      const text = {
        text:chatResponce
      }
      res.status(200)
      .json(new ApiResponce(200,text,"chat_text"))
    }

    if (intent === "check_availability") {
      if (!(checkIn && checkOut)) {
        throw new ApiError(
          400,
          "Pls include date. Like?:available rooms 2 march to 10 march"
        );
      }

      const availableRooms = await checkAvailability({
        checkIn,
        checkOut,
      });

      
      return res
        .status(200)
        .json(new ApiResponce(200, availableRooms, "fetch room success"));
    }

    if (intent === "active_booking_info") {
      const bookings = await userBookings(user);

      return res
        .status(200)
        .json(new ApiResponce(200, bookings, "fetch booking success"));
    }

    if (intent === "make_booking") {
      if (
        [checkIn, checkOut, roomNo].some((field) => !field?.toString().trim())
      ) {
        throw new ApiError(
          400,
          "Pls include date. Like?:book room No 1 2 march to 10 march"
        );
      }

      const confirmation = {
        confirmation:"bookingCofirmation",
        checkIn,
        checkOut,
        roomNo,
        tool:intent
      }

      return res
        .status(200)
        .json(new ApiResponce(200,confirmation , "create booking success"));
    }

    if (intent === "cancel_booking") {
      if (!bookingId) {
        throw new ApiError(404,"pls include bookinId like?: cancel booking <bookingId>")
      }

      const booking = await getBookingById(bookingId)
      const confirmation = {
        confirmation: "cancelConfirmation",
        booking,
        tool:intent
      }

       return res
        .status(200)
        .json(new ApiResponce(200, confirmation, "Confirm Cancel Booking"));
    }
  }
  

  if (data.confirmation) {
    if (data.tool === "make_booking") {
      const values = {
        user,
        roomNo:data.roomNo,
        checkIn:data.checkIn,
        checkOut: data.checkOut
      }

      const booking = await roomBooking(values)

      return res
        .status(200)
        .json(new ApiResponce(200, booking, "Booked Successfully"));
    }

    if (data.tool === "cancel_booking") {

      const values = {
        bookingId:data.booking._id,
        user
      }
      const canceled = await cancelBooking(values)

      return res
        .status(200)
        .json(new ApiResponce(200, canceled, "booking Canceled"));
    }
  }
});

export { chatBot };
