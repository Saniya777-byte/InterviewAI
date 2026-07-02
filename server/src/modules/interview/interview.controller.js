const {startInterview,sendMessage,finishInterview,getInterview,getUserInterviewsList} = require("./interview.service");
const {startInterviewSchema,messageSchema, endInterviewSchema,} = require("./interview.validation");

const start = async (req, res, next) => {
  try {
    startInterviewSchema.parse(req.body);

    const result = await startInterview(req.user.userId);

    res.status(201).json({
      success: true,
      message: "Interview started successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const message = async (req, res, next) => {
  try {
    const validatedData = messageSchema.parse(req.body);

    const result = await sendMessage(validatedData);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const end = async (req, res, next) => {
  try {
    const { sessionId } = endInterviewSchema.parse(req.body);

    const result = await finishInterview(sessionId);

    res.status(200).json({
      success: true,
      message: "Interview ended successfully",
      session: result,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const result = await getInterview(req.params.id);

    res.status(200).json({
      success: true,
      interview: result,
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const result = await getUserInterviewsList(req.user.userId);

    res.status(200).json({
      success: true,
      interviews: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  start,
  message,
  end,
  getById,
  getHistory,
};