import { PageLayout, PageContent } from "@components/PageLayout";
import { CapacityRevenueVisualization } from "./CapacityRevenueVisualization";

export const CapacityRevenuePage = ({ contentHtml, data }) => {
  return (
    <PageLayout title={<><b>Capacity vs Revenue</b></>}>
      <PageContent html={contentHtml} />
      <CapacityRevenueVisualization data={data} />
    </PageLayout>
  );
};
