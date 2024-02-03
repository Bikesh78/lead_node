import app from "./app";
import { PORT } from "./utils/config";
import { connectToDatabase } from "./utils/db";

const startApp = async () => {
  await connectToDatabase();
  app
    .listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
    .on("error", (err) => console.log(`error connecting ${err}`));
};

startApp();
