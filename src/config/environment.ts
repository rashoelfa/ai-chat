export const ENVIRONMENT = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  API: {
    SERVICE: {
      AI: {
        BASE_URL:
          process.env.NEXT_PUBLIC_AI_SERVICE_BASE_URL  ||
          "http://localhost:3000",
      },
    },
  },
};
