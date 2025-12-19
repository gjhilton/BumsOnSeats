import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";
import { token } from "@generated/tokens";

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

const renderTopAxes = (g, xScale, innerHeight, centerX) => {
  const leftAxis = d3.axisTop(xScale)
    .tickValues(xScale.ticks(5).filter(d => d <= 0))
    .tickFormat(d => Math.abs(d));

  const rightAxis = d3.axisTop(xScale)
    .tickValues(xScale.ticks(5).filter(d => d >= 0))
    .tickFormat(d => Math.abs(d));

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


export const YearByYearVisualization = ({ data }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(1200);

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

    const aggregated = aggregatePerformancesByYear(data);

    const height = 800;
    const innerWidth = width - PYRAMID_CONFIG.MARGINS.left - PYRAMID_CONFIG.MARGINS.right;
    const innerHeight = height - PYRAMID_CONFIG.MARGINS.top - PYRAMID_CONFIG.MARGINS.bottom;

    const svg = d3.select(svgRef.current);
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

  }, [data, width]);

  return (
    <div ref={containerRef} className={css({ marginTop: "xl", width: "100%" })}>
      <div className={css({ paddingTop: 0, paddingBottom: 0, paddingLeft: "2xl", paddingRight: "2xl" })}>
        <h2 className={css({ fontSize: "xl", mb: "lg", fontWeight: "normal" })}>
          Performance Count
        </h2>
      </div>
      <svg ref={svgRef} />
    </div>
  );
};
