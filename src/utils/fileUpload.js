import { v2 as cloudinary } from 'cloudinary';

import fs from "fs";

    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET  
    });
    


const uploadOnCloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath) return console.log("Could not find file path ");
        // upload the file on cloudinary 
        const resposne = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
        console.log(resposne);
        console.log("The file has been successfully uploaded on ",resposne.url);
        return resposne;

    } catch (error) {
        fs.unlinkSync(localFilePath)       // remove the locally saved file when the operation is failed 
        return null;
    }
}
export {uploadOnCloudinary}