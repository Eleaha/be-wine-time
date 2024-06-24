import { db } from "../db/db-connection";
import { Brew, Recipe } from "../interfaces";
import format from "pg-format";

export const fetchUsers = async () => {
    const { rows } = await db.query(`SELECT * FROM users`);
    return rows;
};

export const fetchUserById = async (userId: number) => {
    const { rows } = await db.query(
        `
	SELECT 
	users.id,
	users.username, 
	users.password, 
	users.email,
	COUNT(CASE WHEN brews.maker_id=$1 AND brews.finished=false THEN brews.maker_id ELSE NULL END)::INT AS brews_in_progress,
	COUNT(CASE WHEN brews.maker_id=$1 AND brews.finished=true THEN brews.maker_id ELSE NULL END)::INT AS completed_brews
	FROM users
	LEFT JOIN brews ON users.id = brews.maker_id
	WHERE users.id = $1
	GROUP BY users.id, users.username, users.password, users.email;
	`,
        [userId]
    );

    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }

    return rows[0];
};

export const insertBrewByUserId = async (payload: Brew) => {
    const cols: string[] = Object.keys(payload);
    const values: any[] = Object.values(payload);

    const colString = cols.join(", ");
    const queryString: string = format(
        `
		INSERT INTO brews (${colString})
		VALUES %L
		RETURNING *`,
        [values]
    );
	const { rows } = await db.query(queryString);
    return rows[0];
};

export const insertRecipeByUserId = async (payload: Recipe) => {
    const cols: string[] = Object.keys(payload)
    const values: any[] = Object.values(payload)

    const colString = cols.join(", ")
    const queryString: string = format(
        `
        INSERT INTO recipes (${colString})
        VALUES %L
        RETURNING *`,
        [values]
    )
    const { rows } = await db.query(queryString)
    return rows[0]
}
