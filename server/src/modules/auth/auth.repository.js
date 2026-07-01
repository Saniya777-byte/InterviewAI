const prisma = require("../../lib/prisma");

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};