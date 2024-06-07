import { Request, Response, NextFunction } from "express";
import { fetchBrews } from "../models/brews-models";

export const getBrews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
    const brews = await fetchBrews()
    console.log(brews)
    return res.status(200). send({ brews }) 
};
