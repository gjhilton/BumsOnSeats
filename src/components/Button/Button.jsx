import { css } from "@generated/css";

export const Button = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className={css({
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      background: "transparent",
      border: "2px solid currentColor",
      color: "inherit",
      cursor: "pointer",
      borderRadius: 0
    })}
  >
    {children}
  </button>
);

export const LatchButton = ({ checked, onChange, children, color }) => (
  <label
    style={{ '--button-color': color }}
    className={css({
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem 1rem",
      fontSize: "1rem",
	  fontWeight: 700,
      border: "2px solid",
      cursor: "pointer",
      borderRadius: 0,
      background: "transparent",
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
