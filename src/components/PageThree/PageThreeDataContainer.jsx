import { loadPerformanceData } from "@/lib/loadPerformanceData";
import { PageThree } from "./PageThree";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/page-three/description.md";

export const PageThreeDataContainer = () => {
  return (
    <DataContainer loadData={loadPerformanceData}>
      {(data) => <PageThree contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
};
