import { useCallback } from "react";
import * as d3 from "d3";
import { processPerformanceData } from "@lib/processPerformanceData";
import { PerformancesPage } from "./PerformancesPage";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/performances/description.md";

export function PerformancesDataContainer() {
  const loadData = useCallback(() => {
    return d3.csv('/BumsOnSeats/data/plays_export_2025-12-15_21-52-04.csv')
      .then(processPerformanceData);
  }, []);

  return (
    <DataContainer loadData={loadData}>
      {(data) => <PerformancesPage contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
}
