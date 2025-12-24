import { css } from "@generated/css";
import { Paper } from "./Paper";
import { Benefit } from "./Benefit";
import { Theatres } from "./Theatres";
import { Today } from "./Today";
import { Pretitle } from "./Pretitle";
import { Title } from "./Title";
import { Act } from "./Act";
import { Footer } from "./Footer";

export function Playbill() {
  return (
    <Paper>
      <div
        className={css({
          position: "relative",
          height: "100%",
          fontFamily: "var(--font-caslon)",
          textAlign: "center",
        })}
      >
        <Benefit />
        <Theatres />
        <Today />
        <Pretitle />
        <Title />
        <Act number="1" link="/performances" title="Performance Calendar">
          To this calendar is joined an account of the monies received at each performance, faithfully recorded, whereby the prosperity or decline of particular entertainments may be plainly discerned.
        </Act>
        <Act number={2} title="Year by Year Analysis" link="/year-by-year">
          <p>
            Explore performance trends on a <b>year-by-year</b> basis,
            aggregating data across both Drury Lane and Covent Garden theatres.
          </p>
        </Act>
        <Act number={3} title="Capacity vs Revenue" link="/capacity-revenue">
          <p>
            Examine the relationship between theatre <b>capacity</b> and <b>revenue</b>,
            revealing patterns in audience attendance and financial success.
          </p>
        </Act>
        <Footer />
      </div>
    </Paper>
  );
}
