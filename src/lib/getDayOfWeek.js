import { DateTime } from '@tubular/time';

/**
 * Get the day of the week for any historical date, accounting for the
 * British calendar switchover from Julian to Gregorian on September 14, 1752.
 *
 * IMPORTANT: Pass an ISO date string (e.g., '1732-09-08') for accurate results.
 * If a JavaScript Date object is passed, it will already be in the Gregorian calendar
 * and will produce incorrect results for dates before the calendar switchover.
 *
 * @param {string|Date} dateInput - ISO date string (preferred) or JavaScript Date object
 * @returns {string} Day of week: 'Monday', 'Tuesday', etc.
 */
export function getDayOfWeek(dateInput) {
  // British calendar switchover: September 14, 1752 was the first Gregorian date
  // (September 3-13, 1752 did not exist)

  // CRITICAL: Parse ISO string directly to interpret dates correctly as Julian before 1752-09-14
  // JavaScript Date objects are ALWAYS Gregorian, so passing a Date here would give wrong results
  const dt = typeof dateInput === 'string'
    ? new DateTime(dateInput, 'UTC', '1752-09-14')
    : new DateTime(dateInput, 'UTC', '1752-09-14'); // Fallback for Date objects (legacy)

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dt.getDayOfWeek()];
}
