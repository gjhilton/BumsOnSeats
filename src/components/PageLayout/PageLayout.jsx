import { Link } from "@tanstack/react-router";
import { css } from "@generated/css";
import { html as footerHtml } from "@content/site/footer.md";

function PageTitle({ children }) {
  return (
    <h1
      className={css({
        fontSize: "2xl",
        mb: "lg",
        fontWeight: "normal",
        lineHeight: "1.1",
        marginTop: "xl",
      })}
    >
      {children}
    </h1>
  );
}

function Header() {
  return (
    <header>
      <Link
        to="/"
        className={css({
          textDecoration: "none !important",
          fontSize: "xl",
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
        fontSize: "md",
        lineHeight: "1.6",
        borderTop: "1px solid ink",
        paddingTop: "xl",
      })}
      dangerouslySetInnerHTML={{ __html: footerHtml }}
    />
  );
}

function PageContent({ html }) {
  return (
    <PageWidth>
      <div
        className={css({
          "& p": {
            fontSize: "lg",
            mb: "xl",
            lineHeight: "1.5",
            maxWidth: "800px"
          },
          "& p:first-child": {
            fontSize: "xl"
          }
        })}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </PageWidth>
  );
}

export function PageWidth({ children }) {
  return (
    <div
      className={css({
        paddingTop: "xl",
        paddingBottom: "xl",
        paddingLeft: "2xl",
        paddingRight: "2xl"
      })}
    >
      {children}
    </div>
  );
}

export { PageContent };

export function PageLayout({ title, children }) {
  return (
    <div>
      <PageWidth>
        <Header />
        <PageTitle>{title}</PageTitle>
      </PageWidth>
      {children}

      <PageWidth>
        <Footer />
      </PageWidth>
    </div>
  );
}
