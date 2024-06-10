import { Request, Response, NextFunction } from "express";
import { User } from "../interfaces";
import { fetchUserById, fetchUsers } from "../models/users-model";

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
		const { username } = req.params;
		const user: User = await fetchUserById(username);
		res.status(200).send({ user });
	} catch (err) {
		return next(err);
	}
};
