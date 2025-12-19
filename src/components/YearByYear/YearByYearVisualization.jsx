import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";
import { token } from "@generated/tokens";
import { LatchButton } from "../Button/Button";
import { PageWidth } from "../PageLayout/PageLayout";

const PYRAMID_CONFIG = {
  MARGINS: {
    top: 50,
    right: 80,
    bottom: 60,
    left: 80
  },
  BAR_OPACITY: 0.85,
  MIN_BAR_WIDTH: 2,
  AXIS_FONT_SIZE: "14px",
  LABEL_FONT_SIZE: "16px",
  TITLE_FONT_SIZE: "20px",
  GUTTER_WIDTH: 60
};

const THEATRE_COLORS = {
  DRURY: token.var('colors.theatreA'),
  COVENT: token.var('colors.theatreB')
};

const aggregatePerformancesByYear = (data) => {
  const yearGroups = d3.group(data, d => d.year);
  const aggregated = [];

  yearGroups.forEach((performances, year) => {
    const theatreGroups = d3.group(performances, p => p.theatre);

    const drury = theatreGroups.get("Drury Lane") || [];
    const covent = theatreGroups.get("Covent Garden") || [];

    aggregated.push({
      year: year,
      druryCount: drury.length,
      coventCount: covent.length
    });
  });

  return aggregated.sort((a, b) => a.year - b.year);
};

const aggregateRevenueByYear = (data) => {
  const yearGroups = d3.group(data, d => d.year);
  const aggregated = [];

  yearGroups.forEach((performances, year) => {
    const theatreGroups = d3.group(performances, p => p.theatre);

    const drury = theatreGroups.get("Drury Lane") || [];
    const covent = theatreGroups.get("Covent Garden") || [];

    const druryWithRevenue = drury.filter(p => p.currencyValue > 0);
    const coventWithRevenue = covent.filter(p => p.currencyValue > 0);

    // Convert from pence to pounds (240 pence = £1)
    const druryMean = druryWithRevenue.length > 0
      ? d3.mean(druryWithRevenue, p => p.currencyValue / 240)
      : 0;
    const coventMean = coventWithRevenue.length > 0
      ? d3.mean(coventWithRevenue, p => p.currencyValue / 240)
      : 0;

    aggregated.push({
      year: year,
      druryCount: druryMean,
      coventCount: coventMean
    });
  });

  return aggregated.sort((a, b) => a.year - b.year);
};

const aggregateBoxPlotByYear = (data) => {
  const yearGroups = d3.group(data, d => d.year);
  const aggregated = [];

  yearGroups.forEach((performances, year) => {
    const theatreGroups = d3.group(performances, p => p.theatre);

    const drury = theatreGroups.get("Drury Lane") || [];
    const covent = theatreGroups.get("Covent Garden") || [];

    const druryWithRevenue = drury.filter(p => p.currencyValue > 0);
    const coventWithRevenue = covent.filter(p => p.currencyValue > 0);

    // Convert from pence to pounds and sort
    const druryValues = druryWithRevenue.map(p => p.currencyValue / 240).sort(d3.ascending);
    const coventValues = coventWithRevenue.map(p => p.currencyValue / 240).sort(d3.ascending);

    const druryStats = druryValues.length > 0 ? {
      min: d3.min(druryValues),
      q1: d3.quantile(druryValues, 0.25),
      median: d3.quantile(druryValues, 0.5),
      q3: d3.quantile(druryValues, 0.75),
      max: d3.max(druryValues)
    } : null;

    const coventStats = coventValues.length > 0 ? {
      min: d3.min(coventValues),
      q1: d3.quantile(coventValues, 0.25),
      median: d3.quantile(coventValues, 0.5),
      q3: d3.quantile(coventValues, 0.75),
      max: d3.max(coventValues)
    } : null;

    aggregated.push({
      year: year,
      drury: druryStats,
      covent: coventStats
    });
  });

  return aggregated.sort((a, b) => a.year - b.year);
};

const createYScale = (data, innerHeight) => {
  const years = data.map(d => d.year);

  return d3.scaleBand()
    .domain(years)
    .range([0, innerHeight])
    .padding(0.1);
};

const createXScale = (data, innerWidth) => {
  const maxCount = d3.max(data, d => Math.max(d.druryCount, d.coventCount));

  return d3.scaleLinear()
    .domain([-maxCount, maxCount])
    .range([0, innerWidth]);
};

const createXScaleFromBoxPlot = (data, innerWidth) => {
  const maxValue = d3.max(data, d => {
    const druryMax = d.drury ? d.drury.max : 0;
    const coventMax = d.covent ? d.covent.max : 0;
    return Math.max(druryMax, coventMax);
  });

  return d3.scaleLinear()
    .domain([-maxValue, maxValue])
    .range([0, innerWidth]);
};

const renderYearLabels = (g, yScale, centerX, data) => {
  g.append("g")
    .attr("class", "year-labels")
    .selectAll("text")
    .data(data.filter(d => d.year % 5 === 0))
    .join("text")
    .attr("x", centerX)
    .attr("y", d => yScale(d.year) + yScale.bandwidth() / 2)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", PYRAMID_CONFIG.AXIS_FONT_SIZE)
    .style("fill", token.var('colors.ink'))
    .text(d => d.year);
};

const renderTopAxes = (g, xScale, innerHeight, centerX, options = {}) => {
  const { tickCount = 5, formatValue = (d) => Math.abs(d) } = options;

  const leftAxis = d3.axisTop(xScale)
    .tickValues(xScale.ticks(tickCount).filter(d => d < 0))
    .tickFormat(formatValue);

  const rightAxis = d3.axisTop(xScale)
    .tickValues(xScale.ticks(tickCount).filter(d => d > 0))
    .tickFormat(formatValue);

  g.append("g")
    .attr("class", "x-axis-left")
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis)
    .call(g => g.select(".domain").remove())
    .selectAll("text")
    .style("font-size", PYRAMID_CONFIG.AXIS_FONT_SIZE)
    .style("fill", token.var('colors.ink'));

  g.append("g")
    .attr("class", "x-axis-right")
    .attr("transform", `translate(0, 0)`)
    .call(rightAxis)
    .call(g => g.select(".domain").remove())
    .selectAll("text")
    .style("font-size", PYRAMID_CONFIG.AXIS_FONT_SIZE)
    .style("fill", token.var('colors.ink'));

  g.append("line")
    .attr("class", "center-axis")
    .attr("x1", centerX)
    .attr("x2", centerX)
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", token.var('colors.ink'))
    .attr("stroke-width", 2)
    .attr("opacity", 0.3);
};

const renderDruryBars = (g, data, xScale, yScale, centerX) => {
  const gutterHalf = PYRAMID_CONFIG.GUTTER_WIDTH / 2;

  g.append("g")
    .attr("class", "drury-bars")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => xScale(-d.druryCount))
    .attr("y", d => yScale(d.year))
    .attr("width", d => Math.max(0, centerX - xScale(-d.druryCount) - gutterHalf))
    .attr("height", yScale.bandwidth())
    .attr("fill", THEATRE_COLORS.DRURY)
    .attr("opacity", PYRAMID_CONFIG.BAR_OPACITY);
};

const renderCoventBars = (g, data, xScale, yScale, centerX) => {
  const gutterHalf = PYRAMID_CONFIG.GUTTER_WIDTH / 2;

  g.append("g")
    .attr("class", "covent-bars")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", centerX + gutterHalf)
    .attr("y", d => yScale(d.year))
    .attr("width", d => Math.max(0, xScale(d.coventCount) - centerX - gutterHalf))
    .attr("height", yScale.bandwidth())
    .attr("fill", THEATRE_COLORS.COVENT)
    .attr("opacity", PYRAMID_CONFIG.BAR_OPACITY);
};

const renderTheatreLabels = (g, centerX, innerWidth) => {
  const gutterHalf = PYRAMID_CONFIG.GUTTER_WIDTH / 2;

  g.append("text")
    .attr("x", centerX - gutterHalf)
    .attr("y", -30)
    .attr("text-anchor", "end")
    .style("font-size", PYRAMID_CONFIG.LABEL_FONT_SIZE)
    .style("fill", token.var('colors.ink'))
    .style("font-weight", "bold")
    .text("Drury Lane");

  g.append("text")
    .attr("x", centerX + gutterHalf)
    .attr("y", -30)
    .attr("text-anchor", "start")
    .style("font-size", PYRAMID_CONFIG.LABEL_FONT_SIZE)
    .style("fill", token.var('colors.ink'))
    .style("font-weight", "bold")
    .text("Covent Garden");
};

const renderDruryBoxPlots = (g, data, xScale, yScale, centerX) => {
  const gutterHalf = PYRAMID_CONFIG.GUTTER_WIDTH / 2;
  const boxWidth = yScale.bandwidth();

  const boxPlots = g.append("g")
    .attr("class", "drury-boxplots")
    .selectAll("g")
    .data(data.filter(d => d.drury))
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.year)})`);

  // Whisker line (min to max)
  boxPlots.append("line")
    .attr("x1", d => xScale(-d.drury.min))
    .attr("x2", d => xScale(-d.drury.max))
    .attr("y1", boxWidth / 2)
    .attr("y2", boxWidth / 2)
    .attr("stroke", THEATRE_COLORS.DRURY)
    .attr("stroke-width", 1);

  // Box (Q1 to Q3)
  boxPlots.append("rect")
    .attr("x", d => xScale(-d.drury.q3))
    .attr("y", boxWidth * 0.25)
    .attr("width", d => Math.max(0, xScale(-d.drury.q1) - xScale(-d.drury.q3)))
    .attr("height", boxWidth * 0.5)
    .attr("fill", THEATRE_COLORS.DRURY)
    .attr("opacity", PYRAMID_CONFIG.BAR_OPACITY);

  // Median line
  boxPlots.append("line")
    .attr("x1", d => xScale(-d.drury.median))
    .attr("x2", d => xScale(-d.drury.median))
    .attr("y1", boxWidth * 0.25)
    .attr("y2", boxWidth * 0.75)
    .attr("stroke", token.var('colors.ink'))
    .attr("stroke-width", 2);

  // Min whisker cap
  boxPlots.append("line")
    .attr("x1", d => xScale(-d.drury.min))
    .attr("x2", d => xScale(-d.drury.min))
    .attr("y1", boxWidth * 0.35)
    .attr("y2", boxWidth * 0.65)
    .attr("stroke", THEATRE_COLORS.DRURY)
    .attr("stroke-width", 1);

  // Max whisker cap
  boxPlots.append("line")
    .attr("x1", d => xScale(-d.drury.max))
    .attr("x2", d => xScale(-d.drury.max))
    .attr("y1", boxWidth * 0.35)
    .attr("y2", boxWidth * 0.65)
    .attr("stroke", THEATRE_COLORS.DRURY)
    .attr("stroke-width", 1);
};

const renderCoventBoxPlots = (g, data, xScale, yScale, centerX) => {
  const gutterHalf = PYRAMID_CONFIG.GUTTER_WIDTH / 2;
  const boxWidth = yScale.bandwidth();

  const boxPlots = g.append("g")
    .attr("class", "covent-boxplots")
    .selectAll("g")
    .data(data.filter(d => d.covent))
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.year)})`);

  // Whisker line (min to max)
  boxPlots.append("line")
    .attr("x1", d => xScale(d.covent.min))
    .attr("x2", d => xScale(d.covent.max))
    .attr("y1", boxWidth / 2)
    .attr("y2", boxWidth / 2)
    .attr("stroke", THEATRE_COLORS.COVENT)
    .attr("stroke-width", 1);

  // Box (Q1 to Q3)
  boxPlots.append("rect")
    .attr("x", d => xScale(d.covent.q1))
    .attr("y", boxWidth * 0.25)
    .attr("width", d => Math.max(0, xScale(d.covent.q3) - xScale(d.covent.q1)))
    .attr("height", boxWidth * 0.5)
    .attr("fill", THEATRE_COLORS.COVENT)
    .attr("opacity", PYRAMID_CONFIG.BAR_OPACITY);

  // Median line
  boxPlots.append("line")
    .attr("x1", d => xScale(d.covent.median))
    .attr("x2", d => xScale(d.covent.median))
    .attr("y1", boxWidth * 0.25)
    .attr("y2", boxWidth * 0.75)
    .attr("stroke", token.var('colors.ink'))
    .attr("stroke-width", 2);

  // Min whisker cap
  boxPlots.append("line")
    .attr("x1", d => xScale(d.covent.min))
    .attr("x2", d => xScale(d.covent.min))
    .attr("y1", boxWidth * 0.35)
    .attr("y2", boxWidth * 0.65)
    .attr("stroke", THEATRE_COLORS.COVENT)
    .attr("stroke-width", 1);

  // Max whisker cap
  boxPlots.append("line")
    .attr("x1", d => xScale(d.covent.max))
    .attr("x2", d => xScale(d.covent.max))
    .attr("y1", boxWidth * 0.35)
    .attr("y2", boxWidth * 0.65)
    .attr("stroke", THEATRE_COLORS.COVENT)
    .attr("stroke-width", 1);
};


export const YearByYearVisualization = ({ data }) => {
  const svgRefCount = useRef(null);
  const svgRefRevenue = useRef(null);
  const svgRefBoxPlot = useRef(null);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(1200);
  const [includeOrdinary, setIncludeOrdinary] = useState(true);
  const [includeBenefit, setIncludeBenefit] = useState(true);
  const [includeCommand, setIncludeCommand] = useState(true);

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

    const filteredData = data.filter(d => {
      if (d.isBenefit) return includeBenefit;
      if (d.isCommand) return includeCommand;
      return includeOrdinary;
    });

    const aggregated = aggregatePerformancesByYear(filteredData);

    const height = 800;
    const innerWidth = width - PYRAMID_CONFIG.MARGINS.left - PYRAMID_CONFIG.MARGINS.right;
    const innerHeight = height - PYRAMID_CONFIG.MARGINS.top - PYRAMID_CONFIG.MARGINS.bottom;

    const svg = d3.select(svgRefCount.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${PYRAMID_CONFIG.MARGINS.left},${PYRAMID_CONFIG.MARGINS.top})`);

    const yScale = createYScale(aggregated, innerHeight);
    const xScale = createXScale(aggregated, innerWidth);
    const centerX = xScale(0);

    renderDruryBars(g, aggregated, xScale, yScale, centerX);
    renderCoventBars(g, aggregated, xScale, yScale, centerX);
    renderYearLabels(g, yScale, centerX, aggregated);
    renderTopAxes(g, xScale, innerHeight, centerX);
    renderTheatreLabels(g, centerX, innerWidth);

  }, [data, width, includeOrdinary, includeBenefit, includeCommand]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const filteredData = data.filter(d => {
      if (d.isBenefit) return includeBenefit;
      if (d.isCommand) return includeCommand;
      return includeOrdinary;
    });

    const aggregated = aggregateRevenueByYear(filteredData);
    const boxPlotData = aggregateBoxPlotByYear(filteredData);

    const height = 800;
    const innerWidth = width - PYRAMID_CONFIG.MARGINS.left - PYRAMID_CONFIG.MARGINS.right;
    const innerHeight = height - PYRAMID_CONFIG.MARGINS.top - PYRAMID_CONFIG.MARGINS.bottom;

    const svg = d3.select(svgRefRevenue.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${PYRAMID_CONFIG.MARGINS.left},${PYRAMID_CONFIG.MARGINS.top})`);

    const yScale = createYScale(aggregated, innerHeight);
    const xScale = createXScaleFromBoxPlot(boxPlotData, innerWidth);
    const centerX = xScale(0);

    renderDruryBars(g, aggregated, xScale, yScale, centerX);
    renderCoventBars(g, aggregated, xScale, yScale, centerX);
    renderYearLabels(g, yScale, centerX, aggregated);
    renderTopAxes(g, xScale, innerHeight, centerX, {
      tickCount: 10,
      formatValue: (d) => `£${Math.abs(d).toLocaleString()}`
    });
    renderTheatreLabels(g, centerX, innerWidth);

  }, [data, width, includeOrdinary, includeBenefit, includeCommand]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const filteredData = data.filter(d => {
      if (d.isBenefit) return includeBenefit;
      if (d.isCommand) return includeCommand;
      return includeOrdinary;
    });

    const aggregated = aggregateBoxPlotByYear(filteredData);

    const height = 800;
    const innerWidth = width - PYRAMID_CONFIG.MARGINS.left - PYRAMID_CONFIG.MARGINS.right;
    const innerHeight = height - PYRAMID_CONFIG.MARGINS.top - PYRAMID_CONFIG.MARGINS.bottom;

    const svg = d3.select(svgRefBoxPlot.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${PYRAMID_CONFIG.MARGINS.left},${PYRAMID_CONFIG.MARGINS.top})`);

    const yScale = createYScale(aggregated, innerHeight);
    const xScale = createXScaleFromBoxPlot(aggregated, innerWidth);
    const centerX = xScale(0);

    renderDruryBoxPlots(g, aggregated, xScale, yScale, centerX);
    renderCoventBoxPlots(g, aggregated, xScale, yScale, centerX);
    renderYearLabels(g, yScale, centerX, aggregated);
    renderTopAxes(g, xScale, innerHeight, centerX, {
      tickCount: 10,
      formatValue: (d) => `£${Math.abs(d).toLocaleString()}`
    });
    renderTheatreLabels(g, centerX, innerWidth);

  }, [data, width, includeOrdinary, includeBenefit, includeCommand]);

  const noneSelected = !includeOrdinary && !includeCommand && !includeBenefit;

  return (
    <div ref={containerRef} className={css({ width: "100%" })}>
      <PageWidth>
        <div className={css({ display: "flex", gap: "md", mb: "lg" })}>
          <LatchButton
            checked={includeOrdinary}
            onChange={() => setIncludeOrdinary(!includeOrdinary)}
            color={token.var('colors.ink')}
          >
            Ordinary Performances
          </LatchButton>
          <LatchButton
            checked={includeCommand}
            onChange={() => setIncludeCommand(!includeCommand)}
            color={token.var('colors.ink')}
          >
            Command Performances
          </LatchButton>
          <LatchButton
            checked={includeBenefit}
            onChange={() => setIncludeBenefit(!includeBenefit)}
            color={token.var('colors.ink')}
          >
            Benefit Performances
          </LatchButton>
        </div>
        {noneSelected && (
          <div className={css({
            fontSize: "lg",
            mb: "lg",
            color: token.var('colors.ink'),
            display: "flex",
            alignItems: "center",
            gap: "sm"
          })}>
            <span>⚠</span>
            <span>Please select at least one performance type to display the visualization.</span>
          </div>
        )}
      </PageWidth>
      {!noneSelected && (
        <PageWidth>
          <h2 className={css({ fontSize: "xl", mb: "lg", fontWeight: "normal" })}>
            Revenue Distribution
          </h2>
          <svg ref={svgRefBoxPlot} />
        </PageWidth>
      )}
      {!noneSelected && (
        <PageWidth>
          <h2 className={css({ fontSize: "xl", mb: "lg", fontWeight: "normal" })}>
            Mean Revenue
          </h2>
          <svg ref={svgRefRevenue} />
        </PageWidth>
      )}
      {!noneSelected && (
        <PageWidth>
          <h2 className={css({ fontSize: "xl", mb: "lg", fontWeight: "normal" })}>
            Performance Count
          </h2>
          <svg ref={svgRefCount} />
        </PageWidth>
      )}
    </div>
  );
};
