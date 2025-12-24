import { css } from "@generated/css";

const BUTTON_BASE_STYLES = {
  paddingTop: "sm",
  paddingBottom: "sm",
  paddingLeft: "md",
  paddingRight: "md",
  fontSize: "md",
  lineHeight: "1.5",
  background: "transparent",
  border: "2px solid",
  cursor: "pointer",
  borderRadius: 0,
  height: "fit-content"
};

export const Button = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className={css({
      ...BUTTON_BASE_STYLES,
      borderColor: "currentColor",
      color: "inherit"
    })}
  >
    {children}
  </button>
);

export const LatchButton = ({ checked, onChange, children, color }) => (
  <label
    style={{ '--button-color': color }}
    className={css({
      ...BUTTON_BASE_STYLES,
      display: "flex",
      alignItems: "center",
      gap: "sm",
      fontWeight: 700,
      borderColor: checked ? 'var(--button-color)' : "currentColor",
      color: checked ? 'var(--button-color)' : "inherit",
      opacity: checked ? 1 : 0.25
    })}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={css({
          display: "none"
        })}
      />
      <span
        className={css({
          position: "relative",
          display: "inline-block",
          width: "1rem",
          height: "1rem",
          ...(checked ? {
            _after: {
              content: "''",
              position: "absolute",
              left: "20%",
              top: "50%",
              width: "40%",
              height: "70%",
              borderRight: "2px solid currentColor",
              borderBottom: "2px solid currentColor",
              transform: "translate(0, -65%) rotate(45deg)"
            }
          } : {
            _before: {
              content: "''",
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "100%",
              height: "2px",
              background: "currentColor",
              transform: "translate(-50%, -50%) rotate(45deg)"
            },
            _after: {
              content: "''",
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "100%",
              height: "2px",
              background: "currentColor",
              transform: "translate(-50%, -50%) rotate(-45deg)"
            }
          })
        })}
      />
      {children}
    </label>
);
