import { useState, useEffect, useMemo } from 'react';
import { debounce } from '@/lib/debounce';

export const useResizeObserver = (ref, initialWidth = 1200) => {
  const [width, setWidth] = useState(initialWidth);

  const debouncedSetWidth = useMemo(
    () => debounce((newWidth) => setWidth(newWidth), 150),
    []
  );

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        debouncedSetWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [ref, debouncedSetWidth]);

  return width;
};
