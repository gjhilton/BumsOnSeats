import { loadPerformanceData } from "@/lib/loadPerformanceData";
import { CapacityRevenuePage } from "./CapacityRevenuePage";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/capacity-revenue/description.md";

export const CapacityRevenueDataContainer = () => {
  return (
    <DataContainer loadData={loadPerformanceData}>
      {(data) => <CapacityRevenuePage contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
};
