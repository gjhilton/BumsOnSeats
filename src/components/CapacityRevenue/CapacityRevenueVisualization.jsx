import { css } from "@generated/css";

export const CapacityRevenueVisualization = ({ data }) => {
  return (
    <div className={css({ marginTop: "xl", width: "100%" })}>
      <svg width="800" height="600">
        <rect x="0" y="0" width="800" height="600" fill="white" stroke="black" strokeWidth="2" />
      </svg>
    </div>
  );
};
