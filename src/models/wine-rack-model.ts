import { User, Wine } from "../interfaces";
import format from "pg-format";
import { db } from "../db/db-connection";
import { fetchUserById } from "./users-model";

export const fetchWineById = async (wineId: number) => {
	const { rows } = await db.query(`SELECT * FROM wine_rack WHERE id = $1;`, [
		wineId,
	]);
	return rows.length
		? rows[0]
		: Promise.reject({ status: 404, msg: "Not found" });
};

export const insertWine = async (wine: Wine) => {
	const cols: string[] = Object.keys(wine);
	const values: any[] = Object.values(wine);

	const colString = cols.join(", ");
	const queryString: string = format(
		`
        INSERT INTO wine_rack (${colString})
        VALUES %L
        RETURNING *
        `,
		[values]
	);
	const { rows } = await db.query(queryString);
	return rows[0];
};

export const fetchWineRackByUserId = async (userId: number) => {
	const { rows } = await db.query(
		`SELECT 
        wine_rack.id,
        wine_rack.batch_name, 
        wine_rack.brew_id, 
        wine_rack.date_bottled,
        wine_rack.num_of_bottles
        FROM wine_rack 
        LEFT JOIN brews ON wine_rack.brew_id = brews.id
        WHERE brews.maker_id = $1
        GROUP BY 
        wine_rack.id,
        wine_rack.batch_name, 
        wine_rack.brew_id, 
        wine_rack.date_bottled,
        wine_rack.num_of_bottles;`,
		[userId]
	);
	if (!rows.length) {
		const user: User = await fetchUserById(userId);
		return user
			? Promise.reject({ status: 404, msg: "No wines in the rack yet!" })
			: Promise.reject({ status: 404, msg: "Not found" });
	}
	return rows;
};
