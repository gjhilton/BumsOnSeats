import { loadPerformanceData } from "@/lib/loadPerformanceData";
import { PerformancesPage } from "./PerformancesPage";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/performances/description.md";

export function PerformancesDataContainer() {
  return (
    <DataContainer loadData={loadPerformanceData}>
      {(data) => <PerformancesPage contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
}
