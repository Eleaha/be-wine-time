import { db } from "../db/db-connection";
import { User } from "../interfaces";
import { fetchUserById } from "./users-model";

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

export const fetchRecipesByUserId = async (userId: number) => {
	const { rows } = await db.query(
		`
	SELECT * FROM recipes
	WHERE maker_id = $1`,
		[userId]
	);
	if (!rows.length) {
		const user: User = await fetchUserById(userId);
		return user["id"] === userId
			? Promise.reject({ status: 404, msg: "No recipes yet!" })
			: Promise.reject({ status: 404, msg: "Not Found" });
	}
	return rows;
};
