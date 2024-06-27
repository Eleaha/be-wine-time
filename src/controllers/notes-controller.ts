import { NextFunction, Request, Response } from "express";
import { Note } from "../interfaces";
import { fetchNoteById, fetchNotesByBrewId } from "../models/notes-model";

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
