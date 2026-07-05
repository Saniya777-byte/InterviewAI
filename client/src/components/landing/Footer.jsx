import Link from "next/link";
import { Code2, Link2, Sparkles } from "lucide-react";
import { footerLinks } from "./data";

export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                InterviewAI
              </p>
              <p className="text-sm text-slate-600">AI Mock Interview Platform</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-slate-950">
              {link.label === "GitHub" ? <Code2 className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              {link.label}
            </a>
          ))}
          <span className="text-slate-400">Copyright {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}