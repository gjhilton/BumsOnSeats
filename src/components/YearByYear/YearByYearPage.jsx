import { PageLayout, PageContent } from "@components/PageLayout";
import { YearByYearVisualization } from "./YearByYearVisualization";

export const YearByYearPage = ({ contentHtml, data }) => {
  return (
    <PageLayout title={<><b>Year by Year</b> Analysis (1732-1809)</>}>
      <PageContent html={contentHtml} />
      <YearByYearVisualization data={data} />
    </PageLayout>
  );
};
