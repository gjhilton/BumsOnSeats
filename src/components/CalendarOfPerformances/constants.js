import { token } from "@generated/tokens";
import { THEATRE_COLORS } from "@/constants/theatre";

export const OVERLAY_GREY = THEATRE_COLORS.BOTH;

export const CHART_MARGINS = {
  top: 50,
  right: 128,
  bottom: 20,
  left: 128
};

export const ROW_HEIGHT = 25;

export const PERFORMANCE_CONFIG = {
  OPACITY: 1,
  MIN_BAR_HEIGHT: 2,
  BLEND_MODE: 'normal'
};

export const NO_DATA_MARKER_CONFIG = {
  HEIGHT: 3,
  WIDTH_FACTOR: 0.6,
  OPACITY: 0.35,
  Y_OFFSET: 0
};

// Feature flag: Controls stub mark height strategy
// 'FIXED' = Use fixed 1px height at 100% opacity (minimalist baseline)
// 'AVERAGE' = Use annual average receipt value to determine height at 35% opacity
export const STUB_MARK_STRATEGY = 'FIXED';

export const LEGEND_CONFIG = {
  FONT_SIZE: "1.5rem",
  CHECKBOX_SIZE: 18,
  MAX_HEIGHT: 20,
  BAR_WIDTH: 2,
  PLAQUE_HEIGHT: 32,
  PLAQUE_PADDING: "0 0.75rem",
  FONT_WEIGHT_BOLD: "bold",
  FONT_WEIGHT_SEMIBOLD: "600"
};

export const AXIS_CONFIG = {
  FONT_SIZE: "20px",
  TITLE_FONT_SIZE: "36px",
  YEAR_TICK_INTERVAL: 10,
  YEAR_TICK_OFFSET: 8,
  MONTH_LABEL_Y: -18,
  LABEL_PADDING: 8,
  TITLE_FONT_WEIGHT: 900,
  Y_AXIS_TITLE_X: -50,
  X_AXIS_TITLE_Y: -30
};

export const TOOLTIP_CONFIG = {
  OFFSET_X: 10,
  OFFSET_Y: -10,
  PADDING: "0.5rem 0.75rem",
  BACKGROUND: "rgba(0, 0, 0, 0.85)",
  BORDER_RADIUS: "4px",
  FONT_SIZE: "12px",
  OPACITY_HIDDEN: 0,
  OPACITY_VISIBLE: 1,
  TRANSITION: "opacity 0.2s",
  Z_INDEX: 1000,
  LINE_HEIGHT: "1.4",
  DATE_FORMAT: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
};

export const MAGNIFIER_CONFIG = {
  RADIUS: 200,
  ZOOM_LEVEL: 5,
  BORDER_WIDTH: 3,
  BORDER_COLOR: token.var('colors.ink')
};

export const THEME = {
  AXIS_GREY: token.var('colors.paper'),
  BORDER_WHITE: token.var('colors.ink'),
  TRANSITION: "all 0.2s"
};

export const EXPORT_BUTTON_CONFIG = {
  PADDING: "0.5rem 1rem",
  FONT_SIZE: "14px",
  FONT_WEIGHT_SEMIBOLD: "600",
  BORDER_RADIUS: "4px",
  GAP: "0.5rem",
  CANVAS_BACKGROUND: token.var('colors.ink')
};

export const LAYOUT_CONFIG = {
  DEFAULT_WIDTH: 1200,
  CONTAINER_WIDTH: "100%",
  CONTAINER_MARGIN_TOP: "xl",
  LEGEND_GAP: "2rem",
  LEGEND_MARGIN_BOTTOM: "1rem",
  FILTER_GAP: "0.5rem",
  RECEIPTS_GAP: "3rem",
  RECEIPTS_MARGIN_BOTTOM: "2rem",
  RECEIPTS_ITEM_GAP: "0.5rem",
  RECEIPTS_LABEL_MARGIN: "0.5rem",
  NO_DATA_MARGIN_LEFT: "1rem",
  NO_DATA_PADDING_LEFT: "1rem",
  HEADER_MARGIN_BOTTOM: "1rem"
};

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_START_DAYS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

export const DAYS_IN_LEAP_YEAR = 366;
export const DAYS_IN_REGULAR_YEAR = 365;

export const CURRENCY_CONVERSION = {
  PENCE_PER_POUND: 240,
  PENCE_PER_SHILLING: 12
};
