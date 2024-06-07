import { db } from "../db/db-connection"

export const fetchBrews = async () => {
    const { rows } = await db.query(`SELECT * FROM brews`)
    return rows
}