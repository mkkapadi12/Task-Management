import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import postRoutes from "./modules/posts/post.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
