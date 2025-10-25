import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Room } from "../models/room.model.js";

const addRoom = asyncHandler(async (req,res)=>{
    let {roomNo,price,description,capacity,type,} = req.body;
    const userId = req.user?._id;
    
})

export {}