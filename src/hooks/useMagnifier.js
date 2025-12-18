import { useEffect, useRef } from "react";
import * as d3 from "d3";

const DEFAULT_CONFIG = {
  RADIUS: 100,
  ZOOM_LEVEL: 3,
  BORDER_WIDTH: 3,
  BORDER_COLOR: "#000",
  BACKGROUND_COLOR: "#f80"
};

/**
 * Custom hook to add a magnifier/loupe effect to an SVG visualization
 *
 * @param {Object} params
 * @param {React.RefObject} params.svgRef - Reference to the SVG element
 * @param {Function} params.renderMagnifiedContent - Callback function to render magnified content
 *   Receives (magnifierContent, centerX, centerY, config) as parameters
 * @param {Object} params.config - Configuration object for magnifier appearance
 * @param {number} params.config.radius - Radius of the magnifier circle
 * @param {number} params.config.zoomLevel - Magnification zoom level
 * @param {number} params.config.borderWidth - Width of the magnifier border
 * @param {string} params.config.borderColor - Color of the magnifier border
 * @param {string} params.config.backgroundColor - Background color of the magnifier
 * @param {Array} params.dependencies - Array of dependencies to trigger effect re-run
 */
export function useMagnifier({
  svgRef,
  renderMagnifiedContent,
  config = {},
  dependencies = []
}) {
  const magnifierRef = useRef(null);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    if (!svgRef.current || !renderMagnifiedContent) return;

    const svg = d3.select(svgRef.current);

    // Remove existing magnifier if any
    svg.select(".magnifier").remove();
    svg.select("defs #magnifier-clip").remove();

    // Add clip path for magnifier
    let defs = svg.select("defs");
    if (defs.empty()) {
      defs = svg.append("defs");
    }

    defs.append("clipPath")
      .attr("id", "magnifier-clip")
      .append("circle")
      .attr("r", finalConfig.RADIUS);

    // Create magnifier overlay
    const magnifier = svg.append("g")
      .attr("class", "magnifier")
      .style("pointer-events", "none")
      .style("opacity", 0);

    magnifierRef.current = magnifier;

    // Background circle for magnifier
    magnifier.append("circle")
      .attr("r", finalConfig.RADIUS)
      .attr("fill", finalConfig.BACKGROUND_COLOR);

    // Magnifier content group
    const magnifierContent = magnifier.append("g")
      .attr("class", "magnifier-content")
      .attr("clip-path", "url(#magnifier-clip)");

    // Magnifier border
    magnifier.append("circle")
      .attr("r", finalConfig.RADIUS)
      .attr("fill", "none")
      .attr("stroke", finalConfig.BORDER_COLOR)
      .attr("stroke-width", finalConfig.BORDER_WIDTH);

    // Mouse and touch event handlers
    const updateMagnifier = (event) => {
      const [mouseX, mouseY] = d3.pointer(event, svg.node());

      // Show magnifier
      magnifier
        .style("opacity", 1)
        .attr("transform", `translate(${mouseX}, ${mouseY})`);

      // Clear previous content
      magnifierContent.selectAll("*").remove();

      // Render magnified content using callback
      renderMagnifiedContent(magnifierContent, mouseX, mouseY, finalConfig);
    };

    const hideMagnifier = () => {
      magnifier.style("opacity", 0);
    };

    // Touch event handlers
    const handleTouchStart = (event) => {
      event.preventDefault(); // Prevent scrolling
      updateMagnifier(event.touches[0]);
    };

    const handleTouchMove = (event) => {
      event.preventDefault(); // Prevent scrolling
      updateMagnifier(event.touches[0]);
    };

    const handleTouchEnd = (event) => {
      event.preventDefault();
      hideMagnifier();
    };

    // Attach mouse events
    svg
      .on("mousemove", updateMagnifier)
      .on("mouseleave", hideMagnifier);

    // Attach touch events
    const svgNode = svg.node();
    svgNode.addEventListener("touchstart", handleTouchStart, { passive: false });
    svgNode.addEventListener("touchmove", handleTouchMove, { passive: false });
    svgNode.addEventListener("touchend", handleTouchEnd, { passive: false });
    svgNode.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    // Cleanup function
    return () => {
      svg.on("mousemove", null);
      svg.on("mouseleave", null);
      svgNode.removeEventListener("touchstart", handleTouchStart);
      svgNode.removeEventListener("touchmove", handleTouchMove);
      svgNode.removeEventListener("touchend", handleTouchEnd);
      svgNode.removeEventListener("touchcancel", handleTouchEnd);
      magnifier.remove();
    };
  }, [svgRef, renderMagnifiedContent, finalConfig, ...dependencies]);

  return magnifierRef;
}
