import * as d3 from "d3";
import { processPerformanceData } from "./processPerformanceData";

export function loadPerformanceData() {
  return d3.csv('/BumsOnSeats/data/plays_export_2025-12-15_21-52-04.csv')
    .then(processPerformanceData);
}
