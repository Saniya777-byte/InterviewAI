"use client";

import InterviewerCard from "./InterviewerCard";
import TranscriptPanel from "./TranscriptPanel";
import VoiceButton from "./VoiceButton";
import InterviewStatus from "./InterviewStatus";

export default function InterviewLayout({
  session,
  messages,
  status,
  timer,
  onToggleListening,
  onEnd,
  interimTranscript,
  onTogglePause,
}) {
  // Format the elapsed time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-blue-600">
              Interview<span className="text-slate-900">AI</span>
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Active Mock Interview
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer component */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm font-bold text-slate-700 shadow-sm">
              ⏱️ {formatTime(timer)}
            </div>
            <div className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-800 shadow-sm border border-green-200">
              🟢 Live Session
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:px-8 lg:grid-cols-12">
        {/* Interviewer Profile Panel */}
        <div className="lg:col-span-3">
          <InterviewerCard
            session={session}
            onEnd={onEnd}
            status={status}
            onTogglePause={onTogglePause}
          />
        </div>

        {/* Conversation & Controls Panel */}
        <div className="flex flex-col lg:col-span-9">
          <InterviewStatus
            status={status}
          />

          <div className="flex h-[68vh] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Transcript container */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <TranscriptPanel
                messages={messages}
                interimTranscript={interimTranscript}
              />
            </div>

            {/* Voice Controls footer */}
            <div className="border-t border-slate-100 bg-slate-50 p-6">
              <VoiceButton
                status={status}
                onClick={onToggleListening}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}