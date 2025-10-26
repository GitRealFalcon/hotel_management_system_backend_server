import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Room } from "../models/room.model.js";
import { cloudinaryUpload } from "../cloudinary.js";
import {User} from "../models/user.model.js"
import mongoose from "mongoose";

const addRoom = asyncHandler(async (req, res) => {
  let { roomNo, price, description, capacity, type } = req.body;
  const userId = req.user?._id;
  const imageLocalPath = req.file?.path;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(401,"invalid userId")
  }
  const user = await User.findById(userId)
  if (!user) {
    throw new ApiError(404,"User not found")
  }

  if (user.isAdmin !== true) {
    throw new ApiError(401,"access denied")
  }

  if ( [roomNo, price, description, capacity, type].some((field) => !field?.toString().trim())) {
    throw new ApiError(400, "All fields required");
  }

  roomNo = Number(roomNo);
  price = Number(price)

  const isExist = await Room.findOne({
    roomNo
  })

  if (isExist) {
    throw new ApiError(400,"Room No already exist")
  }

  let cloudinaryPath;
  if (imageLocalPath) {
    cloudinaryPath = await cloudinaryUpload(imageLocalPath);
    if (!cloudinaryPath) {
      throw new ApiError(500, "cloudinary upload error");
    }
  }

  const newRoom = await Room.create({
    roomNo,
    price,
    description,
    capacity,
    type,
    image:[
      {
        secure_url: cloudinaryPath?.secure_url,
        public_id: cloudinaryPath?.public_id,
      },
    ] || "",
  })

  if (!newRoom) {
    throw new ApiError(500,"something went wrong while creating room")
  }

  return res
  .status(200)
  .json(new ApiResponce(200,newRoom, "Room created successfully"))

});

const getRoomDeatils = asyncHandler(async (req,res)=>{
    let {roomNo} = req.body

    if (!roomNo) {
        throw new ApiError(400,"Room No required")
    }
    roomNo = Number(roomNo)

    const room = await Room.findOne({
        roomNo
    })

    if (!room) {
        throw new ApiError(404,"Room not found")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,room,"successfully fetched room"))
})
const getAllRooms = asyncHandler(async (req,res)=>{
    const rooms = await Room.find();

    if (!rooms || rooms.length === 0) {
        throw new ApiError(404, "Room not found")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,rooms,"Rooms fetched successfully"))
})

const updateRoomDetails = asyncHandler(async (req,res)=>{
    let {roomNo, price, description, capacity, type } = req.body;
    const userId = req.user?._id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(401,"Invalid userId")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404,"User Not Found")
    }

    if (user.isAdmin !== true) {
        throw new ApiError(401,"access denied")
    }

    if (price) {
       price = Number(price) 
    }

    const updatedRoom = await Room.findOneAndUpdate(
        {roomNo},
        {
           price,
           description,
           capacity,
           type 
        },
        {new: true ,runValidators: true}
    )

    if (!updatedRoom) {
        throw new ApiError(500,"something went wrong while update room details")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,updatedRoom,"room update successfully"))
})

export {addRoom,getRoomDeatils,getAllRooms,updateRoomDetails};
