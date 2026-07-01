const {findUserByEmail, createUser,} = require("./auth.repository");
const {hashPassword, comparePassword,} = require("../../utils/hashPassword");
const generateToken = require("../../utils/generateToken");


const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({name, email, password: hashedPassword,});

  const token = generateToken(user.id);
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
};

return {
    user: safeUser,
    token,
};
};

const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id);

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
};

return {
    user: safeUser,
    token,
};
};

module.exports = {
  registerUser,
  loginUser,
};