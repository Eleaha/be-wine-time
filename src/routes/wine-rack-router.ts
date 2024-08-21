import express, { Router } from "express";
import { getWineRackByUserId } from "../controllers/wine-rack-controllers";

export const wineRackRouter: Router = express.Router();

wineRackRouter.get("/user/:user_id", getWineRackByUserId);
