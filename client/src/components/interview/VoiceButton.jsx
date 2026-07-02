"use client";

import { useEffect, useState } from "react";

export default function VoiceButton({
  status,
  onClick,
}) {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  if (!supported) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600">
        ⚠️ Speech Recognition is not supported by your browser. Please use Google Chrome or Microsoft Edge.
      </div>
    );
  }

  // Determine button styles, icons, and labels based on current status
  let buttonClass = "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200 hover:scale-105";
  let label = "Click to Speak";
  let icon = "🎤";

  if (status === "listening") {
    buttonClass = "bg-red-500 hover:bg-red-600 text-white animate-pulse scale-105 shadow-red-200";
    label = "Listening... Speak now";
    icon = "🎙️";
  } else if (status === "candidate-speaking") {
    buttonClass = "bg-orange-500 hover:bg-orange-600 text-white animate-ping scale-105 shadow-orange-200";
    label = "Capturing Voice...";
    icon = "🗣️";
  } else if (status === "speaking") {
    buttonClass = "bg-green-500 text-white cursor-not-allowed opacity-90 shadow-green-100";
    label = "Claire is Speaking...";
    icon = "🔊";
  } else if (status === "processing") {
    buttonClass = "bg-blue-500 text-white cursor-not-allowed opacity-90 animate-pulse shadow-blue-100";
    label = "Processing Answer...";
    icon = "⚙️";
  } else if (status === "analyzing") {
    buttonClass = "bg-indigo-500 text-white cursor-not-allowed opacity-90 animate-pulse shadow-indigo-100";
    label = "Analyzing Answer...";
    icon = "🔍";
  } else if (status === "generating") {
    buttonClass = "bg-amber-500 text-white cursor-not-allowed opacity-90 animate-pulse shadow-amber-100";
    label = "Generating Next Question...";
    icon = "⚡";
  }

  const isDisabled =
    status === "speaking" ||
    status === "processing" ||
    status === "analyzing" ||
    status === "generating" ||
    status === "completed";

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl shadow-lg transition-all duration-300 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed ${buttonClass}`}
        title={label}
      >
        {icon}
      </button>

      <p className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
        status === "listening" ? "text-red-500" :
        status === "candidate-speaking" ? "text-orange-500" :
        status === "speaking" ? "text-green-600" :
        status === "processing" ? "text-blue-600" :
        status === "analyzing" ? "text-indigo-600" :
        status === "generating" ? "text-amber-600" : "text-slate-500"
      }`}>
        {label}
      </p>
    </div>
  );
}