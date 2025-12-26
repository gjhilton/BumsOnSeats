import { loadPerformanceData } from "@/lib/loadPerformanceData";
import { PageTwo } from "./PageTwo";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/page-two/description.md";

export const PageTwoDataContainer = () => {
  return (
    <DataContainer loadData={loadPerformanceData}>
      {(data) => <PageTwo contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
};
