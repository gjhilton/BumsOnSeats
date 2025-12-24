import { css } from "@generated/css";
import { Bodycopy, Italic, Caps } from "./Typography";

export const Pretitle = () => (
  <div
    className={css({
      display: "block",
    })}
  >
    <Bodycopy>
      Will be <Italic>vizualis'd</Italic> the <Caps>dataset</Caps> call'd
    </Bodycopy>
  </div>
);
