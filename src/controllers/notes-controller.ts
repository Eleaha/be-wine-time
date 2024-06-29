import { NextFunction, Request, Response } from "express";
import { Note } from "../interfaces";
import {
	fetchNoteById,
	fetchNotesByBrewId,
	insertNote,
	removeNoteById,
	updateNoteById,
} from "../models/notes-model";

export const getNoteById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { note_id } = req.params;
	try {
		const note: Note = await fetchNoteById(+note_id);
		res.status(200).send({ note });
	} catch (err) {
		return next(err);
	}
};

export const getNotesByBrewId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { brew_id } = req.params;
	try {
		const notes: Note[] = await fetchNotesByBrewId(+brew_id);
		res.status(200).send({ notes });
	} catch (err) {
		return next(err);
	}
};

export const postNote = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { brew_id } = req.params;
	const newNote: Note = { brew_id, ...req.body };
	try {
		const note: Note = await insertNote(newNote);
		res.status(201).send({ note });
	} catch (err) {
		return next(err);
	}
};

export const patchNoteById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { note_id } = req.params;
	const patchObject: { [index: string]: any } = req.body;
	try {
		const note: Note = await updateNoteById(+note_id, patchObject);
		res.status(200).send({ note });
	} catch (err) {
		return next(err);
	}
};

export const deleteNoteById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { note_id } = req.params;
	try {
		await removeNoteById(+note_id);
		res.status(204).send();
	} catch (err) {
		return next(err);
	}
};
