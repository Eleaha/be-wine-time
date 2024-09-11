import express, { Router } from "express";
import {
	getWineById,
	getWineRackByUserId,
	postWineByBrewId,
} from "../controllers/wine-rack-controllers";

export const wineRackRouter: Router = express.Router();

wineRackRouter.get("/:wine_id", getWineById);

wineRackRouter.post("/:brew_id", postWineByBrewId);

wineRackRouter.get("/user/:user_id", getWineRackByUserId);
