// import UserService from "./user.service.js";

const getProfile = (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await UserService.update({
      id: req.user.id,
      body: req.body,
      file: req.file,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export { getProfile, updateProfile };
