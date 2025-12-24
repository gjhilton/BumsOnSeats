import { css } from "@generated/css";

export const MobileWarningBanner = () => {
  return (
    <div
      className={css({
        display: "block",
        md: {
          display: "none",
        },
        backgroundColor: "warning",
        color: "warningText",
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
