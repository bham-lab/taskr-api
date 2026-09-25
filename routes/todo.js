
import { Router } from "express";
import { createTodo, deleteTodo, getAllTodo, getStatus, getTodoById, updateTodo } from "../controller/todo.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { TODO_SCHEMA, UPDATE_SCHEMA } from "../schemas/index.js";




const router = Router()


router.use(requireAuth)

router.get("/", getAllTodo)
router.get("/stats", getStatus)
router.get("/:id", getTodoById)
router.post("/", validate(TODO_SCHEMA), createTodo)
router.patch("/:id", validate(UPDATE_SCHEMA), updateTodo)
router.delete("/:id", deleteTodo)


export default router
