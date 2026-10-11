import { MessageSquare, Send, Trophy, Users } from "lucide-react";

import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const plannedFeatures = [
  {
    icon: Send,
    title: "Predictions with friends",
    description: "Create private groups and follow each other's calls.",
  },
  {
    icon: MessageSquare,
    title: "Matchday chat",
    description: "Discuss fixtures and results with other fans.",
  },
  {
    icon: Trophy,
    title: "Season leagues",
    description: "Publish leagues and compete over a full season.",
  },
];

export default function Community() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
          Together
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          Community
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          A space for fans to connect is on the roadmap.
        </p>
      </div>

      <EmptyState
        icon={Users}
        title="Coming soon"
        description="The Mi Predict community area isn't built yet. We'll keep this page clear until real group features are available — no fake posts here."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {plannedFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card key={feature.title} className="p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Icon size={20} />
              </span>
              <h2 className="mt-4 font-display text-base font-semibold">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}