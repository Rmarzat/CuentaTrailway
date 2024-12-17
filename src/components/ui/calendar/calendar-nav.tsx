import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CalendarNav() {
  return (
    <div className="calendar-nav flex items-center justify-between px-1">
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
      >
        <ChevronLeft className="h-2.5 w-2.5" />
      </button>
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "bg-transparent p-0 opacity-50 hover:opacity-100"
        )}
      >
        <ChevronRight className="h-2.5 w-2.5" />
      </button>
    </div>
  );
}