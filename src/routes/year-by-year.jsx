import { createFileRoute } from "@tanstack/react-router";
import { YearByYearDataContainer } from "@components/YearByYear";

export const Route = createFileRoute("/year-by-year")({
  component: YearByYearDataContainer,
});
