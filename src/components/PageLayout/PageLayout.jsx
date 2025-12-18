import { Link } from "@tanstack/react-router";
import { css } from "@generated/css";
import { token } from "@generated/tokens";
import { html as footerHtml } from "@content/site/footer.md";

export function PageWidth({ children }) {
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

function Footer() {
  return (
    <footer
      className={css({
        fontSize: "1rem",
        lineHeight: "1.6",
        borderTop: `1px solid ${token.var('colors.ink')}`,
        paddingTop: "2rem",
      })}
      dangerouslySetInnerHTML={{ __html: footerHtml }}
    />
  );
}

export function PageLayout({ children }) {
  return (
    <div>
      <PageWidth>
        <Header />
      </PageWidth>

      {children}

      <PageWidth>
        <Footer />
      </PageWidth>
    </div>
  );
}
