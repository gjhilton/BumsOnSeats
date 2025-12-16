import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";

const THEATRES = {
  DRURY_LANE: "Drury Lane",
  COVENT_GARDEN: "Covent Garden"
};

const THEATRE_COLORS = {
  [THEATRES.DRURY_LANE]: "#E91E63",
  [THEATRES.COVENT_GARDEN]: "#00BCD4"
};

const YEAR_RANGE = {
  START: 1732,
  END: 1810
};

const CHART_MARGINS = {
  top: 50,
  right: 100,
  bottom: 20,
  left: 80
};

const PERFORMANCE_CONFIG = {
  OPACITY: 1,
  MIN_BAR_HEIGHT: 2,
  BLEND_MODE: 'multiply'
};

const ASTERISK_CONFIG = {
  FONT_SIZE: "9px",
  OPACITY: 0.6,
  BOTTOM_OFFSET: 2
};

const LEGEND_CONFIG = {
  FONT_SIZE: "16px",
  CHECKBOX_SIZE: 18,
  MAX_HEIGHT: 20,
  BAR_WIDTH: 2,
  PLAQUE_HEIGHT: 32,
  PLAQUE_PADDING: "0 0.75rem"
};

const AXIS_CONFIG = {
  FONT_SIZE: "10px",
  YEAR_TICK_INTERVAL: 10,
  YEAR_TICK_OFFSET: -2,
  MONTH_LABEL_Y: -10
};

const TOOLTIP_OFFSET = {
  X: 10,
  Y: -10
};

const THEME = {
  BORDER_GREY: "#ccc",
  FILL_GREY: "#666",
  BORDER_WHITE: "white",
  TRANSITION: "all 0.2s"
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_START_DAYS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

const DAYS_PER_YEAR = 366;
const DAYS_FOR_WIDTH = 365;

const CURRENCY_CONVERSION = {
  PENCE_PER_POUND: 240,
  PENCE_PER_SHILLING: 12
};

const LEGEND_VALUES = [
  { label: '£5', value: 5 * CURRENCY_CONVERSION.PENCE_PER_POUND },
  { label: '£50', value: 50 * CURRENCY_CONVERSION.PENCE_PER_POUND },
  { label: '£500', value: 500 * CURRENCY_CONVERSION.PENCE_PER_POUND }
];

const CHECKMARK_ICON = {
  WIDTH: 12,
  HEIGHT: 12,
  VIEWBOX: "0 0 14 14",
  PATH: "M2 7L5.5 10.5L12 3",
  STROKE_WIDTH: 2
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatCurrency(pence) {
  const pounds = Math.floor(pence / CURRENCY_CONVERSION.PENCE_PER_POUND);
  const remainingPence = pence % CURRENCY_CONVERSION.PENCE_PER_POUND;
  const shillings = Math.floor(remainingPence / CURRENCY_CONVERSION.PENCE_PER_SHILLING);
  const finalPence = remainingPence % CURRENCY_CONVERSION.PENCE_PER_SHILLING;
  return `£${pounds}.${shillings}.${finalPence}`;
}

function preparePerformanceData(data) {
  const groups = d3.group(data, d => `${d.year}-${d.dayOfYear}`);
  const processedData = [];

  groups.forEach((performances) => {
    performances.sort((a, b) => a.theatre.localeCompare(b.theatre));
    processedData.push(...performances);
  });

  return processedData;
}

function createColorScale() {
  return d3.scaleOrdinal()
    .domain([THEATRES.DRURY_LANE, THEATRES.COVENT_GARDEN])
    .range([THEATRE_COLORS[THEATRES.DRURY_LANE], THEATRE_COLORS[THEATRES.COVENT_GARDEN]]);
}

function createXScale(innerWidth) {
  return d3.scaleLinear()
    .domain([1, DAYS_PER_YEAR])
    .range([0, innerWidth]);
}

function createYScale(innerHeight) {
  return d3.scaleBand()
    .domain(d3.range(YEAR_RANGE.START, YEAR_RANGE.END))
    .range([0, innerHeight])
    .padding(0.1);
}

function createHeightScale(maxValue, maxHeight) {
  return d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, maxHeight]);
}

function attachTooltipHandlers(selection, showTooltip, hideTooltip) {
  return selection
    .on('mouseenter', showTooltip)
    .on('mousemove', showTooltip)
    .on('mouseleave', hideTooltip)
    .style('cursor', 'pointer');
}

function calculateBarHeight(currencyValue, heightScale) {
  return Math.max(PERFORMANCE_CONFIG.MIN_BAR_HEIGHT, heightScale(currencyValue));
}

function calculateBarY(year, yScale, barHeight) {
  return yScale(year) + yScale.bandwidth() - barHeight;
}

export function CalendarOfPerformances({ data, height = 1560 }) {
  const svgRef = useRef();
  const containerRef = useRef();
  const tooltipRef = useRef();

  const [width, setWidth] = useState(1200);
  const [visibleTheatres, setVisibleTheatres] = useState({
    [THEATRES.DRURY_LANE]: true,
    [THEATRES.COVENT_GARDEN]: true
  });

  const colorScale = useMemo(() => createColorScale(), []);

  const legendHeightScale = useMemo(() => {
    if (!data || data.length === 0) return null;
    return createHeightScale(d3.max(data, d => d.currencyValue), LEGEND_CONFIG.MAX_HEIGHT);
  }, [data]);

  const toggleTheatre = (theatre) => {
    setVisibleTheatres(prev => ({
      ...prev,
      [theatre]: !prev[theatre]
    }));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const filteredData = data.filter(d => visibleTheatres[d.theatre]);

    d3.select(svgRef.current).selectAll("*").remove();

    const innerWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;
    const innerHeight = height - CHART_MARGINS.top - CHART_MARGINS.bottom;

    const xScale = createXScale(innerWidth);
    const yScale = createYScale(innerHeight);
    const heightScale = createHeightScale(d3.max(filteredData, d => d.currencyValue), yScale.bandwidth());

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHART_MARGINS.left},${CHART_MARGINS.top})`);

    g.append("g")
      .call(d3.axisLeft(yScale).tickValues(
        d3.range(YEAR_RANGE.START + AXIS_CONFIG.YEAR_TICK_OFFSET, YEAR_RANGE.END, AXIS_CONFIG.YEAR_TICK_INTERVAL)
      ))
      .selectAll("text")
      .style("font-size", AXIS_CONFIG.FONT_SIZE);

    g.append("g")
      .selectAll(".month-label")
      .data(MONTH_LABELS)
      .join("text")
      .attr("class", "month-label")
      .attr("x", (d, i) => xScale(MONTH_START_DAYS[i]))
      .attr("y", AXIS_CONFIG.MONTH_LABEL_Y)
      .text(d => d)
      .style("font-size", AXIS_CONFIG.FONT_SIZE)
      .style("text-anchor", "start");

    const performanceData = preparePerformanceData(filteredData);

    const showTooltip = (event, d) => {
      const dateStr = d.date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const receipts = d.currencyValue > 0
        ? formatCurrency(d.currencyValue)
        : 'No receipt data';

      d3.select(tooltipRef.current)
        .style('opacity', 1)
        .style('left', `${event.clientX + TOOLTIP_OFFSET.X}px`)
        .style('top', `${event.clientY + TOOLTIP_OFFSET.Y}px`)
        .html(`
          <strong>${dateStr}</strong><br/>
          ${d.theatre}<br/>
          ${d.performances}<br/>
          ${receipts}
        `);
    };

    const hideTooltip = () => {
      d3.select(tooltipRef.current).style('opacity', 0);
    };

    const dayWidth = innerWidth / DAYS_FOR_WIDTH;
    const bars = g.selectAll('.performance-bar')
      .data(performanceData.filter(d => d.currencyValue > 0))
      .join('rect')
      .attr('class', 'performance-bar')
      .attr('x', d => xScale(d.dayOfYear) - dayWidth / 2)
      .attr('y', d => calculateBarY(d.year, yScale, calculateBarHeight(d.currencyValue, heightScale)))
      .attr('width', dayWidth)
      .attr('height', d => calculateBarHeight(d.currencyValue, heightScale))
      .attr('fill', d => colorScale(d.theatre))
      .attr('opacity', PERFORMANCE_CONFIG.OPACITY)
      .style('mix-blend-mode', PERFORMANCE_CONFIG.BLEND_MODE);

    attachTooltipHandlers(bars, showTooltip, hideTooltip);

    const asterisks = g.selectAll('.performance-asterisk')
      .data(performanceData.filter(d => d.currencyValue === 0))
      .join('text')
      .attr('class', 'performance-asterisk')
      .attr('x', d => xScale(d.dayOfYear))
      .attr('y', d => yScale(d.year) + yScale.bandwidth() - ASTERISK_CONFIG.BOTTOM_OFFSET)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .attr('fill', d => colorScale(d.theatre))
      .attr('opacity', ASTERISK_CONFIG.OPACITY)
      .attr('font-size', ASTERISK_CONFIG.FONT_SIZE)
      .text('*')
      .style('mix-blend-mode', PERFORMANCE_CONFIG.BLEND_MODE);

    attachTooltipHandlers(asterisks, showTooltip, hideTooltip);

  }, [data, width, height, visibleTheatres, colorScale]);

  return (
    <div
      ref={containerRef}
      className={css({
        width: "100%",
        marginTop: "xl",
      })}
    >
      <TheatreFilterLegend
        visibleTheatres={visibleTheatres}
        toggleTheatre={toggleTheatre}
        colorScale={colorScale}
      />

      <ReceiptsLegend legendHeightScale={legendHeightScale} />

      <svg ref={svgRef}></svg>

      <Tooltip tooltipRef={tooltipRef} />
    </div>
  );
}

function TheatreFilterLegend({ visibleTheatres, toggleTheatre, colorScale }) {
  return (
    <div
      className={css({
        display: "flex",
        gap: "2rem",
        marginBottom: "1rem",
        marginLeft: `${CHART_MARGINS.left}px`,
        alignItems: "center",
      })}
    >
      {[THEATRES.DRURY_LANE, THEATRES.COVENT_GARDEN].map((theatre) => {
        const isSelected = visibleTheatres[theatre];
        const bgColor = isSelected
          ? hexToRgba(colorScale(theatre), PERFORMANCE_CONFIG.OPACITY)
          : THEME.BORDER_WHITE;

        return (
          <label
            key={theatre}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              position: "relative",
              fontSize: LEGEND_CONFIG.FONT_SIZE,
              padding: LEGEND_CONFIG.PLAQUE_PADDING,
              borderRadius: "40px",
              height: `${LEGEND_CONFIG.PLAQUE_HEIGHT}px`,
              color: isSelected ? THEME.BORDER_WHITE : "black",
              border: isSelected ? `1px solid ${THEME.BORDER_WHITE}` : `1px solid ${THEME.BORDER_GREY}`,
              transition: THEME.TRANSITION,
            })}
            style={{ backgroundColor: bgColor }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleTheatre(theatre)}
              className={css({
                position: "absolute",
                opacity: 0,
                cursor: "pointer",
              })}
            />
            <CheckboxIcon isSelected={isSelected} bgColor={bgColor} />
            <span className={css({ cursor: "pointer", fontWeight: "600" })}>
              {theatre}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function CheckboxIcon({ isSelected, bgColor }) {
  return (
    <span
      className={css({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${LEGEND_CONFIG.CHECKBOX_SIZE}px`,
        height: `${LEGEND_CONFIG.CHECKBOX_SIZE}px`,
        border: isSelected ? "1px solid transparent" : `1px solid ${THEME.BORDER_GREY}`,
        transition: THEME.TRANSITION,
        flexShrink: 0,
        cursor: "pointer",
      })}
      style={{ backgroundColor: isSelected ? bgColor : THEME.BORDER_WHITE }}
    >
      {isSelected && (
        <svg width={CHECKMARK_ICON.WIDTH} height={CHECKMARK_ICON.HEIGHT} viewBox={CHECKMARK_ICON.VIEWBOX} fill="none">
          <path
            d={CHECKMARK_ICON.PATH}
            stroke={THEME.BORDER_WHITE}
            strokeWidth={CHECKMARK_ICON.STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

function ReceiptsLegend({ legendHeightScale }) {
  return (
    <div
      className={css({
        display: "flex",
        gap: "3rem",
        marginBottom: "2rem",
        marginLeft: `${CHART_MARGINS.left}px`,
        alignItems: "center",
        fontSize: LEGEND_CONFIG.FONT_SIZE,
      })}
    >
      <div
        className={css({
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        })}
      >
        <span className={css({ fontWeight: "600", marginRight: "0.5rem" })}>
          Box office receipts:
        </span>
        {legendHeightScale && LEGEND_VALUES.map(({ label, value }) => {
          const barHeight = legendHeightScale(value);
          return (
            <div
              key={label}
              className={css({
                display: "flex",
                alignItems: "flex-end",
                gap: "0.5rem",
              })}
            >
              <svg width="6" height={LEGEND_CONFIG.MAX_HEIGHT + 4}>
                <rect
                  x="2"
                  y={LEGEND_CONFIG.MAX_HEIGHT + 4 - barHeight}
                  width={LEGEND_CONFIG.BAR_WIDTH}
                  height={barHeight}
                  fill={THEME.FILL_GREY}
                  opacity={1}
                />
              </svg>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginLeft: "1rem",
          paddingLeft: "1rem",
          borderLeft: `1px solid ${THEME.BORDER_GREY}`,
        })}
      >
        <span className={css({ fontSize: LEGEND_CONFIG.FONT_SIZE, fontWeight: "600" })}>
          *
        </span>
        <span>No receipt data</span>
      </div>
    </div>
  );
}

function Tooltip({ tooltipRef }) {
  return (
    <div
      ref={tooltipRef}
      className={css({
        position: "fixed",
        padding: "0.5rem 0.75rem",
        background: "rgba(0, 0, 0, 0.85)",
        color: THEME.BORDER_WHITE,
        borderRadius: "4px",
        fontSize: "12px",
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.2s",
        zIndex: 1000,
        lineHeight: "1.4",
      })}
    />
  );
}
