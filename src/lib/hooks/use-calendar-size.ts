import { useState, useCallback } from 'react';

interface CalendarSize {
  width: number;
  height: number;
}

interface UseCalendarSizeProps {
  defaultSize?: CalendarSize;
  minSize?: CalendarSize;
  maxSize?: CalendarSize;
}

export function useCalendarSize({
  defaultSize = { width: 160, height: 180 },
  minSize = { width: 140, height: 160 },
  maxSize = { width: 240, height: 260 }
}: UseCalendarSizeProps = {}) {
  const [size, setSize] = useState<CalendarSize>(defaultSize);

  const updateSize = useCallback((newSize: Partial<CalendarSize>) => {
    setSize(currentSize => {
      const updatedSize = {
        width: newSize.width ?? currentSize.width,
        height: newSize.height ?? currentSize.height
      };

      return {
        width: Math.min(Math.max(updatedSize.width, minSize.width), maxSize.width),
        height: Math.min(Math.max(updatedSize.height, minSize.height), maxSize.height)
      };
    });
  }, [minSize, maxSize]);

  return {
    size,
    updateSize,
    minSize,
    maxSize
  };
}