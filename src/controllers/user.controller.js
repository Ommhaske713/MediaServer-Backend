import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave : false });

      return {accessToken,refreshToken};
   
   } catch (error) {
      throw new ApiError(500,"Something went wrong thile generating refresh and access tokens")
   }
}

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
   // console.log(email)
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
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
      coverImageLocalPath = req.files.coverImage[0].path;
   }
   
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
      throw new ApiError(500,"Something went wrong while registering the user");
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

const loginUser = asyncHandler(async (req,res) => {

   const {email,username,password} = req.body

   if (!(username || email)) {
      throw new ApiError(400,"username or email required");
   }

   const user = await User.findOne({      // maximum time when we access the User we gave name to constant as user
      $or:[{username},{email}]
   });

   if (!user) {
      throw new ApiError(404,"User does not exist");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);
   if (!isPasswordValid) {
     throw new ApiError(401,"invalid  password ");
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options = {
      httpOnly:true,
      secure:true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken , options)
   .cookie("refreshToken", refreshToken , options)
   .json(
      new ApiResponse(200,{user :loggedInUser,accessToken,refreshToken}," User logged in successfully ")
   )
});

const logoutUser = asyncHandler(async (req,res) => {
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset:{
            refreshToken:1
         }
         
      },
      {
         new:true
      }
   )
   const options = {
      httpOnly:true,
      secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{}," User logged out "))

})

