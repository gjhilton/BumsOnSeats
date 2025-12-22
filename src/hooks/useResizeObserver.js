import { useState, useEffect } from 'react';

export const useResizeObserver = (ref, initialWidth = 1200) => {
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [ref]);

  return width;
};
