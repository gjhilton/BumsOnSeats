import { Link } from "@tanstack/react-router";
import { css } from "@generated/css";
import { token } from "@generated/tokens";
import { html as footerHtml } from "@content/site/footer.md";

export const PageContent = ({html}) => <PageWidth>
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

const PageTitle = ({children}) =>  
<h1
          className={css({
            fontSize: "5rem",
            mb: "lg",
            fontWeight: "normal",
            lineHeight: "1.1",
            marginTop: "2rem",
          })}>
          {children}
        </h1>

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
