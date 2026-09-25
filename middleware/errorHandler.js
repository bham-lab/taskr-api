




export const errorHandler = (err, req, res, next) => {

    const isDev = process.env.NODE_ENV === "development"
    console.error(err)
    if (err.isOperational) {
        return res.status(err.statusCode).json({ error: err.message })
    }

    if (err.name === "ZodError") {
        return res.status(422).json({
            error: "validation failed",
            errors: err.issues.map(i => ({
                field: i.path.join("."),
                message: i.message
            }))
        })
    }


    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid Token" })
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" })
    }

    console.log("UNHANDLED ERROR:", err)
    res.status(500).json({ error: "Server error", ...err(isDev && { stack: err.stack }) })
}
