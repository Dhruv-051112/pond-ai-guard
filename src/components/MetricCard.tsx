import { ArrowDownRight, ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, type BadgeTone } from "@/components/StatusBadge";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: string;
  tone?: BadgeTone;
  rangeText?: string;
  trend?: number;
  note?: string;
  size?: "md" | "lg";
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  status,
  tone,
  rangeText,
  trend,
  note,
  size = "md",
  className,
}: Props) {
  const TrendIcon =
    trend === undefined || Math.abs(trend) < 0.001
      ? ArrowRight
      : trend > 0
        ? ArrowUpRight
        : ArrowDownRight;

  return (
    <div className={cn("panel relative overflow-hidden p-5", className)}>
      <div className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-primary/5 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg border border-border-strong bg-secondary text-primary">
            <Icon className="size-4.5" />
          </span>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>
        {status && <StatusBadge label={status} tone={tone} />}
      </div>

      <div className="mt-5 flex items-end gap-1.5">
        <span
          className={cn(
            "font-mono font-semibold leading-none tracking-tight text-foreground",
            size === "lg" ? "text-5xl" : "text-3xl",
          )}
        >
          {value}
        </span>
        {unit && <span className="pb-1 text-sm text-muted-foreground">{unit}</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        {rangeText && <span>{rangeText}</span>}
        {trend !== undefined && (
          <span className="inline-flex items-center gap-1 font-mono">
            <TrendIcon className="size-3.5" />
            {trend > 0 ? "+" : ""}
            {trend.toFixed(2)}
          </span>
        )}
      </div>
      {note && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>}
    </div>
  );
}
