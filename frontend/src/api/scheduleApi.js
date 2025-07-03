/**
 * API helper for CPU‑Scheduler Visualizer (React / CRA / Vercel)
 */
import axios from "axios";

/*----------------------------------------------------------------
  Resolve the backend URL in this priority order:

  1. REACT_APP_API_BASE_URL  – set in Vercel & local .env
  2. http://localhost:8000   – default for local Django dev server
  3. Hard‑coded Render URL   – final safety net
----------------------------------------------------------------*/
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : "https://cpu-scheduler-backend.onrender.com");

/**
 * POST a scheduling request and normalise the response
 * @param {object} payload – { algorithm, processes, ... }
 * @returns {Promise<{gantt:[], table:[], averages:{}, debug:{}}>}
 */
export async function sendScheduleRequest(payload) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/schedule/`,
      payload,
      { headers: { "Content-Type": "application/json" } }
      // withCredentials: true // ← enable later if you add auth cookies
    );

    console.log("📡 backend response:", data);

    return {
      gantt:    data.gantt    ?? [],
      table:    data.table    ?? [],
      averages: data.averages ?? {},
      debug:    data.debug    ?? {},
    };
  } catch (error) {
    console.error("❌ backend error:", error);

    return {
      gantt: [],
      table: [],
      averages: {
        completion: "N/A",
        turnaround: "N/A",
        waiting:    "N/A",
      },
      debug: {
        exe_path:   "N/A",
        input:      "N/A",
        raw_output: error.response?.data?.error || "Unknown Error",
      },
    };
  }
}
