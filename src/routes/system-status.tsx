import { createFileRoute } from "@tanstack/react-router";
import { CircuitBoard, Database, Cpu, Radio, Server, Thermometer, Droplets } from "lucide-react";
import { Panel, PageHeader } from "@/components/Panel";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { StatusBadge } from "@/components/StatusBadge";
import { useLatestSensorData, useSystemStatus } from "@/hooks/useSensorData";
import { formatDateTime, formatUptime } from "@/utils/format";

export const Route = createFileRoute("/system-status")({
  head: () => ({
    meta: [
      { title: "System Status — AIoT Aquaculture" },
      {
        name: "description",
        content:
          "Health of the ESP32 edge device, DS18B20 and TDS sensors, edge AI model, data acquisition, API and database layers.",
      },
      { property: "og:title", content: "System Status — AIoT Aquaculture" },
      {
        property: "og:description",
        content: "ESP32, sensor, edge AI and data layer health overview.",
      },
    ],
  }),
  component: SystemStatusPage,
});

const ICONS: Record<string, typeof Cpu> = {
  "ESP32 Edge Device": CircuitBoard,
  "DS18B20 Temperature Sensor": Thermometer,
  "TDS Sensor": Droplets,
  "Edge AI Model": Cpu,
  "Data Acquisition": Radio,
  "REST API": Server,
  Database: Database,
};

function SystemStatusPage() {
  const { data: components } = useSystemStatus();
  const { data: latest } = useLatestSensorData();

  return (
    <div className="space-y-6">
      <PageHeader title="System Status" subtitle="Device, sensor and service health" />
      <PrototypeBanner />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {components.map((c) => {
          const Icon = ICONS[c.name] ?? Server;
          return (
            <div key={c.name} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border border-border-strong bg-secondary text-primary">
                  <Icon className="size-4.5" />
                </span>
                <StatusBadge label={c.state === "MOCK" ? "Mock Mode" : c.state} />
              </div>
              <p className="mt-4 text-sm font-medium">{c.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.detail}</p>
            </div>
          );
        })}
      </div>

      <Panel title="Runtime Information">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Device ID", value: latest?.deviceId ?? "—" },
            { label: "Uptime", value: latest ? formatUptime(latest.uptimeSeconds) : "—" },
            { label: "Last Reading", value: latest ? formatDateTime(latest.timestamp) : "—" },
            { label: "Sampling Interval", value: "15 s" },
          ].map((i) => (
            <div key={i.label}>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {i.label}
              </dt>
              <dd className="mt-1 font-mono text-sm">{i.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}
