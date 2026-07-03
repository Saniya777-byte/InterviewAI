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

const evaluateAnswer = async (conversation) => {
  if (!conversation || conversation.length === 0) {
    return {
      topics_covered: [],
      key_claims: [],
      follow_up_count_by_topic: {},
      time_elapsed_minutes: 0,
      time_remaining_minutes: 15,
      depth: "shallow",
      specificity: "vague",
      gaps: [],
      contradicts_earlier: false,
      route: "acknowledge_and_move_on",
      reason: "Initial call/introduction",
      currentTopic: "Introduction"
    };
  }

  // Find last user response and last AI question
  const lastUser = [...conversation].reverse().find((m) => m.speaker === "USER");
  if (!lastUser) {
    return {
      topics_covered: [],
      key_claims: [],
      follow_up_count_by_topic: {},
      time_elapsed_minutes: 0,
      time_remaining_minutes: 15,
      depth: "shallow",
      specificity: "vague",
      gaps: [],
      contradicts_earlier: false,
      route: "acknowledge_and_move_on",
      reason: "Initial call/introduction",
      currentTopic: "Introduction"
    };
  }

  const systemPrompt = `
    You are an expert technical interviewer assistant.
    Analyze the full interview conversation history so far to reconstruct the running interview state and evaluate the candidate's last answer.
    
    Allowed Technical Topics to cover:
    - JavaScript
    - React
    - Node.js
    - Express.js
    - PostgreSQL
    - REST APIs
    - Authentication
    - System Design
    - Problem Solving
    
    Reconstruct the following state properties based on the conversation history:
    1. topics_covered: An array of objects showing which technical topics have been discussed so far, and the depth achieved: "shallow", "adequate", or "strong".
    2. key_claims: An array of specific technical facts/statements the candidate made (e.g., "uses pool.query", "uses JWT for stateless auth", "implements debouncing").
    3. follow_up_count_by_topic: An object showing the number of follow-up questions asked so far for each topic.
    4. time_elapsed_minutes: Estimate of time elapsed. Assume 1.5 minutes per turn.
    5. time_remaining_minutes: 15 minus time_elapsed_minutes (capped at 0).
    
    Evaluate the candidate's last answer:
    - currentTopic: The topic of the last question asked by the AI (must be one of the Allowed Technical Topics, or "Introduction").
    - depth: "shallow" | "adequate" | "strong"
    - specificity: "vague" | "concrete"
    - gaps: Array of missing or unclear technical points in their last answer.
    
    Contradiction check:
    - contradicts_earlier: Compare the candidate's last response with earlier claims in key_claims. Set to true ONLY if there is a clear logical contradiction.
    
    Route selection rules:
    - CAPPING RULE: If the follow-up count for the current topic is already >= 2, the route MUST be "acknowledge_and_move_on" (or "challenge" if they contradicted themselves). You cannot ask another follow-up or probe.
    - If contradicts_earlier is true, route MUST be "challenge".
    - If the last answer is vague or shallow, and follow-up count is < 2, route is "probe".
    - If the last answer has minor gaps, and follow-up count is < 2, route is "follow_up".
    - If the last answer is strong or all details are covered, route is "acknowledge_and_move_on".
    
    Your output MUST be a JSON object with this exact structure:
    {
      "topics_covered": [{ "topic": "JavaScript", "depth_reached": "shallow" }],
      "key_claims": ["claim 1"],
      "follow_up_count_by_topic": { "JavaScript": 1 },
      "time_elapsed_minutes": 1,
      "time_remaining_minutes": 14,
      "depth": "shallow" | "adequate" | "strong",
      "specificity": "vague" | "concrete",
      "gaps": ["gap 1"],
      "contradicts_earlier": false,
      "route": "probe" | "follow_up" | "acknowledge_and_move_on" | "challenge",
      "reason": "short internal justification",
      "currentTopic": "JavaScript"
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
    const parsed = JSON.parse(response.content);
    
    // Safety check: Enforce the cap of 2 follow-ups per topic in code
    const currentTopic = parsed.currentTopic || "JavaScript";
    const currentFollowUpCount = parsed.follow_up_count_by_topic?.[currentTopic] || 0;
    if (currentFollowUpCount >= 2 && (parsed.route === "probe" || parsed.route === "follow_up")) {
      parsed.route = parsed.contradicts_earlier ? "challenge" : "acknowledge_and_move_on";
      parsed.reason = `Enforced follow-up limit (current count: ${currentFollowUpCount}) for topic: ${currentTopic}`;
    }

    // Log the evaluation to console for observability
    console.log("=== EVALUATE_ANSWER NODE OUTPUT ===");
    console.log(JSON.stringify(parsed, null, 2));
    console.log("===================================");
    
    return parsed;
  } catch (err) {
    console.error("Evaluation error:", err);
    return {
      topics_covered: [],
      key_claims: [],
      follow_up_count_by_topic: {},
      time_elapsed_minutes: 0,
      time_remaining_minutes: 15,
      depth: "adequate",
      specificity: "concrete",
      gaps: [],
      contradicts_earlier: false,
      route: "acknowledge_and_move_on",
      reason: "Error in evaluation fallback",
      currentTopic: "Introduction"
    };
  }
};

const generateResponse = async (state) => {
  const {
    messages,
    topics_covered,
    key_claims,
    follow_up_count_by_topic,
    time_elapsed_minutes,
    time_remaining_minutes,
    evaluation
  } = state;

  const currentTopic = evaluation.currentTopic || "JavaScript";

  const systemPrompt = `
    You are an experienced Senior Software Engineer conducting a real technical mock interview.
    Generate the next spoken line for the candidate. Do NOT re-evaluate the answer; perform ONLY the decision already made.
    
    Evaluation Context:
    - Route decision: "${evaluation.route}"
    - Reason: "${evaluation.reason}"
    - Current Topic: "${currentTopic}"
    - Gaps identified: ${JSON.stringify(evaluation.gaps)}
    - Key Claims candidate made earlier: ${JSON.stringify(key_claims)}
    - Contradiction detected: ${evaluation.contradicts_earlier}
    - Topics Covered so far: ${JSON.stringify(topics_covered)}
    - Time Remaining: ${time_remaining_minutes} minutes
    
    Technical Topics to cover:
    - JavaScript
    - React
    - Node.js
    - Express.js
    - PostgreSQL
    - REST APIs
    - Authentication
    - System Design
    - Problem Solving
    
    SPEECH & WRITING RULES (CRITICAL FOR TTS NATURALNESS):
    1. Write for speech, not for reading: Keep it short (1-3 sentences maximum per turn, never a paragraph).
    2. Always use contractions naturally ("don't", "can't", "we'll", "you've", "let's", "that's", "there's").
    3. Vary sentence length: Mix short, punchy lines with a single longer thought. Avoid uniform rhythms.
    4. Use commas, ellipses (...), or a light SSML <break time="200ms"/> tag to cue natural breathing, pausing, or hesitations (e.g. "Okay... <break time=\"200ms\"/> so how does that work under the hood?"). Do not over-use the break tag (max one per response).
    5. Absolutely no markdown, no lists, and no digits (e.g. write "ten times scale" instead of "10x scale", "forty-two" instead of "42").
    6. Never use robotic transition words like "Additionally", "Furthermore", "In conclusion", "Moreover". Talk like a real human.
    7. Ends by yielding the floor naturally (e.g., asking a question).
    
    OPENER RULES:
    - Never use generic filler openers like "Great answer", "That's interesting", "Good point", "Perfect", "Awesome".
    - Instead, use a specific callback referencing what the candidate said (e.g., "Since you've worked with pool connection pools...", "Alright, focusing on Express routing...") or go directly to the question without any filler.
    
    ROUTE SPECIFIC RULES:
    - If route is "probe" or "follow_up":
      Choose ONE of these 4 strategies based on the gap type:
      * Clarification: for vague terms ("what do you mean by...")
      * Depth probe: for general surface explanations ("walk me through how that actually works")
      * Challenge/pushback: for assumptions or simplified solutions ("what if the input wasn't sorted — would that still hold?")
      * Scenario extension: for complete answers that need to scale ("how would that change at 10x scale?")
      Pick the strategy based on the gap, explain the context briefly, then ask.
      
    - If route is "challenge":
      Reference the contradiction or claims directly. For example: "Earlier you mentioned that you use JWTs for stateless auth, but you just mentioned storing session state in memory... <break time=\"200ms\"/> how do those two fit together?"
      
    - If route is "acknowledge_and_move_on":
      Acknowledge what they said with a specific callback, transition naturally to a new topic not in ${JSON.stringify(topics_covered.map(t => t.topic))}, and ask the main question for that topic.
  `;

  const conversationMessages = [
    new SystemMessage(systemPrompt),
    ...messages.map((m) => {
      if (m.speaker === "USER") {
        return new HumanMessage(m.content);
      }
      return new AIMessage(m.content);
    }),
  ];

  try {
    const response = await llm.invoke(conversationMessages);
    return response.content;
  } catch (err) {
    console.error("Response generation error:", err);
    return "Let's move on to the next topic. Can you tell me about your experience with React?";
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
  evaluateAnswer,
  generateResponse,
  generateInterviewResponse,
};