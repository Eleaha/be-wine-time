import { db } from "../db/db-connection";
import { User } from "../interfaces";
import { fetchUsers } from "./users-model";

export const fetchBrews = async () => {
	const { rows } = await db.query(`SELECT * FROM brews`);
	return rows;
};

export const fetchBrewById = async (brewId: number) => {
	const { rows } = await db.query(`SELECT * FROM brews WHERE id=$1`, [brewId]);
	if (!rows.length) {
		return Promise.reject({ status: 404, msg: "Not found" });
	}
	return rows[0];
};

export const fetchBrewsByUserId = async (userId: number) => {
	const { rows } = await db.query(
		`SELECT * FROM brews 
		WHERE maker_id = $1;`,
		[userId]
	);
	if (!rows.length) {
		const users: User[] = await fetchUsers();
		for (const user of users) {
			if (user["id"] === userId) {
				return Promise.reject({ status: 404, msg: "No brews yet!" });
			}
		}
		return Promise.reject({ status: 404, msg: "Not found" });
	}
	return rows;
};
