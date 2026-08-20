import { FlaskConical } from "lucide-react";

export function PrototypeBanner({ note }: { note?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/8 px-4 py-3">
      <FlaskConical className="mt-0.5 size-4 shrink-0 text-warning" />
      <div className="text-xs leading-relaxed">
        <p className="font-semibold uppercase tracking-wider text-warning">
          Prototype Mode — Using Mock Sensor Data
        </p>
        <p className="mt-0.5 text-muted-foreground">
          {note ??
            "The REST API and database are not connected yet. All readings shown are simulated and will be replaced by live ESP32 data."}
        </p>
      </div>
    </div>
  );
}
