import { css } from "@generated/css";
import { Bodycopy, Italic } from "./Typography";

export const Footer = () => (
  <div
    className={css({
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      padding: "6em",
      fontSize: "2cqw",
      textAlign: "justify",
    })}
  >
    <Bodycopy>
      <span
        className={css({
          fontSize: "2.5cqw ",
        })}
      >
        All data are copyright the{" "}
        <a href="https://www.theatronomics.com">Theatronomics Project</a> and
        are used by their kind permission, with huge gratitude and subject to
        their{" "}
        <a href="https://www.theatronomics.com/data/introduction/">
          licensing terms and conditions
        </a>
        . Any and all errors are however my own.{" "}
        <Italic>
          The code and design for his site is copyright &copy; 2025-6 g.j.hilton
          / <a href="https://funeralgames.co.uk">Funeral Games</a> and is
          available on{" "}
          <a href="https://github.com/gjhilton/BumsOnSeats">Github</a>.
        </Italic>
      </span>
    </Bodycopy>
  </div>
);
