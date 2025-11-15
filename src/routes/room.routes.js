import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addRoom,getAllRooms,getRoomDeatils,updateRoomDetails,getAvailableRooms } from "../controllers/room.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const roomRouter = Router()

roomRouter.route("/all-rooms").get(getAllRooms)
roomRouter.route("/get-room").get(getRoomDeatils)
roomRouter.route("/add-room").post(verifyJWT,upload.single("image"),addRoom);
roomRouter.route("/update-details").patch(verifyJWT,updateRoomDetails);
roomRouter.route("/available-room").get(getAvailableRooms)

export {roomRouter}