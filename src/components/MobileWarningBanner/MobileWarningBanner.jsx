import { css } from "@generated/css";

export const MobileWarningBanner = () => {
  return (
    <div
      className={css({
        display: "block",
        imd: {
          display: "none",
        },
        backgroundColor: "#fc0",
        color: "#000",
        padding: "md",
        textAlign: "center",
        fontSize: "lg",
        position: "sticky",
        top: 0,
        zIndex: 1000
      })}
    >
      This site is <strong>best viewed on desktop</strong>
    </div>
  );
};
