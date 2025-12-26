import { PageOneVisualization } from "./PageOneVisualization";
import { PageLayout, PageContent } from "@components/PageLayout";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";
import { PAGE_TITLES } from "@/constants/pageTitles";

export function PageOne({ contentHtml, data }) {
  return (
    <PageLayout title={PAGE_TITLES.PAGE_ONE.full()}>
		<PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <PageOneVisualization data={data} />
      </ChartErrorBoundary>
    </PageLayout>
  );
}
