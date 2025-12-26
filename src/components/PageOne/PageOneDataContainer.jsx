import { loadPerformanceData } from "@/lib/loadPerformanceData";
import { PageOne } from "./PageOne";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/page-one/description.md";

export function PageOneDataContainer() {
  return (
    <DataContainer loadData={loadPerformanceData}>
      {(data) => <PageOne contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
}
