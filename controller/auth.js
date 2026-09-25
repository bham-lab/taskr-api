import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError.js"
import { passwordResetEmail, welcomeEmail } from "../utils/email_tamplate.js"
import { sendEmail } from "../config/email.js"
import crypto from "crypto"
import prisma from "../config/prisma.js"

const signToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )


const SAFE_USER = { id: true, name: true, email: true, avatar: true, createdAt: true }


export const registerUser = async (req, res, next) => {

  try {
    const { email, password, name } = req.body



    const existing = await prisma.user.findUnique({
      where: { email: email },

    })

    if (existing) {
      throw new AppError("This user is already exist", 409)

    }

    const hashPassword = await bcrypt.hash(password, 12)


    const newUser = await prisma.user.create({

      data: { name, email, password: hashPassword },
      select: SAFE_USER
    })



    const token = signToken(newUser)
    try {
      await sendEmail({ to: email, ...welcomeEmail(name) })
    } catch (emailErr) {
      console.error("Welcome email failed:", emailErr.message)
    }

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { newUser }
    })

  } catch (err) {
    next(err)
  }

}



export const userLogin = async (req, res, next) => {

  try {

    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true, password: true }
    })



    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid credential", 401)

    }

    const token = signToken(user)
    const { password: _, ...safeUser } = user;
    res.status(200).json({
      message: "login successfully",
      token,
      user: safeUser
    })

  } catch (err) {
    next(err)
  }

}



export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: SAFE_USER })

    if (!user) throw new AppError("User not found", 404)

    res.status(200).json({
      user: user
    })
  } catch (err) { next(err) }

}



export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: SAFE_USER
    })


    const genericRes = { message: "If this email exists, a reset link was sent" }
    if (!user) return res.json(genericRes)



    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    const expire = new Date(Date.now() + 10 * 60 * 1000)
    await prisma.user.update({
      where: { email: email },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpire: expire
      }
    })


    const url = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    try {
      await sendEmail({
        to: user.email,
        ...passwordResetEmail({ name: user.name, url })
      })
    } catch (err) {
      throw new AppError(err.message, 500)
    }
    res.json(genericRes)
  } catch (err) { next(err) }
}





export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params
    const { password } = req.body

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")


    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpire: { gte: new Date() }
      },
      select: SAFE_USER

    })


    if (!user) throw new AppError("Token is invalid or expired", 400)


    const hashedPassword = await bcrypt.hash(password, 12)


    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpire: null,

      }
    })



    const token = signToken(user)
    res.json({ message: "Password reset successfully", token })
  } catch (err) {
    next(err)
  }
}
