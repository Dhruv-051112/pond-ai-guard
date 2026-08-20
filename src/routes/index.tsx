import { createFileRoute } from "@tanstack/react-router";
import { Activity, BrainCircuit, Droplets, Sigma, Thermometer } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Panel, PageHeader } from "@/components/Panel";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { SensorChart } from "@/components/SensorChart";
import { StatusBadge } from "@/components/StatusBadge";
import { DELTA_THRESHOLD, RANGES, BASELINE_DO } from "@/data/mockData";
import { useHistoricalData, useLatestSensorData } from "@/hooks/useSensorData";
import { formatDateTime, formatUptime } from "@/utils/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AIoT Aquaculture Monitoring System" },
      {
        name: "description",
        content:
          "Edge AI-based real-time aquaculture water quality dashboard: temperature, TDS, predicted dissolved oxygen and biological delta from an ESP32 device.",
      },
      { property: "og:title", content: "AIoT Aquaculture Monitoring System" },
      {
        property: "og:description",
        content: "Edge AI-based real-time water quality monitoring on ESP32.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useLatestSensorData(5000);
  const { data: history } = useHistoricalData(24);
  const recent = history.slice(-24);
  const prev = history.length > 1 ? history[history.length - 2] : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AIoT Aquaculture Monitoring System"
        subtitle="Edge AI-Based Real-Time Water Quality Monitoring"
        action={<StatusBadge label={data?.deviceStatus ?? "…"} />}
      />

      <PrototypeBanner />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Device Status", value: data?.deviceStatus ?? "—" },
          { label: "ESP32 Device ID", value: data?.deviceId ?? "—" },
          {
            label: "Last Updated",
            value: data ? formatDateTime(data.timestamp) : "—",
          },
          {
            label: "System Uptime",
            value: data ? formatUptime(data.uptimeSeconds) : "—",
          },
        ].map((item) => (
          <div key={item.label} className="panel px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 truncate font-mono text-sm text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Data collection: sampling every 15 s from DS18B20 and TDS sensors
        </p>
        <StatusBadge label="Active" tone="normal" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Temperature"
          icon={Thermometer}
          value={data ? data.temperature.toFixed(1) : "—"}
          unit="°C"
          status={
            data && data.temperature >= RANGES.temperature.min && data.temperature <= RANGES.temperature.max
              ? "Normal"
              : "Attention"
          }
          rangeText={`Normal ${RANGES.temperature.min}–${RANGES.temperature.max} °C`}
          {...(data && prev ? { trend: +(data.temperature - prev.temperature).toFixed(2) } : {})}
        />
        <MetricCard
          label="TDS"
          icon={Droplets}
          value={data ? data.tds : "—"}
          unit="ppm"
          status={
            data && data.tds >= RANGES.tds.min && data.tds <= RANGES.tds.max ? "Normal" : "Attention"
          }
          rangeText={`Normal ${RANGES.tds.min}–${RANGES.tds.max} ppm`}
          {...(data && prev ? { trend: +(data.tds - prev.tds).toFixed(2) } : {})}
        />
        <MetricCard
          label="Predicted DO"
          icon={BrainCircuit}
          value={data ? data.predictedDO.toFixed(2) : "—"}
          unit="mg/L"
          status={data && data.predictedDO >= RANGES.predictedDO.min ? "Normal" : "Attention"}
          rangeText={`Healthy ≥ ${RANGES.predictedDO.min} mg/L`}
          note="Predicted on-device by the ESP32 edge AI model."
          {...(data && prev ? { trend: +(data.predictedDO - prev.predictedDO).toFixed(2) } : {})}
        />
        <MetricCard
          label="Biological Delta (Δ)"
          icon={Sigma}
          value={data ? data.delta.toFixed(2) : "—"}
          unit="mg/L"
          status={data ? (data.delta < DELTA_THRESHOLD ? "Normal" : "Attention") : undefined}
          rangeText={`Threshold ${DELTA_THRESHOLD.toFixed(1)} mg/L`}
          note={`Δ = Baseline DO (${BASELINE_DO.toFixed(1)} mg/L) − Predicted DO`}
          {...(data && prev ? { trend: +(data.delta - prev.delta).toFixed(2) } : {})}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Recent Trend"
          description="Temperature and TDS over the last 6 hours (simulated)"
        >
          <SensorChart
            data={recent}
            dualAxis
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

        <Panel title="Water Quality Overview" description="Current condition summary">
          <ul className="space-y-3 text-sm">
            {[
              { label: "Temperature", value: data ? `${data.temperature.toFixed(1)} °C` : "—" },
              { label: "TDS", value: data ? `${data.tds} ppm` : "—" },
              { label: "Predicted DO", value: data ? `${data.predictedDO.toFixed(2)} mg/L` : "—" },
              { label: "Biological Delta", value: data ? `${data.delta.toFixed(2)} mg/L` : "—" },
            ].map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0"
              >
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-mono">{row.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border-strong bg-secondary/60 px-4 py-3">
            <span className="text-sm text-muted-foreground">Overall condition</span>
            <StatusBadge label={data?.status ?? "…"} />
          </div>
          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Activity className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <p>
              Delta below {DELTA_THRESHOLD.toFixed(1)} mg/L is reported as NORMAL; reaching the
              threshold is reported as ATTENTION. Alerts are informational only.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
