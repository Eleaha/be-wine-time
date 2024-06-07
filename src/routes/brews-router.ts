import express, {Router} from "express"
import { getBrews } from "../controllers/brews-controllers";

export const brewsRouter = express.Router();

brewsRouter.get('/', getBrews)