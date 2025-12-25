import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";

// ============ Register Controller =============
const register = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const result = await registerUserService({ email, password });
    
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    res.status(201).json({
      success: true,
      data: result,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ Login Controller =============
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService({ email, password });
    
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({
      success: true,
      data: result,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// ============ Logout Controller =============
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });
  
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export { register, login, logout };
