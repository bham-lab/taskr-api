import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER || "dss984584@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "tksi vgry xjsb mzco"
    }
});


export const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
    })
}


export default transporter
