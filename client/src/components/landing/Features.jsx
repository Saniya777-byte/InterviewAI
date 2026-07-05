import {
  AudioLines,
  History,
  LockKeyhole,
  MicVocal,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { features } from "./data";

const iconMap = {
  "Voice AI Interviews": MicVocal,
  "Adaptive Questions": MessagesSquare,
  "Live Transcript": AudioLines,
  "Interview History": History,
  "AI Feedback": Sparkles,
  "Secure Authentication": LockKeyhole,
};

export default function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="Features" title="Why it feels worth using." />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.title] || Sparkles;

            return (
              <Reveal key={feature.title} delay={index * 0.03}>
                <article className="group h-full rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.12)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 transition duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}