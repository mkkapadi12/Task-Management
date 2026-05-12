import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.middleware.js";

// Helper: verify user is a member of the project
const requireProjectMembership = async (projectId, userId) => {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!membership) {
    throw new AppError("You are not a member of this project", 403);
  }
  return membership;
};

// Helper: verify assignee is a member of the project
const verifyAssigneeMembership = async (projectId, assigneeId) => {
  if (assigneeId === null || assigneeId === undefined) return;

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: assigneeId } },
  });
  if (!membership) {
    throw new AppError("Assignee is not a member of this project", 400);
  }
};

// Shared select for user fields
const userSelect = { id: true, name: true, email: true, avatar: true };

const TaskService = {
  // Create a task in a project
  create: async (projectId, creatorId, data) => {
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new AppError("Project not found", 404);

    // Verify creator is a member
    await requireProjectMembership(projectId, creatorId);

    // If assigneeId provided, verify assignee is a project member
    if (data.assigneeId) {
      await verifyAssigneeMembership(projectId, data.assigneeId);
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        priority: data.priority || "MEDIUM",
        deadline: data.deadline ? new Date(data.deadline) : null,
        projectId,
        creatorId,
        assigneeId: data.assigneeId || null,
      },
      include: {
        assignee: { select: userSelect },
        creator: { select: userSelect },
        project: { select: { id: true, title: true } },
      },
    });
    return task;
  },

  // Get all tasks for a project (with optional filters)
  findAllByProject: async (projectId, userId, filters = {}) => {
    // Verify membership
    await requireProjectMembership(projectId, userId);

    const where = { projectId };

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assigneeId) where.assigneeId = Number(filters.assigneeId);

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: userSelect },
        creator: { select: userSelect },
      },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    });
    return tasks;
  },

  // Get all tasks assigned to the current user across all projects
  findMyTasks: async (userId) => {
    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      include: {
        project: { select: { id: true, title: true, status: true } },
        creator: { select: userSelect },
      },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    });
    return tasks;
  },

  // Get a single task by ID
  findById: async (taskId, userId) => {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: { select: userSelect },
        creator: { select: userSelect },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            owner: { select: userSelect },
          },
        },
      },
    });

    if (!task) throw new AppError("Task not found", 404);

    // Verify the requesting user is a member of the task's project
    await requireProjectMembership(task.projectId, userId);

    return task;
  },

  // Update a task
  update: async (taskId, userId, data) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    // Verify membership
    await requireProjectMembership(task.projectId, userId);

    // If assigneeId is being changed, verify new assignee is a project member
    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      await verifyAssigneeMembership(task.projectId, data.assigneeId);
    }

    // Build update data
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.deadline !== undefined) {
      updateData.deadline = data.deadline ? new Date(data.deadline) : null;
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: { select: userSelect },
        creator: { select: userSelect },
        project: { select: { id: true, title: true } },
      },
    });
    return updated;
  },

  // Delete a task (creator, project owner, or project admin)
  delete: async (taskId, userId) => {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new AppError("Task not found", 404);

    const membership = await requireProjectMembership(task.projectId, userId);

    // Allow deletion by: task creator, project owner, or project admin
    const isCreator = task.creatorId === userId;
    const isOwnerOrAdmin =
      membership.role === "OWNER" || membership.role === "ADMIN";

    if (!isCreator && !isOwnerOrAdmin) {
      throw new AppError(
        "Only the task creator, project owner, or admin can delete this task",
        403,
      );
    }

    await prisma.task.delete({ where: { id: taskId } });
    return { message: "Task deleted successfully" };
  },
};

export default TaskService;
