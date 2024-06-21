import express, { Router } from "express";
import {
    deleteBrewByID,
    getBrewById,
    getBrews,
    patchBrewById,
} from "../controllers/brews-controller";

export const brewsRouter: Router = express.Router();

brewsRouter.get("/", getBrews);
brewsRouter.get("/:brew_id", getBrewById);
brewsRouter.patch("/:brew_id", patchBrewById);
brewsRouter.delete("/:brew_id", deleteBrewByID);
