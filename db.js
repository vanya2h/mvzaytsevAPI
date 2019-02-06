import mongoose from "mongoose";
import { config } from "./config";

const options = {
  poolSize: 5,
  reconnectInterval: 2000,
  connectTimeoutMS: 30000,
  keepAlive: true,
  keepAliveInitialDelay: 30000,
  reconnectTries: Number.MAX_VALUE,
  user: config.db.user,
  pass: config.db.password,
  promiseLibrary: Promise,
  useNewUrlParser: true
};

const handleConnectionSuccess = db => {
  console.log("[SERVER] Соединение с базой данных установлено".green);
  Promise.resolve(db);
};

const handleConnectionFail = err => {
  console.log("[SERVER] Соединение с базой данных не произошло".red);
  console.log("[SERVER] Отчёт об ошибке: ".red);
  console.log(err);
};

export const createMongooseConnection = () => {
  /**
   * From this point mongoose has connected
   * and may be used in other modules
   */
  mongoose
    .connect(`mongodb://${config.db.host}/${config.db.database}`, options)
    .then(handleConnectionSuccess)
    .catch(handleConnectionFail);
};

/**
 * Default export is mongoose instance
 * It may be connected or not
 *
 * It depends on where craeteMongooseConnection
 * invoked
 */

mongoose.set("useCreateIndex", true);

export default mongoose;
