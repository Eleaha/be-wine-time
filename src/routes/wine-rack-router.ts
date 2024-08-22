import express, { Router } from "express";
import { getWineById, getWineRackByUserId } from "../controllers/wine-rack-controllers";

export const wineRackRouter: Router = express.Router();

wineRackRouter.get("/:wine_id", getWineById)

wineRackRouter.get("/user/:user_id", getWineRackByUserId);
