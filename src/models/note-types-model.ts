import { db } from "../db/db-connection";

export const fetchNoteTypes = async () => {
    const { rows } = await db.query(
        `
        SELECT * FROM note_types;
        `
    )
    return rows
}