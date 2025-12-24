import { createRoute } from "@tanstack/react-router";
import { YearByYearDataContainer } from "@components/YearByYear";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/year-by-year",
  component: YearByYearDataContainer,
});
