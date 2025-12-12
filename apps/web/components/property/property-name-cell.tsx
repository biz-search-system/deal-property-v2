"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { useState } from "react";

interface PropertyNameCellProps {
  propertyName: string;
}

export function PropertyNameCell({ propertyName }: PropertyNameCellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:underline">
          {propertyName}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">物件名</h4>
          <p className="text-sm text-muted-foreground wrap-break-word">
            {propertyName}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
