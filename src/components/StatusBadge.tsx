import { cn } from "@/lib/utils";

export type BadgeTone = "normal" | "attention" | "critical" | "info" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  normal: "bg-success/12 text-success border-success/30",
  attention: "bg-warning/12 text-warning border-warning/30",
  critical: "bg-destructive/12 text-destructive border-destructive/35",
  info: "bg-primary/12 text-primary border-primary/30",
  neutral: "bg-muted text-muted-foreground border-border-strong",
};

export function toneFromStatus(status: string): BadgeTone {
  switch (status.toUpperCase()) {
    case "NORMAL":
    case "ONLINE":
    case "CONNECTED":
    case "ACTIVE":
      return "normal";
    case "ATTENTION":
    case "WARNING":
    case "MOCK":
      return "attention";
    case "CRITICAL":
    case "OFFLINE":
      return "critical";
    default:
      return "neutral";
  }
}

interface Props {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ label, tone, dot = true, className }: Props) {
  const resolved = tone ?? toneFromStatus(label);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        toneClasses[resolved],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}
