import { ArrowRight, Bot, Brain, MonitorSmartphone, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const nodes = [
  { label: "Candidate", icon: MonitorSmartphone },
  { label: "Frontend", icon: Sparkles },
  { label: "Backend", icon: ArrowRight },
  { label: "LangGraph", icon: Brain },
  { label: "Groq", icon: Bot },
  { label: "Dynamic AI Response", icon: ArrowRight },
];

export default function Architecture() {
  return (
    <section id="architecture" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Architecture Preview"
            title="A modern workflow that turns a conversation into the next best interview step."
            description="The system stays responsive by splitting conversation handling, orchestration, and response generation into focused layers."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="grid gap-4 lg:grid-cols-6 lg:gap-5">
              {nodes.map((node, index) => {
                const Icon = node.icon;

                return (
                  <div key={node.label} className="relative">
                    <div className="flex h-full flex-col items-center justify-center rounded-[1.6rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 text-center shadow-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-950">
                        {node.label}
                      </p>
                    </div>

                    {index < nodes.length - 1 ? (
                      <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-blue-400 lg:block">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}