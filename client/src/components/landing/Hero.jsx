import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="relative z-10">
          <h1 className="mt-6 max-w-3xl text-display text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Ace Your Next Technical Interview with AI
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Practice with a voice-first AI interviewer that adapts to your answers and gives you a realistic way to prepare.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Start Interview
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#screenshots"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
            >
              Watch Demo
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-blue-500/15 via-cyan-300/10 to-transparent blur-3xl" />
          <div className="glass-panel animate-float-slow relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
            <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute left-8 top-16 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl" />

            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard Preview</p>
                <p className="mt-1 text-base font-semibold text-slate-950">Interview session overview</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.35rem] border border-slate-200 bg-slate-950 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Live Interview</p>
                <p className="mt-4 text-sm leading-7 text-slate-200">Tell me about a project where you had to make a difficult tradeoff.</p>
              </div>

              <div className="space-y-3 rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                <div className="h-10 rounded-2xl bg-white" />
                <div className="h-10 rounded-2xl bg-blue-50" />
                <div className="h-10 rounded-2xl bg-white" />
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500" />
                  <div className="h-14 rounded-2xl bg-slate-200/70" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}