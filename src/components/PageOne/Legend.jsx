import { css } from "@generated/css";
import { THEATRE_COLORS } from "@/constants/theatre";
import { CHART_MARGINS, LEGEND_CONFIG, CURRENCY_CONVERSION } from "./constants";
import { getDayWidth } from "./utils";

export function Legend({ legendHeightScale, visibleTheatres, width, data }) {
  if (!legendHeightScale || !data || data.length === 0) return null;

  const activeTheatres = Object.entries(visibleTheatres)
    .filter(([, isVisible]) => isVisible)
    .map(([theatre]) => theatre);

  const innerWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;
  const dayWidth = getDayWidth(false, innerWidth);
  const svgHeight = LEGEND_CONFIG.MAX_HEIGHT + 10;

  // Legend values
  const legendValues = [50, 100, 500, 1000].map(pounds => ({
    label: `£${pounds}`,
    value: pounds * CURRENCY_CONVERSION.PENCE_PER_POUND
  }));

  return (
    <div
      className={css({
        marginTop: "2rem",
        marginBottom: "2rem",
        marginLeft: `${CHART_MARGINS.left}px`,
        fontSize: LEGEND_CONFIG.FONT_SIZE,
      })}
    >
      <div>
        <span className={css({ fontWeight: LEGEND_CONFIG.FONT_WEIGHT_SEMIBOLD })}>
          Box office receipts:
        </span>
      </div>
      <div
        className={css({
          display: "flex",
          gap: "md",
          marginTop: "md"
        })}
      >
        {legendValues.map(({ label, value }) => {
          const barHeight = legendHeightScale(value);
          const svgWidth = dayWidth * activeTheatres.length;

          return (
            <div
              key={label}
              className={css({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "sm"
              })}
            >
              <svg width={svgWidth} height={svgHeight}>
                {activeTheatres.map((theatre, index) => (
                  <rect
                    key={theatre}
                    x={index * dayWidth}
                    y={svgHeight - barHeight}
                    width={dayWidth}
                    height={barHeight}
                    fill={THEATRE_COLORS[theatre]}
                  />
                ))}
              </svg>
              <span className={css({ fontSize: "md" })}>{label}</span>
            </div>
          );
        })}
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "sm"
          })}
        >
          <svg width={dayWidth * activeTheatres.length} height={svgHeight}>
            {activeTheatres.map((theatre, index) => (
              <rect
                key={theatre}
                x={index * dayWidth}
                y={svgHeight - 0.5}
                width={dayWidth}
                height={0.5}
                fill={THEATRE_COLORS[theatre]}
              />
            ))}
          </svg>
          <span className={css({ fontSize: "md" })}>No data</span>
        </div>
      </div>
    </div>
  );
}
