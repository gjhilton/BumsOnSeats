export function processPerformanceData(rows) {
  return rows.map(row => {
    const date = new Date(row.Date);
    const year = date.getFullYear();

    const startOfYear = new Date(year, 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    const pounds = parseInt(row.Pounds) || 0;
    const shillings = parseInt(String(row.Shillings).trim()) || 0;
    const pence = parseInt(String(row.Pence).trim()) || 0;
    const currencyValue = (pounds * 240) + (shillings * 12) + pence;

    return {
      date,
      year,
      dayOfYear,
      isLeapYear,
      currencyValue,
      theatre: row.Theatre,
      performances: row.Performances,
      isBenefit: row['Is Benefit'] === 'Yes',
      isCommand: row['Is Command'] === 'Yes',
      isRequest: row['Is Request'] === 'Yes',
    };
  });
}
