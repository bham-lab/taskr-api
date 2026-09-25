import express from "express"
import auth from "./routes/auth.js"
import { logger } from "./middleware/logger.js"
import cors from "cors"
import "dotenv/config";
import todos from "./routes/todo.js"
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js"
import { AppError } from "./utils/AppError.js";
import rateLimit from "express-rate-limit";
import user from "./routes/user.js"


const app = express()
const port = process.env.PORT || 3000

const required = [
   "JWT_SECRET","JWT_EXPIRES_IN",
   "DATABASE_URL","CLIENT_URL",
   "EMAIL_HOST", "EMAIL_USER",
   "EMAIL_PASS", "CLOUDINARY_CLOUD_NAME",
   "CLOUDINARY_API_KEY","CLOUDINARY_API_SECRET"
]

const missing = required.filter(key => !process.env[key])

if(missing.length > 0) {
   console.error("Missing required environment variables:", missing)
   process.exit(1)
}


app.use(helmet())

const corsOptions = {
   origin: (origin, callback) => {
      const allowed = [
         process.env.CLIENT_URL,
         "http://localhost:5173",
      ].filter(Boolean)

      if(!origin || allowed.includes(origin)) {
         callback(null, true)
      }else {
         callback(new Error(`CORS blocked: ${origin}`))
      }
   },
   Credentials: true,
}


// {
//    origin: process.env.CLIENT_URL || "http://localhost:5173",
//    methods: ["GET", "POST", "PATCH", "DELETE"],
//    allowedHeaders: ["Content-Type", "Authorization"],
//    credentials: true,
// }

const apiLimiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: { error: "Too many attempts - please try again in 15 minutes" },
   standardHeaders: true,
   legacyHeaders: false
})



app.use(cors(corsOptions))
app.use(express.json())

app.use(apiLimiter)
app.use(logger)

app.use("/api/auth", auth)
app.use('/api/todo', todos)
app.use("/api/user", user)

app.use((req, res, next) => {
   next(new AppError("No route found", 404))
})




app.use(errorHandler)


export default app
