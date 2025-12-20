import { createFileRoute } from "@tanstack/react-router";
import { CapacityRevenueDataContainer } from "@components/CapacityRevenue";

export const Route = createFileRoute("/capacity-revenue")({
  component: CapacityRevenueDataContainer,
});
