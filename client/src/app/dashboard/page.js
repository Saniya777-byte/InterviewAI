"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { startInterview, getInterviewHistory } from "@/services/interview.service";

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect to login if user is not logged in after auth finishes loading
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await getInterviewHistory();
      if (response && response.success) {
        setInterviews(response.interviews || []);
      }
    } catch (err) {
      console.error("Error loading interview history:", err);
      setError("Failed to load interview history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const response = await startInterview();
      const sessionId = response.session.id;
      router.push(`/interview/${sessionId}`);
    } catch (error) {
      console.error(error);
      alert("Unable to start interview. Please check database connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-blue-600">
              Interview<span className="text-slate-900">AI</span>
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Your AI-Powered Mock Interviewer
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">
              Welcome, <strong className="text-slate-900">{user?.name || "Candidate"}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        {/* Welcome Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Ready to practice,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {user?.name || "Candidate"}
              </span>
              ?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Boost your technical confidence with real-time feedback. Start a realistic, voice-only simulated technical interview. Claire, your AI interviewer, will evaluate your responses and ask intelligent follow-up questions tailored to your performance.
            </p>
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Initializing Claire...
                </span>
              ) : (
                "Start Voice Interview"
              )}
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Recent Interviews
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Review your performance history and transcripts.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {interviews.length} Sessions
            </span>
          </div>

          {historyLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <svg className="h-10 w-10 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="mt-4 text-sm font-medium">Retrieving your interview archives...</p>
            </div>
          ) : error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          ) : interviews.length === 0 ? (
            <div className="my-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 px-4 text-center">
              <span className="text-4xl">📚</span>
              <h4 className="mt-4 text-lg font-bold text-slate-700">No mock interviews completed yet</h4>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Click "Start Voice Interview" above to conduct your first AI-evaluated mock interview.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="px-6 py-4">Session ID</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Q&A Count</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {interviews.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4 font-mono text-sm text-slate-700">
                          #{session.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {formatDate(session.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              session.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                session.status === "COMPLETED" ? "bg-green-600" : "bg-blue-600"
                              }`}
                            />
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {session.messages?.length || 0} messages
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => router.push(`/interview/${session.id}`)}
                            className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}