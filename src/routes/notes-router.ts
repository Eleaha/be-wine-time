import express, { Router } from "express";
import {
	deleteNoteById,
	getNoteById,
	patchNoteById,
} from "../controllers/notes-controller";

export const notesRouter = express.Router();

notesRouter.get("/:note_id", getNoteById);
notesRouter.patch("/:note_id", patchNoteById);
notesRouter.delete("/:note_id", deleteNoteById);
