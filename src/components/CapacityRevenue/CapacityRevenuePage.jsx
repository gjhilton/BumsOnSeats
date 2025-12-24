import { PageLayout, PageContent } from "@components/PageLayout";
import { CapacityRevenueVisualization } from "./CapacityRevenueVisualization";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";

export const CapacityRevenuePage = ({ contentHtml, data }) => {
  return (
    <PageLayout title={<><b>Capacity vs Revenue</b></>}>
      <PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <CapacityRevenueVisualization data={data} />
      </ChartErrorBoundary>
    </PageLayout>
  );
};
