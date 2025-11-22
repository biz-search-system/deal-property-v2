"use client";

import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@workspace/ui/components/popover";
import { createContext, use, useState, useRef } from "react";

type PropertyInfo = {
  propertyName: string;
};

type ContextType = {
  activeProperty: PropertyInfo | null;
  setActiveProperty: (property: PropertyInfo | null) => void;
  setAnchorElement: (element: HTMLDivElement | null) => void;
  openPopover: (element: HTMLDivElement, property: PropertyInfo) => void;
};

const PopoverContext = createContext<ContextType | null>(null);

export function PopoverProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState<PropertyInfo | null>(
    null
  );
  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(
    null
  );

  const openPopover = (element: HTMLDivElement, property: PropertyInfo) => {
    setAnchorElement(element);
    setActiveProperty(property);
    setIsOpen(true);
  };

  return (
    <PopoverContext
      value={{
        activeProperty,
        setActiveProperty,
        setAnchorElement,
        openPopover,
      }}
    >
      {children}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {anchorElement && (
          // 通常のRefではなく、virtualRefを使うことで、異なるDOM要素を動的に参照
          <PopoverAnchor virtualRef={{ current: anchorElement }} />
        )}
        <PopoverContent>
          {activeProperty && (
            <div className="space-y-2">
              <h4 className="font-medium leading-none">物件名</h4>
              <p className="text-sm text-muted-foreground wrap-break-word">
                {activeProperty.propertyName}
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </PopoverContext>
  );
}

export const usePopover = () => {
  const context = use(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
};

interface PropertyNameCellProps {
  propertyName: string;
}

export function PropertyNameCell({ propertyName }: PropertyNameCellProps) {
  const { openPopover } = usePopover();
  const cellRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (cellRef.current) {
      openPopover(cellRef.current, { propertyName });
    }
  };

  return (
    <div
      ref={cellRef}
      onClick={handleClick}
      className="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:underline"
    >
      {propertyName}
    </div>
  );
}
