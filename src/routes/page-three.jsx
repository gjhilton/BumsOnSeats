import { createRoute } from "@tanstack/react-router";
import { PageThreeDataContainer } from "@components/PageThree";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/page-three",
  component: PageThreeDataContainer,
});
