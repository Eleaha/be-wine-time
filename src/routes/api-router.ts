import { getEndpoints } from "../controllers/api-controllers";
import express, { Router } from "express";

export const apiRouter: Router = express.Router();

apiRouter.get("/", getEndpoints);
