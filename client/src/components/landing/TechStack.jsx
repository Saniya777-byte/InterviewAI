import { CircleDot, Cpu, Database, Lock, Workflow } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { techCards } from "./data";

const icons = [CircleDot, Cpu, Workflow, Database];

export default function TechStack() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Tech Stack"
            title="The stack is presented as product design, not a feature checklist."
            description="A clear stack grid helps the platform feel credible while reinforcing the engineering quality underneath the UI."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {techCards.map((card, index) => {
            const Icon = icons[index] || Lock;

            return (
              <Reveal key={card.title} delay={index * 0.04}>
                <article className="h-full rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {card.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}