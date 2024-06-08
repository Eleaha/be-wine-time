import express, { Router } from "express"
import { getUsers } from "../controllers/users-controller"

export const usersRouter: Router = express.Router()

usersRouter.get("/", getUsers)
