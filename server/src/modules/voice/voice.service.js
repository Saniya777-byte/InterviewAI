/**
 * Vapi Assistant & Call Configuration
 * 
 * This configuration tunes the voice and LLM latency parameters for Vapi.ai:
 * - silenceTimeoutSeconds is set to 1.2s to prevent cutting off the candidate mid-thought
 *   while avoiding excessive dead air.
 * - fillersEnabled: true allows natural conversational fillers (e.g. "uh-huh", "hmm")
 *   to play during LLM processing latency.
 * - backchannelingEnabled: true enables active listening cues.
 */

const vapiAssistantConfig = {
  // Silence timeout to wait before responding (endpointing sensitivity)
  silenceTimeoutSeconds: 1.2,
  
  // Custom LLM processing latency fillers
  fillersEnabled: true,
  backchannelingEnabled: true,
  
  // Voicemail / endpointing timing in milliseconds
  endOfSpeechTimeoutMs: 1200,

  // Assistant persona and model details
  model: {
    provider: "custom-llm",
    url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/voice/vapi`,
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    systemPrompt: "You are Claire, an experienced Senior Software Engineer conducting a real technical mock interview."
  },
  
  // Voice engine details
  voice: {
    provider: "elevenlabs",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel - highly natural and professional
    stability: 0.45,                 // Low stability (40-50) for expressive, non-flat tone
    similarityBoost: 0.75,           // Moderate similarity boost for voice consistency
    style: 0.35,                     // Style boost (20-40) for natural speech variation
    useSpeakerBoost: true,           // Boost speech clarity and projection
    speed: 1.0
  },

  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US"
  }
};

module.exports = {
  vapiAssistantConfig
};
