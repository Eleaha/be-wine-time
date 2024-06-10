import express, { Router } from "express";
import { getUserById, getUsers } from "../controllers/users-controller";

export const usersRouter: Router = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserById);
