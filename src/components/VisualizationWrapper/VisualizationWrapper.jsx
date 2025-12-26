import { css } from "@generated/css";

export const VisualizationWrapper = ({ children }) => (
  <div
    className={css({
      "@media (max-width: 768px)": {
        overflowX: "auto",
        width: "100%",
      }
    })}
  >
    <div
      className={css({
        "@media (max-width: 768px)": {
          minWidth: "1024px",
        }
      })}
    >
      {children}
    </div>
  </div>
);
