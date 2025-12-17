import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarOfPerformances } from "@components/CalendarOfPerformances/CalendarOfPerformances";
import { css } from "@generated/css";
import { useState, useEffect } from "react";
import * as d3 from "d3";

const PageWidth = ({children}) =>  <div
        className={css({
          padding: "2rem 8rem",
          minHeight: "100vh"
        })}
      >
     {children}
      </div> 

const Description = () => <>
<Paragraph hero>Each row of this chart corresponds to a single year. Each row has 356/6 columns, each representing a single day of the year. </Paragraph>
<Paragraph>Where no performane took place on that day (for instance during Easter or the long Summer closure), the column is blank. Where a performance took place at either or both of the theates, the column contains a bar, black for Covent Garden, white for Drury Lane, grey where the two intersect. The height of the bar indicates the box office receipts for the performance.</Paragraph>
  </>


const Paragraph = ({children, hero}) =>  <p
        className={css({
          fontSize: hero ? "2rem" : "1.5rem",
          mb: "xl",
          color: "text",
          lineHeight: "1.5",
          maxWidth: "800px"
        })}
      >
     {children}
      </p> 

const Title = ({children}) =>       <h1
        className={css({
          fontSize: "5rem",
          mb: "lg",
          color: "text",
          fontWeight: "normal",
          lineHeight: "1.1",
          marginTop: "2rem",
        })}
      >
        <b>Calendar</b><span> of Performances &amp; Receipts (1732-1809)</span>
      </h1>

const Header = () =>  <header className={css({
       
      })}>
        <Link
          to="/"
          className={css({
            color: "text",
            textDecoration: "none !important",
            fontSize: "2rem",
            _hover: {
              textDecoration: "underline !important"
            }
          })}
        >
          ← Home
        </Link>
      </header>

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
      <div className={css({ padding: "2rem", background: "#fc0", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          Loading performance data...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={css({ padding: "2rem", background: "#FFF", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg", color: "accent" })}>
          Error loading data
        </h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={css({ padding: "2rem", background: "#fc0", minHeight: "100vh" })}>
        <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
          No data available
        </h1>
      </div>
    );
  }

  return (
    <div className={css({background: "#f80" })}>
   <PageWidth>
     <Header />
     <Title />
   <Description />
    
        </PageWidth>
        <CalendarOfPerformances data={data} />
        </div>
  );
}
