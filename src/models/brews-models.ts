import { db } from "../db/db-connection";

export const fetchBrews = async () => {
	const { rows } = await db.query(`SELECT * FROM brews`);
	return rows;
};

export const fetchBrewById = async (brewId: number) => {
	const { rows } = await db.query(
		`
        SELECT * FROM brews WHERE id=$1`,
		[brewId]
	);
    if(!rows.length){
        return Promise.reject({status: 404, msg: "Not found"})
    }
	return rows[0];
};
