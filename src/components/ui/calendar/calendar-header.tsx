import { cn } from "@/lib/utils";

export function CalendarHeader() {
  return (
    <div className="calendar-header grid grid-cols-7 gap-0.5">
      {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
        <div
          key={day + index}
          className={cn(
            "flex items-center justify-center",
            "font-medium",
            "text-slate-500 dark:text-slate-400"
          )}
        >
          {day}
        </div>
      ))}
    </div>
  );
}