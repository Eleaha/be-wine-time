import { Request, Response, NextFunction } from "express";
import { fetchNoteTypes } from "../models/note-types-model";
import { NoteTypes } from "../interfaces";

export const getNoteTypes = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const noteTypes: NoteTypes[] = await fetchNoteTypes()
    res.status(200).send({noteTypes})
}