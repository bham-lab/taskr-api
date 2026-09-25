







export const logger = (req,res,next)=> {

    const start = new Date()
    console.log(`${req.method} ${req.url}`)

    res.on("finish", () => {
        const ms = new Date() - start
        console.log(`${res.statusCode} ${req.url} (${ms}ms)`)
    })
    next()
}




