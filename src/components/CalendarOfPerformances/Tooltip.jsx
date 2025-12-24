import { css } from "@generated/css";
import { TOOLTIP_CONFIG, THEME } from "./constants";

export function Tooltip({ tooltipRef }) {
  return (
    <div
      ref={tooltipRef}
      className={css({
        position: "fixed",
        padding: TOOLTIP_CONFIG.PADDING,
        background: TOOLTIP_CONFIG.BACKGROUND,
        color: THEME.BORDER_WHITE,
        borderRadius: TOOLTIP_CONFIG.BORDER_RADIUS,
        fontSize: TOOLTIP_CONFIG.FONT_SIZE,
        pointerEvents: "none",
        opacity: TOOLTIP_CONFIG.OPACITY_HIDDEN,
        transition: TOOLTIP_CONFIG.TRANSITION,
        zIndex: TOOLTIP_CONFIG.Z_INDEX,
        lineHeight: TOOLTIP_CONFIG.LINE_HEIGHT,
      })}
    />
  );
}
