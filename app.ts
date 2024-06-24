import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { apiRouter } from "./src/routes/api-router";
import cors from "cors";
import { brewsRouter } from "./src/routes/brews-router";
import { handleErrors } from "./error-handling";
import { usersRouter } from "./src/routes/users-router";
import { recipesRouter } from "./src/routes/recipes-router";

dotenv.config();

export const app = express();

app.use(express.json());

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/brews", brewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/recipes", recipesRouter)

app.all("*", (req: Request, res: Response, next: NextFunction) => {
	res.status(404).send({ msg: "Not found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	handleErrors(err, req, res, next);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ msg: "Internal server error" });
});
