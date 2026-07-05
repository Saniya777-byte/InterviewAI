export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}