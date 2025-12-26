import { css } from "@generated/css";
import { Button, LatchButton } from "@components/Button/Button";
import { THEATRES, THEATRE_COLORS } from "@/constants/theatre";
import { CHART_MARGINS, LAYOUT_CONFIG } from "./constants";
import { exportSVG, exportPNG } from "./utils";

export function Tools({ visibleTheatres, toggleTheatre, svgRef, containerRef }) {
  return (
    <div className={css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: LAYOUT_CONFIG.HEADER_MARGIN_BOTTOM
    })}>
      <div
        className={css({
          display: "flex",
          gap: "md",
          marginLeft: `${CHART_MARGINS.left}px`,
          alignItems: "center",
        })}
      >
        {[THEATRES.DRURY_LANE, THEATRES.COVENT_GARDEN].map((theatre) => (
          <LatchButton
            key={theatre}
            checked={visibleTheatres[theatre]}
            onChange={() => toggleTheatre(theatre)}
            color={THEATRE_COLORS[theatre]}
          >
            {theatre}
          </LatchButton>
        ))}
      </div>

      <div className={css({
        display: "flex",
        gap: "md",
        marginRight: `${CHART_MARGINS.right}px`
      })}>
        <Button onClick={() => exportSVG(svgRef)}>
          Export SVG
        </Button>
        <Button onClick={() => exportPNG(svgRef, containerRef)}>
          Export PNG
        </Button>
      </div>
    </div>
  );
}
