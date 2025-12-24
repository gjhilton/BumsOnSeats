import { css } from "@generated/css";
import { Link } from "@tanstack/react-router";
import { Caps, Italic, Paragraph } from "./Typography";

export const Act = ({ children, title, link, number }) => {
  const content = (
    <>
      <h3><Caps>ACT</Caps> {number}: <Italic>{title}</Italic></h3>
      <Paragraph>{children}</Paragraph>
    </>
  );

  return (
    <div
      className={css({
        fontWeight: "500",
        fontSize: "3.2cqw",
        display: "inline-block",
        lineHeight: "1",
        padding: " 0",
        wordSpacing: "0.3em",
      })}
    >
      {link ? <Link to={link} className={css({ cursor: "pointer" })}>{content}</Link> : content}
    </div>
  );
};
