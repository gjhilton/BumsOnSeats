import { Link } from "@tanstack/react-router";
import { css } from "@generated/css";
import { html as footerHtml } from "@content/site/footer.md";

const PageTitle = ({ children }) => (
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

const Header = () => (
  <header>
    <Link
      to="/"
      className={css({
        textDecoration: "none",
        fontSize: "xl",
        _hover: {
          textDecoration: "underline"
        }
      })}
    >
      ← Home
    </Link>
  </header>
);

const Footer = () => (
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

const PageContent = ({ html }) => (
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
);

export const PageWidth = ({ children }) => (
  <div
    className={css({
      paddingLeft: "2xl",
	  paddingRight: "2xl",
	  border: "10px solid red"
    })}
  >
    {children}
  </div>
);

export { PageContent };

export const PageLayout = ({ title, children }) => {
  return (
    <div>
      <PageWidth>
        <Header />
        <PageTitle>{title}</PageTitle>
      {children}
        <Footer />
      </PageWidth>
    </div>
  );
};
