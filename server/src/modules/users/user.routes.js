import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { getProfile } from "./user.controller.js";

const router = Router();

router.get("/profile", protect, getProfile);

// router.post("/profile", protect, updateProfile);

export default router;
