const path = require("path");

const getServerAddress = port => {
  if (process.env.NODE_ENV !== "production") {
    return `http://localhost:${port}/api`;
  }

  return `https://${process.env.APP_DOMAIN}/api`;
};

const getFrontendAddress = port => {
  if (process.env.NODE_ENV !== "production") {
    return `http://localhost:${port}`;
  }

  return `https://${process.env.APP_DOMAIN}`;
};

const configureConfig = () => ({
  app: {
    port: process.env.APP_PORT,
    prefix: "/api",
    uploadDir: "uploads",
    server: getServerAddress(process.env.APP_PORT),
    frontend: getFrontendAddress(process.env.FRONTEND_PORT)
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
  },
  email: {
    user: process.env.SMTP_USER,
    host: process.env.SMTP_HOST,
    password: process.env.SMTP_PASSWORD
  }
});

export const config = configureConfig(process.env.NODE_ENV);
export default config;
