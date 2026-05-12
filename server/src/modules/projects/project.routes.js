import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} from "./project.schema.js";
import {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getMembers,
  addMember,
  updateMemberRole,
  removeMember,
} from "./project.controller.js";

const router = Router();

// All routes require authentication
router.use(protect);

// Project CRUD
router.post("/", validate(createProjectSchema), createProject);
router.get("/", getAllProjects);
router.get("/:projectId", getProject);
router.patch("/:projectId", validate(updateProjectSchema), updateProject);
router.delete("/:projectId", deleteProject);

// Project members
router.get("/:projectId/members", getMembers);
router.post("/:projectId/members", validate(addMemberSchema), addMember);
router.patch("/:projectId/members/:userId", validate(updateMemberRoleSchema), updateMemberRole);
router.delete("/:projectId/members/:userId", removeMember);

export default router;
