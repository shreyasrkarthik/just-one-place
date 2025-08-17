export const trackEvent = (name: string, options?: Record<string, unknown>) => {
  window.plausible?.(name, { props: options });
};

declare global {
  interface Window {
    plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export {}; // Ensure this file is treated as a module
