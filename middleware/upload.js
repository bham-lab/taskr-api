import multer from "multer";




export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB max — in bytes
  },

  fileFilter: (req, file, cb) => {
    // Only allow images
     console.log("File name:", file.originalname);
        console.log("MIME type:", file.mimetype);
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]

    if (allowed.includes(file.mimetype)) {
      cb(null, true)   // ← accept file
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"), false)
    }
  },
})