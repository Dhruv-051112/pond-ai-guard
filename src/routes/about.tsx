import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CircuitBoard, Cpu, Droplets, Sigma, Target, Thermometer } from "lucide-react";
import { Panel, PageHeader } from "@/components/Panel";
import { BASELINE_DO, DELTA_THRESHOLD } from "@/data/mockData";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — AIoT Aquaculture" },
      {
        name: "description",
        content:
          "AIoT-Based Aquaculture Monitoring and Edge AI Prediction System: objective, ESP32 edge device, DS18B20 and TDS sensors, and the biological delta method.",
      },
      { property: "og:title", content: "About the Project — AIoT Aquaculture" },
      {
        property: "og:description",
        content: "Objective, hardware and methodology of the edge AI aquaculture monitoring system.",
      },
    ],
  }),
  component: AboutPage,
});

const PIPELINE = [
  "Sensor Data",
  "ESP32",
  "Edge AI Processing",
  "DO Prediction",
  "Delta Calculation",
  "Water Condition Assessment",
  "Web Dashboard",
];

function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AIoT-Based Aquaculture Monitoring and Edge AI Prediction System"
        subtitle="Final-year engineering project · prototype dashboard"
      />

      <Panel title="Project Objective">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Real-time monitoring and intelligent analysis of aquaculture water conditions using a
            low-cost ESP32-based edge computing platform.
          </p>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Current Sensors">
          <ul className="space-y-3">
            {[
              { icon: Thermometer, name: "DS18B20 Temperature Sensor", note: "Digital 1-Wire water temperature" },
              { icon: Droplets, name: "TDS Sensor", note: "Total dissolved solids in ppm" },
            ].map((s) => (
              <li
                key={s.name}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3"
              >
                <s.icon className="size-4.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Edge Device & AI/ML">
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <CircuitBoard className="size-4.5 text-primary" />
              <div>
                <p className="text-sm font-medium">ESP32</p>
                <p className="text-xs text-muted-foreground">
                  Edge controller for acquisition and inference
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3">
              <Cpu className="mt-0.5 size-4.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">AI / ML</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Local edge inference for predicting Dissolved Oxygen and deriving Biological
                  Delta.
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Biological Delta (Δ)">
        <div className="flex items-start gap-3">
          <Sigma className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-mono text-sm">Δ = Baseline DO − Actual/Predicted DO</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              With a baseline of {BASELINE_DO.toFixed(1)} mg/L and a demonstration threshold of{" "}
              {DELTA_THRESHOLD.toFixed(1)} mg/L, a delta below the threshold is reported as NORMAL
              and a delta reaching or exceeding it is reported as ATTENTION.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Current System Flow">
        <div className="flex flex-wrap items-center gap-2">
          {PIPELINE.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-lg border border-border-strong bg-secondary/50 px-3 py-2 text-xs font-medium">
                {step}
              </span>
              {i < PIPELINE.length - 1 && (
                <ArrowRight className="size-3.5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Development Status">
        <p className="text-sm leading-relaxed text-muted-foreground">
          The dashboard currently runs on a centralised mock data service (
          <code className="font-mono text-foreground">src/services/sensorService.ts</code>). When
          the REST backend is available, set{" "}
          <code className="font-mono text-foreground">VITE_API_BASE_URL</code> and switch{" "}
          <code className="font-mono text-foreground">USE_MOCK_DATA</code> to false in{" "}
          <code className="font-mono text-foreground">src/config/api.ts</code> — no UI changes are
          required.
        </p>
      </Panel>
    </div>
  );
}
