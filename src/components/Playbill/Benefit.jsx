import { css } from "@generated/css";

export const Benefit = () => (
  <div
    className={css({
      display: "block",
    })}
  >
    <div
      className={css({
        fontWeight: "500",
        letterSpacing: "0.08em",
        fontSize: "5cqw",
        borderBottom: "1px solid black",
        display: "inline-block",
        lineHeight: "1",
        padding: "0.7em 0 0.2em 0",
      })}
    >
      For the <em className={css({ fontStyle: "italic" })}>BENEFIT</em> of Mr.
      HILTON.
    </div>
  </div>
);
