import { Log } from "../../helpers";
import { Config, ConfigKey } from "../../config";
import mongoose from "mongoose";
// mongodb+srv://mihir:<password>@cluster0.tevmscz.mongodb.net/?
let uri = `mongodb+srv://${Config.getConfig<string>(ConfigKey.MONGO_USERNAME)}:${Config.getConfig<string>(ConfigKey.MONGO_PASSWORD)}@${Config.getConfig<string>(ConfigKey.MONGO_CLUSTER)}/?retryWrites=true&w=majority&appName=${Config.getConfig<string>(ConfigKey.MONGO_APPNAME)}`;
// const client = new mongoose.(uri);

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
  } catch (error) {
    Log.logError((error as Error).message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  Log.logInfo("MongoDB connected successfully");
});

mongoose.connection.on("error", (error) => {
  Log.logError("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  Log.logInfo("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  Log.logInfo("MongoDB reconnected");
});

mongoose.connection.on("SIGINT", () => {
  Log.logInfo("MongoDB connection closed due to app termination");
});

mongoose.connection.on("SIGUSR2", () => {
  Log.logInfo("MongoDB connection closed due to node restart");
});
