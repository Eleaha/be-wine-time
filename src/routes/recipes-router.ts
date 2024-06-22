import express, { Router } from "express";
import { getRecipes, getRecipeById } from "../controllers/recipes-controllers";


export const recipesRouter: Router = express.Router()

recipesRouter.get("/", getRecipes)
recipesRouter.get("/:recipe_id", getRecipeById)