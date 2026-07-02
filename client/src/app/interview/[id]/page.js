"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import InterviewLayout from "@/components/interview/InterviewLayout";
import {getInterview,sendMessage,endInterview,} from "@/services/interview.service";

export default function InterviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);

  // Statuses: "loading", "speaking", "listening", "candidate-speaking", "processing", "analyzing", "generating", "ready", "completed"
  const [status, setStatus] = useState("loading");
  const [interimTranscript, setInterimTranscript] = useState("");

  const recognitionRef = useRef(null);
  const accumulatedTranscriptRef = useRef("");
  const silenceTimerRef = useRef(null);
  const isCompletedRef = useRef(false);
  const isListeningRef = useRef(false);
  const hasAlertedMicDeniedRef = useRef(false);

  // Refs to read active status inside useEffect event handlers without triggering re-runs
  const statusRef = useRef(status);
  const interimTranscriptRef = useRef(interimTranscript);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    interimTranscriptRef.current = interimTranscript;
  }, [interimTranscript]);

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Load interview details
  useEffect(() => {
    if (user) {
      loadInterview();
    }
  }, [user]);

  // Timer interval
  useEffect(() => {
    if (isCompletedRef.current || loading || status === "paused") return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, status]);

  // Initialize Speech Recognition ONCE on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      isListeningRef.current = true;
      setStatus("listening");
      setInterimTranscript("");
      accumulatedTranscriptRef.current = "";
      resetSilenceTimer();
    };

    rec.onend = () => {
      isListeningRef.current = false;
      
      const finalResult = (accumulatedTranscriptRef.current + " " + interimTranscriptRef.current).trim();
      const currentStatus = statusRef.current;
      
      if (finalResult && !isCompletedRef.current && (currentStatus === "listening" || currentStatus === "candidate-speaking")) {
        commitSpeechResult(finalResult);
      } else {
        if (!isCompletedRef.current && currentStatus !== "processing" && currentStatus !== "analyzing" && currentStatus !== "generating") {
          setStatus("ready");
        }
      }
    };

    rec.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        if (!hasAlertedMicDeniedRef.current) {
          hasAlertedMicDeniedRef.current = true;
          alert("Microphone permission denied. Please allow microphone access in your browser settings to continue.");
        }
        setStatus("ready");
      }
    };

    rec.onresult = (event) => {
      setStatus("candidate-speaking");

      let interim = "";
      let finalSegment = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalSegment += (finalSegment ? " " : "") + transcriptSegment;
        } else {
          interim += transcriptSegment;
        }
      }

      if (finalSegment) {
        accumulatedTranscriptRef.current += (accumulatedTranscriptRef.current ? " " : "") + finalSegment.trim();
      }

      setInterimTranscript(interim || "");
      resetSilenceTimer();
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      const finalResult = (accumulatedTranscriptRef.current + " " + interimTranscriptRef.current).trim();
      if (finalResult) {
        commitSpeechResult(finalResult);
      } else {
        // No speech detected at all, stop listening
        try {
          recognitionRef.current?.stop();
        } catch (e) {}
        setStatus("ready");
      }
    }, 5500); // 5.5 seconds silence threshold
  };

  const commitSpeechResult = (finalResult) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    try {
      recognitionRef.current?.stop();
    } catch (e) {}

    setInterimTranscript("");
    sendUserResponse(finalResult);
  };

  const loadInterview = async () => {
    try {
      setStatus("loading");
      setLoading(true);
      const data = await getInterview(id);

      if (data && data.success && data.interview) {
        setSession(data.interview);
        const msgs = data.interview.messages || [];
        setMessages(msgs);

        if (data.interview.status === "COMPLETED") {
          isCompletedRef.current = true;
          setStatus("completed");
        } else {
          // Speak the last AI question if there is one
          const lastAI = [...msgs].reverse().find((m) => m.speaker === "AI");
          if (lastAI) {
            setTimeout(() => {
              speakText(lastAI.content);
            }, 1000);
          } else {
            setStatus("ready");
          }
        }
      } else {
        alert("Failed to fetch interview session");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error loading interview:", err);
      alert("Error loading interview details.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (isCompletedRef.current || statusRef.current === "paused") return;
    if (typeof window === "undefined" || !window.speechSynthesis) {
      // Speech synthesis not supported, auto-start mic immediately
      startListening();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95; // natural professional reading speed
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const cleanEnglishVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Microsoft"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (cleanEnglishVoice) {
      utterance.voice = cleanEnglishVoice;
    }

    utterance.onstart = () => {
      setStatus("speaking");
    };

    utterance.onend = () => {
      if (!isCompletedRef.current && statusRef.current !== "paused") {
        setStatus("ready");
        // Wait 1.5 seconds naturally before starting microphone capture
        setTimeout(() => {
          if (statusRef.current === "ready" && !isCompletedRef.current) {
            startListening();
          }
        }, 1500);
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis utterance status/error:", e.error);
      if (!isCompletedRef.current && statusRef.current !== "paused" && e.error !== "interrupted" && e.error !== "canceled") {
        setStatus("ready");
        setTimeout(() => {
          if (statusRef.current === "ready" && !isCompletedRef.current) {
            startListening();
          }
        }, 1500);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (isCompletedRef.current || !recognitionRef.current) return;
    if (isListeningRef.current || statusRef.current === "paused") return;

    isListeningRef.current = true;
    accumulatedTranscriptRef.current = "";
    setInterimTranscript("");
    setStatus("listening");

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn("SpeechRecognition start attempt ignored (already running):", err);
      isListeningRef.current = false;
    }
  };

  const sendUserResponse = async (text) => {
    if (isCompletedRef.current || !text) return;

    setStatus("processing");

    // Display user transcript immediately in chronological order
    setMessages((prev) => [
      ...prev,
      {
        speaker: "USER",
        content: text,
      },
    ]);

    try {
      // Transition to Analyzing Answer -> Generating Next Question
      setStatus("analyzing");
      setTimeout(() => {
        if (statusRef.current !== "paused" && !isCompletedRef.current) {
          setStatus("generating");
        }
      }, 1000);

      const response = await sendMessage(id, text);

      if (response && response.success && response.aiResponse) {
        const nextQuestion = response.aiResponse;

        setMessages((prev) => [
          ...prev,
          {
            speaker: "AI",
            content: nextQuestion,
          },
        ]);

        if (response.isCompleted) {
          speakText(nextQuestion);
          isCompletedRef.current = true;
          setStatus("completed");
        } else {
          speakText(nextQuestion);
        }
      } else {
        console.error("Malformed message response:", response);
        if (statusRef.current !== "paused") {
          setStatus("ready");
        }
      }
    } catch (err) {
      console.error("Error sending response message:", err);
      if (statusRef.current !== "paused") {
        setStatus("ready");
      }
    }
  };

  const handleToggleListening = () => {
    if (isCompletedRef.current) return;

    if (statusRef.current === "paused") {
      statusRef.current = "ready";
      setStatus("ready");
      startListening();
      return;
    }

    if (isListeningRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setStatus("ready");
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      startListening();
    }
  };

  const handleTogglePause = () => {
    if (isCompletedRef.current) return;

    if (status === "paused") {
      // Resume the interview
      statusRef.current = "ready";
      setStatus("ready");
      // Find the last AI message
      const lastAI = [...messages].reverse().find((m) => m.speaker === "AI");
      if (lastAI) {
        speakText(lastAI.content);
      } else {
        startListening();
      }
    } else {
      // Pause the interview
      statusRef.current = "paused";
      setStatus("paused");
      // Cancel speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    }
  };

  const handleEndInterview = async () => {
    try {
      isCompletedRef.current = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      setStatus("completed");

      await endInterview(id);
      alert("Interview saved and closed. Returning to dashboard.");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error concluding interview:", err);
      alert("Error ending interview session.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-slate-600">
        <svg className="h-12 w-12 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="mt-4 text-base font-bold">Synchronizing with Claire...</p>
      </div>
    );
  }

  return (
    <InterviewLayout
      session={session}
      messages={messages}
      status={status}
      timer={timer}
      onToggleListening={handleToggleListening}
      onEnd={handleEndInterview}
      onTogglePause={handleTogglePause}
      interimTranscript={interimTranscript}
    />
  );
}