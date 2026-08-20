import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Droplets, RadioTower, Sigma, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { Panel, PageHeader } from "@/components/Panel";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { SensorChart } from "@/components/SensorChart";
import { StatusBadge } from "@/components/StatusBadge";
import { DELTA_THRESHOLD } from "@/data/mockData";
import { useHistoricalData, useLatestSensorData } from "@/hooks/useSensorData";
import type { SensorReading } from "@/types/sensor";
import { formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/live-monitoring")({
  head: () => ({
    meta: [
      { title: "Live Monitoring — AIoT Aquaculture" },
      {
        name: "description",
        content:
          "Live simulated ESP32 sensor stream with temperature, TDS, predicted dissolved oxygen and biological delta.",
      },
      { property: "og:title", content: "Live Monitoring — AIoT Aquaculture" },
      {
        property: "og:description",
        content: "Real-time style sensor stream from the ESP32 edge device.",
      },
    ],
  }),
  component: LiveMonitoringPage,
});

function LiveMonitoringPage() {
  const { data } = useLatestSensorData(3000);
  const { data: seed } = useHistoricalData(3);
  const [stream, setStream] = useState<SensorReading[]>([]);

  useEffect(() => {
    if (seed.length) setStream(seed.slice(-30));
  }, [seed]);

  useEffect(() => {
    if (!data) return;
    setStream((prev) => [...prev, data].slice(-40));
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Monitoring"
        subtitle="Streaming readings from the ESP32 edge device"
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <RadioTower className="size-3.5 animate-pulse" /> Live · Simulated
          </span>
        }
      />

      <PrototypeBanner note="This live feed is simulated. Values refresh every 3 seconds from the mock service until the ESP32 API is connected." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Last Reading", value: data ? formatDateTime(data.timestamp) : "—" },
          { label: "Device ID", value: data?.deviceId ?? "—" },
          { label: "Sensor Status", value: "DS18B20 + TDS Connected" },
          { label: "Data Update", value: "Every 3 s (mock)" },
        ].map((i) => (
          <div key={i.label} className="panel px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{i.label}</p>
            <p className="mt-1 truncate font-mono text-sm">{i.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          size="lg"
          label="Temperature"
          icon={Thermometer}
          value={data ? data.temperature.toFixed(1) : "—"}
          unit="°C"
          status="Live"
          tone="info"
        />
        <MetricCard
          size="lg"
          label="TDS"
          icon={Droplets}
          value={data ? data.tds : "—"}
          unit="ppm"
          status="Live"
          tone="info"
        />
        <MetricCard
          size="lg"
          label="Predicted DO"
          icon={BrainCircuit}
          value={data ? data.predictedDO.toFixed(2) : "—"}
          unit="mg/L"
          status="Edge AI"
          tone="info"
        />
        <MetricCard
          size="lg"
          label="Biological Delta (Δ)"
          icon={Sigma}
          value={data ? data.delta.toFixed(2) : "—"}
          unit="mg/L"
          status={data ? (data.delta < DELTA_THRESHOLD ? "Normal" : "Attention") : undefined}
        />
      </div>

      <Panel
        title="Real-Time Trend"
        description="Temperature and TDS, rolling window"
        action={<StatusBadge label="Mock Stream" tone="attention" />}
      >
        <SensorChart
          data={stream}
          dualAxis
          height={320}
          series={[
            { key: "temperature", name: "Temperature", color: "var(--color-chart-1)", unit: "°C" },
            {
              key: "tds",
              name: "TDS",
              color: "var(--color-chart-2)",
              unit: "ppm",
              yAxisId: "right",
            },
          ]}
        />
      </Panel>
    </div>
  );
}
