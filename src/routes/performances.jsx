import { createFileRoute } from "@tanstack/react-router";
import { PerformancesDataContainer } from "@components/PerformancesPage";

export const Route = createFileRoute("/performances")({
  component: PerformancesDataContainer,
});
