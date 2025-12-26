import { css } from "@generated/css";
import { TOOLTIP_CONFIG, THEME } from "./constants";

export function Tooltip({ tooltipRef }) {
  return (
    <div
      ref={tooltipRef}
      className={css({
        position: "fixed",
        padding: "10px",
        background: "black",
        color: THEME.BORDER_WHITE,
        border: "1px solid",
        borderColor: "ink",
        borderRadius: TOOLTIP_CONFIG.BORDER_RADIUS,
        fontSize: TOOLTIP_CONFIG.FONT_SIZE,
        pointerEvents: "none",
        opacity: TOOLTIP_CONFIG.OPACITY_HIDDEN,
        transition: TOOLTIP_CONFIG.TRANSITION,
        zIndex: TOOLTIP_CONFIG.Z_INDEX,
        lineHeight: TOOLTIP_CONFIG.LINE_HEIGHT,
        maxWidth: "300px"
      })}
    />
  );
}
