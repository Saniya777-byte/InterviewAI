const prisma = require("../../lib/prisma");

const {
  createInterview,
  findInterviewById,
  createMessage,
  getMessages,
  endInterview,
  getUserInterviews,
} = require("./interview.repository");

const {
  runInterviewGraph,
} = require("../ai/langgraph.service");

const startInterview = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  const userName = user?.name || "Candidate";

  const session = await createInterview(userId);

  const firstQuestion = `Hello ${userName}, welcome to your AI mock interview. My name is Claire and I'll be your AI interviewer today. I'll ask you a series of technical questions based on your responses. Please answer naturally, just as you would in a real interview. Whenever you're ready, let's begin. To start, could you please introduce yourself?`;

  await createMessage({
    sessionId: session.id,
    speaker: "AI",
    content: firstQuestion,
  });

  return {
    session,
    firstMessage: firstQuestion,
  };
};

const sendMessage = async ({
  sessionId,
  content,
}) => {
  const session = await findInterviewById(sessionId);

  if (!session) {
    throw new Error("Interview session not found");
  }

  await createMessage({
    sessionId,
    speaker: "USER",
    content,
  });

  const conversation = await getMessages(sessionId);

  const { response, action } = await runInterviewGraph(
    conversation
  );

  await createMessage({
    sessionId,
    speaker: "AI",
    content: response,
  });

  const isCompleted = action === "END";

  if (isCompleted) {
    await prisma.interviewSession.update({
      where: {
        id: sessionId,
      },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
      },
    });
  }

  return {
    aiResponse: response,
    isCompleted,
  };
};

const finishInterview = async (sessionId) => {
  const session = await findInterviewById(sessionId);

  if (!session) {
    throw new Error("Interview session not found");
  }

  return await endInterview(sessionId);
};

const getInterview = async (sessionId) => {
  const session = await findInterviewById(sessionId);

  if (!session) {
    throw new Error("Interview session not found");
  }

  return session;
};

const getUserInterviewsList = async (userId) => {
  return await getUserInterviews(userId);
};

module.exports = {
  startInterview,
  sendMessage,
  finishInterview,
  getInterview,
  getUserInterviewsList,
};