import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { ApiError } from "./utils/ApiError.js"

const App = express()

App.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin:"http://localhost:5173",
    credentials: true
}))
App.use(express.json({limit : "16kb"}))
App.use(express.urlencoded({
    extended:true,
    limit: "16kb"
}))
App.use(express.static("public"))
App.use(cookieParser())

import { userRouter } from "./routes/user.routes.js"
import { bookingRouter } from "./routes/booking.routes.js"
import { roomRouter } from "./routes/room.routes.js"
import { transactionRouter } from "./routes/transaction.routes.js"

App.use("/api/v1/users",userRouter)
App.use("/api/v1/bookings",bookingRouter)
App.use("/api/v1/rooms",roomRouter)
App.use("/api/v1/transections",transactionRouter)

App.use((err, req, res, next) => {
  

   if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  // ✅ Handle unexpected errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


export {App}