import { useEffect, useState } from "react";
import {
  getAlerts,
  getHistoricalSensorData,
  getLatestSensorData,
  getPrediction,
  getSystemStatus,
} from "@/services/sensorService";
import type {
  AlertItem,
  LatestSensorData,
  PredictionInfo,
  SensorReading,
  SystemComponent,
} from "@/types/sensor";

/** Latest reading. Pass a refresh interval (ms) to simulate a live stream. */
export function useLatestSensorData(intervalMs?: number) {
  const [data, setData] = useState<LatestSensorData | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    getLatestSensorData(tick).then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, [tick]);

  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { data, tick, loading: data === null };
}

export function useHistoricalData(hours = 24) {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getHistoricalSensorData(hours).then((d) => {
      if (!active) return;
      setData(d);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [hours]);

  return { data, loading };
}

export function usePrediction(intervalMs?: number) {
  const [data, setData] = useState<PredictionInfo | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    getPrediction(tick).then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, [tick]);

  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { data, loading: data === null };
}

export function useAlerts() {
  const [data, setData] = useState<AlertItem[]>([]);
  useEffect(() => {
    let active = true;
    getAlerts().then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, []);
  return { data };
}

export function useSystemStatus() {
  const [data, setData] = useState<SystemComponent[]>([]);
  useEffect(() => {
    let active = true;
    getSystemStatus().then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, []);
  return { data };
}
