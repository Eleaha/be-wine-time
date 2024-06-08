import { error } from "console";
import express, { NextFunction, Request, Response } from "express";

export const handleErrors = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err["msg"] });
	}

	if (err["code"] === "22P02") {
		res.status(400).send({ msg: "Bad request" });
	}
};
