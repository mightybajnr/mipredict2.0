import "./App.css";

import {
  ArrowRight,
  Crosshair,
  Trophy,
  Users,
  Zap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import miPredictLogo from "./assets/logos/mipredict2.0_logo_nav.svg";
import LaunchSignup from "./components/LaunchSignup.jsx";

const features = [
  {
    icon: Crosshair,
    title: "Predict",
    description:
      "Make your match predictions, trust your instincts, and put your football knowledge to the test.",
    number: "01",
  },
  {
    icon: Trophy,
    title: "Compete",
    description:
      "Climb the leaderboard, earn points, and prove yourself against friends and other fans.",
    number: "02",
  },
  {
    icon: Users,
    title: "Connect",
    description:
      "Challenge your friends and become part of a community that lives and breathes football.",
    number: "03",
  },
];

export default function App() {
  return (
    <main id="top" className="min-h-screen overflow-hidden bg-pitch text-white">
      {/* Navigation */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <a
          href="#top"
          className="flex min-w-0 items-center gap-2"
          aria-label="Mi Predict home"
        >
          <img
            src={miPredictLogo}
            alt="Mi Predict logo"
            className="h-10 w-10 shrink-0 object-contain sm:h-16"
          />

          <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
            Mi<span className="text-brand">Predict</span>
            <span className="ml-1 text-xs font-medium text-text-secondary">
              2.0
            </span>
          </span>
        </a>

        <a
          href="#features"
          className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold transition hover:border-brand hover:text-brand sm:px-5 sm:text-sm"
        >
          What&apos;s coming
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pb-28 lg:pt-20">
        <div className="min-w-0">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-2 text-xs font-medium text-brand sm:text-sm">
            <Sparkles size={15} className="shrink-0" />
            <span>THE NEXT CHAPTER STARTS SOON</span>
          </div>

          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Football is changing.
            <span className="mt-2 block text-brand">Predict your place.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            Same passion. Bigger plans. Mi Predict is evolving into a new home
            for predictions, competition, and football community.
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row sm:mt-10">
            <a
              href="#features"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-pitch transition hover:bg-brand-hover sm:text-base"
            >
              Discover what&apos;s next
              <ArrowRight size={18} />
            </a>

            <a
              href="#coming-soon"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-white/40 sm:text-base"
            >
              The next era
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-text-secondary sm:mt-10 sm:gap-x-6 sm:text-sm">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0 text-brand" />
              Built for fans
            </span>
            <span className="flex items-center gap-2">
              <Zap size={16} className="shrink-0 text-brand" />A new experience
            </span>
          </div>
        </div>

        {/* Preview card */}
        <div className="relative mx-auto w-full max-w-lg min-w-0 lg:max-w-none">
          <div className="absolute -inset-4 rounded-[2rem] bg-brand/5 blur-2xl sm:-inset-8" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-4 shadow-2xl sm:rounded-3xl sm:p-6 md:p-8">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-5 sm:pb-6">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-secondary">
                  Matchday experience
                </p>
                <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                  Your game. Your call.
                </h2>
              </div>

              <span className="shrink-0 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">
                Mi 2.0
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-pitch p-4 sm:mt-6 sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-2">
                <span className="text-xs text-text-secondary sm:text-sm">
                  YOUR NEXT CHALLENGE
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  Coming soon
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                <div className="min-w-0 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 sm:h-16 sm:w-16">
                    <span className="font-display text-lg font-bold sm:text-2xl">
                      FC
                    </span>
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold sm:text-base">
                    Your team
                  </p>
                </div>

                <span className="text-xs font-bold text-text-secondary sm:text-sm">
                  VS
                </span>

                <div className="min-w-0 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 sm:h-16 sm:w-16">
                    <Trophy size={25} className="text-brand sm:h-8 sm:w-8" />
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold sm:text-base">
                    The rivals
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-surface p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    Prediction challenge
                  </span>
                  <Crosshair size={18} className="shrink-0 text-brand" />
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-brand" />
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  A whole new way to compete is on the way.
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                <Users size={19} className="text-brand" />
                <p className="mt-3 text-sm font-semibold sm:text-base">
                  Your community
                </p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Challenge your friends.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                <Trophy size={19} className="text-brand" />
                <p className="mt-3 text-sm font-semibold sm:text-base">
                  Your leaderboard
                </p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Make every point count.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-white/10 bg-white/[0.02] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
              More than predictions
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              A new way to experience football.
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base sm:leading-8">
              We&apos;re building an experience where your football knowledge
              brings you closer to the game and the people who love it.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group min-w-0 rounded-2xl border border-white/10 bg-surface p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon size={24} />
                    </div>
                    <span className="font-display text-sm text-text-secondary">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section
        id="coming-soon"
        className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-4xl rounded-2xl border border-brand/20 bg-brand/[0.05] px-5 py-10 text-center sm:rounded-3xl sm:px-10 sm:py-14 md:px-16">
          <Sparkles size={30} className="mx-auto text-brand" />
          <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            The next era starts here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text-secondary sm:text-base sm:leading-8">
            Mi Predict 2.0 is being built with football fans in mind. Get ready
            for something bigger.
          </p>
          <a
            href="#top"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-pitch transition hover:bg-brand-hover sm:text-base"
          >
            Back to the top
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <LaunchSignup />

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-display text-sm font-bold">
            Mi<span className="text-brand">Predict</span> 2.0
          </p>
          <p className="text-xs leading-5 text-text-secondary sm:text-sm">
            Built for the love of the game. © {new Date().getFullYear()} Mi
            Predict.
          </p>
          <div className="py-2 text-center text-xs text-white/50 sm:py-0 sm:text-sm">
            Deployment test: October 10
          </div>
        </div>
      </footer>
    </main>
  );
}
