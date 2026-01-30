"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

interface SimpleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

interface SimpleSelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}

const SimpleSelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export function SimpleSelect({ value, onValueChange, placeholder, children, className }: SimpleSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 선택된 아이템의 렌더링 내용 가져오기
  const getSelectedLabel = () => {
    const items = React.Children.toArray(children) as React.ReactElement[];
    const selectedItem = items.find(item => item.props.value === value);
    
    if (!selectedItem) return placeholder;
    
    // 선택된 아이템의 children을 그대로 렌더링
    return selectedItem.props.children;
  };

  const contextValue = {
    value,
    onValueChange: (newValue: string) => {
      onValueChange(newValue);
      setIsOpen(false);
    },
    isOpen,
    setIsOpen,
  };

  return (
    <SimpleSelectContext.Provider value={contextValue}>
      <div ref={selectRef} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-9",
            !value && "text-gray-500"
          )}
        >
          <span className="flex items-center gap-2">{getSelectedLabel()}</span>
          <ChevronDown className={cn("size-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="p-1">
              {children}
            </div>
          </div>
        )}
      </div>
    </SimpleSelectContext.Provider>
  );
}

export function SimpleSelectItem({ value, children, onSelect }: SimpleSelectItemProps) {
  const { value: selectedValue, onValueChange } = React.useContext(SimpleSelectContext);
  const isSelected = selectedValue === value;

  const handleClick = () => {
    onValueChange(value);
    onSelect?.(value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors outline-none",
        isSelected 
          ? "bg-blue-100 text-blue-900" 
          : "hover:bg-gray-100 text-gray-900"
      )}
    >
      {children}
    </button>
  );
}
