import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { faqs } from "./data";

export default function FAQ() {
  return (
    <section id="faq" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions answered clearly and without marketing noise."
            description="The answers are intentionally direct so candidates can understand how the platform behaves before they start practicing."
            align="center"
          />
        </Reveal>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={index * 0.04}>
              <details className="group rounded-[1.5rem] border border-white/80 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-950">
                  <span>{faq.question}</span>
                  <ChevronDown className="h-5 w-5 flex-none text-slate-400 transition duration-300 group-open:rotate-180 group-open:text-blue-600" />
                </summary>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}