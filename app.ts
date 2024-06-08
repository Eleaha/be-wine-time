import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { apiRouter } from "./src/routes/api-router";
import cors from "cors";
import { brewsRouter } from "./src/routes/brews-router";
import { handleErrors } from "./error-handling";

dotenv.config();

export const app = express();

app.use(express.json());

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/brews", brewsRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	handleErrors(err, req, res, next);
});
