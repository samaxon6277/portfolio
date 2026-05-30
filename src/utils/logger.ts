const isDev = !!(
  typeof import.meta !== 'undefined' &&
  (import.meta as any).env &&
  (import.meta as any).env.DEV
);

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Only log strictly non-sensitive info if needed, but in production we can choose to suppress or log minimal
    if (isDev) {
      console.error(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  }
};
