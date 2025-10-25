import JWT from "jsonwebtoken"
import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

export const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Athorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401,"unathorized request")
        }

        const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(401,"Invalid access token")
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401,"invalid access token")
        }

        req.user = user
        next()
        
    } catch (error) {
        throw new ApiError(401,error.message,"Invalid access token")
    }
}) 