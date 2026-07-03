const {
  StateGraph,
  START,
  END,
} = require("@langchain/langgraph");

const {
  evaluateAnswer,
  generateResponse,
} = require("./groq.service");

const graph = new StateGraph({
  channels: {
    messages: {
      value: (_, value) => value,
      default: () => [],
    },
    topics_covered: {
      value: (_, value) => value,
      default: () => [],
    },
    key_claims: {
      value: (_, value) => value,
      default: () => [],
    },
    follow_up_count_by_topic: {
      value: (_, value) => value,
      default: () => ({}),
    },
    time_elapsed_minutes: {
      value: (_, value) => value,
      default: () => 0,
    },
    time_remaining_minutes: {
      value: (_, value) => value,
      default: () => 15,
    },
    evaluation: {
      value: (_, value) => value,
      default: () => null,
    },
    response: {
      value: (_, value) => value,
      default: () => "",
    },
  },
});

graph.addNode("evaluate_answer", async (state) => {
  const result = await evaluateAnswer(state.messages);

  return {
    topics_covered: result.topics_covered,
    key_claims: result.key_claims,
    follow_up_count_by_topic: result.follow_up_count_by_topic,
    time_elapsed_minutes: result.time_elapsed_minutes,
    time_remaining_minutes: result.time_remaining_minutes,
    evaluation: {
      depth: result.depth,
      specificity: result.specificity,
      gaps: result.gaps,
      contradicts_earlier: result.contradicts_earlier,
      route: result.route,
      reason: result.reason,
      currentTopic: result.currentTopic,
    },
  };
});

graph.addNode("generate_probe", async (state) => {
  const response = await generateResponse(state);
  return { response };
});

graph.addNode("generate_follow_up", async (state) => {
  const response = await generateResponse(state);
  return { response };
});

graph.addNode("generate_challenge", async (state) => {
  const response = await generateResponse(state);
  return { response };
});

graph.addNode("generate_move_on", async (state) => {
  const response = await generateResponse(state);
  return { response };
});

graph.addNode("generate_end", async (state) => {
  const response = await generateResponse(state);
  return { response };
});

const routeDecision = (state) => {
  const route = state.evaluation?.route || "acknowledge_and_move_on";
  
  if (state.time_remaining_minutes <= 0) {
    return "generate_end";
  }
  
  switch (route) {
    case "probe":
      return "generate_probe";
    case "follow_up":
      return "generate_follow_up";
    case "challenge":
      return "generate_challenge";
    case "acknowledge_and_move_on": {
      // If all topics covered, route to end
      const allowedTopics = [
        "JavaScript", "React", "Node.js", "Express.js",
        "PostgreSQL", "REST APIs", "Authentication",
        "System Design", "Problem Solving"
      ];
      const covered = (state.topics_covered || []).map(t => t.topic);
      const allCovered = allowedTopics.every(t => covered.includes(t));
      if (allCovered) {
        return "generate_end";
      }
      return "generate_move_on";
    }
    case "end":
    default:
      return "generate_end";
  }
};

graph.addConditionalEdges(
  "evaluate_answer",
  routeDecision,
  {
    generate_probe: "generate_probe",
    generate_follow_up: "generate_follow_up",
    generate_challenge: "generate_challenge",
    generate_move_on: "generate_move_on",
    generate_end: "generate_end"
  }
);

graph.addEdge(START, "evaluate_answer");
graph.addEdge("generate_probe", END);
graph.addEdge("generate_follow_up", END);
graph.addEdge("generate_challenge", END);
graph.addEdge("generate_move_on", END);
graph.addEdge("generate_end", END);

const compiledGraph = graph.compile();

const runInterviewGraph = async (messages) => {
  const result = await compiledGraph.invoke({
    messages,
  });

  const isCompleted = result.evaluation?.route === "end" || 
                      result.response?.toLowerCase().includes("thank you") || 
                      result.time_remaining_minutes <= 0;

  return {
    response: result.response,
    action: isCompleted ? "END" : "NEXT",
  };
};

module.exports = {
  runInterviewGraph,
};