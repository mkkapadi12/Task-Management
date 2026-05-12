import TaskService from "./task.service.js";

const createTask = async (req, res, next) => {
  try {
    const task = await TaskService.create(
      Number(req.params.projectId),
      req.user.id,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const tasks = await TaskService.findAllByProject(
      Number(req.params.projectId),
      req.user.id,
      req.query,
    );
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await TaskService.findMyTasks(req.user.id);
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await TaskService.findById(
      Number(req.params.taskId),
      req.user.id,
    );
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.update(
      Number(req.params.taskId),
      req.user.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await TaskService.delete(
      Number(req.params.taskId),
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

export {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTask,
  deleteTask,
};
