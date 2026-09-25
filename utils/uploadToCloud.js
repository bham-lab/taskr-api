import cloudinary from "../config/cloudinary.js"




export const uploadToCloud = (buffer, options={} ) => {
    return new Promise((resolve, reject) => {


        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "avatars",
                transformation: [
                    {width: 400, height: 400, crop: "fill" ,gravity: "face"},
                    {quality: "auto", fetch_format: "auto"}
                ],
                ...options
            },
            (error, result) => {
                if (error) reject(error)
                 else  resolve(result)
                }
        )

        stream.end(buffer)
    })
}

export const deleteFromCloud= async (publicId) => {
if(!publicId) 
    return
        await  cloudinary.deleteFromCloud(updateID)
}