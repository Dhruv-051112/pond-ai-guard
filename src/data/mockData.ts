import type {
  AlertItem,
  ConditionStatus,
  LatestSensorData,
  SensorReading,
  SystemComponent,
} from "@/types/sensor";

export const DEVICE_ID = "ESP32-AQUA-01";
export const BASELINE_DO = 8.0;
export const DELTA_THRESHOLD = 2.0;

export const RANGES = {
  temperature: { min: 24, max: 32, unit: "°C" },
  tds: { min: 250, max: 600, unit: "ppm" },
  predictedDO: { min: 5.0, max: 9.0, unit: "mg/L" },
  delta: { min: 0, max: DELTA_THRESHOLD, unit: "mg/L" },
} as const;

export function classify(delta: number): ConditionStatus {
  if (delta >= DELTA_THRESHOLD + 0.6) return "CRITICAL";
  if (delta >= DELTA_THRESHOLD) return "ATTENTION";
  return "NORMAL";
}

/** Deterministic pseudo-random so charts stay stable between renders. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x) - 0.5;
}

function predictDO(temperature: number, tds: number) {
  // Placeholder relationship used only to generate plausible mock outputs.
  const value = 11.6 - 0.16 * temperature - 0.0022 * (tds - 300);
  return Math.max(3.5, Math.min(9.5, value));
}

export function buildReading(index: number, timestamp: Date): SensorReading {
  const temperature = 28.4 + Math.sin(index / 7) * 1.1 + noise(index) * 0.4;
  const tds = 420 + Math.cos(index / 9) * 45 + noise(index + 50) * 18;
  const predictedDO = predictDO(temperature, tds);
  const delta = Math.max(0, BASELINE_DO - predictedDO);
  return {
    timestamp: timestamp.toISOString(),
    temperature: +temperature.toFixed(1),
    tds: Math.round(tds),
    predictedDO: +predictedDO.toFixed(2),
    delta: +delta.toFixed(2),
    status: classify(delta),
  };
}

/** 24 hours of readings, one every 15 minutes (96 points). */
export function generateHistory(hours = 24, stepMinutes = 15): SensorReading[] {
  const points = Math.round((hours * 60) / stepMinutes);
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const ts = new Date(now - (points - 1 - i) * stepMinutes * 60_000);
    return buildReading(i, ts);
  });
}

export function generateLatest(tick = 0): LatestSensorData {
  const reading = buildReading(1000 + tick, new Date());
  return {
    ...reading,
    deviceId: DEVICE_ID,
    deviceStatus: "ONLINE",
    uptimeSeconds: 187_425 + tick * 5,
  };
}

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: "ALR-1042",
    severity: "critical",
    parameter: "Biological Delta",
    message: "Biological Delta exceeded configured threshold (2.0 mg/L).",
    timestamp: new Date(Date.now() - 42 * 60_000).toISOString(),
    resolved: false,
  },
  {
    id: "ALR-1041",
    severity: "warning",
    parameter: "Biological Delta",
    message: "Biological Delta approaching threshold.",
    timestamp: new Date(Date.now() - 3 * 3600_000).toISOString(),
    resolved: false,
  },
  {
    id: "ALR-1040",
    severity: "warning",
    parameter: "TDS",
    message: "TDS drifted above the typical operating band (600 ppm).",
    timestamp: new Date(Date.now() - 5 * 3600_000).toISOString(),
    resolved: true,
  },
  {
    id: "ALR-1039",
    severity: "info",
    parameter: "Temperature",
    message: "Temperature within acceptable range.",
    timestamp: new Date(Date.now() - 7 * 3600_000).toISOString(),
    resolved: true,
  },
  {
    id: "ALR-1038",
    severity: "info",
    parameter: "Edge AI Model",
    message: "Edge inference cycle completed successfully on ESP32.",
    timestamp: new Date(Date.now() - 9 * 3600_000).toISOString(),
    resolved: true,
  },
  {
    id: "ALR-1037",
    severity: "warning",
    parameter: "Predicted DO",
    message: "Predicted dissolved oxygen trending downward over the last hour.",
    timestamp: new Date(Date.now() - 12 * 3600_000).toISOString(),
    resolved: true,
  },
  {
    id: "ALR-1036",
    severity: "info",
    parameter: "Data Acquisition",
    message: "Sensor sampling interval synchronised at 15 s.",
    timestamp: new Date(Date.now() - 18 * 3600_000).toISOString(),
    resolved: true,
  },
];

export const MOCK_SYSTEM_COMPONENTS: SystemComponent[] = [
  { name: "ESP32 Edge Device", state: "ONLINE", detail: `Device ID ${DEVICE_ID} · Wi-Fi RSSI -58 dBm` },
  { name: "DS18B20 Temperature Sensor", state: "CONNECTED", detail: "1-Wire bus · sampling every 15 s" },
  { name: "TDS Sensor", state: "CONNECTED", detail: "Analog input · sampling every 15 s" },
  { name: "Edge AI Model", state: "ACTIVE", detail: "On-device inference · no cloud dependency" },
  { name: "Data Acquisition", state: "ACTIVE", detail: "Buffered readings streaming to dashboard" },
  { name: "REST API", state: "MOCK", detail: "NOT CONNECTED — mock mode" },
  { name: "Database", state: "MOCK", detail: "MOCK DATA — persistence layer pending" },
];
