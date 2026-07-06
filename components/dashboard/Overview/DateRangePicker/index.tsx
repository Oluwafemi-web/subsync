"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IDateRangePickerProps } from "./@types";

const PRESETS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const;

export function DateRangePicker({ value, onChange }: IDateRangePickerProps) {
  function applyPreset(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);

    onChange({
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset.days)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="analytics-from" className="text-xs">
            From
          </Label>
          <Input
            id="analytics-from"
            type="date"
            value={value.from}
            max={value.to}
            className="w-[10.5rem]"
            onChange={(event) =>
              onChange({ ...value, from: event.target.value })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="analytics-to" className="text-xs">
            To
          </Label>
          <Input
            id="analytics-to"
            type="date"
            value={value.to}
            min={value.from}
            max={new Date().toISOString().slice(0, 10)}
            className="w-[10.5rem]"
            onChange={(event) =>
              onChange({ ...value, to: event.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}
