"use client";

import { useRouter } from "next/navigation";

export default function InterviewerCard({
  session,
  onEnd,
  status,
  onTogglePause,
}) {
  const router = useRouter();

  const handleEnd = async () => {
    await onEnd();
    router.push("/dashboard");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col items-center">

        <img
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=Claire"
          alt="AI Interviewer"
          className="h-36 w-36 rounded-full border-4 border-blue-500 bg-slate-100"
        />

        <h2 className="mt-5 text-2xl font-bold text-slate-800">
          Claire
        </h2>

        <p className="text-sm text-slate-500">
          AI Technical Interviewer
        </p>

      </div>

      <div className="mt-8 space-y-4">

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">

          <span className="text-slate-600">
            Status
          </span>

          <span className="font-semibold text-green-600">
            🟢 Live
          </span>

        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">

          <span className="text-slate-600">
            Topic
          </span>

          <span className="font-semibold text-slate-800">
            Full Stack
          </span>

        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">

          <span className="text-slate-600">
            Session
          </span>

          <span className="font-semibold text-slate-800">
            {session?.id?.slice(-6)}
          </span>

        </div>

      </div>

      <div className="mt-10 space-y-3">

        <button
          onClick={onTogglePause}
          className={`w-full rounded-lg border py-3 font-semibold transition-all duration-200 ${
            status === "paused"
              ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {status === "paused" ? "▶️ Resume Interview" : "⏸️ Pause Interview"}
        </button>

        <button
          onClick={handleEnd}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          End Interview
        </button>

      </div>

    </div>
  );
}