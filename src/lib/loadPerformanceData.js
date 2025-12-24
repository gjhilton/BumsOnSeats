import * as d3 from "d3";
import { processPerformanceData } from "./processPerformanceData";
import { APP_CONFIG } from "@/config/app";

export function loadPerformanceData() {
  return d3.csv(APP_CONFIG.DATA_PATH)
    .then(processPerformanceData);
}
