import { db } from "../db/db-connection";

export const fetchRecipes = async () => {
	const { rows } = await db.query(`
        SELECT * FROM recipes`);
	return rows;
};

export const fetchRecipeById = async (recipeId: number) => {
	const { rows } = await db.query(
		`
        SELECT * FROM recipes
        WHERE id = $1`,
		[recipeId]
	);

	return !rows.length
		? Promise.reject({ status: 404, msg: "Not found" })
		: rows[0];
};
