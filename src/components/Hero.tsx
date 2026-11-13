import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-800 text-white">
      <div
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-red-400/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-200" />
            Live emergency resource locator
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find Emergency Healthcare Resources Instantly
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-red-50 sm:text-xl">
            Locate hospitals, blood banks, ambulances, and emergency care nearby.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="#hospitals"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-red-700 shadow-xl shadow-red-900/20 transition-all hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-2xl"
            >
              Get Started
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <a
              href="tel:112"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-6 py-3.5 text-base font-semibold backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <Phone className="h-5 w-5" aria-hidden />
              Emergency Help
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
