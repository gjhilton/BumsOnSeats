import { useEffect } from 'react';

export const useChartRender = (renderFn, dependencies, chartName) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const startTime = performance.now();

      renderFn();

      const endTime = performance.now();
      console.log(`[${chartName}] rendered in ${Math.round(endTime - startTime)}ms`);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, dependencies);
};
