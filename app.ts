import express from "express";
import dotenv from "dotenv";
import { apiRouter } from "./src/routes/api-router";
import cors from "cors";
import { brewsRouter } from "./src/routes/brews-router";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/brews", brewsRouter);
