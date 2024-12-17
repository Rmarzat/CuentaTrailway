import { cn } from "@/lib/utils";

interface CalendarCellProps {
  showOutsideDays?: boolean;
}

export function CalendarCell({ showOutsideDays = true }: CalendarCellProps) {
  return (
    <div
      className={cn(
        "calendar-grid",
        showOutsideDays && "show-outside-days"
      )}
    >
      {Array.from({ length: 42 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "calendar-cell",
            "flex items-center justify-center",
            "rounded-sm",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            "focus:bg-slate-100 dark:focus:bg-slate-800",
            "aria-selected:bg-slate-900 dark:aria-selected:bg-slate-50",
            "aria-selected:text-slate-50 dark:aria-selected:text-slate-900",
            "data-[disabled]:opacity-50",
            "data-[outside-month]:opacity-30"
          )}
        />
      ))}
    </div>
  );
}