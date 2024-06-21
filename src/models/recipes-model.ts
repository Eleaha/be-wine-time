import { db } from "../db/db-connection";

export const fetchRecipes = async () => {
	const { rows } = await db.query(`
        SELECT * FROM recipes`);
        console.log(rows);
	return rows;
};
