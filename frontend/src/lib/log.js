// Minimal dev-only logger.
// In production builds (NODE_ENV === 'production') these become no-ops,
// preventing accidental leakage of error details via the browser console
// while still surfacing issues during local development.

const isDev = process.env.NODE_ENV !== 'production';

export const log = {
  error: (...args) => { if (isDev) console.error(...args); },
  warn:  (...args) => { if (isDev) console.warn(...args);  },
  info:  (...args) => { if (isDev) console.info(...args);  },
};

export default log;
