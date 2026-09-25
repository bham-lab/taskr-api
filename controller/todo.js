import { AppError } from "../utils/AppError.js"
import prisma from "../config/prisma.js"
import { io } from "../server.js"




export const getAllTodo = async (req, res, next) => {
    try {
        const { text, completed } = req.query

        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10))
        const offset = (page - 1) * limit



        const where = {
            userId: req.user.id,
            ...(text && { text: { contains: text, mode: "insensitive" } }),
            ...(completed !== undefined && { completed: completed === "true" })
        }



        const [todosResult, total] = await Promise.all([
            prisma.todo.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset
            }),
            prisma.todo.count({
                where
            })
        ])


        const totalPage = Math.ceil(total / limit)

        return res.status(200).json({
            todos: todosResult,

            pagination: {
                page,
                limit,
                total,
                totalPage,
                hasNext: page < totalPage,
                hasPrev: page > 1
            }
        })

    } catch (err) {
        next(err)
    }
}

export const getTodoById = async (req, res, next) => {
    try {
        const todo = await prisma.todo.findUnique({
            where: { id: Number(req.body.id), userId: req.user.id },

        })


        if (!todo) {
            throw new AppError("Todo not found", 404)

        }

        res.status(200).json({ todos: todo })

    } catch (err) {
        next(err)

    }
}




export const createTodo = async (req, res, next) => {
    try {
        const { text } = req.body


        const todo = await prisma.todo.create({
            data: { userId: req.user.id, text: text, completed: false },

        })



        io.to(`user:${req.user.id}`).emit("todo:created", todo)
        io.to(`user-${req.user.id}`).emit("notification:new_todo", todo)

        
        res.status(201).json({ message: "New todo added successfully", todo })

    } catch (err) {

        next(err)
    }
}




export const updateTodo = async (req, res, next) => {

    try {
        const { text, completed } = req.body
        const id = Number(req.params.id)



        const result = await prisma.todo.updateMany({
            where: { id: id, userId: req.user.id },
            data: {
                ...(text !== undefined && { text }),
                ...(completed !== undefined && { completed })
            }
        })



        if (result.count == 0) {
            throw new AppError("Todo  not found", 404)
        }

        const todo = await prisma.todo.findUnique({
            where: { id: id, }
        })

        res.status(200).json({ message: "Updated successfully", todo: todo })
        io.to(`user:${req.user.id}`).emit("todo:updated", todo)
    } catch (err) {
        next(err)
    }
}


export const deleteTodo = async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        const { count } = await prisma.todo.deleteMany({
            where: { id: id, userId: req.user.id },

        })

        if (count === 0) {
            throw new AppError("Todo not found", 404)
        }



        res.status(200).json({ message: "Deleted Successfully" })

        io.to(`user:${req.user.id}`).emit("todo:deleted", {
            id: id
        })
    } catch (err) {
        next(err)
    }
}




export const getStatus = async (req, res, next) => {
    try {


        const [total, completed, thisWeek] = await Promise.all([
            prisma.todo.count({
                where: { userId: req.user.id },

            }),
            prisma.todo.count({
                where: { userId: req.user.id, completed: true },

            }),
            prisma.todo.count({
                where: {
                    userId: req.user.id,
                    createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                },

            }),


        ])


        const pending = total - completed

        res.json({ stats: { total, completed, thisWeek, pending } })
    } catch (err) { next(err) }
}
