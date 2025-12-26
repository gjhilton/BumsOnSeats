import { PageOneVisualization } from "./PageOneVisualization";
import { PageLayout, PageContent } from "@components/PageLayout";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";
import { VisualizationWrapper } from "@components/VisualizationWrapper/VisualizationWrapper";
import { PAGE_TITLES } from "@/constants/pageTitles";

export function PageOne({ contentHtml, data }) {
  return (
    <PageLayout title={PAGE_TITLES.PAGE_ONE.full()}>
		<PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <VisualizationWrapper>
          <PageOneVisualization data={data} />
        </VisualizationWrapper>
      </ChartErrorBoundary>
    </PageLayout>
  );
}
