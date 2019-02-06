import express from "express";
import http from "http";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressValidator from "express-validator";
import bodyParser from "body-parser";
import { errorHandler } from "@middlewares/errorHandler";
import * as serverRoutes from "./routes";
import { config } from "./config";
import { createMongooseConnection } from "./db";

const app = express();
export const server = http.createServer(app);

app.use(
  `${config.app.prefix}/${config.app.uploadDir}`,
  express.static(`${__dirname}/${config.app.uploadDir}`)
);

app.use(cookieParser());
app.use(expressValidator());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ credentials: true }));
app.use(morgan("dev"));

Object.keys(serverRoutes).map(routeInstance => {
  app.use(`${config.app.prefix}/${routeInstance}`, serverRoutes[routeInstance]);
});

app.use(errorHandler);

server.listen(config.app.port, () => {
  console.log("[SERVER] Сервер запущен".green);
  console.log(
    `[SERVER] В режиме: ${process.env.NODE_ENV === "production" ? "PRODUCTION" : "DEVELOPMENT"}`
      .grey
  );
  console.log(`[SERVER] Порт: ${config.app.port}`);

  createMongooseConnection();
});

export default app;
