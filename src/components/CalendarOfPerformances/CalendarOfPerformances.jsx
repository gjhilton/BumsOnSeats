import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";
import { token } from "@generated/tokens";
import { useMagnifier } from "../../hooks/useMagnifier";
import { Button, LatchButton } from "../Button/Button";

const THEATRES = {
  DRURY_LANE: "Drury Lane",
  COVENT_GARDEN: "Covent Garden"
};

const THEATRE_COLORS = {
  [THEATRES.DRURY_LANE]: token.var('colors.theatreA'),
  [THEATRES.COVENT_GARDEN]: token.var('colors.theatreB')
};

const OVERLAY_GREY = token.var('colors.theatresBoth');

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

const NO_DATA_MARKER_CONFIG = {
  HEIGHT: 3,           // Height of the stub mark in pixels
  WIDTH_FACTOR: 0.6,   // Width as fraction of day width (60% of day column)
  OPACITY: 0.35,       // Lighter opacity to de-emphasize
  Y_OFFSET: 0          // Position at baseline (bottom of row)
};

// Feature flag: Controls stub mark height strategy
// 'FIXED' = Use fixed 1px height at 100% opacity (minimalist baseline)
// 'AVERAGE' = Use annual average receipt value to determine height at 35% opacity
const STUB_MARK_STRATEGY = 'FIXED'; // Toggle between 'FIXED' or 'AVERAGE'

const LEGEND_CONFIG = {
  FONT_SIZE: "1.5rem",
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
  MONTH_LABEL_Y: -18,
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
  RADIUS: 200,
  ZOOM_LEVEL: 5,
  BORDER_WIDTH: 3,
  BORDER_COLOR: token.var('colors.ink')
};

const THEME = {
  AXIS_GREY: token.var('colors.paper'),
  BORDER_WHITE: token.var('colors.ink'),
  TRANSITION: "all 0.2s"
};

const EXPORT_BUTTON_CONFIG = {
  PADDING: "0.5rem 1rem",
  FONT_SIZE: "14px",
  FONT_WEIGHT_SEMIBOLD: "600",
  BORDER_RADIUS: "4px",
  GAP: "0.5rem",
  CANVAS_BACKGROUND: token.var('colors.ink')
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

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_START_DAYS = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

const DAYS_IN_LEAP_YEAR = 366;
const DAYS_IN_REGULAR_YEAR = 365;

const CURRENCY_CONVERSION = {
  PENCE_PER_POUND: 240,
  PENCE_PER_SHILLING: 12
};

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

/**
 * Calculate annual average receipt values per theatre
 * @param {Array} data - Full dataset of performances
 * @returns {Map} Map keyed by "theatre-year" (e.g., "Drury Lane-1732")
 *                with values as average currencyValue
 */
function calculateAnnualAverages(data) {
  const averages = new Map();

  // Group by theatre and year
  const groups = d3.group(data, d => `${d.theatre}-${d.year}`);

  groups.forEach((performances, key) => {
    // Filter to only performances with receipt data
    const withReceipts = performances.filter(p => p.currencyValue > 0);

    if (withReceipts.length > 0) {
      const sum = d3.sum(withReceipts, p => p.currencyValue);
      const average = sum / withReceipts.length;
      averages.set(key, average);
    } else {
      // No receipt data for this theatre-year combination
      averages.set(key, 0);
    }
  });

  return averages;
}

/**
 * Calculate stub mark height based on selected strategy
 * @param {Object} performance - Performance object with theatre, year, etc.
 * @param {Map} annualAverages - Map of theatre-year averages (null if FIXED strategy)
 * @param {Function} heightScale - D3 scale for converting currency to height
 * @returns {Object} Object with height and opacity for the stub mark
 */
function calculateStubHeight(performance, annualAverages, heightScale) {
  if (STUB_MARK_STRATEGY === 'FIXED') {
    return {
      height: 0.5, // 0.5px thin line
      opacity: 1.0 // Fully opaque
    };
  }

  // AVERAGE strategy
  const key = `${performance.theatre}-${performance.year}`;
  const averageValue = annualAverages.get(key) || 0;

  if (averageValue === 0) {
    // Fallback when no average available
    return {
      height: PERFORMANCE_CONFIG.MIN_BAR_HEIGHT, // 2px
      opacity: NO_DATA_MARKER_CONFIG.OPACITY // 0.35 (de-emphasized)
    };
  }

  // Use heightScale to convert average value to pixel height
  return {
    height: Math.max(
      PERFORMANCE_CONFIG.MIN_BAR_HEIGHT,
      heightScale(averageValue)
    ),
    opacity: NO_DATA_MARKER_CONFIG.OPACITY // 0.35 (de-emphasized)
  };
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

function renderYAxis(g, yScale, tickYears, axisPosition, innerWidth, minDataYear) {
  const isLeft = axisPosition === 'left';
  const axis = isLeft ? d3.axisLeft(yScale) : d3.axisRight(yScale);
  const transform = isLeft ? null : `translate(${innerWidth}, 0)`;
  const labelPadding = isLeft ? -AXIS_CONFIG.LABEL_PADDING : AXIS_CONFIG.LABEL_PADDING;

  const axisGroup = g.append("g");
  if (transform) axisGroup.attr("transform", transform);

  return axisGroup
    .call(axis.tickValues(tickYears).tickSize(0))
    .call(g => g.select(".domain").remove())
    .selectAll("text")
    .style("font-size", AXIS_CONFIG.FONT_SIZE)
    .style("fill", token.var('colors.ink'))
    .attr("text-anchor", "end")
    .attr("dx", labelPadding)
    .attr("dy", yScale.bandwidth() / 2)
    .style("dominant-baseline", "baseline")
    .style("opacity", d => {
      if (d % 5 !== 0) return 0; // Hide non-multiples of 5
      if (d < minDataYear) return 0.2; // Show multiples of 5 before data at 20%
      return 1; // Show multiples of 5 with data at 100%
    });
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
    const yearStart = Math.floor(d3.min(data, d => d.year) / 10) * 10 - 1;
    const yearEnd = d3.max(data, d => d.year);
    const numYears = yearEnd - yearStart + 1;
    return (numYears * ROW_HEIGHT) + CHART_MARGINS.top + CHART_MARGINS.bottom;
  }, [data]);

  const legendHeightScale = useMemo(() => {
    if (!data || data.length === 0) return null;
    return createHeightScale(d3.max(data, d => d.currencyValue), LEGEND_CONFIG.MAX_HEIGHT);
  }, [data]);

  const magnifierConfig = useMemo(() => ({
    RADIUS: MAGNIFIER_CONFIG.RADIUS,
    ZOOM_LEVEL: MAGNIFIER_CONFIG.ZOOM_LEVEL,
    BORDER_WIDTH: MAGNIFIER_CONFIG.BORDER_WIDTH,
    BORDER_COLOR: MAGNIFIER_CONFIG.BORDER_COLOR,
    BACKGROUND_COLOR: token.var('colors.paper')
  }), []);

  const containerStyles = useMemo(() => css({
    width: LAYOUT_CONFIG.CONTAINER_WIDTH,
    marginTop: LAYOUT_CONFIG.CONTAINER_MARGIN_TOP,
    paddingBottom: "5rem"
  }), []);

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

    // Render magnified stub marks
    magnifierContent.selectAll('.mag-marker')
      .data(visibleMarkers)
      .join('rect')
      .attr('class', 'mag-marker')
      .attr('x', d => {
        const dayWidth = getDayWidth(d.isLeapYear, innerWidth);
        const xPos = getXPosition(d.dayOfYear, d.isLeapYear, innerWidth);
        return ((xPos - dayWidth / 2 + d.xOffset) - chartX) * config.ZOOM_LEVEL;
      })
      .attr('y', d => (yScale(d.year) + yScale.bandwidth() - d.stubHeight - chartY) * config.ZOOM_LEVEL)
      .attr('width', d => getDayWidth(d.isLeapYear, innerWidth) * config.ZOOM_LEVEL)
      .attr('height', d => d.stubHeight * config.ZOOM_LEVEL)
      .attr('fill', d => d.fill)
      .attr('opacity', d => d.stubOpacity);

    // Get unique years from visible data
    const visibleYears = new Set();
    visibleBars.forEach(d => visibleYears.add(d.year));
    visibleMarkers.forEach(d => visibleYears.add(d.year));
    const yearArray = Array.from(visibleYears).filter(year => year % 5 === 0);

    // Render year labels aligned to the baseline of the bars
    magnifierContent.selectAll('.mag-year-label')
      .data(yearArray)
      .join('text')
      .attr('class', 'mag-year-label')
      .attr('x', (-AXIS_CONFIG.LABEL_PADDING - chartX) * config.ZOOM_LEVEL)
      .attr('y', year => (yScale(year) + yScale.bandwidth() - chartY) * config.ZOOM_LEVEL)
      .text(d => d)
      .style('font-size', `${parseInt(AXIS_CONFIG.FONT_SIZE) * config.ZOOM_LEVEL}px`)
      .style('fill', token.var('colors.ink'))
      .attr('text-anchor', 'end')
      .style('dominant-baseline', 'baseline');

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

    const minDataYear = d3.min(data, d => d.year);
    const yearStart = Math.floor(minDataYear / 10) * 10 - 1;
    const yearEnd = d3.max(data, d => d.year);

    // Calculate annual averages if using AVERAGE strategy
    const annualAverages = STUB_MARK_STRATEGY === 'AVERAGE'
      ? calculateAnnualAverages(data)
      : null;

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

    // Add black background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", token.var('colors.paper'));

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHART_MARGINS.left},${CHART_MARGINS.top})`);

    const tickYears = d3.range(yearStart, yearEnd + 1);

    renderYAxis(g, yScale, tickYears, 'left', innerWidth, minDataYear);

    g.append("g")
      .selectAll(".month-label")
      .data(MONTH_LABELS)
      .join("text")
      .attr("class", "month-label")
      .attr("x", (d, i) => xScaleForLabels(MONTH_START_DAYS[i]))
      .attr("y", AXIS_CONFIG.MONTH_LABEL_Y)
      .text(d => d)
      .style("font-size", AXIS_CONFIG.FONT_SIZE)
      .style("text-anchor", "start")
      .style("fill", token.var('colors.ink'));

    // Add x-axis line
    g.append("line")
      .attr("class", "x-axis-line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", token.var('colors.ink'))
      .attr("stroke-width", 3);

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
          const stubProps = calculateStubHeight(perf, annualAverages, heightScale);

          markersToRender.push({
            ...perf,
            fill: colorScale(perf.theatre),
            xOffset: 0,
            stubHeight: stubProps.height,
            stubOpacity: stubProps.opacity
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
          // Calculate stub heights and opacity based on strategy
          const stubProps1 = calculateStubHeight(perf1, annualAverages, heightScale);
          const stubProps2 = calculateStubHeight(perf2, annualAverages, heightScale);

          // Two stub marks centered on top of each other (semi-transparent layering)
          markersToRender.push({
            ...perf1,
            fill: colorScale(perf1.theatre),
            xOffset: 0,
            stubHeight: stubProps1.height,
            stubOpacity: stubProps1.opacity
          });
          markersToRender.push({
            ...perf2,
            fill: colorScale(perf2.theatre),
            xOffset: 0,
            stubHeight: stubProps2.height,
            stubOpacity: stubProps2.opacity
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

          const stubProps = calculateStubHeight(withoutData, annualAverages, heightScale);

          markersToRender.push({
            ...withoutData,
            fill: colorScale(withoutData.theatre),
            xOffset: 0,
            stubHeight: stubProps.height,
            stubOpacity: stubProps.opacity
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
      innerHeight,
      annualAverages,
      heightScale
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

    // Render stub marks for performances without receipt data
    const noDataMarkers = g.selectAll('.performance-no-data')
      .data(markersToRender)
      .join('rect')
      .attr('class', 'performance-no-data')
      .attr('x', d => {
        const dayWidth = getDayWidth(d.isLeapYear, innerWidth);
        const xPos = getXPosition(d.dayOfYear, d.isLeapYear, innerWidth);
        return xPos - dayWidth / 2 + d.xOffset;
      })
      .attr('y', d => yScale(d.year) + yScale.bandwidth() - d.stubHeight)
      .attr('width', d => getDayWidth(d.isLeapYear, innerWidth))
      .attr('height', d => d.stubHeight)
      .attr('fill', d => d.fill)
      .attr('opacity', d => d.stubOpacity)
      .style('mix-blend-mode', PERFORMANCE_CONFIG.BLEND_MODE);

    attachTooltipHandlers(noDataMarkers, showTooltip, hideTooltip);

  }, [data, width, height, visibleTheatres, colorScale]);

  useMagnifier({
    svgRef,
    renderMagnifiedContent,
    config: magnifierConfig,
    data,
    width,
    height,
    visibleTheatres
  });

  return (
    <div
      ref={containerRef}
      className={containerStyles}
    >
      <Tools
        visibleTheatres={visibleTheatres}
        toggleTheatre={toggleTheatre}
        svgRef={svgRef}
      />

      <Legend legendHeightScale={legendHeightScale} visibleTheatres={visibleTheatres} width={width} data={data} />

      <svg ref={svgRef}></svg>

      <Tooltip tooltipRef={tooltipRef} />
    </div>
  );
}

function Tools({ visibleTheatres, toggleTheatre, svgRef }) {

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
          gap: "1rem",
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
        gap: "1rem",
        marginRight: `${CHART_MARGINS.right}px`
      })}>
        <Button onClick={() => exportSVG(svgRef)}>
          Export SVG
        </Button>
        <Button onClick={() => exportPNG(svgRef)}>
          Export PNG
        </Button>
      </div>
    </div>
  );
}

function Legend({ legendHeightScale, visibleTheatres, width, data }) {
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
          gap: "1rem",
          marginTop: "1rem"
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
                gap: "0.5rem"
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
            gap: "0.5rem"
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

