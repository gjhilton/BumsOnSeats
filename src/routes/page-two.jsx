import { createRoute } from "@tanstack/react-router";
import { PageTwoDataContainer } from "@components/PageTwo";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/page-two",
  component: PageTwoDataContainer,
});
