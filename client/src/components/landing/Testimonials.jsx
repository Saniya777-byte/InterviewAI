import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { testimonials } from "./data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="What learners say" title="Can I trust it?" />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.05}>
              <article className="h-full rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <p className="text-lg leading-8 text-slate-800">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-950">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}