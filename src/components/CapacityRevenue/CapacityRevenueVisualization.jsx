import { css } from "@generated/css";
import { PageWidth } from "../PageLayout/PageLayout";

export const CapacityRevenueVisualization = ({ data }) => {
  return (
    <PageWidth>
      <svg width="800" height="600">
        <rect x="0" y="0" width="800" height="600" fill="white" stroke="black" strokeWidth="2" />
      </svg>
    </PageWidth>
  );
};
