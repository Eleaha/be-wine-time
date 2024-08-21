import { User } from "../interfaces";
import { db } from "../db/db-connection";
import { fetchUserById } from "./users-model";

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
