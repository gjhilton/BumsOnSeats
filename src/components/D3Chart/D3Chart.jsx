import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";

// Configuration constants
const THEATRES = {
  DRURY_LANE: "Drury Lane",
  COVENT_GARDEN: "Covent Garden"
};

const THEATRE_COLORS = {
  [THEATRES.DRURY_LANE]: "#cf2e2e",    // Red
  [THEATRES.COVENT_GARDEN]: "#0693e3"  // Blue
};

const YEAR_RANGE = {
  START: 1732,
  END: 1810  // 1809 inclusive
};

const DOT_CONFIG = {
  MIN_RADIUS: 1,
  MAX_RADIUS: 10,
  OPACITY: 0.3,
  VERTICAL_OFFSET: 2.5,   // px between stacked dots
  HORIZONTAL_JITTER: 0.8  // max ±px for horizontal jitter
};

const CHART_MARGINS = {
  top: 50,
  right: 100,
  bottom: 20,
  left: 80
};

const ASTERISK_FONT_SIZE = "8px";

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
        yOffset: index * DOT_CONFIG.VERTICAL_OFFSET,
        xJitter: (Math.random() - 0.5) * DOT_CONFIG.HORIZONTAL_JITTER,
        isStacked: sorted.length > 1
      });
    });
  });

  return dotsData;
}

export function D3Chart({ data, height = 1560 }) {
  const svgRef = useRef();
  const containerRef = useRef();
  const [width, setWidth] = useState(1200);
  const [visibleTheatres, setVisibleTheatres] = useState({
    [THEATRES.DRURY_LANE]: true,
    [THEATRES.COVENT_GARDEN]: true
  });

  const toggleTheatre = (theatre) => {
    setVisibleTheatres(prev => ({
      ...prev,
      [theatre]: !prev[theatre]
    }));
  };

  // Track container width for responsiveness
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

  // Calculate legend values for dot sizes (in pence: £1 = 240 pence)
  const legendValues = [
    { label: '£5', value: 5 * 240 },       // 1,200 pence
    { label: '£50', value: 50 * 240 },     // 12,000 pence
    { label: '£500', value: 500 * 240 }    // 120,000 pence
  ];

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter data by visible theatres
    const filteredData = data.filter(d => visibleTheatres[d.theatre]);

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const innerWidth = width - CHART_MARGINS.left - CHART_MARGINS.right;
    const innerHeight = height - CHART_MARGINS.top - CHART_MARGINS.bottom;

    // Create scales
    // X-axis: Days of year (always 366 to accommodate leap years)
    const xScale = d3.scaleLinear()
      .domain([1, 366])
      .range([0, innerWidth]);

    // Y-axis: Years
    const yScale = d3.scaleBand()
      .domain(d3.range(YEAR_RANGE.START, YEAR_RANGE.END))
      .range([0, innerHeight])
      .padding(0.1);

    // Size: Currency to dot radius (use scaleSqrt for better visual perception)
    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(filteredData, d => d.currencyValue)])
      .range([DOT_CONFIG.MIN_RADIUS, DOT_CONFIG.MAX_RADIUS]);

    // Color: Theatre to color
    const colorScale = d3.scaleOrdinal()
      .domain([THEATRES.DRURY_LANE, THEATRES.COVENT_GARDEN])
      .range([THEATRE_COLORS[THEATRES.DRURY_LANE], THEATRE_COLORS[THEATRES.COVENT_GARDEN]]);

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHART_MARGINS.left},${CHART_MARGINS.top})`);

    // Add Y-axis (years) - display every 10 years
    g.append("g")
      .call(d3.axisLeft(yScale).tickValues(
        d3.range(YEAR_RANGE.START - 2, YEAR_RANGE.END, 10)
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
    const dotsData = prepareDotsWithOffsets(filteredData);

    // Render circles for performances with revenue data
    g.selectAll('.performance-dot')
      .data(dotsData.filter(d => d.currencyValue > 0))
      .join('circle')
      .attr('class', 'performance-dot')
      .attr('cx', d => xScale(d.dayOfYear) + (d.xJitter || 0))
      .attr('cy', d => yScale(d.year) + yScale.bandwidth() / 2 + (d.yOffset || 0))
      .attr('r', d => sizeScale(d.currencyValue))
      .attr('fill', d => colorScale(d.theatre))
      .attr('opacity', DOT_CONFIG.OPACITY);

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
      .attr('opacity', 1)
      .attr('font-size', ASTERISK_FONT_SIZE)
      .text('*');

  }, [data, width, height, visibleTheatres]);

  const colorScale = d3.scaleOrdinal()
    .domain([THEATRES.DRURY_LANE, THEATRES.COVENT_GARDEN])
    .range([THEATRE_COLORS[THEATRES.DRURY_LANE], THEATRE_COLORS[THEATRES.COVENT_GARDEN]]);

  // Create size scale for legend
  const legendSizeScale = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    return d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.currencyValue)])
      .range([DOT_CONFIG.MIN_RADIUS, DOT_CONFIG.MAX_RADIUS]);
  }, [data]);

  // Helper function to format currency value (pence to £.s.d)
  const formatCurrency = (pence) => {
    const pounds = Math.floor(pence / 240);
    const remainingPence = pence % 240;
    const shillings = Math.floor(remainingPence / 12);
    const finalPence = remainingPence % 12;
    return `£${pounds}.${shillings}.${finalPence}`;
  };

  return (
    <div
      ref={containerRef}
      className={css({
        width: "100%",
        marginTop: "xl",
      })}
    >
      <div
        className={css({
          display: "flex",
          gap: "2rem",
          marginBottom: "1rem",
          marginLeft: `${CHART_MARGINS.left}px`,
          alignItems: "center",
        })}
      >
        {[THEATRES.DRURY_LANE, THEATRES.COVENT_GARDEN].map((theatre) => (
          <label
            key={theatre}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              position: "relative",
            })}
          >
            <input
              type="checkbox"
              checked={visibleTheatres[theatre]}
              onChange={() => toggleTheatre(theatre)}
              className={css({
                position: "absolute",
                opacity: 0,
                cursor: "pointer",
              })}
            />
            <span
              className={css({
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                border: "2px solid black",
                backgroundColor: visibleTheatres[theatre] ? "black" : "white",
                transition: "all 0.2s",
                flexShrink: 0,
              })}
            >
              {visibleTheatres[theatre] && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7L5.5 10.5L12 3"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span
              className={css({
                fontSize: "16px",
              })}
            >
              {theatre}
            </span>
            <span
              className={css({
                display: "inline-block",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                opacity: DOT_CONFIG.OPACITY,
              })}
              style={{ backgroundColor: colorScale(theatre) }}
            />
          </label>
        ))}
      </div>

      {/* Dot size legend */}
      <div
        className={css({
          display: "flex",
          gap: "3rem",
          marginBottom: "2rem",
          marginLeft: `${CHART_MARGINS.left}px`,
          alignItems: "center",
          fontSize: "12px",
        })}
      >
        <div
          className={css({
            display: "flex",
            gap: "2rem",
            alignItems: "center",
          })}
        >
          <span
            className={css({
              fontWeight: "600",
              marginRight: "0.5rem",
            })}
          >
            Box office receipts:
          </span>
          {legendSizeScale && legendValues.map(({ label, value }) => (
            <div
              key={label}
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              })}
            >
              <svg width={DOT_CONFIG.MAX_RADIUS * 2 + 4} height={DOT_CONFIG.MAX_RADIUS * 2 + 4}>
                <circle
                  cx={DOT_CONFIG.MAX_RADIUS + 2}
                  cy={DOT_CONFIG.MAX_RADIUS + 2}
                  r={legendSizeScale(value)}
                  fill="#666"
                  opacity={DOT_CONFIG.OPACITY}
                />
              </svg>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginLeft: "1rem",
            paddingLeft: "1rem",
            borderLeft: "1px solid #ccc",
          })}
        >
          <span
            className={css({
              fontSize: "14px",
              fontWeight: "600",
            })}
          >
            *
          </span>
          <span>No receipt data</span>
        </div>
      </div>

      <svg ref={svgRef}></svg>
    </div>
  );
}
