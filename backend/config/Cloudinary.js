import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
     cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME, // Click 'View API Keys' above to copy your cloud name
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    try {
        if(!filePath) {
        return null
    }
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath); // Delete the file after upload
       return uploadResult.secure_url; // Return the secure URL of the uploaded image

        
    } catch (error) {
        fs.unlinkSync(filePath); // Delete the file in case of error
        console.log(error);
        
        
    }
    
    
}

export default uploadOnCloudinary;