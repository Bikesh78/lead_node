import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authRouter, interactionRouter, leadRouter } from "./routes";
import { authMiddleware, errorHandler } from "./utils/middleware";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api", authRouter);

app.use(authMiddleware);

app.use("/api/lead", leadRouter);
app.use("/api/interaction", interactionRouter);

app.use(errorHandler);

export default app;
