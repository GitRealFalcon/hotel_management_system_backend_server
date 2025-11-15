import { Router } from "express";
import { cancelBooking, checkIn, checkout, getBookingDetails, getBookings, newBooking } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const bookingRouter = Router()

bookingRouter.route("/get-booking").get(getBookingDetails)

bookingRouter.route("/new-booking").post(verifyJWT,newBooking)
bookingRouter.route("/cancel-booking").patch(verifyJWT,cancelBooking)
bookingRouter.route("/checkout").patch(verifyJWT,checkout)
bookingRouter.route("/checkin").patch(verifyJWT,checkIn)
bookingRouter.route("/get-bookings").get(verifyJWT,getBookings)

export {bookingRouter}