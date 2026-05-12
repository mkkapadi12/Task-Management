import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "./task.schema.js";
import {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTask,
  deleteTask,
} from "./task.controller.js";

const router = Router();

// All routes require authentication
router.use(protect);

// My tasks across all projects
router.get("/my-tasks", getMyTasks);

// Project-scoped task routes
router.post("/project/:projectId", validate(createTaskSchema), createTask);
router.get("/project/:projectId", getProjectTasks);

// Individual task routes
router.get("/:taskId", getTask);
router.patch("/:taskId", validate(updateTaskSchema), updateTask);
router.delete("/:taskId", deleteTask);

export default router;
