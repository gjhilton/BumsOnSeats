import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";
import { token } from "@generated/tokens";
import { useMagnifier } from "../../hooks/useMagnifier";
import { useChartRender } from "../../hooks/useChartRender";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import { Tools } from "./Tools";
import { Legend } from "./Legend";
import { Tooltip } from "./Tooltip";
import {
  OVERLAY_GREY,
  CHART_MARGINS,
  ROW_HEIGHT,
  PERFORMANCE_CONFIG,
  TOOLTIP_CONFIG,
  MAGNIFIER_CONFIG,
  LAYOUT_CONFIG,
  MONTH_LABELS,
  MONTH_START_DAYS,
  DAYS_IN_REGULAR_YEAR,
  AXIS_CONFIG,
  STUB_MARK_STRATEGY
} from "./constants";
import {
  preparePerformanceData,
  calculateAnnualAverages,
  calculateStubHeight,
  createColorScale,
  createXScale,
  createYScale,
  createHeightScale,
  attachTooltipHandlers,
  calculateBarHeight,
  calculateBarY,
  renderYAxis,
  formatCurrency,
  getXPosition,
  getDayWidth
} from "./utils";

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

  const width = useResizeObserver(containerRef, LAYOUT_CONFIG.DEFAULT_WIDTH);
  const [visibleTheatres, setVisibleTheatres] = useState({
    "Drury Lane": true,
    "Covent Garden": true
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
    return createHeightScale(d3.max(data, d => d.currencyValue), 20);
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

  const annualAverages = useMemo(() => {
    if (!data || data.length === 0 || STUB_MARK_STRATEGY !== 'AVERAGE') return null;
    return calculateAnnualAverages(data);
  }, [data]);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const filteredData = data.filter(d => visibleTheatres[d.theatre]);
    const performanceData = preparePerformanceData(filteredData);
    const dayGroups = d3.group(performanceData, d => `${d.year}-${d.dayOfYear}`);

    const minDataYear = d3.min(data, d => d.year);
    const yearStart = Math.floor(minDataYear / 10) * 10 - 1;
    const yearEnd = d3.max(data, d => d.year);
    const maxCurrencyValue = d3.max(data, d => d.currencyValue);

    const innerHeight = height - CHART_MARGINS.top - CHART_MARGINS.bottom;
    const yScale = createYScale(innerHeight, yearStart, yearEnd);
    const heightScale = createHeightScale(maxCurrencyValue, yScale.bandwidth());

    const barsToRender = [];
    const markersToRender = [];

    dayGroups.forEach((performances) => {
      if (performances.length === 1) {
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
        const [perf1, perf2] = performances;
        const bothHaveData = perf1.currencyValue > 0 && perf2.currencyValue > 0;
        const neitherHaveData = perf1.currencyValue === 0 && perf2.currencyValue === 0;

        if (bothHaveData) {
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
          const stubProps1 = calculateStubHeight(perf1, annualAverages, heightScale);
          const stubProps2 = calculateStubHeight(perf2, annualAverages, heightScale);

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

    return {
      dayGroups,
      yearStart,
      yearEnd,
      minDataYear,
      maxCurrencyValue,
      performanceData,
      yScale,
      heightScale,
      barsToRender,
      markersToRender
    };
  }, [data, visibleTheatres, height, colorScale, annualAverages]);

  const renderChart = useCallback(() => {
    if (!processedData) return;

    const { yearStart, yearEnd, minDataYear, yScale, barsToRender, markersToRender } = processedData;

    d3.select(svgRef.current).selectAll("*").remove();

    const innerWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;
    const innerHeight = height - CHART_MARGINS.top - CHART_MARGINS.bottom;

    const xScaleForLabels = createXScale(innerWidth, DAYS_IN_REGULAR_YEAR);

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

    renderDataRef.current = {
      barsToRender,
      markersToRender,
      yScale,
      innerWidth,
      innerHeight,
      annualAverages,
      heightScale: processedData.heightScale
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

  }, [processedData, width, height]);

  useChartRender(renderChart, [processedData, width], "Calendar Chart");

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
        containerRef={containerRef}
      />

      <Legend legendHeightScale={legendHeightScale} visibleTheatres={visibleTheatres} width={width} data={data} />

      <svg ref={svgRef}></svg>

      <Tooltip tooltipRef={tooltipRef} />
    </div>
  );
}
