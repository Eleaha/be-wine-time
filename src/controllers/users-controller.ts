import { Request, Response, NextFunction } from "express";
import { Brew, Recipe, User } from "../interfaces";
import {
    fetchUserById,
    fetchUsers,
    insertBrewByUserId,
	insertRecipeByUserId,
} from "../models/users-model";

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const users: User[] = await fetchUsers();
	res.status(200).send({ users });
};

export const getUserById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user_id } = req.params;
		const user: User = await fetchUserById(+user_id);
		res.status(200).send({ user });
	} catch (err) {
		return next(err);
	}
};

export const postBrewByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user_id } = req.params;
        const newBrew: Brew = { maker_id: user_id, ...req.body };
        const brew: Brew = await insertBrewByUserId(newBrew);
        res.status(201).send({ brew });
    } catch (err) {
        return next(err);
    }
};

export const postRecipeByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.params;
	const payload: Recipe = { maker_id: user_id, ...req.body };
	const recipe: Recipe = await insertRecipeByUserId(payload)
	res.status(201).send({ recipe })
};
