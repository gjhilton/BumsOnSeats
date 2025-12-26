import { DateTime } from '@tubular/time';

/**
 * Get the day of the week for any historical date, accounting for the
 * British calendar switchover from Julian to Gregorian on September 14, 1752.
 *
 * @param {Date} date - JavaScript Date object
 * @returns {string} Day of week: 'Monday', 'Tuesday', etc.
 */
export function getDayOfWeek(date) {
  // British calendar switchover: September 14, 1752 was the first Gregorian date
  // (September 3-13, 1752 did not exist)
  const dt = new DateTime(date, 'UTC', { gregorianChange: '1752-09-14' });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dt.getDayOfWeek()];
}
