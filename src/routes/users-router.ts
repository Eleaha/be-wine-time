import express, { Router } from "express";
import { getUserById, getUsers } from "../controllers/users-controller";
import { getBrewsByUserId } from "../controllers/brews-controller";

export const usersRouter: Router = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:user_id", getUserById);
usersRouter.get("/:user_id/brews", getBrewsByUserId)
