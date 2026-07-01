const {registerUser,loginUser,} = require("./auth.service");

const {registerSchema,loginSchema,} = require("./auth.validation");

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const result = await registerUser(validatedData);

    res.status(201).json({success: true, message: "User registered successfully",  ...result,});
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    res.status(200).json({success: true, message: "Login successful",...result,});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};