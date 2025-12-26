import { createRoute } from "@tanstack/react-router";
import { PageOneDataContainer } from "@components/PageOne";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/page-one",
  component: PageOneDataContainer,
});
