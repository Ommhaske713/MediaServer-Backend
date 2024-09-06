import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { ApiError } from './ApiError';

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
        // console.log(resposne);
        // console.log("The file has been successfully uploaded on ",resposne.url);
        fs.unlinkSync(localFilePath);
        return resposne;

    } catch (error) {
        fs.unlinkSync(localFilePath)       // remove the locally saved file when the operation is failed 
        return null;
    }
}
const deleteFromCloudinary = async(imageUrl)=>{
    try {
        
        // Extract the public ID from the image URL.
        // 1. split('/') - Splits the URL into an array by the '/' character.
        //    Example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' becomes
        //    ['https:', '', 'res.cloudinary.com', 'demo', 'image', 'upload', 'sample.jpg']
        // 2. pop() - Retrieves the last element of the array, which is the file name with extension.
        //    Example: 'sample.jpg'
        // 3. split('.') - Splits the file name by '.' to separate the name from the extension.
        //    Example: 'sample.jpg' becomes ['sample', 'jpg']
        // 4. [0] - Retrieves the first part of the split result, which is the public ID.
        //    Example: 'sample'
        // This public ID ('sample') is used to delete the image from Cloudinary.

    const publicId = imageUrl.split('/').pop().split('.')[0];

    await cloudinary.uploader.destroy(publicId);

    } catch (error) {
        throw new ApiError(500," Error while deleting the file ")
    }
}
export {uploadOnCloudinary,deleteFromCloudinary}