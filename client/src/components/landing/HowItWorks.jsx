import { ArrowDownRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { steps } from "./data";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="How It Works" title="Three steps to practice." />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.05}>
              <article className="relative h-full rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-blue-700">
                    {step.step}
                  </div>
                  <ArrowDownRight className="h-5 w-5 text-slate-300 lg:hidden" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}