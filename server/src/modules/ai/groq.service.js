const { ChatGroq } = require("@langchain/groq");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");

const { INTERVIEW_SYSTEM_PROMPT } = require("./prompts");

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
});

const classifyAnswer = async (conversation) => {
  if (!conversation || conversation.length === 0) {
    return { classification: "N/A", action: "NEXT" };
  }

  // Find last user response and last AI question
  const lastUser = [...conversation].reverse().find((m) => m.speaker === "USER");
  if (!lastUser) {
    return { classification: "N/A", action: "NEXT" };
  }

  const lastAI = [...conversation].reverse().find((m) => m.speaker === "AI");
  const wasClarificationAsked = !!(
    lastAI &&
    (lastAI.content.toLowerCase().includes("clarify") ||
      lastAI.content.toLowerCase().includes("unrelated") ||
      lastAI.content.toLowerCase().includes("specifically") ||
      lastAI.content.toLowerCase().includes("original question") ||
      lastAI.content.toLowerCase().includes("instead"))
  );

  const systemPrompt = `
    You are an expert technical interviewer assistant.
    Analyze the candidate's last answer in response to the interviewer's question.
    
    Classify the answer into one of these categories:
    - Excellent: Precise, complete, and accurate.
    - Good: Mostly correct, but could have more details.
    - Partial: Correct but misses significant parts of the question.
    - Weak: Vague, barely touches the question, or has errors.
    - Incorrect: Factually wrong or completely unrelated.
    
    Determine the next action based on these rules:
    - If the classification is Partial or Weak:
      - If clarification was ALREADY asked in the previous AI question (wasClarificationAsked = ${wasClarificationAsked}), return action: "NEXT".
      - Otherwise, return action: "CLARIFICATION".
    - If the classification is Incorrect:
      - If clarification was ALREADY asked, return action: "NEXT".
      - Otherwise, return action: "CLARIFICATION".
    - Otherwise (Excellent, Good), return action: "NEXT".
    
    You must output your response ONLY as a JSON object:
    {
      "classification": "Excellent" | "Good" | "Partial" | "Weak" | "Incorrect",
      "action": "CLARIFICATION" | "NEXT"
    }
  `;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(
      `Conversation History:\n${conversation
        .map((m) => `${m.speaker}: ${m.content}`)
        .join("\n")}`
    ),
  ];

  try {
    const response = await llm.invoke(messages, {
      response_format: { type: "json_object" },
    });
    return JSON.parse(response.content);
  } catch (err) {
    console.error("Classification error:", err);
    return { classification: "Good", action: "NEXT" };
  }
};

const analyzeInterviewState = async (conversation) => {
  if (!conversation || conversation.length === 0) {
    return {
      currentTopic: "Introduction",
      topicsCompleted: [],
      followUpCount: 0,
      difficultyLevel: "Mid",
      candidatePerformance: {},
      classification: "N/A",
      action: "NEXT"
    };
  }

  // Find last user response and last AI question
  const lastUser = [...conversation].reverse().find((m) => m.speaker === "USER");
  if (!lastUser) {
    return {
      currentTopic: "Introduction",
      topicsCompleted: [],
      followUpCount: 0,
      difficultyLevel: "Mid",
      candidatePerformance: {},
      classification: "N/A",
      action: "NEXT"
    };
  }

  const systemPrompt = `
    You are an expert technical interviewer assistant.
    Analyze the full interview conversation history so far and output the current interview state in JSON format.
    
    List of allowed topics:
    - JavaScript
    - React
    - Node.js
    - Express.js
    - PostgreSQL
    - REST APIs
    - Authentication
    - System Design
    - Problem Solving
    
    Follow these state analysis rules:
    
    1. Identify the "currentTopic" (the topic of the last question asked by the AI before the candidate's last reply).
       If the candidate is introducing themselves and we haven't asked any technical questions yet, the current topic is "Introduction".
       
    2. Determine the "topicsCompleted":
       - This is an array of topics from the allowed list that have been fully evaluated.
       - A topic is completed if:
         - The candidate gave a good/excellent answer and we are ready to move on.
         - The candidate gave a weak/incorrect answer but we already asked one clarification question about it.
         - The candidate stated they do not know, do not remember, are not sure, or asked to move on (e.g. saying "I don't know", "skip", "next topic", "move on").
         - Keep track of all completed topics based on the history.
         
    3. Determine the "followUpCount":
       - Count how many follow-up questions have been asked for the "currentTopic" so far (do not count the main/first question of the topic).
       
    4. Determine the "difficultyLevel":
       - "Junior", "Mid", or "Senior".
       - Start at "Mid". If the candidate answers excellently, adjust up. If they struggle or fail, adjust down.
       
    5. Determine "candidatePerformance":
       - An object mapping each covered topic (e.g. "JavaScript") to the overall performance rating for that topic: "Excellent", "Good", "Partial", "Weak", or "Incorrect".
       
    6. Classify the candidate's LAST answer:
       - "Excellent": Precise, complete, and accurate.
       - "Good": Mostly correct, but could have more details.
       - "Partial": Correct but misses significant parts.
       - "Weak": Vague, barely touches the question, or has errors.
       - "Incorrect": Factually wrong or completely unrelated.
       - "NoAnswer": If the candidate says "I don't know", "I don't remember", "I'm not sure", "Can we move on?", "skip", or synonymous expressions.
       
    7. Determine the next "action":
       - "END": If all 9 allowed topics are in "topicsCompleted", or if there are no more topics left to cover.
       - "NEXT": 
         - If the last reply classification is "Excellent" or "Good" AND we choose not to follow up (or followUpCount >= 2).
         - If the classification is "NoAnswer".
         - If the classification is "Partial", "Weak", or "Incorrect" AND we have ALREADY asked a clarification question for this topic (i.e. the previous AI message was a clarification question).
         - If the current topic is "Introduction" (transition to the first technical topic).
       - "CLARIFICATION":
         - If the last reply classification is "Partial", "Weak", or "Incorrect" AND we have NOT asked a clarification question yet for the current topic.
       - "FOLLOW_UP":
         - If the last reply classification is "Excellent" or "Good" AND we want to ask a deeper question on the same topic, AND followUpCount < 2.
         
    You must output your response ONLY as a JSON object:
    {
      "currentTopic": "JavaScript" | "React" | "Node.js" | "Express.js" | "PostgreSQL" | "REST APIs" | "Authentication" | "System Design" | "Problem Solving" | "Introduction",
      "topicsCompleted": ["Introduction", ...],
      "followUpCount": 0 | 1 | 2,
      "difficultyLevel": "Junior" | "Mid" | "Senior",
      "candidatePerformance": {
        "JavaScript": "Excellent" | "Good" | "Partial" | "Weak" | "Incorrect"
      },
      "classification": "Excellent" | "Good" | "Partial" | "Weak" | "Incorrect" | "NoAnswer",
      "action": "CLARIFICATION" | "FOLLOW_UP" | "NEXT" | "END"
    }
  `;

  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(
      `Conversation History:\n${conversation
        .map((m) => `${m.speaker}: ${m.content}`)
        .join("\n")}`
    ),
  ];

  try {
    const response = await llm.invoke(messages, {
      response_format: { type: "json_object" },
    });
    const state = JSON.parse(response.content);
    // Ensure properties are properly formatted
    if (!state.topicsCompleted) state.topicsCompleted = [];
    if (typeof state.followUpCount !== "number") state.followUpCount = 0;
    return state;
  } catch (err) {
    console.error("State analysis error:", err);
    return {
      currentTopic: "Introduction",
      topicsCompleted: [],
      followUpCount: 0,
      difficultyLevel: "Mid",
      candidatePerformance: {},
      classification: "Good",
      action: "NEXT"
    };
  }
};

const generateInterviewResponse = async (conversation) => {
  const messages = [
    new SystemMessage(INTERVIEW_SYSTEM_PROMPT),

    ...conversation.map((message) => {
      if (message.speaker === "USER") {
        return new HumanMessage(message.content);
      }

      return new AIMessage(message.content);
    }),
  ];

  const response = await llm.invoke(messages);

  return response.content;
};

module.exports = {
  classifyAnswer,
  analyzeInterviewState,
  generateInterviewResponse,
};