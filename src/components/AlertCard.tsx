import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import type { AlertItem } from "@/types/sensor";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/utils/format";
import { cn } from "@/lib/utils";

const config = {
  info: { icon: Info, wrap: "border-primary/25 bg-primary/5", text: "text-primary", label: "INFO" },
  warning: {
    icon: AlertTriangle,
    wrap: "border-warning/30 bg-warning/5",
    text: "text-warning",
    label: "WARNING",
  },
  critical: {
    icon: AlertOctagon,
    wrap: "border-destructive/35 bg-destructive/5",
    text: "text-destructive",
    label: "CRITICAL",
  },
} as const;

export function AlertCard({ alert }: { alert: AlertItem }) {
  const c = config[alert.severity];
  const Icon = c.icon;
  return (
    <article className={cn("flex gap-3 rounded-xl border p-4", c.wrap)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", c.text)} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("text-[11px] font-bold uppercase tracking-wider", c.text)}>
            {c.label}
          </span>
          <span className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {alert.parameter}
          </span>
          <StatusBadge
            label={alert.resolved ? "Resolved" : "Active"}
            tone={alert.resolved ? "neutral" : "attention"}
          />
        </div>
        <p className="mt-2 text-sm text-foreground">{alert.message}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {alert.id} · {formatDateTime(alert.timestamp)}
        </p>
      </div>
    </article>
  );
}
