import { PageLayout, PageContent } from "@components/PageLayout";
import { PageTwoVisualization } from "./PageTwoVisualization";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";
import { VisualizationWrapper } from "@components/VisualizationWrapper/VisualizationWrapper";
import { PAGE_TITLES } from "@/constants/pageTitles";

export const PageTwo = ({ contentHtml, data }) => {
  return (
    <PageLayout title={PAGE_TITLES.PAGE_TWO.full()}>
      <PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <VisualizationWrapper>
          <PageTwoVisualization data={data} />
        </VisualizationWrapper>
      </ChartErrorBoundary>
    </PageLayout>
  );
};
