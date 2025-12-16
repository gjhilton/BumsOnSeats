import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";

function prepareDotsWithOffsets(data) {
  const groups = d3.group(data, d => `${d.year}-${d.dayOfYear}`);
  const dotsData = [];

  groups.forEach((performances) => {
    const sorted = performances.sort((a, b) =>
      a.theatre.localeCompare(b.theatre)
    );

    sorted.forEach((perf, index) => {
      dotsData.push({
        ...perf,
        yOffset: index * 2.5, // Vertical stack
        xJitter: (Math.random() - 0.5) * 0.8, // Horizontal jitter
        isStacked: sorted.length > 1
      });
    });
  });

  return dotsData;
}

export function D3Chart({ data, width = 1200, height = 1560 }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 100, bottom: 20, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    // X-axis: Days of year (always 366 to accommodate leap years)
    const xScale = d3.scaleLinear()
      .domain([1, 366])
      .range([0, innerWidth]);

    // Y-axis: Years (1732-1809)
    const yScale = d3.scaleBand()
      .domain(d3.range(1732, 1810))
      .range([0, innerHeight])
      .padding(0.1);

    // Size: Currency to dot radius (use scaleSqrt for better visual perception)
    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.currencyValue)])
      .range([1, 8]); // Min 1px, max 8px radius

    // Color: Theatre to color
    const colorScale = d3.scaleOrdinal()
      .domain(["Drury Lane", "Covent Garden"])
      .range(["#cf2e2e", "#0693e3"]); // Red, Blue from panda config

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add Y-axis (years) - display every 10 years
    g.append("g")
      .call(d3.axisLeft(yScale).tickValues(
        d3.range(1730, 1810, 10)
      ))
      .selectAll("text")
      .style("font-size", "10px");

    // Add month labels on top
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthDays = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

    g.append("g")
      .selectAll(".month-label")
      .data(months)
      .join("text")
      .attr("class", "month-label")
      .attr("x", (d, i) => xScale(monthDays[i]))
      .attr("y", -10)
      .text(d => d)
      .style("font-size", "10px")
      .style("text-anchor", "start");

    // Prepare dots with offsets for overlapping handling
    const dotsData = prepareDotsWithOffsets(data);

    // Render circles for performances with revenue data
    g.selectAll('.performance-dot')
      .data(dotsData.filter(d => d.currencyValue > 0))
      .join('circle')
      .attr('class', 'performance-dot')
      .attr('cx', d => xScale(d.dayOfYear) + (d.xJitter || 0))
      .attr('cy', d => yScale(d.year) + yScale.bandwidth() / 2 + (d.yOffset || 0))
      .attr('r', d => sizeScale(d.currencyValue))
      .attr('fill', d => colorScale(d.theatre))
      .attr('opacity', 0.5);

    // Render asterisks for performances without revenue data
    g.selectAll('.performance-asterisk')
      .data(dotsData.filter(d => d.currencyValue === 0))
      .join('text')
      .attr('class', 'performance-asterisk')
      .attr('x', d => xScale(d.dayOfYear) + (d.xJitter || 0))
      .attr('y', d => yScale(d.year) + yScale.bandwidth() / 2 + (d.yOffset || 0))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', d => colorScale(d.theatre))
      .attr('opacity', 0.5)
      .attr('font-size', '8px')
      .text('*');

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 90}, 20)`);

    ["Drury Lane", "Covent Garden"].forEach((theatre, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("circle")
        .attr("cx", 5)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", colorScale(theatre))
        .attr("opacity", 0.5);

      legendRow.append("text")
        .attr("x", 15)
        .attr("y", 4)
        .text(theatre)
        .style("font-size", "11px");
    });

  }, [data, width, height]);

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        marginTop: "xl",
        overflowX: "auto",
      })}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
}
