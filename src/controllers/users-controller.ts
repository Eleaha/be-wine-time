import { Request, Response, NextFunction } from "express";
import { User } from "../interfaces";
import { fetchUsers } from "../models/users-model";

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const users: User[] = await fetchUsers();
	res.status(200).send({ users });
};
