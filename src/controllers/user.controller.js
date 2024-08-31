import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req,res) =>{
   // get user details from the frontend 
   // check for validation -no empty field 
   // check if user is already registered or not
   // check for images or check for avatar 
   // upload it on the cloudinary 
   // create a user object -create entry in db
   // remove the password and remove the token field from response 
   //return res

   const {fullName,email,username,password} = req.body
   console.log(email)
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (fullName === "") {
      throw new ApiError(400,"fullName is required");
   }
   else if (email === "" || !emailRegex.test(email)) {
      throw new ApiError(400, "A valid email is required");
   }
   else if(username === ""){
      throw new ApiError(400,"username is required");
   }
   else if(password === ""){
      throw new ApiError(400,"password is required");
   }
   
   const existedUser = await User.findOne({
      $or: [{ email },{ username }]
   })

   if (existedUser) {
      throw new ApiError(409,"Users with email or username already exists");
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;
   
   if (!avatarLocalPath) {
      throw new ApiError(400,"Avatar file is required");
   }
   
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if (!avatar) {
      throw new ApiError(400,"Avatar file is required");
   }

  const user = await User.create({
      fullName,
      avatar :avatar.url,
      coverImage :coverImage?.url || "",
      email,
      password,
      username:username.toLowerCase()

   })
   const userCreated = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if (!userCreated) {
      throw new ApiError(500,"Something went wrong while registering the user")
   }

   return res.status(201).json(
      new ApiResponse(200,userCreated,"User Registered Sucessfully ")
   )
   // res.status(200).json({message:"All good, user can be registered "});
   // if (
   //    [username,email,password,fullName].some((field)=>field?.trim() ==="")
   // ) {
   //    throw new ApiError(400,"All fields are required")
   // }
   
});


export {registerUser};
