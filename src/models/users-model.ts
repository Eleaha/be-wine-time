import { db } from "../db/db-connection";

export const fetchUsers = async () => {
	const { rows } = await db.query(`SELECT * FROM users`);
	return rows;
};
