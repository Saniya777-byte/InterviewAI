import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { screenshots } from "./data";

function ScreenCard({ title, variant }) {
  return (
    <article className="group rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_22px_55px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(37,99,235,0.12)]">
      <div className={`relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-gradient-to-br ${variant} p-4`}>
        <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">InterviewAI</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{title}</p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-blue-600/10" />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <div className="h-2 w-16 rounded-full bg-blue-400/80" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-5/6 rounded-full bg-white/15" />
              <div className="h-3 w-4/5 rounded-full bg-white/10" />
              <div className="h-3 w-2/3 rounded-full bg-white/15" />
            </div>
            <div className="mt-5 rounded-2xl bg-white/6 p-3">
              <div className="h-24 rounded-2xl border border-dashed border-white/15 bg-[linear-gradient(135deg,rgba(59,130,246,0.25),rgba(14,165,233,0.08))]" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
            <div className="space-y-3">
              <div className="h-12 rounded-2xl bg-slate-100" />
              <div className="h-12 rounded-2xl bg-blue-50" />
              <div className="h-12 rounded-2xl bg-slate-100" />
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500" />
                <div className="h-16 rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
    </article>
  );
}

export default function Screenshots() {
  const variants = [
    "from-blue-50 via-white to-cyan-50",
    "from-slate-50 via-white to-blue-50",
    "from-cyan-50 via-white to-blue-50",
  ];

  return (
    <section id="screenshots" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="Screenshots" title="What it looks like." />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {screenshots.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <ScreenCard title={item.title} variant={variants[index]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}