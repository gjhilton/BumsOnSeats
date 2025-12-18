import { CalendarOfPerformances } from "@components/CalendarOfPerformances/CalendarOfPerformances";
import { PageLayout, PageContent } from "@components/PageLayout";

export function PerformancesPage({ contentHtml, data }) {
  return (
    <PageLayout title={<bold>Calendar<bold> of Performances & Receipts (1732-1809)}>
		<PageContent html={contentHtml} />
      <CalendarOfPerformances data={data} />
    </PageLayout>
  );
}
