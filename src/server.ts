import { run } from "./app";
import { Log } from "./helpers";
import { connectDB } from "./utils/DB";

async function startServer() {
  await run().catch(Log.logError);
  await connectDB().catch(Log.logError);
}

startServer();
