import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import {AppError} from "../utils/AppError.js"

import { deleteFromCloud, uploadToCloud } from "../utils/uploadToCloud.js"


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB = path.join(__dirname, "../data/user.json")



const getFile = async () => {
    try{  
   const raw = await fs.readFile(DB , "utf-8")
   return JSON.parse(raw)
    } catch {
        return []
    }
}

const saveFile =  (users) => {
    fs.writeFile(DB,JSON.stringify(users,null,2))
}





export const getProfile = async (req,res,next) => {
 try{
   
      const userId = req.user.id
      const users = await getFile()
      const user = users.find(u => u.id === userId)

      if(!user) {
         throw new AppError("User not found" , 404 )
      } 
     const {password, ...safeUSer} = user
      res.status(200).json({user: safeUSer})
 }catch(err) {
    next(err)
 }

}

export const uploadProfile = async (req, res, next) => {
    try{
         if(!req.file){
        throw new AppError("No file uploaded", 400)
    }
       const users = await getFile()
       const idx = users.findIndex(u => u.id === req.user.id)
      if(idx === -1) throw new AppError("User not found", 404)

       if(users[idx].avatarPublicId) {
         await deleteFromCloud(users[idx].avatarPublicId)
       }


     const result = await uploadToCloud(req.file.buffer, {
        public_id: `user_${req.user.id}`,
        overwrite: true,
     })   

     users[idx].avatar = result.secure_url
    users[idx].avatarPublicId = result.public_id
  
    await saveFile(users)

    res.status(200).json({message: "Avatar uploaded successfully" , avatar : result.secure_url})
    }catch(err){
        next(err)
    }
}



export const deleteAvatar = async (req,res,next) => {
  try{
     const users = await getFile()
     const user = users.find(u=> u.id === req.user.id)
     if(!user) throw new AppError("No user found", 404)
      
    if(!user.avatarPublicId)   throw new AppError("No deleted avatar found", 404)


  }catch(err){

  }
}