import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { css } from "@generated/css";

export const YearByYearVisualization = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;

    svg
      .attr("width", width)
      .attr("height", height);

    svg
      .append("rect")
      .attr("x", 50)
      .attr("y", 50)
      .attr("width", 700)
      .attr("height", 300)
      .attr("fill", "ink")
      .attr("stroke", "paper")
      .attr("stroke-width", 2);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "paper")
      .attr("font-size", "24px")
      .text(`Year by Year Visualization (${data.length} performances)`);

  }, [data]);

  return (
    <div className={css({ marginTop: "xl" })}>
      <svg ref={svgRef} />
    </div>
  );
};
