import { createFileRoute } from "@tanstack/react-router";
import { Playbill } from "../components/Playbill/Playbill";
import { useFontSource } from "../utils/useFontSource";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  let fontSource = useFontSource();
  //fontSource = 'local'

  return <Playbill fontSource={fontSource} />;
}
