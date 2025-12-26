import { PageLayout, PageContent } from "@components/PageLayout";
import { PageThreeVisualization } from "./PageThreeVisualization";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";
import { PAGE_TITLES } from "@/constants/pageTitles";

export const PageThree = ({ contentHtml, data }) => {
  return (
    <PageLayout title={PAGE_TITLES.PAGE_THREE.full()}>
      <PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <PageThreeVisualization data={data} />
      </ChartErrorBoundary>
    </PageLayout>
  );
};
