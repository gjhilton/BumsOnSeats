import { createFileRoute } from "@tanstack/react-router";
import { CalendarOfPerformances } from "@components/CalendarOfPerformances/CalendarOfPerformances";
import { css } from "@generated/css";
import { useState, useEffect } from "react";
import * as d3 from "d3";

export const Route = createFileRoute("/performances")({
  component: Performances,
});

function processData(rows) {
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

function Performances() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    d3.csv('/BumsOnSeats/data/plays_export_2025-12-15_21-52-04.csv')
      .then(processData)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={css({ padding: "2rem" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          Loading performance data...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={css({ padding: "2rem" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg", color: "accent" })}>
          Error loading data
        </h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={css({ padding: "2rem" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          No data available
        </h1>
      </div>
    );
  }

  return (
    <div>
      <h1
        className={css({
          fontSize: "large",
          mb: "lg",
          color: "text",
          fontWeight: "normal",
          lineHeight: "1.1",
          marginLeft: "80px",
          marginRight: "100px",
        })}
      >
        Calendar of Performances &amp; Receipts (1732-1809)
      </h1>
     {/* <p
        className={css({
          fontSize: "medium",
          mb: "xl",
          color: "text",
          lineHeight: "1.5",
          marginLeft: "80px",
          marginRight: "100px",
        })}
      >
        {data.length} performances visualized across 77 years
      </p> */}
      <div className={css({ mt: "2xl" })}>
        <CalendarOfPerformances data={data} height={1560} />
      </div>
    </div>
  );
}
