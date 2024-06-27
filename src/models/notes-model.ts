import { db } from "../db/db-connection";

export const fetchNoteById = async (noteId: number) => {
    const { rows } = await db.query(
        `
        SELECT * FROM notes WHERE id = $1`,
        [noteId]
    );
    return !rows.length
        ? Promise.reject({ status: 404, msg: "Not found" })
        : rows[0];
};
