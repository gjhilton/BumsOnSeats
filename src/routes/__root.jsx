import { createRootRoute, Outlet } from "@tanstack/react-router";
import { MobileWarningBanner } from "@/components/MobileWarningBanner/MobileWarningBanner";

export const Route = createRootRoute({
  component: () => (
    <>
      <MobileWarningBanner />
      <Outlet />
    </>
  ),
});
