import { css } from "@generated/css";
import { Paper } from "./Paper";
import { Benefit } from "./Benefit";
import { Theatres } from "./Theatres";
import { Today } from "./Today";
import { Pretitle } from "./Pretitle";
import { Title } from "./Title";
import { Act } from "./Act";
import { Footer } from "./Footer";
import { PAGE_TITLES } from "@/constants/pageTitles";

export function Playbill() {
  return (
    <Paper>
      <div
        className={css({
          position: "relative",
          fontFamily: "var(--font-caslon)",
          textAlign: "center",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        })}
      >
        <Benefit />
        <Theatres />
        <Today />
        <Pretitle />
        <Title />
        <Act number="1" link="/page-one" title={PAGE_TITLES.PAGE_ONE.short}>
          {PAGE_TITLES.PAGE_ONE.strapline}
        </Act>
        <Act number={2} title={PAGE_TITLES.PAGE_TWO.short} link="/page-two">
          {PAGE_TITLES.PAGE_TWO.strapline}
        </Act>
        <Act number={3} title={PAGE_TITLES.PAGE_THREE.short} link="/page-three">
          {PAGE_TITLES.PAGE_THREE.strapline}
        </Act>
        <Footer />
      </div>
    </Paper>
  );
}
