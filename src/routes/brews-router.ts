import express, { Router } from "express";
import {
    deleteBrewByID,
    getBrewById,
    getBrews,
    patchBrewById,
} from "../controllers/brews-controller";
import { getNotesByBrewId, postNote } from "../controllers/notes-controller";

export const brewsRouter: Router = express.Router();

brewsRouter.get("/", getBrews);

brewsRouter.get("/:brew_id", getBrewById);
brewsRouter.patch("/:brew_id", patchBrewById);
brewsRouter.delete("/:brew_id", deleteBrewByID);

brewsRouter.get("/:brew_id/notes", getNotesByBrewId);
brewsRouter.post("/:brew_id/notes", postNote)

