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

function inlineComputedStyles(svgElement) {
  const cloned = svgElement.cloneNode(true);

  // Get all elements from both original and clone
  const originalElements = [svgElement, ...svgElement.querySelectorAll('*')];
  const clonedElements = [cloned, ...cloned.querySelectorAll('*')];

  // CSS properties that are relevant for SVG
  const relevantProps = [
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin',
    'opacity', 'fill-opacity', 'stroke-opacity',
    'font-family', 'font-size', 'font-weight', 'font-style',
    'text-anchor', 'dominant-baseline',
    'mix-blend-mode', 'transform'
  ];

  clonedElements.forEach((clonedEl, index) => {
    const originalEl = originalElements[index];
    const computedStyle = window.getComputedStyle(originalEl);

    relevantProps.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'none' && value !== 'normal') {
        clonedEl.style.setProperty(prop, value);
      }
    });
  });

  return cloned;
}

export async function exportSVG(svgRef, containerRef, filename = 'calendar-of-performances.svg') {
  const svgElement = svgRef.current;
  const container = containerRef.current;

  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  try {
    // Clone the main SVG and inline its styles
    const clonedMainSvg = inlineComputedStyles(svgElement);

    const svgWidth = parseFloat(svgElement.getAttribute('width'));
    const svgHeight = parseFloat(svgElement.getAttribute('height'));

    // Find all legend SVG elements and their labels
    const allSvgs = Array.from(container.querySelectorAll('svg'));
    const legendSvgs = allSvgs.filter(svg => svg !== svgElement);

    // Get the label text for each legend SVG
    const legendItems = legendSvgs.map(svg => {
      const parentDiv = svg.parentElement;
      const labelSpan = parentDiv.querySelector('span');
      return {
        svg: svg,
        label: labelSpan ? labelSpan.textContent : '',
        labelElement: labelSpan
      };
    });

    // Get computed font styles from existing legend elements
    let legendFontFamily = 'serif';
    let legendTitleFontFamily = 'serif';
    if (legendItems.length > 0 && legendItems[0].labelElement) {
      const computedStyle = window.getComputedStyle(legendItems[0].labelElement);
      legendFontFamily = computedStyle.fontFamily;
    }
    const legendTitleElement = container.querySelector('div > div > span');
    if (legendTitleElement) {
      const computedStyle = window.getComputedStyle(legendTitleElement);
      legendTitleFontFamily = computedStyle.fontFamily;
    }

    // Create a new combined SVG
    const combinedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    combinedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Calculate combined height
    const legendSpacing = 80;
    const legendHeight = 100;
    const combinedHeight = svgHeight + legendSpacing + legendHeight;

    combinedSvg.setAttribute('width', svgWidth);
    combinedSvg.setAttribute('height', combinedHeight);

    // Add background rect that covers entire combined SVG
    const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    backgroundRect.setAttribute('width', svgWidth);
    backgroundRect.setAttribute('height', combinedHeight);
    backgroundRect.setAttribute('fill', 'rgb(0, 0, 0)');
    combinedSvg.appendChild(backgroundRect);

    // Add main visualization content (skip the first background rect from original)
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Array.from(clonedMainSvg.children).forEach((child, index) => {
      // Skip the first rect (background) as we've added our own
      if (index === 0 && child.tagName === 'rect') return;
      mainGroup.appendChild(child.cloneNode(true));
    });
    combinedSvg.appendChild(mainGroup);

    // Add legend
    if (legendItems.length > 0) {
      const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendGroup.setAttribute('transform', `translate(60, ${svgHeight + legendSpacing})`);

      // Add "Box office receipts:" text
      const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      legendTitle.setAttribute('x', '0');
      legendTitle.setAttribute('y', '0');
      legendTitle.setAttribute('fill', 'rgb(255, 255, 255)');
      legendTitle.setAttribute('font-size', '14px');
      legendTitle.setAttribute('font-weight', '600');
      legendTitle.style.setProperty('font-family', legendTitleFontFamily);
      legendTitle.textContent = 'Box office receipts:';
      legendGroup.appendChild(legendTitle);

      // Add legend items
      let xOffset = 0;

      legendItems.forEach((item) => {
        const svg = item.svg;
        const clonedLegendSvg = inlineComputedStyles(svg);
        const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgGroup.setAttribute('transform', `translate(${xOffset}, 25)`);

        // Add the SVG content
        Array.from(clonedLegendSvg.children).forEach(child => {
          svgGroup.appendChild(child.cloneNode(true));
        });

        // Add label text
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', parseFloat(svg.getAttribute('width')) / 2);
        label.setAttribute('y', parseFloat(svg.getAttribute('height')) + 20);
        label.setAttribute('fill', 'rgb(255, 255, 255)');
        label.setAttribute('font-size', '14px');
        label.setAttribute('text-anchor', 'middle');
        label.style.setProperty('font-family', legendFontFamily);
        label.textContent = item.label;
        svgGroup.appendChild(label);

        legendGroup.appendChild(svgGroup);
        xOffset += parseFloat(svg.getAttribute('width')) + 40;
      });

      combinedSvg.appendChild(legendGroup);
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(combinedSvg);

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error exporting SVG:', err);
  }
}

export async function exportPNG(svgRef, containerRef, filename = 'calendar-of-performances.png') {
  const svgElement = svgRef.current;
  const container = containerRef.current;

  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  try {
    // Clone the main SVG and inline its styles
    const clonedMainSvg = inlineComputedStyles(svgElement);

    const svgWidth = parseFloat(svgElement.getAttribute('width'));
    const svgHeight = parseFloat(svgElement.getAttribute('height'));

    // Find all legend SVG elements and their labels
    // The legend is structured as divs containing svg + span pairs
    const allSvgs = Array.from(container.querySelectorAll('svg'));
    const legendSvgs = allSvgs.filter(svg => svg !== svgElement);

    // Get the label text for each legend SVG
    const legendItems = legendSvgs.map(svg => {
      // Find the span sibling that contains the label
      const parentDiv = svg.parentElement;
      const labelSpan = parentDiv.querySelector('span');
      return {
        svg: svg,
        label: labelSpan ? labelSpan.textContent : '',
        labelElement: labelSpan
      };
    });

    // Get computed font styles from existing legend elements
    let legendFontFamily = 'serif';
    let legendTitleFontFamily = 'serif';
    if (legendItems.length > 0 && legendItems[0].labelElement) {
      const computedStyle = window.getComputedStyle(legendItems[0].labelElement);
      legendFontFamily = computedStyle.fontFamily;
    }
    // Find the legend title element to get its font
    const legendTitleElement = container.querySelector('div > div > span');
    if (legendTitleElement) {
      const computedStyle = window.getComputedStyle(legendTitleElement);
      legendTitleFontFamily = computedStyle.fontFamily;
    }

    // Create a new combined SVG
    const combinedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    combinedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Calculate combined height (main svg + spacing + legend)
    const legendSpacing = 80;
    const legendHeight = 100;
    const combinedHeight = svgHeight + legendSpacing + legendHeight;

    combinedSvg.setAttribute('width', svgWidth);
    combinedSvg.setAttribute('height', combinedHeight);

    // Add background rect that covers entire combined SVG
    const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    backgroundRect.setAttribute('width', svgWidth);
    backgroundRect.setAttribute('height', combinedHeight);
    backgroundRect.setAttribute('fill', 'rgb(0, 0, 0)');
    combinedSvg.appendChild(backgroundRect);

    // Add main visualization content (skip the first background rect from original)
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Array.from(clonedMainSvg.children).forEach((child, index) => {
      // Skip the first rect (background) as we've added our own
      if (index === 0 && child.tagName === 'rect') return;
      mainGroup.appendChild(child.cloneNode(true));
    });
    combinedSvg.appendChild(mainGroup);

    // Add legend
    if (legendItems.length > 0) {
      const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      legendGroup.setAttribute('transform', `translate(60, ${svgHeight + legendSpacing})`);

      // Add "Box office receipts:" text
      const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      legendTitle.setAttribute('x', '0');
      legendTitle.setAttribute('y', '0');
      legendTitle.setAttribute('fill', 'rgb(255, 255, 255)');
      legendTitle.setAttribute('font-size', '14px');
      legendTitle.setAttribute('font-weight', '600');
      legendTitle.style.setProperty('font-family', legendTitleFontFamily);
      legendTitle.textContent = 'Box office receipts:';
      legendGroup.appendChild(legendTitle);

      // Add legend items
      let xOffset = 0;

      legendItems.forEach((item) => {
        const svg = item.svg;
        const clonedLegendSvg = inlineComputedStyles(svg);
        const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgGroup.setAttribute('transform', `translate(${xOffset}, 25)`);

        // Add the SVG content
        Array.from(clonedLegendSvg.children).forEach(child => {
          svgGroup.appendChild(child.cloneNode(true));
        });

        // Add label text
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', parseFloat(svg.getAttribute('width')) / 2);
        label.setAttribute('y', parseFloat(svg.getAttribute('height')) + 20);
        label.setAttribute('fill', 'rgb(255, 255, 255)');
        label.setAttribute('font-size', '14px');
        label.setAttribute('text-anchor', 'middle');
        label.style.setProperty('font-family', legendFontFamily);
        label.textContent = item.label;
        svgGroup.appendChild(label);

        legendGroup.appendChild(svgGroup);
        xOffset += parseFloat(svg.getAttribute('width')) + 40;
      });

      combinedSvg.appendChild(legendGroup);
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(combinedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgWidth * 2;
      canvas.height = combinedHeight * 2;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      });
    };

    img.onerror = (err) => {
      console.error('Error loading SVG image:', err);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  } catch (err) {
    console.error('Error exporting PNG:', err);
  }
}
