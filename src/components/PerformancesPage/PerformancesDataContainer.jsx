import { useState, useEffect } from "react";
import * as d3 from "d3";
import { processPerformanceData } from "@lib/processPerformanceData";
import { PerformancesPage } from "./PerformancesPage";
import { css } from "@generated/css";
import { html as contentHtml } from "@content/performances/description.md";

const DataLoading = () => <div className={css({ padding: "2rem", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          Loading performance data...
        </h1>
      </div>

const DataNone = () =>  <div className={css({ padding: "2rem", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          No data available
        </h1>
      </div>

const DataError = ({message}) =>  <div className={css({ padding: "2rem", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg", color: "accent" })}>
          Error loading data
        </h1>
        <p>{message}</p>
      </div>



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
      <DataLoading />
    );
  }

  if (error) {
    return (
     <DataError message={error.message} />
    );
  }

  if (!data) {
    return (
     <DataNone />
    );
  }

  return <PerformancesPage contentHtml={contentHtml} data={data} />;
}
