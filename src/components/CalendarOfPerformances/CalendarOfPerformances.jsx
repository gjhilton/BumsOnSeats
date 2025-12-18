import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";
import { useMagnifier } from "../../hooks/useMagnifier";

const THEATRES = {
  DRURY_LANE: "Drury Lane",
  COVENT_GARDEN: "Covent Garden"
};

const THEATRE_COLORS = {
  [THEATRES.DRURY_LANE]: "#F00",
  [THEATRES.COVENT_GARDEN]: "#000"
};

const OVERLAY_GREY = "#fc0";

const CHART_MARGINS = {
  top: 50,
  right: 128,
  bottom: 20,
  left: 128
};

const ROW_HEIGHT = 25;

const PERFORMANCE_CONFIG = {
  OPACITY: 1,
  MIN_BAR_HEIGHT: 2,
  BLEND_MODE: 'normal'
};

const NO_DATA_CONFIG = {
  FONT_SIZE: "4px",
  OPACITY: 1,
  BOTTOM_OFFSET: 2,
  FONT_WEIGHT: 900
};

const LEGEND_CONFIG = {
  FONT_SIZE: "12px",
  CHECKBOX_SIZE: 18,
  MAX_HEIGHT: 20,
  BAR_WIDTH: 2,
  PLAQUE_HEIGHT: 32,
  PLAQUE_PADDING: "0 0.75rem",
  FONT_WEIGHT_BOLD: "bold",
  FONT_WEIGHT_SEMIBOLD: "600"
};

const AXIS_CONFIG = {
  FONT_SIZE: "20px",
  TITLE_FONT_SIZE: "36px",
  YEAR_TICK_INTERVAL: 10,
  YEAR_TICK_OFFSET: 8,
  MONTH_LABEL_Y: -10,
  LABEL_PADDING: 8,
  TITLE_FONT_WEIGHT: 900,
  Y_AXIS_TITLE_X: -50,
  X_AXIS_TITLE_Y: -30
};

const TOOLTIP_CONFIG = {
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

const MAGNIFIER_CONFIG = {
  RADIUS: 100,
  ZOOM_LEVEL: 3,
  BORDER_WIDTH: 3,
  BORDER_COLOR: "#000"
};

const THEME = {
  BORDER_GREY: "#ccc",
  FILL_GREY: "#666",
  AXIS_GREY: "#000",
  BORDER_WHITE: "white",
  TRANSITION: "all 0.2s"
};

const EXPORT_BUTTON_CONFIG = {
  PADDING: "0.5rem 1rem",
  FONT_SIZE: "14px",
  FONT_WEIGHT_SEMIBOLD: "600",
  BORDER_RADIUS: "4px",
  HOVER_BACKGROUND: "#f5f5f5",
  GAP: "0.5rem",
  CANVAS_BACKGROUND: "white"
};

const LAYOUT_CONFIG = {
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

const RECEIPTS_LEGEND_CONFIG = {
  SVG_WIDTH: 6,
  SVG_HEIGHT_PADDING: 4,
  RECT_X: 2
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_START_DAYS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

const DAYS_IN_LEAP_YEAR = 366;
const DAYS_IN_REGULAR_YEAR = 365;

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

function createXScale(innerWidth, daysInYear) {
  return d3.scaleLinear()
    .domain([1, daysInYear])
    .range([0, innerWidth]);
}

function getDaysInYear(isLeapYear) {
  return isLeapYear ? DAYS_IN_LEAP_YEAR : DAYS_IN_REGULAR_YEAR;
}

function getXPosition(dayOfYear, isLeapYear, innerWidth) {
  const daysInYear = getDaysInYear(isLeapYear);
  const scale = createXScale(innerWidth, daysInYear);
  return scale(dayOfYear);
}

function getDayWidth(isLeapYear, innerWidth) {
  return innerWidth / getDaysInYear(isLeapYear);
}

function createYScale(innerHeight, yearStart, yearEnd) {
  return d3.scaleBand()
    .domain(d3.range(yearStart, yearEnd + 1))
    .range([0, innerHeight])
    .padding(0);
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

function renderYAxis(g, yScale, tickYears, axisPosition, innerWidth) {
  const isLeft = axisPosition === 'left';
  const axis = isLeft ? d3.axisLeft(yScale) : d3.axisRight(yScale);
  const transform = isLeft ? null : `translate(${innerWidth}, 0)`;
  const labelPadding = isLeft ? -AXIS_CONFIG.LABEL_PADDING : AXIS_CONFIG.LABEL_PADDING;

  const axisGroup = g.append("g");
  if (transform) axisGroup.attr("transform", transform);

  return axisGroup
    .call(axis.tickValues(tickYears).tickSize(0))
    .call(g => g.select(".domain").attr("stroke", THEME.AXIS_GREY))
    .selectAll("text")
    .style("font-size", AXIS_CONFIG.FONT_SIZE)
    .attr("text-anchor", "end")
    .attr("dx", labelPadding)
    .attr("dy", yScale.bandwidth() / 2)
    .style("dominant-baseline", "baseline");
}

function exportSVG(svgRef, filename = 'calendar-of-performances.svg') {
  const svgElement = svgRef.current;
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgElement);

  svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportPNG(svgRef, filename = 'calendar-of-performances.png') {
  const svgElement = svgRef.current;
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.fillStyle = EXPORT_BUTTON_CONFIG.CANVAS_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob((blob) => {
      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pngUrl);
    });
  };

  img.src = url;
}

export function CalendarOfPerformances({ data }) {
  const svgRef = useRef();
  const containerRef = useRef();
  const tooltipRef = useRef();
  const renderDataRef = useRef({
    barsToRender: [],
    markersToRender: [],
    yScale: null,
    innerWidth: 0,
    innerHeight: 0
  });

  const [width, setWidth] = useState(LAYOUT_CONFIG.DEFAULT_WIDTH);
  const [visibleTheatres, setVisibleTheatres] = useState({
    [THEATRES.DRURY_LANE]: true,
    [THEATRES.COVENT_GARDEN]: true
  });

  const colorScale = useMemo(() => createColorScale(), []);

  const height = useMemo(() => {
    if (!data || data.length === 0) return 1560;
    const yearStart = d3.min(data, d => d.year);
    const yearEnd = d3.max(data, d => d.year);
    const numYears = yearEnd - yearStart + 1;
    return (numYears * ROW_HEIGHT) + CHART_MARGINS.top + CHART_MARGINS.bottom;
  }, [data]);

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

  // Callback for rendering magnified content
  const renderMagnifiedContent = useCallback((magnifierContent, centerX, centerY, config) => {
    const { barsToRender, markersToRender, yScale, innerWidth } = renderDataRef.current;

    if (!yScale || !innerWidth) return;

    // Calculate the area we're magnifying (in chart coordinates)
    const chartX = centerX - CHART_MARGINS.left;
    const chartY = centerY - CHART_MARGINS.top;

    const viewRadius = config.RADIUS / config.ZOOM_LEVEL;

    // Filter data to only what's visible in the magnifier
    const visibleBars = barsToRender.filter(d => {
      const x = getXPosition(d.dayOfYear, d.isLeapYear, innerWidth);
      const y = yScale(d.year) + yScale.bandwidth() / 2;
      const distance = Math.sqrt(Math.pow(x - chartX, 2) + Math.pow(y - chartY, 2));
      return distance < viewRadius * 1.5; // Slightly larger to avoid edge clipping
    });

    const visibleMarkers = markersToRender.filter(d => {
      const x = getXPosition(d.dayOfYear, d.isLeapYear, innerWidth) + d.xOffset;
      const y = yScale(d.year) + yScale.bandwidth() / 2;
      const distance = Math.sqrt(Math.pow(x - chartX, 2) + Math.pow(y - chartY, 2));
      return distance < viewRadius * 1.5;
    });

    // Render magnified bars
    magnifierContent.selectAll('.mag-bar')
      .data(visibleBars)
      .join('rect')
      .attr('class', 'mag-bar')
      .attr('x', d => {
        const dayWidth = getDayWidth(d.isLeapYear, innerWidth);
        const xPos = getXPosition(d.dayOfYear, d.isLeapYear, innerWidth);
        return (xPos - dayWidth / 2 - chartX) * config.ZOOM_LEVEL;
      })
      .attr('y', d => (calculateBarY(d.year, yScale, d.barHeight) - chartY) * config.ZOOM_LEVEL)
      .attr('width', d => getDayWidth(d.isLeapYear, innerWidth) * config.ZOOM_LEVEL)
      .attr('height', d => d.barHeight * config.ZOOM_LEVEL)
      .attr('fill', d => d.fill)
      .attr('opacity', PERFORMANCE_CONFIG.OPACITY);

    // Render magnified markers
    magnifierContent.selectAll('.mag-marker')
      .data(visibleMarkers)
      .join('text')
      .attr('class', 'mag-marker')
      .attr('x', d => (getXPosition(d.dayOfYear, d.isLeapYear, innerWidth) + d.xOffset - chartX) * config.ZOOM_LEVEL)
      .attr('y', d => (yScale(d.year) + yScale.bandwidth() - NO_DATA_CONFIG.BOTTOM_OFFSET - chartY) * config.ZOOM_LEVEL)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .attr('fill', d => d.fill)
      .attr('opacity', NO_DATA_CONFIG.OPACITY)
      .attr('font-size', parseFloat(NO_DATA_CONFIG.FONT_SIZE) * config.ZOOM_LEVEL + 'px')
      .attr('font-weight', NO_DATA_CONFIG.FONT_WEIGHT)
      .text('?');
  }, []);

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

    const yearStart = d3.min(data, d => d.year);
    const yearEnd = d3.max(data, d => d.year);

    d3.select(svgRef.current).selectAll("*").remove();

    const innerWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;
    const innerHeight = height - CHART_MARGINS.top - CHART_MARGINS.bottom;

    const xScaleForLabels = createXScale(innerWidth, DAYS_IN_REGULAR_YEAR);
    const yScale = createYScale(innerHeight, yearStart, yearEnd);
    const heightScale = createHeightScale(d3.max(data, d => d.currencyValue), yScale.bandwidth());

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHART_MARGINS.left},${CHART_MARGINS.top})`);

    const firstTickYear = Math.ceil((yearStart + AXIS_CONFIG.YEAR_TICK_OFFSET) / AXIS_CONFIG.YEAR_TICK_INTERVAL) * AXIS_CONFIG.YEAR_TICK_INTERVAL;
    const tickYears = d3.range(firstTickYear, yearEnd + 1, AXIS_CONFIG.YEAR_TICK_INTERVAL);

    renderYAxis(g, yScale, tickYears, 'left', innerWidth);

    g.append("text")
      .attr("class", "y-axis-title")
      .attr("x", AXIS_CONFIG.Y_AXIS_TITLE_X)
      .attr("y", 0)
      .attr("text-anchor", "end")
      .style("font-size", AXIS_CONFIG.TITLE_FONT_SIZE)
      .style("font-weight", AXIS_CONFIG.TITLE_FONT_WEIGHT)
      .style("font-variant", "small-caps")
      .style("text-transform", "lowercase")
      .text("Year");

    g.append("g")
      .selectAll(".month-label")
      .data(MONTH_LABELS)
      .join("text")
      .attr("class", "month-label")
      .attr("x", (d, i) => xScaleForLabels(MONTH_START_DAYS[i]))
      .attr("y", AXIS_CONFIG.MONTH_LABEL_Y)
      .text(d => d)
      .style("font-size", AXIS_CONFIG.FONT_SIZE)
      .style("text-anchor", "start");

    g.append("text")
      .attr("class", "x-axis-title")
      .attr("x", 0)
      .attr("y", AXIS_CONFIG.X_AXIS_TITLE_Y)
      .attr("text-anchor", "start")
      .style("font-size", AXIS_CONFIG.TITLE_FONT_SIZE)
      .style("font-weight", AXIS_CONFIG.TITLE_FONT_WEIGHT)
      .style("font-variant", "small-caps")
      .style("text-transform", "lowercase")
      .text("Month & day");

    const performanceData = preparePerformanceData(filteredData);

    // Group performances by day
    const dayGroups = d3.group(performanceData, d => `${d.year}-${d.dayOfYear}`);

    const showTooltip = (event, d) => {
      const dateStr = d.date.toLocaleDateString('en-GB', TOOLTIP_CONFIG.DATE_FORMAT);
      const receipts = d.currencyValue > 0
        ? formatCurrency(d.currencyValue)
        : 'No receipt data';

      d3.select(tooltipRef.current)
        .style('opacity', TOOLTIP_CONFIG.OPACITY_VISIBLE)
        .style('left', `${event.clientX + TOOLTIP_CONFIG.OFFSET_X}px`)
        .style('top', `${event.clientY + TOOLTIP_CONFIG.OFFSET_Y}px`)
        .html(`
          <strong>${dateStr}</strong><br/>
          ${d.theatre}<br/>
          ${d.performances}<br/>
          ${receipts}
        `);
    };

    const hideTooltip = () => {
      d3.select(tooltipRef.current).style('opacity', TOOLTIP_CONFIG.OPACITY_HIDDEN);
    };

    // Process each day and determine what to draw
    const barsToRender = [];
    const markersToRender = [];

    dayGroups.forEach((performances) => {
      if (performances.length === 1) {
        // Single performance
        const perf = performances[0];
        if (perf.currencyValue > 0) {
          barsToRender.push({
            ...perf,
            fill: colorScale(perf.theatre),
            barHeight: calculateBarHeight(perf.currencyValue, heightScale)
          });
        } else {
          markersToRender.push({
            ...perf,
            fill: colorScale(perf.theatre),
            xOffset: 0
          });
        }
      } else if (performances.length === 2) {
        // Both theatres performed
        const [perf1, perf2] = performances;
        const bothHaveData = perf1.currencyValue > 0 && perf2.currencyValue > 0;
        const neitherHaveData = perf1.currencyValue === 0 && perf2.currencyValue === 0;

        if (bothHaveData) {
          // Draw larger bar first, then smaller bar in grey on top
          const larger = perf1.currencyValue >= perf2.currencyValue ? perf1 : perf2;
          const smaller = perf1.currencyValue >= perf2.currencyValue ? perf2 : perf1;

          barsToRender.push({
            ...larger,
            fill: colorScale(larger.theatre),
            barHeight: calculateBarHeight(larger.currencyValue, heightScale)
          });

          barsToRender.push({
            ...smaller,
            fill: OVERLAY_GREY,
            barHeight: calculateBarHeight(smaller.currencyValue, heightScale)
          });
        } else if (neitherHaveData) {
          // Two question marks side by side
          const dayWidth = getDayWidth(perf1.isLeapYear, innerWidth);
          markersToRender.push({
            ...perf1,
            fill: colorScale(perf1.theatre),
            xOffset: -dayWidth / 4
          });
          markersToRender.push({
            ...perf2,
            fill: colorScale(perf2.theatre),
            xOffset: dayWidth / 4
          });
        } else {
          // One has data, one doesn't
          const withData = perf1.currencyValue > 0 ? perf1 : perf2;
          const withoutData = perf1.currencyValue > 0 ? perf2 : perf1;

          barsToRender.push({
            ...withData,
            fill: colorScale(withData.theatre),
            barHeight: calculateBarHeight(withData.currencyValue, heightScale)
          });

          markersToRender.push({
            ...withoutData,
            fill: colorScale(withoutData.theatre),
            xOffset: 0
          });
        }
      }
    });

    // Store render data for magnifier
    renderDataRef.current = {
      barsToRender,
      markersToRender,
      yScale,
      innerWidth,
      innerHeight
    };

    // Render bars
    const bars = g.selectAll('.performance-bar')
      .data(barsToRender)
      .join('rect')
      .attr('class', 'performance-bar')
      .attr('x', d => {
        const dayWidth = getDayWidth(d.isLeapYear, innerWidth);
        const xPos = getXPosition(d.dayOfYear, d.isLeapYear, innerWidth);
        return xPos - dayWidth / 2;
      })
      .attr('y', d => calculateBarY(d.year, yScale, d.barHeight))
      .attr('width', d => getDayWidth(d.isLeapYear, innerWidth))
      .attr('height', d => d.barHeight)
      .attr('fill', d => d.fill)
      .attr('opacity', PERFORMANCE_CONFIG.OPACITY)
      .style('mix-blend-mode', PERFORMANCE_CONFIG.BLEND_MODE);

    attachTooltipHandlers(bars, showTooltip, hideTooltip);

    // Render question marks
    const noDataMarkers = g.selectAll('.performance-no-data')
      .data(markersToRender)
      .join('text')
      .attr('class', 'performance-no-data')
      .attr('x', d => getXPosition(d.dayOfYear, d.isLeapYear, innerWidth) + d.xOffset)
      .attr('y', d => yScale(d.year) + yScale.bandwidth() - NO_DATA_CONFIG.BOTTOM_OFFSET)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .attr('fill', d => d.fill)
      .attr('opacity', NO_DATA_CONFIG.OPACITY)
      .attr('font-size', NO_DATA_CONFIG.FONT_SIZE)
      .attr('font-weight', NO_DATA_CONFIG.FONT_WEIGHT)
      .text('?')
      .style('mix-blend-mode', PERFORMANCE_CONFIG.BLEND_MODE);

    attachTooltipHandlers(noDataMarkers, showTooltip, hideTooltip);

  }, [data, width, height, visibleTheatres, colorScale]);

  // Use magnifier hook
  useMagnifier({
    svgRef,
    renderMagnifiedContent,
    config: {
      RADIUS: MAGNIFIER_CONFIG.RADIUS,
      ZOOM_LEVEL: MAGNIFIER_CONFIG.ZOOM_LEVEL,
      BORDER_WIDTH: MAGNIFIER_CONFIG.BORDER_WIDTH,
      BORDER_COLOR: MAGNIFIER_CONFIG.BORDER_COLOR,
      BACKGROUND_COLOR: "#f80"
    },
    dependencies: [data, width, height, visibleTheatres]
  });

  return (
    <div
      ref={containerRef}
      className={css({
        width: LAYOUT_CONFIG.CONTAINER_WIDTH,
        marginTop: LAYOUT_CONFIG.CONTAINER_MARGIN_TOP
       
      })}
    >
      <Tools
        visibleTheatres={visibleTheatres}
        toggleTheatre={toggleTheatre}
        colorScale={colorScale}
        svgRef={svgRef}
      />

      <Legend legendHeightScale={legendHeightScale} />

      <svg ref={svgRef}></svg>

      <Tooltip tooltipRef={tooltipRef} />
    </div>
  );
}

function Tools({ visibleTheatres, toggleTheatre, colorScale, svgRef }) {
  const buttonStyles = {
    padding: EXPORT_BUTTON_CONFIG.PADDING,
    fontSize: EXPORT_BUTTON_CONFIG.FONT_SIZE,
    fontWeight: EXPORT_BUTTON_CONFIG.FONT_WEIGHT_SEMIBOLD,
    border: `1px solid ${THEME.BORDER_GREY}`,
    borderRadius: EXPORT_BUTTON_CONFIG.BORDER_RADIUS,
    background: THEME.BORDER_WHITE,
    cursor: "pointer",
    transition: THEME.TRANSITION,
    _hover: {
      background: EXPORT_BUTTON_CONFIG.HOVER_BACKGROUND,
    }
  };

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
          gap: LAYOUT_CONFIG.LEGEND_GAP,
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
                gap: LAYOUT_CONFIG.FILTER_GAP,
                cursor: "pointer",
                position: "relative",
                fontSize: LEGEND_CONFIG.FONT_SIZE,
                padding: LEGEND_CONFIG.PLAQUE_PADDING,
                borderRadius: "0",
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
              <span className={css({ cursor: "pointer", fontWeight: LEGEND_CONFIG.FONT_WEIGHT_SEMIBOLD })}>
                {theatre}
              </span>
            </label>
          );
        })}
      </div>

      <div className={css({
        display: "flex",
        gap: EXPORT_BUTTON_CONFIG.GAP,
        marginRight: `${CHART_MARGINS.right}px`
      })}>
        <button
          onClick={() => exportSVG(svgRef)}
          className={css(buttonStyles)}
        >
          Export SVG
        </button>
        <button
          onClick={() => exportPNG(svgRef)}
          className={css(buttonStyles)}
        >
          Export PNG
        </button>
      </div>
    </div>
  );
}

function Legend({ legendHeightScale }) {
  const svgHeight = LEGEND_CONFIG.MAX_HEIGHT + RECEIPTS_LEGEND_CONFIG.SVG_HEIGHT_PADDING;

  return (
    <div
      className={css({
        display: "flex",
        gap: LAYOUT_CONFIG.RECEIPTS_GAP,
        marginBottom: LAYOUT_CONFIG.RECEIPTS_MARGIN_BOTTOM,
        marginLeft: `${CHART_MARGINS.left}px`,
        alignItems: "center",
        fontSize: LEGEND_CONFIG.FONT_SIZE,
      })}
    >
      <div
        className={css({
          display: "flex",
          gap: LAYOUT_CONFIG.LEGEND_GAP,
          alignItems: "center",
        })}
      >
        <span className={css({ fontWeight: LEGEND_CONFIG.FONT_WEIGHT_SEMIBOLD, marginRight: LAYOUT_CONFIG.RECEIPTS_LABEL_MARGIN })}>
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
                gap: LAYOUT_CONFIG.RECEIPTS_ITEM_GAP,
              })}
            >
              <svg width={RECEIPTS_LEGEND_CONFIG.SVG_WIDTH} height={svgHeight}>
                <rect
                  x={RECEIPTS_LEGEND_CONFIG.RECT_X}
                  y={svgHeight - barHeight}
                  width={LEGEND_CONFIG.BAR_WIDTH}
                  height={barHeight}
                  fill={THEME.FILL_GREY}
                  opacity={TOOLTIP_CONFIG.OPACITY_VISIBLE}
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
          gap: LAYOUT_CONFIG.RECEIPTS_ITEM_GAP,
          marginLeft: LAYOUT_CONFIG.NO_DATA_MARGIN_LEFT,
          paddingLeft: LAYOUT_CONFIG.NO_DATA_PADDING_LEFT,
          borderLeft: `1px solid ${THEME.BORDER_GREY}`,
        })}
      >
        <span className={css({ fontSize: LEGEND_CONFIG.FONT_SIZE, fontWeight: LEGEND_CONFIG.FONT_WEIGHT_BOLD })}>
          ?
        </span>
        <span>No receipt data</span>
      </div>
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

function Tooltip({ tooltipRef }) {
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

