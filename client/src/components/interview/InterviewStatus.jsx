"use client";

export default function InterviewStatus({ status }) {
  let title = "Ready";
  let color = "bg-slate-400";
  let description = "Claire is waiting to begin.";

  switch (status) {
    case "speaking":
      title = "AI Speaking";
      color = "bg-green-500 animate-pulse";
      description = "Claire is reading the question. Please listen closely.";
      break;
    case "listening":
      title = "Listening";
      color = "bg-red-500 animate-pulse";
      description = "Your microphone is live. Please answer the question.";
      break;
    case "candidate-speaking":
      title = "Candidate Speaking";
      color = "bg-orange-500 animate-pulse";
      description = "We are capturing your live response. Keep speaking...";
      break;
    case "processing":
      title = "Processing";
      color = "bg-blue-500 animate-pulse";
      description = "Finalizing your speech transcript...";
      break;
    case "analyzing":
      title = "Analyzing Answer";
      color = "bg-indigo-500 animate-pulse";
      description = "Evaluating the details and technical depth of your answer...";
      break;
    case "generating":
      title = "Generating Next Question";
      color = "bg-amber-500 animate-pulse";
      description = "Claire is thinking of the next contextual technical question.";
      break;
    case "paused":
      title = "Paused";
      color = "bg-yellow-500 animate-pulse";
      description = "The interview has been paused. Press Resume to continue.";
      break;
    case "completed":
      title = "Completed";
      color = "bg-slate-600";
      description = "This session has been saved and completed.";
      break;
    case "ready":
    default:
      title = "Ready";
      color = "bg-slate-400";
      description = "Claire is waiting to begin.";
      break;
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div>
        <h2 className="text-base font-bold text-slate-800">
          Interview Status: <span className="ml-1 text-blue-600 font-extrabold">{title}</span>
        </h2>
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${color} shadow-sm`} />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
          {title}
        </span>
      </div>
    </div>
  );
}