import { db } from "../db/db-connection";
import { User } from "../interfaces";
import { formatPatchString } from "../utils";
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

export const updateRecipeById = async (
    recipeId: number,
    updateObj: { [index: string]: any }
) => {
    const setString: string = formatPatchString(updateObj);
    const queryString = `UPDATE recipes SET ${setString} WHERE id = $1 RETURNING *;`;

    const { rows } = await db.query(queryString, [recipeId]);
    return !rows.length
        ? Promise.reject({ status: 404, msg: "Not found" })
        : rows[0];
};

export const removeRecipeById = async (recipeId: number) => {
    const { rows } = await db.query(
        `
        DELETE FROM recipes WHERE id = $1 RETURNING *;`,
        [recipeId]
    );
    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }
};
