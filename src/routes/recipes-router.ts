import express, { Router } from "express";
import {
    getRecipes,
    getRecipeById,
    patchRecipeById,
    deleteRecipeById,
    getRecipesByUserId,
    postRecipe,
} from "../controllers/recipes-controllers";


export const recipesRouter: Router = express.Router()

recipesRouter.get("/", getRecipes)

recipesRouter.get("/:recipe_id", getRecipeById)
recipesRouter.patch("/:recipe_id", patchRecipeById);
recipesRouter.delete("/:recipe_id", deleteRecipeById)

recipesRouter.get("/user/:user_id", getRecipesByUserId)
recipesRouter.post("/user/:user_id", postRecipe)