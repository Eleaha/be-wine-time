import { db } from "../db/db-connection";

export const fetchUsers = async () => {
	const { rows } = await db.query(`SELECT * FROM users`);
	return rows;
};

export const fetchUserById = async (username: number) => {
	const { rows } = await db.query(
		`
	SELECT 
	users.id,
	users.username, 
	users.password, 
	users.email, 
	COUNT(CASE WHEN brews.maker_id=$1 AND brews.finished=false THEN brews.maker_id END)::INT AS brews_in_progress,
	COUNT(CASE WHEN brews.maker_id=$1 AND brews.finished=true THEN brews.maker_id END)::INT AS completed_brews
	FROM users
	JOIN brews ON users.id = brews.maker_id
	WHERE users.id = $1
	GROUP BY users.id, users.username, users.password, users.email;
	`,
		[username]
	);

	if (!rows.length) {
		return Promise.reject({ status: 404, msg: "Not found" });
	}

	return rows[0];
};
