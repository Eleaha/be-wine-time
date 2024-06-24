import express, { Router } from "express";
import {
	getUserById,
	getUsers,
	postBrewByUserId,
	postRecipeByUserId,
} from "../controllers/users-controller";
import { getBrewsByUserId } from "../controllers/brews-controller";
import {
	getRecipeById,
	getRecipesByUserId,
} from "../controllers/recipes-controllers";

export const usersRouter: Router = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:user_id", getUserById);

usersRouter.get("/:user_id/brews", getBrewsByUserId);
usersRouter.post("/:user_id/brews", postBrewByUserId);

usersRouter.get("/:user_id/recipes", getRecipesByUserId);
usersRouter.post("/:user_id/recipes", postRecipeByUserId)
