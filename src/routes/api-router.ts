import { getEndpoints } from "../controllers/api-controllers";
import express, { Router } from "express";

export const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);
