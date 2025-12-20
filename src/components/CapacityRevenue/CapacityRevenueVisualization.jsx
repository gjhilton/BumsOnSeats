import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";
import { token } from "@generated/tokens";
import { PageWidth } from "../PageLayout/PageLayout";
import { getDayOfWeek } from "@lib/getDayOfWeek";

const CHART_CONFIG = {
  MARGINS: { top: 60, right: 40, bottom: 80, left: 60 },
  MARGINS_PERFORMANCE: { top: 100, right: 40, bottom: 80, left: 60 },
  BAR_OPACITY: 0.85,
  AXIS_FONT_SIZE: "14px",
  LABEL_FONT_SIZE: "16px",
  TITLE_FONT_SIZE: "18px",
};

const THEATRE_COLORS = {
  DRURY: token.var("colors.theatreA"),
  COVENT: token.var("colors.theatreB"),
};

const prepareScatterData = (data) => {
  // Filter for performances with capacity data (exclude null, undefined, and 0)
  const withCapacity = data.filter((d) => d.capacity !== null && d.capacity !== undefined && d.capacity > 0);

  // Add day of week to each performance
  return withCapacity.map((d) => ({
    ...d,
    dayOfWeek: getDayOfWeek(d.date),
  }));
};

const aggregateBoxPlotByDayOfWeek = (data, valueKey) => {
  // Filter for performances with data
  const withData = data.filter((d) => {
    if (valueKey === 'capacity') {
      return d.capacity !== null && d.capacity !== undefined && d.capacity > 0;
    } else if (valueKey === 'currencyValue') {
      return d.currencyValue !== null && d.currencyValue !== undefined && d.currencyValue > 0;
    }
    return false;
  });

  // Add day of week to each performance
  const withDayOfWeek = withData.map((d) => ({
    ...d,
    dayOfWeek: getDayOfWeek(d.date),
  }));

  // Group by day of week
  const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const grouped = d3.group(withDayOfWeek, (d) => d.dayOfWeek);

  return dayOrder.map((day) => {
    const performances = grouped.get(day) || [];
    const druryPerformances = performances.filter((p) => p.theatre === "Drury Lane");
    const coventPerformances = performances.filter((p) => p.theatre === "Covent Garden");

    const druryValues = druryPerformances.map((p) => p[valueKey]).sort(d3.ascending);
    const coventValues = coventPerformances.map((p) => p[valueKey]).sort(d3.ascending);

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

    return {
      dayOfWeek: day,
      drury: druryStats,
      covent: coventStats,
    };
  });
};

const aggregatePerformancesByDayOfWeek = (data) => {
  // Add day of week to each performance
  const withDayOfWeek = data.map((d) => ({
    ...d,
    dayOfWeek: getDayOfWeek(d.date),
  }));

  // Group by day of week
  const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const grouped = d3.group(withDayOfWeek, (d) => d.dayOfWeek);

  return dayOrder.map((day) => {
    const performances = grouped.get(day) || [];
    const druryPerformances = performances.filter((p) => p.theatre === "Drury Lane");
    const coventPerformances = performances.filter((p) => p.theatre === "Covent Garden");

    const druryOrdinary = druryPerformances.filter(p => !p.isBenefit && !p.isCommand).length;
    const druryBenefit = druryPerformances.filter(p => p.isBenefit).length;
    const druryCommand = druryPerformances.filter(p => p.isCommand).length;

    const coventOrdinary = coventPerformances.filter(p => !p.isBenefit && !p.isCommand).length;
    const coventBenefit = coventPerformances.filter(p => p.isBenefit).length;
    const coventCommand = coventPerformances.filter(p => p.isCommand).length;

    return {
      dayOfWeek: day,
      drury: {
        ordinary: druryOrdinary,
        benefit: druryBenefit,
        command: druryCommand,
        total: druryPerformances.length
      },
      covent: {
        ordinary: coventOrdinary,
        benefit: coventBenefit,
        command: coventCommand,
        total: coventPerformances.length
      }
    };
  });
};

export const CapacityRevenueVisualization = ({ data }) => {
  const svgRefCapacity = useRef(null);
  const svgRefRevenue = useRef(null);
  const svgRefPerformances = useRef(null);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const boxPlotData = aggregateBoxPlotByDayOfWeek(data, 'capacity');

    // Setup dimensions
    const height = 600;
    const innerWidth = width - CHART_CONFIG.MARGINS.left - CHART_CONFIG.MARGINS.right;
    const innerHeight = height - CHART_CONFIG.MARGINS.top - CHART_CONFIG.MARGINS.bottom;

    // Clear and setup SVG
    const svg = d3.select(svgRefCapacity.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHART_CONFIG.MARGINS.left},${CHART_CONFIG.MARGINS.top})`);

    // Create scales
    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const xScale = d3
      .scaleBand()
      .domain(dayOrder)
      .range([0, innerWidth])
      .padding(0.1);

    const maxCapacity = d3.max(boxPlotData, (d) => {
      const druryMax = d.drury ? d.drury.max : 0;
      const coventMax = d.covent ? d.covent.max : 0;
      return Math.max(druryMax, coventMax);
    }) || 100;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCapacity])
      .range([innerHeight, 0])
      .nice();

    // Box plot dimensions
    const theatreOffset = 20; // 40px total separation
    const boxWidth = 15;

    // Render Drury Lane box plots
    boxPlotData.forEach((d) => {
      if (!d.drury) return;
      const centerX = xScale(d.dayOfWeek) + xScale.bandwidth() / 2 - theatreOffset;

      // Whisker line (min to max)
      g.append("line")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", yScale(d.drury.min))
        .attr("y2", yScale(d.drury.max))
        .attr("stroke", THEATRE_COLORS.DRURY)
        .attr("stroke-width", 1);

      // Box (Q1 to Q3)
      g.append("rect")
        .attr("x", centerX - boxWidth / 2)
        .attr("y", yScale(d.drury.q3))
        .attr("width", boxWidth)
        .attr("height", yScale(d.drury.q1) - yScale(d.drury.q3))
        .attr("fill", THEATRE_COLORS.DRURY)
        .attr("opacity", 0.6);

      // Median line
      g.append("line")
        .attr("x1", centerX - boxWidth / 2)
        .attr("x2", centerX + boxWidth / 2)
        .attr("y1", yScale(d.drury.median))
        .attr("y2", yScale(d.drury.median))
        .attr("stroke", THEATRE_COLORS.DRURY)
        .attr("stroke-width", 2);
    });

    // Render Covent Garden box plots
    boxPlotData.forEach((d) => {
      if (!d.covent) return;
      const centerX = xScale(d.dayOfWeek) + xScale.bandwidth() / 2 + theatreOffset;

      // Whisker line (min to max)
      g.append("line")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", yScale(d.covent.min))
        .attr("y2", yScale(d.covent.max))
        .attr("stroke", THEATRE_COLORS.COVENT)
        .attr("stroke-width", 1);

      // Box (Q1 to Q3)
      g.append("rect")
        .attr("x", centerX - boxWidth / 2)
        .attr("y", yScale(d.covent.q3))
        .attr("width", boxWidth)
        .attr("height", yScale(d.covent.q1) - yScale(d.covent.q3))
        .attr("fill", THEATRE_COLORS.COVENT)
        .attr("opacity", 0.6);

      // Median line
      g.append("line")
        .attr("x1", centerX - boxWidth / 2)
        .attr("x2", centerX + boxWidth / 2)
        .attr("y1", yScale(d.covent.median))
        .attr("y2", yScale(d.covent.median))
        .attr("stroke", THEATRE_COLORS.COVENT)
        .attr("stroke-width", 2);
    });

    // X axis
    const xAxis = d3.axisBottom(xScale);
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"));

    // Y axis
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => d + "%");
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"));

    // Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -55)
      .attr("text-anchor", "middle")
      .style("font-size", CHART_CONFIG.LABEL_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Portion of Capacity");

    // Legend
    const legend = g.append("g").attr("transform", `translate(${innerWidth - 150}, 10)`);

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 7)
      .attr("r", 5)
      .attr("fill", THEATRE_COLORS.DRURY)
      .attr("opacity", 0.6);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 12)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Drury Lane");

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 27)
      .attr("r", 5)
      .attr("fill", THEATRE_COLORS.COVENT)
      .attr("opacity", 0.6);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 32)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Covent Garden");
  }, [data, width]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const boxPlotData = aggregateBoxPlotByDayOfWeek(data, 'currencyValue');

    // Setup dimensions
    const height = 600;
    const innerWidth = width - CHART_CONFIG.MARGINS.left - CHART_CONFIG.MARGINS.right;
    const innerHeight = height - CHART_CONFIG.MARGINS.top - CHART_CONFIG.MARGINS.bottom;

    // Clear and setup SVG
    const svg = d3.select(svgRefRevenue.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHART_CONFIG.MARGINS.left},${CHART_CONFIG.MARGINS.top})`);

    // Create scales
    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const xScale = d3
      .scaleBand()
      .domain(dayOrder)
      .range([0, innerWidth])
      .padding(0.1);

    const maxRevenue = d3.max(boxPlotData, (d) => {
      const druryMax = d.drury ? d.drury.max : 0;
      const coventMax = d.covent ? d.covent.max : 0;
      return Math.max(druryMax, coventMax);
    }) || 100;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxRevenue])
      .range([innerHeight, 0])
      .nice();

    // Box plot dimensions
    const theatreOffset = 20; // 40px total separation
    const boxWidth = 15;

    // Render Drury Lane box plots
    boxPlotData.forEach((d) => {
      if (!d.drury) return;
      const centerX = xScale(d.dayOfWeek) + xScale.bandwidth() / 2 - theatreOffset;

      // Whisker line (min to max)
      g.append("line")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", yScale(d.drury.min))
        .attr("y2", yScale(d.drury.max))
        .attr("stroke", THEATRE_COLORS.DRURY)
        .attr("stroke-width", 1);

      // Box (Q1 to Q3)
      g.append("rect")
        .attr("x", centerX - boxWidth / 2)
        .attr("y", yScale(d.drury.q3))
        .attr("width", boxWidth)
        .attr("height", yScale(d.drury.q1) - yScale(d.drury.q3))
        .attr("fill", THEATRE_COLORS.DRURY)
        .attr("opacity", 0.6);

      // Median line
      g.append("line")
        .attr("x1", centerX - boxWidth / 2)
        .attr("x2", centerX + boxWidth / 2)
        .attr("y1", yScale(d.drury.median))
        .attr("y2", yScale(d.drury.median))
        .attr("stroke", THEATRE_COLORS.DRURY)
        .attr("stroke-width", 2);
    });

    // Render Covent Garden box plots
    boxPlotData.forEach((d) => {
      if (!d.covent) return;
      const centerX = xScale(d.dayOfWeek) + xScale.bandwidth() / 2 + theatreOffset;

      // Whisker line (min to max)
      g.append("line")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", yScale(d.covent.min))
        .attr("y2", yScale(d.covent.max))
        .attr("stroke", THEATRE_COLORS.COVENT)
        .attr("stroke-width", 1);

      // Box (Q1 to Q3)
      g.append("rect")
        .attr("x", centerX - boxWidth / 2)
        .attr("y", yScale(d.covent.q3))
        .attr("width", boxWidth)
        .attr("height", yScale(d.covent.q1) - yScale(d.covent.q3))
        .attr("fill", THEATRE_COLORS.COVENT)
        .attr("opacity", 0.6);

      // Median line
      g.append("line")
        .attr("x1", centerX - boxWidth / 2)
        .attr("x2", centerX + boxWidth / 2)
        .attr("y1", yScale(d.covent.median))
        .attr("y2", yScale(d.covent.median))
        .attr("stroke", THEATRE_COLORS.COVENT)
        .attr("stroke-width", 2);
    });

    // X axis
    const xAxis = d3.axisBottom(xScale);
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"));

    // Y axis - create tick values at multiples of £100
    const maxPounds = Math.ceil(maxRevenue / 240);
    const poundTicks = d3.range(0, maxPounds + 100, 100);
    const penceTicks = poundTicks.map(p => p * 240);

    const yAxis = d3.axisLeft(yScale)
      .tickValues(penceTicks)
      .tickFormat((d) => "£" + Math.round(d / 240));
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"));

    // Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -55)
      .attr("text-anchor", "middle")
      .style("font-size", CHART_CONFIG.LABEL_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Revenue (£)");

    // Legend
    const legend = g.append("g").attr("transform", `translate(${innerWidth - 150}, 10)`);

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 7)
      .attr("r", 5)
      .attr("fill", THEATRE_COLORS.DRURY)
      .attr("opacity", 0.6);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 12)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Drury Lane");

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 27)
      .attr("r", 5)
      .attr("fill", THEATRE_COLORS.COVENT)
      .attr("opacity", 0.6);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 32)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Covent Garden");
  }, [data, width]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const performanceData = aggregatePerformancesByDayOfWeek(data);

    // Setup dimensions
    const height = 600;
    const innerWidth = width - CHART_CONFIG.MARGINS_PERFORMANCE.left - CHART_CONFIG.MARGINS_PERFORMANCE.right;
    const innerHeight = height - CHART_CONFIG.MARGINS_PERFORMANCE.top - CHART_CONFIG.MARGINS_PERFORMANCE.bottom;

    // Clear and setup SVG
    const svg = d3.select(svgRefPerformances.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CHART_CONFIG.MARGINS_PERFORMANCE.left},${CHART_CONFIG.MARGINS_PERFORMANCE.top})`);

    // Create scales
    const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const xScale = d3
      .scaleBand()
      .domain(dayOrder)
      .range([0, innerWidth])
      .padding(0.1);

    const maxCount = d3.max(performanceData, (d) => Math.max(d.drury.total, d.covent.total)) || 100;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .range([innerHeight, 0])
      .nice();

    // Bar dimensions
    const theatreOffset = 20; // 40px total separation
    const barWidth = 30;

    // Color mixes with white - use actual hex values for interpolation
    const druryHex = "#E53935";
    const coventHex = "#1E88E5";

    const druryOrdinary = druryHex;
    const druryBenefit = d3.interpolate(druryHex, "#FFFFFF")(0.5);
    const druryCommand = d3.interpolate(druryHex, "#FFFFFF")(0.75);

    const coventOrdinary = coventHex;
    const coventBenefit = d3.interpolate(coventHex, "#FFFFFF")(0.5);
    const coventCommand = d3.interpolate(coventHex, "#FFFFFF")(0.75);

    // Render Drury Lane stacked bars
    performanceData.forEach((d) => {
      const centerX = xScale(d.dayOfWeek) + xScale.bandwidth() / 2 - theatreOffset;

      // Ordinary (bottom)
      g.append("rect")
        .attr("x", centerX - barWidth / 2)
        .attr("y", yScale(d.drury.ordinary))
        .attr("width", barWidth)
        .attr("height", innerHeight - yScale(d.drury.ordinary))
        .attr("fill", druryOrdinary);

      // Benefit (middle)
      g.append("rect")
        .attr("x", centerX - barWidth / 2)
        .attr("y", yScale(d.drury.ordinary + d.drury.benefit))
        .attr("width", barWidth)
        .attr("height", yScale(d.drury.ordinary) - yScale(d.drury.ordinary + d.drury.benefit))
        .attr("fill", druryBenefit);

      // Command (top)
      g.append("rect")
        .attr("x", centerX - barWidth / 2)
        .attr("y", yScale(d.drury.total))
        .attr("width", barWidth)
        .attr("height", yScale(d.drury.ordinary + d.drury.benefit) - yScale(d.drury.total))
        .attr("fill", druryCommand);
    });

    // Render Covent Garden stacked bars
    performanceData.forEach((d) => {
      const centerX = xScale(d.dayOfWeek) + xScale.bandwidth() / 2 + theatreOffset;

      // Ordinary (bottom)
      g.append("rect")
        .attr("x", centerX - barWidth / 2)
        .attr("y", yScale(d.covent.ordinary))
        .attr("width", barWidth)
        .attr("height", innerHeight - yScale(d.covent.ordinary))
        .attr("fill", coventOrdinary);

      // Benefit (middle)
      g.append("rect")
        .attr("x", centerX - barWidth / 2)
        .attr("y", yScale(d.covent.ordinary + d.covent.benefit))
        .attr("width", barWidth)
        .attr("height", yScale(d.covent.ordinary) - yScale(d.covent.ordinary + d.covent.benefit))
        .attr("fill", coventBenefit);

      // Command (top)
      g.append("rect")
        .attr("x", centerX - barWidth / 2)
        .attr("y", yScale(d.covent.total))
        .attr("width", barWidth)
        .attr("height", yScale(d.covent.ordinary + d.covent.benefit) - yScale(d.covent.total))
        .attr("fill", coventCommand);
    });

    // X axis
    const xAxis = d3.axisBottom(xScale);
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"));

    // Y axis
    const yAxis = d3.axisLeft(yScale);
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"));

    // Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -55)
      .attr("text-anchor", "middle")
      .style("font-size", CHART_CONFIG.LABEL_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Number of Performances");

    // Legend - two columns side by side
    const legend = g.append("g").attr("transform", `translate(${innerWidth - 300}, -60)`);

    // Theatre labels (left column)
    legend
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .style("font-weight", "bold")
      .text("Theatres:");

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 20)
      .attr("r", 5)
      .attr("fill", THEATRE_COLORS.DRURY)
      .attr("opacity", 1);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 25)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Drury Lane");

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 40)
      .attr("r", 5)
      .attr("fill", THEATRE_COLORS.COVENT)
      .attr("opacity", 1);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 45)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Covent Garden");

    // Performance type labels (right column) - in stack order (top to bottom)
    const typesOffsetX = 150;
    legend
      .append("text")
      .attr("x", typesOffsetX)
      .attr("y", 0)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .style("font-weight", "bold")
      .text("Types:");

    legend
      .append("rect")
      .attr("x", typesOffsetX + 5)
      .attr("y", 10)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", druryCommand);

    legend
      .append("text")
      .attr("x", typesOffsetX + 25)
      .attr("y", 22)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Command");

    legend
      .append("rect")
      .attr("x", typesOffsetX + 5)
      .attr("y", 30)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", druryBenefit);

    legend
      .append("text")
      .attr("x", typesOffsetX + 25)
      .attr("y", 42)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Benefit");

    legend
      .append("rect")
      .attr("x", typesOffsetX + 5)
      .attr("y", 50)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", druryOrdinary);

    legend
      .append("text")
      .attr("x", typesOffsetX + 25)
      .attr("y", 62)
      .style("font-size", CHART_CONFIG.AXIS_FONT_SIZE)
      .style("fill", token.var("colors.ink"))
      .text("Ordinary");
  }, [data, width]);

  const scatterDataCount = data ? prepareScatterData(data).length : 0;
  const totalCount = data ? data.length : 0;

  return (
    <div className={css({ width: "100%" })}>
      <PageWidth>
        <p className={css({ fontSize: "lg", color: "ink", marginBottom: "md" })}>
          Showing {scatterDataCount.toLocaleString()} performances with non-zero capacity data out of {totalCount.toLocaleString()} total performances.
        </p>
      </PageWidth>
      <PageWidth>
        <div ref={containerRef} className={css({ width: "100%" })}>
          <h2 className={css({ fontSize: "xl", mb: "lg", fontWeight: "normal" })}>
            Capacity by Day of Week
          </h2>
          <svg ref={svgRefCapacity} />
        </div>
      </PageWidth>
      <PageWidth>
        <h2 className={css({ fontSize: "xl", mb: "lg", fontWeight: "normal" })}>
          Revenue by Day of Week
        </h2>
        <svg ref={svgRefRevenue} />
      </PageWidth>
      <PageWidth>
        <h2 className={css({ fontSize: "xl", mb: "lg", fontWeight: "normal" })}>
          Performance Types by Day of Week
        </h2>
        <svg ref={svgRefPerformances} />
      </PageWidth>
    </div>
  );
};
