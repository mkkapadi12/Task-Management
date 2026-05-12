import ProjectService from "./project.service.js";

const createProject = async (req, res, next) => {
  try {
    const project = await ProjectService.create(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await ProjectService.findAll(req.user.id);
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await ProjectService.findById(
      Number(req.params.projectId),
      req.user.id,
    );
    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await ProjectService.update(
      Number(req.params.projectId),
      req.user.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const result = await ProjectService.delete(
      Number(req.params.projectId),
      req.user.id,
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

const getMembers = async (req, res, next) => {
  try {
    const members = await ProjectService.getMembers(
      Number(req.params.projectId),
      req.user.id,
    );
    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const member = await ProjectService.addMember(
      Number(req.params.projectId),
      req.user.id,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: member,
    });
  } catch (err) {
    next(err);
  }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const member = await ProjectService.updateMemberRole(
      Number(req.params.projectId),
      req.user.id,
      Number(req.params.userId),
      req.body.role,
    );
    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: member,
    });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const result = await ProjectService.removeMember(
      Number(req.params.projectId),
      req.user.id,
      Number(req.params.userId),
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getMembers,
  addMember,
  updateMemberRole,
  removeMember,
};
