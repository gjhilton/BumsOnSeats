import { createRoute } from "@tanstack/react-router";
import { CapacityRevenueDataContainer } from "@components/CapacityRevenue";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/capacity-revenue",
  component: CapacityRevenueDataContainer,
});
