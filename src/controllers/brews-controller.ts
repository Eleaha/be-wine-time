import { Request, Response, NextFunction } from "express";
import {
	fetchBrewById,
	fetchBrews,
	fetchBrewsByUserId,
	removeBrewById,
	updateBrewById,
} from "../models/brews-model";
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

export const getBrewsByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { user_id } = req.params;
	try {
		const brews: Brew[] = await fetchBrewsByUserId(+user_id);
		return res.status(200).send({ brews });
	} catch (err) {
		return next(err);
	}
};

export const patchBrewById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
	const { brew_id } = req.params
	const patchObject = req.body;
	try {
		const brew: Brew = await updateBrewById(+brew_id, patchObject);
		res.status(200).send({ brew });
	} catch(err) {
		console.log(err);
		
	}
};

export const deleteBrewByID = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { brew_id } = req.params;
	try {
		await removeBrewById(+brew_id);
		return res.status(204).send();
	} catch (err) {
		return next(err);
	}
};
