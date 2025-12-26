import { createRoute } from "@tanstack/react-router";
import { Playbill } from "../components/Playbill/Playbill";
import { useFontSource } from "../hooks/useFontSource";
import { Route as rootRoute } from "./__root";

function Index() {
  let fontSource = useFontSource();
  //fontSource = 'local'

  return <Playbill fontSource={fontSource} />;
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});
