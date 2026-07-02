const { z } = require("zod");

const startInterviewSchema = z.object({});

const messageSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  content: z.string().min(1, "Message is required"),
});

const endInterviewSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

module.exports = {
  startInterviewSchema,
  messageSchema,
  endInterviewSchema,
};