import { CalendarOfPerformances } from "@components/CalendarOfPerformances/CalendarOfPerformances";
import { PageLayout, PageContent } from "@components/PageLayout";
import { ChartErrorBoundary } from "@components/ChartErrorBoundary/ChartErrorBoundary";

export function PerformancesPage({ contentHtml, data }) {
  return (
    <PageLayout title={<><b>Calendar</b> of Performances &amp; Receipts (1732-1809)</>}>
		<PageContent html={contentHtml} />
      <ChartErrorBoundary>
        <CalendarOfPerformances data={data} />
      </ChartErrorBoundary>
    </PageLayout>
  );
}
