import { Router } from "express";
import { getProfile, uploadProfile } from "../controller/user.js";
import { upload } from "../middleware/upload.js";
import {requireAuth} from "../middleware/auth.js"

const router = Router()
router.use(requireAuth)
router.get("/profile", getProfile)
router.post("/avatar", upload.single("avatar"), uploadProfile)


export default router