import { NextFunction, Request, Response } from "express";
import { Wine } from "../interfaces";
import { fetchWineRackByUserId } from "../models/wine-rack-model";

export const getWineRackByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { user_id } = req.params;
	try {
		const wineRack: Wine[] = await fetchWineRackByUserId(+user_id);
		res.status(200).send({ wineRack });
	} catch (err) {
		return next(err);
	}
};
