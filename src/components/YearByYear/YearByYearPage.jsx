import { PageLayout, PageContent } from "@components/PageLayout";
import { YearByYearVisualization } from "./YearByYearVisualization";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";

export const YearByYearPage = ({ contentHtml, data }) => {
  return (
    <PageLayout title={<><b>Year by Year</b> Analysis (1732-1809)</>}>
      <PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <YearByYearVisualization data={data} />
      </ChartErrorBoundary>
    </PageLayout>
  );
};
