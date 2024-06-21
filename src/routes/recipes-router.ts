import express, { Router } from "express";
import { getRecipes } from "../controllers/recipes-controllers";


export const recipesRouter: Router = express.Router()

recipesRouter.get("/", getRecipes)