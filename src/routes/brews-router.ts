import express, { Router } from "express";
import {
	deleteBrewByID,
	getBrewById,
	getBrews,
} from "../controllers/brews-controller";

export const brewsRouter: Router = express.Router();

brewsRouter.get("/", getBrews);
brewsRouter.get("/:brew_id", getBrewById);
brewsRouter.delete("/:brew_id", deleteBrewByID);
