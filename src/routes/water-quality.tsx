import { createFileRoute } from "@tanstack/react-router";
import { Panel, PageHeader } from "@/components/Panel";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { SensorChart } from "@/components/SensorChart";
import { StatusBadge } from "@/components/StatusBadge";
import { BASELINE_DO, DELTA_THRESHOLD, RANGES } from "@/data/mockData";
import { useHistoricalData, useLatestSensorData } from "@/hooks/useSensorData";
import { stats } from "@/utils/format";

export const Route = createFileRoute("/water-quality")({
  head: () => ({
    meta: [
      { title: "Water Quality — AIoT Aquaculture" },
      {
        name: "description",
        content:
          "Detailed water quality analysis: temperature, TDS, predicted dissolved oxygen and biological delta with min, max and average statistics.",
      },
      { property: "og:title", content: "Water Quality — AIoT Aquaculture" },
      {
        property: "og:description",
        content: "Detailed temperature, TDS, DO and biological delta analysis.",
      },
    ],
  }),
  component: WaterQualityPage,
});

function StatRow({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{i.label}</p>
          <p className="mt-1 font-mono text-lg">{i.value}</p>
        </div>
      ))}
    </div>
  );
}

function WaterQualityPage() {
  const { data: history } = useHistoricalData(24);
  const { data: latest } = useLatestSensorData();

  if (!history.length || !latest) {
    return (
      <div className="space-y-6">
        <PageHeader title="Water Quality" subtitle="Loading parameter analysis…" />
      </div>
    );
  }

  const t = stats(history.map((r) => r.temperature));
  const d = stats(history.map((r) => r.tds));
  const o = stats(history.map((r) => r.predictedDO));
  const dl = stats(history.map((r) => r.delta));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Water Quality"
        subtitle="Parameter-level analysis over the last 24 hours"
        action={<StatusBadge label={latest.status} />}
      />
      <PrototypeBanner />

      <Panel title="Temperature" description={`DS18B20 · normal range ${RANGES.temperature.min}–${RANGES.temperature.max} °C`}>
        <StatRow
          items={[
            { label: "Current", value: `${latest.temperature.toFixed(1)} °C` },
            { label: "Minimum", value: `${t.min.toFixed(1)} °C` },
            { label: "Maximum", value: `${t.max.toFixed(1)} °C` },
            { label: "Average", value: `${t.avg.toFixed(1)} °C` },
          ]}
        />
        <SensorChart
          data={history}
          series={[
            { key: "temperature", name: "Temperature", color: "var(--color-chart-1)", unit: "°C" },
          ]}
        />
      </Panel>

      <Panel title="Total Dissolved Solids (TDS)" description={`Analog TDS sensor · typical ${RANGES.tds.min}–${RANGES.tds.max} ppm`}>
        <StatRow
          items={[
            { label: "Current", value: `${latest.tds} ppm` },
            { label: "Minimum", value: `${Math.round(d.min)} ppm` },
            { label: "Maximum", value: `${Math.round(d.max)} ppm` },
            { label: "Average", value: `${Math.round(d.avg)} ppm` },
          ]}
        />
        <SensorChart
          data={history}
          series={[{ key: "tds", name: "TDS", color: "var(--color-chart-2)", unit: "ppm" }]}
        />
      </Panel>

      <Panel
        title="Dissolved Oxygen (Predicted)"
        description="Predicted on the ESP32 by the edge AI model from temperature and TDS"
      >
        <StatRow
          items={[
            { label: "Predicted DO", value: `${latest.predictedDO.toFixed(2)} mg/L` },
            { label: "Minimum", value: `${o.min.toFixed(2)} mg/L` },
            { label: "Maximum", value: `${o.max.toFixed(2)} mg/L` },
            { label: "Average", value: `${o.avg.toFixed(2)} mg/L` },
          ]}
        />
        <div className="mb-4">
          <StatusBadge
            label={latest.predictedDO >= RANGES.predictedDO.min ? "DO Normal" : "DO Low"}
            tone={latest.predictedDO >= RANGES.predictedDO.min ? "normal" : "attention"}
          />
        </div>
        <SensorChart
          data={history}
          series={[
            { key: "predictedDO", name: "Predicted DO", color: "var(--color-chart-3)", unit: "mg/L" },
          ]}
        />
      </Panel>

      <Panel
        title="Biological Delta (Δ)"
        description={`Δ = Baseline DO (${BASELINE_DO.toFixed(1)} mg/L) − Predicted DO · threshold ${DELTA_THRESHOLD.toFixed(1)} mg/L`}
      >
        <StatRow
          items={[
            { label: "Current Δ", value: `${latest.delta.toFixed(2)} mg/L` },
            { label: "Threshold", value: `${DELTA_THRESHOLD.toFixed(1)} mg/L` },
            { label: "Maximum", value: `${dl.max.toFixed(2)} mg/L` },
            { label: "Average", value: `${dl.avg.toFixed(2)} mg/L` },
          ]}
        />
        <div className="mb-4">
          <StatusBadge label={latest.delta < DELTA_THRESHOLD ? "NORMAL" : "ATTENTION"} />
        </div>
        <SensorChart
          data={history}
          threshold={DELTA_THRESHOLD}
          series={[
            { key: "delta", name: "Biological Delta", color: "var(--color-chart-4)", unit: "mg/L" },
          ]}
        />
      </Panel>
    </div>
  );
}
