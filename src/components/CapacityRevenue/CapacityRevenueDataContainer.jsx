import { useCallback } from "react";
import * as d3 from "d3";
import { processPerformanceData } from "@lib/processPerformanceData";
import { CapacityRevenuePage } from "./CapacityRevenuePage";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/capacity-revenue/description.md";

export const CapacityRevenueDataContainer = () => {
  const loadData = useCallback(() => {
    return d3.csv('/BumsOnSeats/data/plays_export_2025-12-15_21-52-04.csv')
      .then(processPerformanceData);
  }, []);

  return (
    <DataContainer loadData={loadData}>
      {(data) => <CapacityRevenuePage contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
};
