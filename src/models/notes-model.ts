import format from "pg-format";
import { db } from "../db/db-connection";
import { Brew, Note } from "../interfaces";
import { fetchBrewById } from "./brews-model";
import { formatSQLColumnString } from "../utils";

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

export const fetchNotesByBrewId = async (brewId: number) => {
	const { rows } = await db.query(
		`
        SELECT * FROM notes WHERE maker_id = $1
        `,
		[brewId]
	);
	if (!rows.length) {
		const brew: Brew = await fetchBrewById(brewId);
		return !brew
			? Promise.reject({ status: 404, msg: "Not found" })
			: Promise.reject({ status: 404, msg: "No notes yet!" });
	}
	return rows;
};

export const insertNote = async (payload: Note) => {
	const cols: string[] = Object.keys(payload);
	const values: any[] = Object.values(payload);

	const colString = cols.join(", ");
	const queryString: string = format(
		`
		INSERT INTO notes (${colString})
		VALUES %L
		RETURNING *`,
		[values]
	);
	const { rows } = await db.query(queryString);
	return rows[0];
};

export const updateNoteById = async (
	noteId: number,
	updateObj: { [index: string]: any }
) => {
	const setString: string = formatSQLColumnString(updateObj);
	const queryString = `UPDATE notes SET ${setString} WHERE id = $1 RETURNING *;`;

	const { rows } = await db.query(queryString, [noteId]);
	return !rows.length
		? Promise.reject({ status: 404, msg: "Not found" })
		: rows[0];
};

export const removeNoteById = async (noteId: number) => {
	const { rows } = await db.query(
		`DELETE FROM notes WHERE id = $1 RETURNING *;`,
		[noteId]
	);
	if (!rows.length) {
		return Promise.reject({ status: 404, msg: "Not found" });
	}
};
