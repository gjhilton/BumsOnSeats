import { token } from "@generated/tokens";
import * as d3 from "d3";
import { COLORS } from "../../config/panda.config.mjs";

export const THEATRES = {
  DRURY_LANE: "Drury Lane",
  COVENT_GARDEN: "Covent Garden"
};

// CSS variable references for use in PandaCSS styles
export const THEATRE_COLORS = {
  [THEATRES.DRURY_LANE]: token.var('colors.theatreA'),
  [THEATRES.COVENT_GARDEN]: token.var('colors.theatreB'),
  DRURY: token.var('colors.theatreA'),
  COVENT: token.var('colors.theatreB'),
  BOTH: token.var('colors.theatresBoth')
};

/**
 * Get the base hex color for a theatre (for D3/SVG use)
 * @param {string} theatre - Theatre key ('DRURY' or 'COVENT')
 * @returns {string} Hex color string
 */
export function getTheatreColor(theatre) {
  const colorMap = {
    DRURY: COLORS.theatreA,
    COVENT: COLORS.theatreB,
    BOTH: COLORS.theatresBoth
  };
  return colorMap[theatre];
}

/**
 * Creates a tint by interpolating between a theatre color and white
 * @param {string} theatre - Theatre key ('DRURY' or 'COVENT')
 * @param {number} amount - Amount of white to mix (0-1, where 1 is pure white)
 * @returns {string} Hex color string
 */
export function createTheatreTint(theatre, amount) {
  const baseColor = getTheatreColor(theatre);
  return d3.interpolate(baseColor, "#FFFFFF")(amount);
}
