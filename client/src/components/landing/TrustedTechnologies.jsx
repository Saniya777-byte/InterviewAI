import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { techHighlights } from "./data";

export default function TrustedTechnologies() {
  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Trusted Technologies"
            title="Built on a modern stack that feels fast, secure, and production ready."
            description="The platform combines a polished frontend, a secure backend, and a low-latency AI pipeline designed for real practice sessions."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10">
            {techHighlights.map((tech) => (
              <div
                key={tech}
                className="rounded-2xl border border-white/80 bg-white/90 px-4 py-4 text-center text-sm font-semibold text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-slate-950"
              >
                {tech}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}