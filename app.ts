import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter } from "./routes";
import { errorHandler } from "./utils/middleware";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("tiny"));

app.use("/api",authRouter)


app.use(errorHandler);

export default app; 
