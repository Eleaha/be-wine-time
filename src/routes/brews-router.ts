import express, {Router} from "express"
import { getBrewById, getBrews } from "../controllers/brews-controllers";

export const brewsRouter: Router = express.Router();

brewsRouter.get('/', getBrews)
brewsRouter.get("/:brew_id", getBrewById)