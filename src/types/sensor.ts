export type ConditionStatus = "NORMAL" | "ATTENTION" | "CRITICAL";

export interface SensorReading {
  timestamp: string;
  temperature: number;
  tds: number;
  predictedDO: number;
  delta: number;
  status: ConditionStatus;
}

export interface LatestSensorData extends SensorReading {
  deviceId: string;
  deviceStatus: "ONLINE" | "OFFLINE";
  uptimeSeconds: number;
}

export interface PredictionInfo {
  inputs: { temperature: number; tds: number };
  outputs: {
    predictedDO: number;
    delta: number;
    condition: ConditionStatus;
  };
  baselineDO: number;
  deltaThreshold: number;
  inferenceLocation: string;
  cloudDependency: string;
  inferenceTimeMs: number;
  lastInferenceAt: string;
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  parameter: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export type ComponentState = "ONLINE" | "CONNECTED" | "ACTIVE" | "MOCK" | "OFFLINE";

export interface SystemComponent {
  name: string;
  state: ComponentState;
  detail: string;
}

export interface MetricStats {
  current: number;
  min: number;
  max: number;
  avg: number;
}
