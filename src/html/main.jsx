import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "../routes/__root";
import { Route as indexRoute } from "../routes/index";
import { Route as performancesRoute } from "../routes/performances";
import { Route as yearByYearRoute } from "../routes/year-by-year";
import { Route as capacityRevenueRoute } from "../routes/capacity-revenue";
import "../../styled-system/styles.css";
import "@style/index.css";

// Create route tree manually
const routeTree = rootRoute.addChildren([
  indexRoute,
  performancesRoute,
  yearByYearRoute,
  capacityRevenueRoute,
]);

// Create a new router instance
const router = createRouter({
  routeTree,
  basepath: "/BumsOnSeats",
});

// Render the app
const rootElement = document.getElementById("root");
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
