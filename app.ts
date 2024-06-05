import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { apiRouter } from "./src/routes/api-router";
import cors from "cors";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
