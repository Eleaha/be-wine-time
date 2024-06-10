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
	const { username } = req.params;
	console.log(username);
	const user: User = await fetchUserById(username);
	res.status(200).send({ user });
};
