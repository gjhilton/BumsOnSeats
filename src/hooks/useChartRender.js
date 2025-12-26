import { useEffect } from 'react';

export const useChartRender = (renderFn, dependencies, chartName) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (import.meta.env.DEV) {
        const startTime = performance.now();
        renderFn();
        const endTime = performance.now();
        console.log(`[${chartName}] rendered in ${Math.round(endTime - startTime)}ms`);
      } else {
        renderFn();
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, dependencies);
};
