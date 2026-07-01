"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              InterviewAI
            </h1>

            <p className="text-sm text-slate-500">
              AI Mock Interview Platform
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="mx-auto mt-12 max-w-5xl px-6">

        <div className="rounded-2xl bg-white p-8 shadow">

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {user.name} 👋
          </h2>

          <p className="mt-3 text-slate-600">
            Practice interviews with an AI interviewer that adapts to your answers.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-xl border bg-slate-50 p-5">
              <h3 className="font-semibold">Candidate</h3>

              <p className="mt-3 text-slate-600">
                {user.name}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-5">
              <h3 className="font-semibold">Email</h3>

              <p className="mt-3 text-slate-600">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-5">
              <h3 className="font-semibold">Interview Type</h3>

              <p className="mt-3 text-slate-600">
                Full Stack Developer
              </p>
            </div>

          </div>

          <button
            onClick={() => router.push("/interview")}
            className="mt-10 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Start Interview
          </button>

        </div>

      </main>

    </div>
  );
}