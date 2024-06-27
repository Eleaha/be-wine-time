import { NextFunction, Request, Response } from "express";
import { Note } from "../interfaces";
import { fetchNoteById } from "../models/notes-model";

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
        return next(err)
    }
};
