import asyncHandler from "../utils/asyncHandler.js";
import { ApiError, } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const chatBot = asyncHandler(async (req, res) => {
    const data = req.body

    if (data.text) {
        return res.status(200)
            .json(new ApiResponce(200, data.text, "in text"))
    }
    if (data.getValue) {
        if (data.tool === "make_booking") {

              return res.status(200)
            .json(new ApiResponce(200, data.tool, "in make_booking"))
        }
        if (data.tool === "active_booking_info") {

              return res.status(200)
            .json(new ApiResponce(200, data.tool, "in active_booking_info"))
        }
        if (data.tool === "cancel_booking") {
                return res.status(200)
            .json(new ApiResponce(200, data.tool, "in cancel_booking"))
        }
        if (data.tool === "check_availability") {
                return res.status(200)
            .json(new ApiResponce(200, data.tool, "in check_availability"))
        }

    }

    if (data.confirm) {
        if (data.tool === "make_booking") {
            return res.status(200)
                .json(new ApiResponce(200, data.tool, "confirmed make_booking"))
        }

        if (data.tool === "cancel_booking") {
            return res.status(200)
                .json(new ApiResponce(200, data.tool, "confirmed cancel_booking"))
        }
    }
})

export { chatBot }