import express, { Router } from "express";
import { getNoteById } from "../controllers/notes-controller";

export const notesRouter = express.Router()

notesRouter.get("/:note_id", getNoteById)
