import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const cloudinaryUpload = async (localFilePath)=>{

    try {
        
        
        if (!localFilePath) return null;
        const result = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto"
            }
        )

        fs.unlinkSync(localFilePath)
        return result
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const cloudinaryDelete = async (publicId)=>{
    try {
        if (!publicId) return null;
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        return null
    }
}

export {cloudinaryUpload,cloudinaryDelete}