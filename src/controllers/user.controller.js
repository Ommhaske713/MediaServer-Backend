import {asyncHandler} from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req,res) =>{
   // get user details from the frontend 
   // check for validation -no empty field 
   // check if user is already registered or not
   // check for images or check for avatar 
   // upload it on the cloudinary 
   // create a user object -create entry in db
   // remove the password and remove the token field from response 
   //return res
});

export {registerUser};
