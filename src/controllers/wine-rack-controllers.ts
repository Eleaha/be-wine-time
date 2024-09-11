import { NextFunction, Request, Response } from "express";
import { Wine } from "../interfaces";
import {
	insertWine,
	fetchWineById,
	fetchWineRackByUserId,
} from "../models/wine-rack-model";

export const getWineById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { wine_id } = req.params;
	try {
		const wine: Wine = await fetchWineById(+wine_id);
		res.status(200).send({ wine });
	} catch (err) {
		return next(err);
	}
};

export const postWineByBrewId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { brew_id } = req.params;
		const newWine: Wine = { brew_id, ...req.body };
		const wine: Wine = await insertWine(newWine);
		res.status(201).send({ wine });
	} catch (err) {
		return next(err);
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
