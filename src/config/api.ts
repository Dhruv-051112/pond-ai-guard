/**
 * API configuration placeholder.
 *
 * The frontend currently runs in mock mode. When the Python/REST backend is
 * ready, set VITE_API_BASE_URL in a .env file and flip USE_MOCK_DATA to false;
 * only src/services/sensorService.ts needs new fetch implementations.
 */
export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ??
  "http://localhost:8000/api";

export const USE_MOCK_DATA = true;

export const API_ENDPOINTS = {
  latest: "/sensors/latest",
  historical: "/sensors/history",
  prediction: "/ai/prediction",
  alerts: "/alerts",
  systemStatus: "/system/status",
} as const;
