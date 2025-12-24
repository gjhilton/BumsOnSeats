import { loadPerformanceData } from "@/lib/loadPerformanceData";
import { YearByYearPage } from "./YearByYearPage";
import { DataContainer } from "@components/DataContainer";
import { html as contentHtml } from "@content/year-by-year/description.md";

export const YearByYearDataContainer = () => {
  return (
    <DataContainer loadData={loadPerformanceData}>
      {(data) => <YearByYearPage contentHtml={contentHtml} data={data} />}
    </DataContainer>
  );
};
