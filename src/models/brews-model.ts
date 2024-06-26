import format from "pg-format";
import { User, Brew } from "../interfaces";
import { fetchUserById } from "./users-model";
import { formatSQLColumnString } from "../utils";
import { db } from "../db/db-connection";

export const fetchBrews = async () => {
    const { rows } = await db.query(`SELECT * FROM brews`);
    return rows;
};

export const fetchBrewById = async (brewId: number) => {
    const { rows } = await db.query(
        `
        SELECT * FROM brews WHERE id=$1
        `,
        [brewId]
    );
    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows[0];
};

export const fetchBrewsByUserId = async (userId: number) => {
    const { rows } = await db.query(
        `
        SELECT * FROM brews
		WHERE maker_id = $1;
        `,
        [userId]
    );
    if (!rows.length) {
        const user: User = await fetchUserById(userId);
        if (user["id"] === userId) {
            return Promise.reject({ status: 404, msg: "No brews yet!" });
        }
    }
    return rows;
};

export const insertBrew = async (payload: Brew) => {
    const cols: string[] = Object.keys(payload);
    const values: any[] = Object.values(payload);

    const colString = cols.join(", ");
    const queryString: string = format(
        `
		INSERT INTO brews (${colString})
		VALUES %L
		RETURNING *
        `,
        [values]
    );
    const { rows } = await db.query(queryString);
    return rows[0];
};

export const updateBrewById = async (
    brewId: number,
    updateObj: { [index: string]: any }
) => {
    const setString: string = formatSQLColumnString(updateObj);
    const queryString = `UPDATE brews SET ${setString} WHERE id = $1 RETURNING *;`;
    const { rows } = await db.query(queryString, [brewId]);
    return !rows.length
        ? Promise.reject({ status: 404, msg: "Not found" })
        : rows[0];
};

export const removeBrewById = async (brewId: number) => {
    const { rows } = await db.query(
        `
        DELETE FROM brews
		WHERE id = $1
		RETURNING *;
        `,
        [brewId]
    );
    if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
    }
};
