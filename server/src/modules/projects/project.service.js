import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.middleware.js";

// Helper: check if a user is a member of a project and return their role
const getMembership = async (projectId, userId) => {
  return prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
};

// Helper: require membership, throw 403 if not a member
const requireMembership = async (projectId, userId) => {
  const membership = await getMembership(projectId, userId);
  if (!membership) {
    throw new AppError("You are not a member of this project", 403);
  }
  return membership;
};

// Helper: require owner or admin role
const requireAdminOrOwner = async (projectId, userId) => {
  const membership = await requireMembership(projectId, userId);
  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new AppError(
      "Only project owner or admin can perform this action",
      403,
    );
  }
  return membership;
};

const ProjectService = {
  // Create a new project and add the creator as OWNER member
  create: async (ownerId, data) => {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: "OWNER",
          },
        },
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        _count: { select: { tasks: true } },
      },
    });
    return project;
  },

  // Get all projects where the user is a member
  findAll: async (userId) => {
    const projects = await prisma.project.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        _count: { select: { members: true, tasks: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return projects;
  },

  // Get a single project by ID (verify membership)
  findById: async (projectId, userId) => {
    await requireMembership(projectId, userId);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true, avatar: true },
            },
            creator: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { members: true, tasks: true } },
      },
    });

    if (!project) throw new AppError("Project not found", 404);
    return project;
  },

  // Update a project (owner or admin only)
  update: async (projectId, userId, data) => {
    await requireAdminOrOwner(projectId, userId);

    const project = await prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        _count: { select: { members: true, tasks: true } },
      },
    });
    return project;
  },

  // Delete a project (owner only)
  delete: async (projectId, userId) => {
    const membership = await requireMembership(projectId, userId);
    if (membership.role !== "OWNER") {
      throw new AppError("Only the project owner can delete the project", 403);
    }

    await prisma.project.delete({ where: { id: projectId } });
    return { message: "Project deleted successfully" };
  },

  // Get all members of a project
  getMembers: async (projectId, userId) => {
    await requireMembership(projectId, userId);

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { joinedAt: "asc" },
    });
    return members;
  },

  // Add a member to a project (owner or admin only)
  addMember: async (projectId, requesterId, { userId, role }) => {
    await requireAdminOrOwner(projectId, requesterId);

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new AppError("User not found", 404);

    // Check if already a member
    const existing = await getMembership(projectId, userId);
    if (existing)
      throw new AppError("User is already a member of this project", 409);

    const member = await prisma.projectMember.create({
      data: { projectId, userId, role: role || "MEMBER" },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });
    return member;
  },

  // Remove a member from a project (owner or admin only)
  removeMember: async (projectId, requesterId, targetUserId) => {
    await requireAdminOrOwner(projectId, requesterId);

    const targetMembership = await getMembership(projectId, targetUserId);
    if (!targetMembership)
      throw new AppError("User is not a member of this project", 404);

    // Cannot remove the owner
    if (targetMembership.role === "OWNER") {
      throw new AppError("Cannot remove the project owner", 403);
    }

    // Admins cannot remove other admins — only owner can
    const requesterMembership = await getMembership(projectId, requesterId);
    if (
      requesterMembership.role === "ADMIN" &&
      targetMembership.role === "ADMIN"
    ) {
      throw new AppError("Admins cannot remove other admins", 403);
    }

    // Unassign the removed member from any tasks in this project
    await prisma.task.updateMany({
      where: { projectId, assigneeId: targetUserId },
      data: { assigneeId: null },
    });

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });

    return { message: "Member removed successfully" };
  },

  // Update a member's role (owner only)
  updateMemberRole: async (projectId, requesterId, targetUserId, role) => {
    const requesterMembership = await requireMembership(projectId, requesterId);
    if (requesterMembership.role !== "OWNER") {
      throw new AppError("Only the project owner can change member roles", 403);
    }

    const targetMembership = await getMembership(projectId, targetUserId);
    if (!targetMembership)
      throw new AppError("User is not a member of this project", 404);

    if (targetMembership.role === "OWNER") {
      throw new AppError("Cannot change the owner's role", 403);
    }

    const updated = await prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId: targetUserId } },
      data: { role },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });
    return updated;
  },
};

export default ProjectService;
