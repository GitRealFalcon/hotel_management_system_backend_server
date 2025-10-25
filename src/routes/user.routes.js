import { Router } from "express";
import { changePassword, getUserDetails, registerUser, updateUserDetails, userLogin } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(userLogin)
userRouter.route("/get-user-details").get(verifyJWT,getUserDetails)
userRouter.route("/change-password").patch(verifyJWT,changePassword)
userRouter.route("/update-details").patch(verifyJWT,updateUserDetails)

export {userRouter}