import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "./post.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);

router.post(
  "/",
  protect,
  upload.single("coverImage"),
  validate(createPostSchema),
  createPost,
);

router.put(
  "/:id",
  protect,
  upload.single("coverImage"),
  validate(updatePostSchema),
  updatePost,
);
router.delete("/:id", protect, deletePost);

export default router;
