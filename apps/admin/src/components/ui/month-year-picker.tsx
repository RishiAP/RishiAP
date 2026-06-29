"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface MonthYearPickerProps {
  value?: string; // "YYYY-MM" format
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
}

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function MonthYearPicker({ value, onChange, disabled }: MonthYearPickerProps) {
  const [year, month] = value ? value.split("-") : ["", ""];
  const [monthOpen, setMonthOpen] = React.useState(false);
  const [yearOpen, setYearOpen] = React.useState(false);

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => String(currentYear - i + 5)); // +5 years future to -45 years past
  }, []);

  const handleMonthChange = (newMonth: string) => {
    if (!year && onChange) {
      onChange(`${new Date().getFullYear()}-${newMonth}`);
    } else if (onChange) {
      onChange(`${year}-${newMonth}`);
    }
  };

  const handleYearChange = (newYear: string) => {
    if (!month && onChange) {
      onChange(`${newYear}-01`);
    } else if (onChange) {
      onChange(`${newYear}-${month}`);
    }
  };

  // We only render SelectItem components when the dropdown is open OR if it is the currently 
  // selected value. This ensures Radix can still read the selected label to display it, 
  // without the massive synchronous render of all unselected items when the modal mounts.
  return (
    <div className="flex gap-2 w-full">
      <div className="flex-[3]">
        <Select 
          value={month} 
          onValueChange={handleMonthChange} 
          disabled={disabled}
          open={monthOpen}
          onOpenChange={setMonthOpen}
        >
          <SelectTrigger>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-[350px]">
            {MONTHS.map((m) => {
              if (monthOpen || m.value === month) {
                return (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                );
              }
              return null;
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-[2]">
        <Select 
          value={year} 
          onValueChange={handleYearChange} 
          disabled={disabled}
          open={yearOpen}
          onOpenChange={setYearOpen}
        >
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-[350px]">
            {years.map((y) => {
              if (yearOpen || y === year) {
                return (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                );
              }
              return null;
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
