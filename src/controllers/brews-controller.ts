import { Request, Response, NextFunction } from "express";
import { fetchBrewById, fetchBrews } from "../models/brews-model";
import { Brew } from "../interfaces";

export const getBrews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const brews: Brew[] = await fetchBrews();
	return res.status(200).send({ brews });
};

export const getBrewById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { brew_id } = req.params;
	try {
		const brew: Brew = await fetchBrewById(+brew_id);
		return res.status(200).send({ brew });
	} catch (err) {
		return next(err);
	}
};
