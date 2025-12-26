import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "../routes/__root";
import { Route as indexRoute } from "../routes/index";
import { Route as pageOneRoute } from "../routes/page-one";
import { Route as pageTwoRoute } from "../routes/page-two";
import { Route as pageThreeRoute } from "../routes/page-three";
import "../../styled-system/styles.css";
import "@style/index.css";

// Create route tree manually
const routeTree = rootRoute.addChildren([
  indexRoute,
  pageOneRoute,
  pageTwoRoute,
  pageThreeRoute,
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
