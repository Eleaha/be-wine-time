import { NextFunction, Request, Response } from "express";
import { Recipe } from "../interfaces";
import {
	fetchRecipes,
	fetchRecipeById,
	fetchRecipesByUserId,
} from "../models/recipes-model";
import { insertRecipeByUserId } from "../models/users-model";

export const getRecipes = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const recipes: Recipe[] = await fetchRecipes();
		res.status(200).send({ recipes });
	} catch (err) {
		return next(err);
	}
};

export const getRecipeById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { recipe_id } = req.params;
	try {
		const recipe: Recipe = await fetchRecipeById(+recipe_id);
		res.status(200).send({ recipe });
	} catch (err) {
		console.log(err);
		return next(err);
	}
};

export const getRecipesByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { user_id } = req.params;
	try {
		const recipes: Recipe[] = await fetchRecipesByUserId(+user_id);
		res.status(200).send({ recipes });
	} catch (err) {
		return next(err);
	}
};

export const postRecipeByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user_id } = req.params;
        const payload: Recipe = { maker_id: user_id, ...req.body };
        const recipe: Recipe = await insertRecipeByUserId(payload);
        res.status(201).send({ recipe });
    } catch (err) {
        return next(err);
    }
};