import { NextFunction, Request, Response } from "express";
import { Recipe } from "../interfaces";
import { fetchRecipes } from "../models/recipes-model";


export const getRecipes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const recipes : Recipe[] = await fetchRecipes()
        res.status(200).send({recipes})
    } catch(err) {
        return next(err)
    }
}