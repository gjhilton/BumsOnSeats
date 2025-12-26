import { css } from "@generated/css";
import { Bodycopy, Italic, Smallcaps } from "./Typography";

export const Title = () => (
  <div
    className={css({
      margin: "3em 0",
    })}
  >
    <h1
      className={css({
        textTransform: "uppercase",
        fontWeight: "300",
        fontSize: "9cqw",
        display: "block",
        lineHeight: "0.75",
        padding: " 0",
        margin: "1em 0 0",
        transform: "scaleY(1.1)",
      })}
    >
      Theatronomics
    </h1>
    <Bodycopy>
      <Smallcaps>or</Smallcaps>
    </Bodycopy>
    <h2
      className={css({
        fontWeight: "500",
        fontSize: "9cqw",
        display: "block",
        lineHeight: "0.75",
        padding: " 0",
        margin: "0",
      })}
    >
      <Italic>Bums</Italic> on Seats<Italic>!</Italic>
    </h2>
  </div>
);
