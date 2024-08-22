import { NextFunction, Request, Response } from "express";
import { Wine } from "../interfaces";
import { fetchWineById, fetchWineRackByUserId } from "../models/wine-rack-model";

export const getWineById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { wine_id } = req.params;
	try {
		const wine: Wine = await fetchWineById(+wine_id)
		res.status(200).send({ wine })
	} catch (err) {
		return next(err)
	}
};

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
