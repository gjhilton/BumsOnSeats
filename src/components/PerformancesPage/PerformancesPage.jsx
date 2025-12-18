import { Link } from "@tanstack/react-router";
import { CalendarOfPerformances } from "@components/CalendarOfPerformances/CalendarOfPerformances";
import { css } from "@generated/css";
import { token } from "@generated/tokens";
import { html as titleHtml } from "@content/performances/title.md";
import { html as descriptionHtml } from "@content/performances/description.md";
import { html as footerHtml } from "@content/performances/footer.md";

/**
 * Layout wrapper component
 */
function PageWidth({ children }) {
  return (
    <div
      className={css({
        padding: "2rem 8rem"
      })}
    >
      {children}
    </div>
  );
}

/**
 * Page header with home link
 */
function Header() {
  return (
    <header>
      <Link
        to="/"
        className={css({
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
  );
}

/**
 * Pure presentational component for the Performances page
 * @param {Object} props
 * @param {Array} props.data - Processed performance data
 */
export function PerformancesPage({ data }) {
  return (
    <div>
      <PageWidth>
        <Header />

        <h1
          className={css({
            fontSize: "5rem",
            mb: "lg",
            fontWeight: "normal",
            lineHeight: "1.1",
            marginTop: "2rem",
          })}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />

        <div
          className={css({
            "& p": {
              fontSize: "1.5rem",
              mb: "xl",
              lineHeight: "1.5",
              maxWidth: "800px"
            },
            "& p:first-child": {
              fontSize: "2rem"
            }
          })}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      </PageWidth>

      <CalendarOfPerformances data={data} />

      <PageWidth>
        <footer
          className={css({
            fontSize: "1rem",
            lineHeight: "1.6",
            borderTop: `1px solid ${token.var('colors.ink')}`,
            paddingTop: "2rem",
          })}
          dangerouslySetInnerHTML={{ __html: footerHtml }}
        />
      </PageWidth>
    </div>
  );
}
