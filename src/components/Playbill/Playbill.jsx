import { css } from "@generated/css";

const Paper = ({ children }) => (
  <div
    className={css({
      containerType: "inline-size",
      width: "80%",
      maxWidth: "800px",
      aspectRatio: "1 / 1.3",
      margin: "2rem auto",
      bg: "#e8dcc8",
      borderRadius: "3px 5px 4px 6px",
      backgroundImage: `
                radial-gradient(circle at 15% 20%, rgba(101,67,33,0.08) 0%, transparent 8%),
                radial-gradient(circle at 85% 15%, rgba(101,67,33,0.06) 0%, transparent 10%),
                radial-gradient(circle at 92% 80%, rgba(101,67,33,0.09) 0%, transparent 12%),
                radial-gradient(circle at 8% 85%, rgba(101,67,33,0.07) 0%, transparent 9%),
                radial-gradient(circle at 50% 95%, rgba(101,67,33,0.05) 0%, transparent 15%),
                radial-gradient(ellipse at 95% 5%, rgba(80,50,20,0.12) 0%, transparent 6%),
                radial-gradient(ellipse at 5% 8%, rgba(80,50,20,0.10) 0%, transparent 7%),
                linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 30%, rgba(101,67,33,0.03) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(101,67,33,0.015) 2px, rgba(101,67,33,0.015) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(101,67,33,0.01) 2px, rgba(101,67,33,0.01) 4px)
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

const Benefit = ({ fontSource }) => (
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

const Theatres = ({ fontSource }) => (
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

const Today = ({ fontSource }) => {
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
        
      marginTop:"1em"
      })}
    >
      <Bodycopy>
        <Caps>{dayOfWeek}</Caps> {timeOfDay}, <Italic>{month}</Italic> {day},{" "}
        {year},
      </Bodycopy>
    </div>
  );
};

const Bodycopy = ({ children }) => (
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

const Caps = ({ children }) => (
  <span
    className={css({
      letterSpacing: "0.3rem",
      textTransform: "uppercase",
    })}
  >
    {children}
  </span>
);

const Italic = ({ children }) => (
  <span
    className={css({
      fontStyle: "italic",
    })}
  >
    {children}
  </span>
);

const Pretitle = ({ fontSource }) => (
  <div
    className={css({
      display: "block"
    })}
  >
    <Bodycopy>
      Will be <Italic>vizualis'd</Italic> the <Caps>dataset</Caps> call'd
    </Bodycopy>
  </div>
);

const Title = ({ fontSource }) => (
  <div  className={css({
      
        margin: "3em 0"
      })}>
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

const Smallcaps = ({ children }) => (
  <span
    className={css({
      textTransform: "lowercase",
      fontVariant: "small-caps",
    })}
  >
    or
  </span>
);

const Footer = () => (
  <div
    className={css({
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      padding: "6em",
      fontSize: "2cqw",
      textAlign:"justify",
        fontSize: "1cqw !important",
    })}
  ><Bodycopy>
    <span  className={css({
  
        fontSize: "2.5cqw ",
    })}>
    All data are copyright the <a href="https://www.theatronomics.com">Theatronomics Project</a> and are used by their kind permission, with huge gratitude and subject to their <a href="https://www.theatronomics.com/data/introduction/">licensing terms and conditions</a>. Any and all errors are however my own. <Italic>The code and design for his site is copyright &copy; 2025-6 g.j.hilton / <a href="https://funeralgames.co.uk">Funeral Games</a> and is available on  <a href="https://github.com/gjhilton/BumsOnSeats">Github</a>.</Italic>
    </span>
    </Bodycopy>
  </div>
);

export function Playbill({ fontSource }) {
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
        <Footer />
      </div>
    </Paper>
  );
}
