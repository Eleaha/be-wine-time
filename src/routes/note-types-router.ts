import express, { Router } from "express";
import { getNoteTypes } from "../controllers/note-types-controller";

export const noteTypesRouter: Router = express.Router();

noteTypesRouter.get("/", getNoteTypes);
