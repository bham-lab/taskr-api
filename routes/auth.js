import { userLogin, registerUser, forgetPassword, resetPassword, getMe } from "../controller/auth.js";
import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { REGISTER_SCHEMA, LOGIN_SCHEMA } from "../schemas/index.js";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";






const router = Router()


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Too many attempt - try aganin in 15 minutes" },
    skipSuccessfulRequests: true,
})


router.use(authLimiter)

router.post("/register", validate(REGISTER_SCHEMA), registerUser)
router.post("/login", validate(LOGIN_SCHEMA), userLogin)
router.post("/forgetpassword", forgetPassword)
router.post("/resetpasword/:resetToken", resetPassword)
router.get("/me", requireAuth, getMe)

export default router
