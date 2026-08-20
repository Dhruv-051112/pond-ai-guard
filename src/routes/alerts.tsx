import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState } from "react";
import { AlertCard } from "@/components/AlertCard";
import { Panel, PageHeader } from "@/components/Panel";
import { useAlerts } from "@/hooks/useSensorData";
import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/types/sensor";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — AIoT Aquaculture" },
      {
        name: "description",
        content:
          "Informational alerts for temperature, TDS, predicted dissolved oxygen and biological delta threshold events.",
      },
      { property: "og:title", content: "Alerts — AIoT Aquaculture" },
      {
        property: "og:description",
        content: "Informational water-quality alerts from the monitoring prototype.",
      },
    ],
  }),
  component: AlertsPage,
});

const FILTERS = ["all", "critical", "warning", "info"] as const;

function AlertsPage() {
  const { data } = useAlerts();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const list = data.filter((a) => filter === "all" || a.severity === (filter as AlertSeverity));
  const counts = {
    critical: data.filter((a) => a.severity === "critical").length,
    warning: data.filter((a) => a.severity === "warning").length,
    active: data.filter((a) => !a.resolved).length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Alerts" subtitle="Threshold and status notifications" />

      <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Alerts in this prototype are{" "}
          <span className="font-semibold text-foreground">informational only</span>. The system
          reports water conditions and does not perform any automatic control action.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Critical", value: counts.critical },
          { label: "Warnings", value: counts.warning },
          { label: "Active", value: counts.active },
        ].map((c) => (
          <div key={c.label} className="panel px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-mono text-2xl">{c.value}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Alert Log"
        description={`${list.length} entries`}
        action={
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  filter === f
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <div className="space-y-3">
          {list.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
          {!list.length && (
            <p className="py-8 text-center text-sm text-muted-foreground">No alerts to show.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
