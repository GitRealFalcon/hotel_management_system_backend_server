import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const generateRefreshTokenAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating acceess and refresh Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  let { fullName, password, email, phone, address, city, state, pincode, dob,isAdmin } =
    req.body;

  if (
    [fullName, password, email, phone, address, city, state, pincode, dob].some(
      (field) => !field?.trim()
    )
  ) {
    throw new ApiError(400, "All fields required");
  }

  dob = new Date(dob)

  const isExist = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (isExist) {
    throw new ApiError(401, "user with email or phone already exist");
  }

  const newUser = await User.create({
    fullName,
    email,
    phone,
    address,
    state,
    city,
    pincode,
    password,
    dob,
    isAdmin
  });

  const user = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(500, "Something went wrong registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponce(201, user, "User created successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  let { password, email, phone } = req.body;

  if (!(phone?.trim() || email?.trim()) || !password?.trim()) {
    throw new ApiError(400, "all fields required");
  }

  const userExist = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (!userExist) {
    throw new ApiError(404, "user not found");
  }

  const validPassword = await userExist.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "password incorrect");
  }

  const { accessToken, refreshToken } = await generateRefreshTokenAndAccessToken(userExist._id);

  const loggedInUser = await User.findById(userExist._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
      new ApiResponce(
        200,
        { userData: loggedInUser, accessToken, refreshToken },
        "Successfully loggedIn"
      )
    );
});
const getUserDetails = asyncHandler(async (req,res)=>{
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "userId required")
  }

  const userDetails = await User.aggregate([
    {
      $match:{_id : userId}
    },
  {
    $lookup:{
      from:"bookings",
      foreignField:"customer",
      localField: "_id",
      as:"Bookings"
    }
  },{
    $addFields:{
      fullAddress:{
        $concat : [
          "$address", ", ",
          "$city", ", ",
          "$state", " - ",
          "$pincode"
        ]
      },
     
    }
  },
  {
    $project:{
      fullName:1,
      email:1,
      phone:1,
      dob:1,
      fullAddress:1,
      bookingHistory:1,
      isAdmin:1,
      Bookings:1

    }
  }
  ])

  if (!userDetails) {
    throw new ApiError(404,"User Not Found")
  }

  return res
  .status(200)
  .json(new ApiResponce(200,userDetails[0],"fetched successfully user details"))
})

const changePassword = asyncHandler(async (req,res)=>{
  const {oldPassword, newPassword} = req.body
  const userId = req.user?._id;

  if (!oldPassword?.trim() || !newPassword?.trim()) {
    throw new ApiError(400, "old and new password required")
  }

  const user = await User.findById(
    userId
  )

  if (!user) {
    throw new ApiError(404,"user not found")
  }

  const correctPassword = await user.isPasswordCorrect(oldPassword)

  if (!correctPassword) {
    throw new ApiError(401,"Password incorrect")
  }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(new ApiResponce(200,{},"password changed successfully"))
})

const updateUserDetails = asyncHandler(async (req,res)=>{
  const {fullName,email,dob,address,city,state,pincode} = req.body
  const userId = req.user?._id;
  if (dob?.trim()) {
    dob = new Date(dob)
  }

  const updatedUser = await User.findByIdAndUpdate({"_id":userId},{
    fullName,
    email,
    dob,
    address,
    city,
    state,
    pincode
  },{new:true})

  if (!updatedUser) {
    throw new ApiError(500,"something went wrong while updating details")
  }

  return res
  .status(200)
  .json(new ApiResponce(200,updatedUser,"user details update successfully"))
})

export { registerUser, userLogin , getUserDetails, changePassword,updateUserDetails};
 