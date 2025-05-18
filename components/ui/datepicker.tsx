"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Portal } from "@radix-ui/react-portal"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange, placeholder, ...props }) => {
  return (
    <div {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal w-full",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent className="w-auto p-0 z-[10000]" align="start">
            <Calendar
              defaultMonth={date || new Date()}
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Portal>
      </Popover>
    </div>
  );
};
