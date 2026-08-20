import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "@/config/api";
import {
  BASELINE_DO,
  DELTA_THRESHOLD,
  MOCK_ALERTS,
  MOCK_SYSTEM_COMPONENTS,
  generateHistory,
  generateLatest,
} from "@/data/mockData";
import type {
  AlertItem,
  LatestSensorData,
  PredictionInfo,
  SensorReading,
  SystemComponent,
} from "@/types/sensor";

/**
 * Single access point for all sensor data.
 * UI components must only talk to this service — never to mock data directly.
 * Replace the mock branches with `fetch(`${API_BASE_URL}${endpoint}`)` later.
 */

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export async function getLatestSensorData(tick = 0): Promise<LatestSensorData> {
  if (USE_MOCK_DATA) {
    await delay();
    return generateLatest(tick);
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.latest}`);
  return (await res.json()) as LatestSensorData;
}

export async function getHistoricalSensorData(hours = 24): Promise<SensorReading[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return generateHistory(hours);
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.historical}?hours=${hours}`);
  return (await res.json()) as SensorReading[];
}

export async function getPrediction(tick = 0): Promise<PredictionInfo> {
  if (USE_MOCK_DATA) {
    const latest = await getLatestSensorData(tick);
    return {
      inputs: { temperature: latest.temperature, tds: latest.tds },
      outputs: {
        predictedDO: latest.predictedDO,
        delta: latest.delta,
        condition: latest.status,
      },
      baselineDO: BASELINE_DO,
      deltaThreshold: DELTA_THRESHOLD,
      inferenceLocation: "ESP32 Edge Device",
      cloudDependency: "Not Required for Inference",
      inferenceTimeMs: 18,
      lastInferenceAt: latest.timestamp,
    };
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.prediction}`);
  return (await res.json()) as PredictionInfo;
}

export async function getAlerts(): Promise<AlertItem[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return MOCK_ALERTS;
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.alerts}`);
  return (await res.json()) as AlertItem[];
}

export async function getSystemStatus(): Promise<SystemComponent[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return MOCK_SYSTEM_COMPONENTS;
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.systemStatus}`);
  return (await res.json()) as SystemComponent[];
}
