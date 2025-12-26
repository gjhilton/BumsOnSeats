import { PageLayout, PageContent } from "@components/PageLayout";
import { PageTwoVisualization } from "./PageTwoVisualization";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";
import { PAGE_TITLES } from "@/constants/pageTitles";

export const PageTwo = ({ contentHtml, data }) => {
  return (
    <PageLayout title={PAGE_TITLES.PAGE_TWO.full()}>
      <PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <PageTwoVisualization data={data} />
      </ChartErrorBoundary>
    </PageLayout>
  );
};
