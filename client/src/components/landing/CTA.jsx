import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.25rem] border border-blue-200 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-16 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-10 sm:py-20 lg:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent_30%)]" />
            <div className="absolute left-12 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <h2 className="text-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Ready to Ace Your Next Interview?
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                  Start practicing in minutes and get a realistic interview experience.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  Start Free Interview
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  GitHub
                  <Code2 className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}