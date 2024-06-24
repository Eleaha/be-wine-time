import express, { Router } from "express";
import { getUserById, getUsers } from "../controllers/users-controller";
import {
    getBrewsByUserId,
    postBrewByUserId,
} from "../controllers/brews-controller";
import {
    getRecipesByUserId,
    postRecipeByUserId,
} from "../controllers/recipes-controllers";

export const usersRouter: Router = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:user_id", getUserById);

usersRouter.get("/:user_id/brews", getBrewsByUserId);
usersRouter.post("/:user_id/brews", postBrewByUserId);

usersRouter.get("/:user_id/recipes", getRecipesByUserId);
usersRouter.post("/:user_id/recipes", postRecipeByUserId)
