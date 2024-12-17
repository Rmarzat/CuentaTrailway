import { Calendar } from "react-day-picker";
import { cn } from "@/lib/utils";

interface CalendarRootProps extends React.ComponentProps<typeof Calendar> {
  className?: string;
}

export function CalendarRoot({ className, ...props }: CalendarRootProps) {
  return (
    <Calendar
      className={cn(
        "p-1",
        "bg-white dark:bg-slate-950",
        "border rounded-md shadow-sm",
        "dark:border-slate-800",
        "text-xs",
        className
      )}
      {...props}
    />
  );
}