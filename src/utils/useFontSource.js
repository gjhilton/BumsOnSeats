import { useState, useEffect } from "react";

/**
 * React hook to detect which font source is being used (typekit or local)
 *
 * @returns {'typekit' | 'local'} The current font source
 *
 * @example
 * function MyComponent() {
 *   const fontSource = useFontSource();
 *
 *   return (
 *     <div style={{
 *       letterSpacing: fontSource === 'local' ? '0.03em' : '0.05em'
 *     }}>
 *       Text with conditional styling
 *     </div>
 *   );
 * }
 */
export function useFontSource() {
  const [fontSource, setFontSource] = useState(() => {
    // Initialize with current value
    if (typeof document !== "undefined") {
      return (
        document.documentElement.getAttribute("data-font-source") || "typekit"
      );
    }
    return "typekit";
  });

  useEffect(() => {
    // Update when the attribute changes
    const observer = new MutationObserver(() => {
      const newSource =
        document.documentElement.getAttribute("data-font-source") || "typekit";
      setFontSource(newSource);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-font-source"],
    });

    return () => observer.disconnect();
  }, []);

  return fontSource;
}

/**
 * Check if Typekit fonts are loaded
 *
 * @returns {boolean} True if Typekit fonts are being used
 *
 * @example
 * const isTypekitLoaded = useFontSource() === 'typekit';
 */
export function useIsTypekitLoaded() {
  return useFontSource() === "typekit";
}
