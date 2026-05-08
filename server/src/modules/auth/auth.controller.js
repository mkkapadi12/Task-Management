import AuthService from "./auth.service.js";

const register = async (req, res, next) => {
  try {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

export { register, login };
