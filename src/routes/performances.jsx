import { createRoute } from "@tanstack/react-router";
import { PerformancesDataContainer } from "@components/PerformancesPage";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/performances",
  component: PerformancesDataContainer,
});
