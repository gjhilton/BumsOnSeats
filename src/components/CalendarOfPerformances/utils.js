import * as d3 from "d3";
import { token } from "@generated/tokens";
import { THEATRES, THEATRE_COLORS } from "@/constants/theatre";
import {
  CURRENCY_CONVERSION,
  PERFORMANCE_CONFIG,
  NO_DATA_MARKER_CONFIG,
  STUB_MARK_STRATEGY,
  DAYS_IN_LEAP_YEAR,
  DAYS_IN_REGULAR_YEAR,
  AXIS_CONFIG,
  EXPORT_BUTTON_CONFIG
} from "./constants";

export function formatCurrency(pence) {
  const pounds = Math.floor(pence / CURRENCY_CONVERSION.PENCE_PER_POUND);
  const remainingPence = pence % CURRENCY_CONVERSION.PENCE_PER_POUND;
  const shillings = Math.floor(remainingPence / CURRENCY_CONVERSION.PENCE_PER_SHILLING);
  const finalPence = remainingPence % CURRENCY_CONVERSION.PENCE_PER_SHILLING;
  return `£${pounds}.${shillings}.${finalPence}`;
}

export function preparePerformanceData(data) {
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
export function calculateAnnualAverages(data) {
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
export function calculateStubHeight(performance, annualAverages, heightScale) {
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

export function createColorScale() {
  return d3.scaleOrdinal()
    .domain([THEATRES.DRURY_LANE, THEATRES.COVENT_GARDEN])
    .range([THEATRE_COLORS[THEATRES.DRURY_LANE], THEATRE_COLORS[THEATRES.COVENT_GARDEN]]);
}

export function createXScale(innerWidth, daysInYear) {
  return d3.scaleLinear()
    .domain([1, daysInYear])
    .range([0, innerWidth]);
}

export function getDaysInYear(isLeapYear) {
  return isLeapYear ? DAYS_IN_LEAP_YEAR : DAYS_IN_REGULAR_YEAR;
}

export function getXPosition(dayOfYear, isLeapYear, innerWidth) {
  const daysInYear = getDaysInYear(isLeapYear);
  const scale = createXScale(innerWidth, daysInYear);
  return scale(dayOfYear);
}

export function getDayWidth(isLeapYear, innerWidth) {
  return innerWidth / getDaysInYear(isLeapYear);
}

export function createYScale(innerHeight, yearStart, yearEnd) {
  return d3.scaleBand()
    .domain(d3.range(yearStart, yearEnd + 1))
    .range([0, innerHeight])
    .padding(0);
}

export function createHeightScale(maxValue, maxHeight) {
  return d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, maxHeight]);
}

export function attachTooltipHandlers(selection, showTooltip, hideTooltip) {
  return selection
    .on('mouseenter', showTooltip)
    .on('mousemove', showTooltip)
    .on('mouseleave', hideTooltip)
    .style('cursor', 'pointer');
}

export function calculateBarHeight(currencyValue, heightScale) {
  return Math.max(PERFORMANCE_CONFIG.MIN_BAR_HEIGHT, heightScale(currencyValue));
}

export function calculateBarY(year, yScale, barHeight) {
  return yScale(year) + yScale.bandwidth() - barHeight;
}

export function renderYAxis(g, yScale, tickYears, axisPosition, innerWidth, minDataYear) {
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

export function exportSVG(svgRef, filename = 'calendar-of-performances.svg') {
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

export function exportPNG(svgRef, filename = 'calendar-of-performances.png') {
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
