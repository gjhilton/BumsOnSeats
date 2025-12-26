import { css } from "@generated/css";
import { Bodycopy, Caps, Italic } from "./Typography";

export const Today = () => {
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
