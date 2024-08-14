import express, { Router } from "express";
import {
	deleteNoteById,
	getNoteById,
	getNotesByBrewId,
	patchNoteById,
	postNote,
} from "../controllers/notes-controller";

export const notesRouter: Router = express.Router();

notesRouter.get("/:note_id", getNoteById);
notesRouter.patch("/:note_id", patchNoteById);
notesRouter.delete("/:note_id", deleteNoteById);

notesRouter.get("/brew/:brew_id", getNotesByBrewId)
notesRouter.post("/brew/:brew_id", postNote)