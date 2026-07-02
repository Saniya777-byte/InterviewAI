const prisma = require("../../lib/prisma");


const createInterview = async (userId) => {
  return await prisma.interviewSession.create({
    data: {
      userId,
    },
  });
};


const findInterviewById = async (id) => {
  return await prisma.interviewSession.findUnique({
    where: {
      id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


const createMessage = async ({
  sessionId,
  speaker,
  content,
}) => {
  return await prisma.message.create({
    data: {
      sessionId,
      speaker,
      content,
    },
  });
};


const getMessages = async (sessionId) => {
  return await prisma.message.findMany({
    where: {
      sessionId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};


const endInterview = async (sessionId) => {
  return await prisma.interviewSession.update({
    where: {
      id: sessionId,
    },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
    },
  });
};

const getUserInterviews = async (userId) => {
  return await prisma.interviewSession.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

module.exports = {
  createInterview,
  findInterviewById,
  createMessage,
  getMessages,
  endInterview,
  getUserInterviews,
};