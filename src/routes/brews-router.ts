import express, { Router } from "express";
import {
    deleteBrewByID,
    getBrewById,
    getBrews,
    getBrewsByUserId,
    patchBrewById,
    postBrew,
} from "../controllers/brews-controller";

export const brewsRouter: Router = express.Router();

brewsRouter.get("/", getBrews);

brewsRouter.get("/:brew_id", getBrewById);
brewsRouter.patch("/:brew_id", patchBrewById);
brewsRouter.delete("/:brew_id", deleteBrewByID);

brewsRouter.get("/user/:user_id", getBrewsByUserId)
brewsRouter.post("/user/:user_id", postBrew)