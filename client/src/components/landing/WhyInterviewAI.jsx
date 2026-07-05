import { Brain, MessageCircleMore, MicVocal, Scale, Sparkles, Workflow } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { reasons } from "./data";

const detailCards = [
  { icon: Brain, title: "Conversation memory", text: "The interviewer carries context forward so every answer can shape the next prompt." },
  { icon: Workflow, title: "Decision orchestration", text: "LangGraph routes the interview based on answer quality, topic depth, and role signals." },
  { icon: MicVocal, title: "Natural voice interaction", text: "The experience feels conversational, not like filling out a form with audio attached." },
  { icon: Scale, title: "Structured feedback", text: "Each interview ends with a clear, calibrated snapshot of strengths and gaps." },
];

export default function WhyInterviewAI() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Why InterviewAI"
            title="Different from static prep tools and template-driven mock interviews."
            description="The platform is designed to act like a thoughtful interviewer, not a canned checklist of questions."
          />

          <div className="mt-8 space-y-3">
            {reasons.map((reason) => (
              <div key={reason} className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm">
                <Sparkles className="mt-0.5 h-5 w-5 flex-none text-blue-600" />
                <p className="text-sm font-medium text-slate-700">{reason}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-2">
            {detailCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.title} className="rounded-[1.6rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {card.text}
                  </p>
                </article>
              );
            })}

            <article className="rounded-[1.6rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-[0_20px_50px_rgba(37,99,235,0.08)] sm:col-span-2">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                <MessageCircleMore className="h-5 w-5" />
                Real-time decision making
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700">
                Every branch is selected with live context in mind, which lets the interviewer shift from breadth to depth naturally and stay aligned with the candidate’s performance.
              </p>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}