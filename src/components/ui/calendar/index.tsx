import { Calendar as CalendarPrimitive } from "react-day-picker";
import { cn } from "@/lib/utils";
import { CalendarHeader } from "./calendar-header";
import { CalendarCell } from "./calendar-cell";
import { CalendarNav } from "./calendar-nav";
import { CalendarRoot } from "./calendar-root";
import "./styles.css";

export type CalendarProps = React.ComponentProps<typeof CalendarPrimitive>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <CalendarRoot className={cn("calendar-container", className)} {...props}>
      <CalendarHeader />
      <CalendarNav />
      <CalendarCell showOutsideDays={showOutsideDays} />
    </CalendarRoot>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };