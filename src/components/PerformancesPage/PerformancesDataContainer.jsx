import { useState, useEffect } from "react";
import * as d3 from "d3";
import { processPerformanceData } from "@lib/processPerformanceData";
import { PerformancesPage } from "./PerformancesPage";
import { css } from "@generated/css";

export function PerformancesDataContainer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    d3.csv('/BumsOnSeats/data/plays_export_2025-12-15_21-52-04.csv')
      .then(processPerformanceData)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={css({ padding: "2rem", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          Loading performance data...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={css({ padding: "2rem", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg", color: "accent" })}>
          Error loading data
        </h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={css({ padding: "2rem", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          No data available
        </h1>
      </div>
    );
  }

  return <PerformancesPage data={data} />;
}
