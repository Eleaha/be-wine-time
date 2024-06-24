import express, { NextFunction, Request, Response } from "express";

export const handleErrors = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const badRequestCodes = ["42703", "22P02"]
	const notFoundCodes = ["23503"];

	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err["msg"] });
	}

	if (badRequestCodes.includes(err["code"])) {
		res.status(400).send({ msg: "Bad request" });
	}

	if (notFoundCodes.includes(err["code"])) {
        res.status(404).send({ msg: "Not found" });
    }
};
