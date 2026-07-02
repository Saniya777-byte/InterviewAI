"use client";

import { useEffect, useRef } from "react";

export default function TranscriptPanel({ messages, interimTranscript }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, interimTranscript]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-800">
          Interview Transcript
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Live conversation between you and the AI interviewer.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-700">
                Waiting for interview to begin...
              </h3>
              <p className="mt-2 text-slate-500">
                The AI interviewer will ask the first question.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((message, index) => {
              const isAI = message.speaker === "AI";

              return (
                <div
                  key={index}
                  className={`border-l-4 pl-5 ${
                    isAI ? "border-blue-500" : "border-indigo-600 bg-slate-50/50 py-2 rounded-r-lg"
                  }`}
                >
                  <p
                    className={`mb-2 text-sm font-bold uppercase tracking-wide ${
                      isAI ? "text-blue-600" : "text-indigo-600"
                    }`}
                  >
                    {isAI ? "AI Interviewer" : "Candidate"}
                  </p>

                  <p className="text-[17px] leading-8 text-slate-700">
                    {message.content}
                  </p>
                </div>
              );
            })}

            {/* Live interim transcript display */}
            {interimTranscript && (
              <div className="border-l-4 border-slate-300 pl-5 bg-slate-50/30 py-2 rounded-r-lg opacity-70 animate-pulse">
                <p className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Candidate (Speaking...)
                </p>
                <p className="text-[17px] leading-8 text-slate-600 italic">
                  {interimTranscript}...
                </p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}