import { css } from "@generated/css";
import { Link } from "@tanstack/react-router";

const Paper = ({ children }) => (
  <div
    className={css({
      color: "#000",
      containerType: "inline-size",
      width: "80%",
      maxWidth: "800px",
      aspectRatio: "1 / 1.5",
      margin: "2rem auto",
      bg: "#e8dcc8",
      borderRadius: "3px 5px 4px 6px",
      backgroundImage: `
                linear-gradient(to right, rgba(75,35,8,0.45) 0%, transparent 2%),
                linear-gradient(to left, rgba(72,33,7,0.42) 0%, transparent 2%),
                linear-gradient(to bottom, rgba(78,36,9,0.40) 0%, transparent 2%),
                linear-gradient(to top, rgba(70,32,6,0.48) 0%, transparent 2%),
                radial-gradient(ellipse 40% 60% at 0% 0%, rgba(95,45,15,0.35) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 100% 0%, rgba(90,42,12,0.32) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 0% 100%, rgba(85,40,10,0.38) 0%, transparent 50%),
                radial-gradient(ellipse 40% 60% at 100% 100%, rgba(88,43,13,0.36) 0%, transparent 50%),
                radial-gradient(ellipse 25% 100% at 0% 50%, rgba(82,38,8,0.28) 0%, transparent 60%),
                radial-gradient(ellipse 25% 100% at 100% 50%, rgba(86,41,11,0.30) 0%, transparent 60%),
                radial-gradient(ellipse 100% 30% at 50% 0%, rgba(92,44,14,0.25) 0%, transparent 55%),
                radial-gradient(ellipse 100% 30% at 50% 100%, rgba(84,39,9,0.33) 0%, transparent 55%),
                radial-gradient(circle at 15% 20%, rgba(120,65,25,0.12) 0%, transparent 8%),
                radial-gradient(circle at 85% 15%, rgba(115,60,20,0.10) 0%, transparent 10%),
                radial-gradient(circle at 92% 80%, rgba(125,70,28,0.14) 0%, transparent 12%),
                radial-gradient(circle at 8% 85%, rgba(110,58,22,0.11) 0%, transparent 9%),
                radial-gradient(circle at 50% 95%, rgba(118,62,24,0.08) 0%, transparent 15%),
                radial-gradient(ellipse at 95% 5%, rgba(105,50,15,0.18) 0%, transparent 6%),
                radial-gradient(ellipse at 5% 8%, rgba(100,48,12,0.15) 0%, transparent 7%),
                linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 30%, rgba(115,60,20,0.05) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(110,55,18,0.025) 2px, rgba(110,55,18,0.025) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(108,52,16,0.02) 2px, rgba(108,52,16,0.02) 4px)
            `,
      boxShadow: `
                inset 0 0 60px rgba(101,67,33,0.08),
                inset 20px 0 40px rgba(101,67,33,0.06),
                inset -20px 0 40px rgba(101,67,33,0.06),
                inset 0 20px 40px rgba(101,67,33,0.06),
                inset 0 -20px 40px rgba(101,67,33,0.05),
                0 4px 12px rgba(0,0,0,0.1),
                0 2px 4px rgba(0,0,0,0.06)
            `,
      transform: "rotate(1deg)",
    })}
  >
    {children}
  </div>
);

const Benefit = (
  {
    // fontSource
  },
) => (
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

const Theatres = (
  {
    //fontSource
  },
) => (
  <div
    className={css({
      display: "block",
    })}
  >
    <div
      className={css({
        fontWeight: "500",
        letterSpacing: "0.35em",
        fontSize: "6cqw",
        display: "inline-block",
        lineHeight: "1",
        padding: "0.4em 0 0 0",
      })}
    >
      THEATRES-ROYAL
    </div>
  </div>
);

const Today = (
  {
    // fontSource
  },
) => {
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString("en-GB", { weekday: "long" });
  const month = now.toLocaleDateString("en-GB", { month: "long" });
  const day = now.getDate();
  const year = now.getFullYear();

  const hour = now.getHours();
  let timeOfDay;
  if (hour < 12) {
    timeOfDay = "Morning";
  } else if (hour < 16) {
    timeOfDay = "Afternoon";
  } else if (hour < 20) {
    timeOfDay = "Evening";
  } else {
    timeOfDay = "Night";
  }

  return (
    <div
      className={css({
        display: "block",

        marginTop: "1em",
      })}
    >
      <Bodycopy>
        <Caps>{dayOfWeek}</Caps> {timeOfDay}, <Italic>{month}</Italic> {day},{" "}
        {year},
      </Bodycopy>
    </div>
  );
};

const Act = ({
  children,
  title,
  link,
  number
  // , fontSource
}) => {
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
}


const Bodycopy = ({
  children,
  // , fontSource
}) => (
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

const Caps = ({
  children,
  // , fontSource
}) => (
  <span
    className={css({
      letterSpacing: "0.3rem",
      textTransform: "uppercase",
    })}
  >
    {children}
  </span>
);

const Italic = ({
  children,
  // , fontSource
}) => (
  <span
    className={css({
      fontStyle: "italic",
    })}
  >
    {children}
  </span>
);

const Pretitle = (
  {
    // fontSource
  },
) => (
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

const Title = (
  {
    // fontSource
  },
) => (
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
        margin: "0.4em 0 0",
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

const Smallcaps = (
  {
    children
    // , fontSource
  },
) => (
  <span
    className={css({
      textTransform: "lowercase",
      fontVariant: "small-caps",
    })}
  >
    {children}
  </span>
);

const Footer = (
  {
    // , fontSource
  },
) => (
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

const Paragraph = (
  {
    children
    // , fontSource
  },
) => (
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

export function Playbill(
  {
    //fontSource
  },
) {
  // e.g. const letterSpacing = fontSource === 'local' ? '0.04em' : '0.05em'

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
