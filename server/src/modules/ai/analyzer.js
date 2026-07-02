const analyzeConversation = (messages) => {
  if (messages.length === 0) {
    return {
      action: "START",
    };
  }

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.speaker === "USER");

  if (!lastUserMessage) {
    return {
      action: "START",
    };
  }

  const answer = lastUserMessage.content.trim();

  if (answer.split(" ").length < 12) {
    return {
      action: "FOLLOW_UP",
    };
  }

  return {
    action: "NEXT",
  };
};

module.exports = {
  analyzeConversation,
};