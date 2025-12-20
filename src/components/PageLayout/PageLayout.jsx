import { Link } from "@tanstack/react-router";
import { css } from "@generated/css";
import { html as footerHtml } from "@content/site/footer.md";

const PageTitle = ({ children }) => {
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
};

const Header = () => {
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
};

const Footer = () => {
  return (
    <footer
      className={css({
        fontSize: "md",
        lineHeight: "1.6",
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: "ink",
        paddingTop: "xl",
      })}
      dangerouslySetInnerHTML={{ __html: footerHtml }}
    />
  );
};

const PageContent = ({ html }) => {
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
};

export const PageWidth = ({ children }) => {
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
};

export { PageContent };

export const PageLayout = ({ title, children }) => {
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
};
