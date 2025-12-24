import { css } from "@generated/css";

export const Bodycopy = ({ children }) => (
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
    {children}
  </div>
);

export const Caps = ({ children }) => (
  <span
    className={css({
      letterSpacing: "0.3rem",
      textTransform: "uppercase",
    })}
  >
    {children}
  </span>
);

export const Italic = ({ children }) => (
  <span
    className={css({
      fontStyle: "italic",
    })}
  >
    {children}
  </span>
);

export const Smallcaps = ({ children }) => (
  <span
    className={css({
      textTransform: "lowercase",
      fontVariant: "small-caps",
    })}
  >
    {children}
  </span>
);

export const Paragraph = ({ children }) => (
  <span
    className={css({
      display: "block",
      textAlign: "justify",
      padding: "0 4em",
    })}
  >
    <Bodycopy>
      <span
        className={css({
          fontSize: "2.5cqw ",
        })}
      >
        {children}
      </span>
    </Bodycopy>
  </span>
);
