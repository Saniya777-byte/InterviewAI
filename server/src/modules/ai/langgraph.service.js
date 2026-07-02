const {
  StateGraph,
  START,
  END,
} = require("@langchain/langgraph");

const {
  analyzeInterviewState,
  generateInterviewResponse,
} = require("./groq.service");

const graph = new StateGraph({
  channels: {
    messages: {
      value: (_, value) => value,
      default: () => [],
    },
    currentTopic: {
      value: (_, value) => value,
      default: () => "Introduction",
    },
    topicsCompleted: {
      value: (_, value) => value,
      default: () => [],
    },
    followUpCount: {
      value: (_, value) => value,
      default: () => 0,
    },
    difficultyLevel: {
      value: (_, value) => value,
      default: () => "Mid",
    },
    candidatePerformance: {
      value: (_, value) => value,
      default: () => ({}),
    },
    action: {
      value: (_, value) => value,
      default: () => "NEXT",
    },
    classification: {
      value: (_, value) => value,
      default: () => "",
    },
    response: {
      value: (_, value) => value,
      default: () => "",
    },
  },
});

graph.addNode("analyze", async (state) => {
  const result = await analyzeInterviewState(state.messages);

  return {
    currentTopic: result.currentTopic,
    topicsCompleted: result.topicsCompleted,
    followUpCount: result.followUpCount,
    difficultyLevel: result.difficultyLevel,
    candidatePerformance: result.candidatePerformance,
    classification: result.classification,
    action: result.action,
  };
});

graph.addNode("clarification", async (state) => {
  const prompt = [
    ...state.messages,
    {
      speaker: "USER",
      content: `The candidate's last answer was evaluated as "${state.classification}". Ask one clarification or follow-up question to give them a chance to improve on the topic of "${state.currentTopic}". Acknowledge what they said briefly and raise a specific point for them to address. Keep it warm, human-like, and professional. Max 80 words.`,
    },
  ];

  const response = await generateInterviewResponse(prompt);

  return {
    response,
  };
});

graph.addNode("followUp", async (state) => {
  const prompt = [
    ...state.messages,
    {
      speaker: "USER",
      content: `The candidate's last answer was evaluated as "${state.classification}". Ask one follow-up question to dive deeper into the topic of "${state.currentTopic}" (this is follow-up #${state.followUpCount + 1}). Make it challenging but appropriate for a ${state.difficultyLevel}-level developer. Keep it warm, human-like, and professional. Max 80 words.`,
    },
  ];

  const response = await generateInterviewResponse(prompt);

  return {
    response,
  };
});

graph.addNode("nextQuestion", async (state) => {
  const allowedTopics = [
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "REST APIs",
    "Authentication",
    "System Design",
    "Problem Solving",
  ];

  // Find the next topic that is not completed
  const nextTopic = allowedTopics.find((t) => !state.topicsCompleted.includes(t));

  if (!nextTopic) {
    const prompt = [
      ...state.messages,
      {
        speaker: "USER",
        content: `Acknowledge their answer. Conclude the interview session politely, thank them for their time, and explain that we have gathered all the necessary info to evaluate. Do not ask any more questions. Max 80 words.`,
      },
    ];
    const response = await generateInterviewResponse(prompt);
    return {
      response,
      action: "END",
    };
  }

  const prompt = [
    ...state.messages,
    {
      speaker: "USER",
      content: `Acknowledge the candidate's last response naturally (e.g. "Nice", "That's fine, let's switch topics", or "Got it"). Transition naturally to the new topic: "${nextTopic}" (e.g., "Let's move on to ${nextTopic}" or "Now I'd like to discuss ${nextTopic}"). Ask one main conceptual/practical question about "${nextTopic}" appropriate for a ${state.difficultyLevel}-level developer. Do not ask multiple questions. Max 80 words.`,
    },
  ];

  const response = await generateInterviewResponse(prompt);

  return {
    response,
  };
});

graph.addNode("endInterview", async (state) => {
  const prompt = [
    ...state.messages,
    {
      speaker: "USER",
      content: `Acknowledge their answer. Conclude the interview session politely, thank them for their time, and explain that we have gathered all the necessary info to evaluate. Do not ask any more questions. Max 80 words.`,
    },
  ];

  const response = await generateInterviewResponse(prompt);

  return {
    response,
  };
});

graph.addConditionalEdges(
  "analyze",
  (state) => state.action,
  {
    CLARIFICATION: "clarification",
    FOLLOW_UP: "followUp",
    NEXT: "nextQuestion",
    END: "endInterview",
  }
);

graph.addEdge(START, "analyze");
graph.addEdge("clarification", END);
graph.addEdge("followUp", END);
graph.addEdge("nextQuestion", END);
graph.addEdge("endInterview", END);

const compiledGraph = graph.compile();

const runInterviewGraph = async (messages) => {
  const result = await compiledGraph.invoke({
    messages,
  });

  return {
    response: result.response,
    action: result.action,
  };
};

module.exports = {
  runInterviewGraph,
};